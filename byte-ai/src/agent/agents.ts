// Byte AI multi-agent orchestration layer.
//
// Byte AI (the orchestrator) dynamically decides which of the two
// specialized agents a query requires, runs them, and — when both run —
// cross-analyzes their findings into a single combined intelligence report.
//
// This module builds on top of the EXISTING patent tools
// (competitorPatentFinder / patentStatusChecker) in ./patentTools.ts and the
// competitor data/tooling in ./competitorTools.ts. No existing tool logic is
// duplicated or replaced.

import {
  competitorPatentFinder,
  patentStatusChecker,
  PatentRecord,
  AgentExecutionStep
} from './patentTools';

import {
  competitorNewsSearch,
  getCompetitorProfile,
  extractCompanies,
  CompetitorActivityRecord
} from './competitorTools';

import {
  ConversationContext,
  LongTermMemory,
  resolveCompanies
} from '../lib/memoryManager';

export type AgentType = 'competitor' | 'patent';

export interface AgentResult {
  agent: string;
  success: boolean;
  findings: unknown;
  confidence: number;
  evidence: unknown[];
  steps: AgentExecutionStep[];
  /** Set when the agent answered using short-term conversation context instead of a fresh search. */
  contextUsed?: string;
  /** Set when the agent answered using long-term (saved) memory. */
  memoryUsed?: string;
}

const EMPTY_MEMORY: LongTermMemory = { competitors: [], topics: [] };

export interface CompetitorFindings {
  competitor: string;
  keyActivities: string[];
  technologyFocus: string;
  patentActivity: string;
  recentDevelopments: string[];
  opportunities: string[];
  threats: string[];
}

export interface PatentFindings {
  competitor: string;
  patentsFound: number;
  relevantPatents: PatentRecord[];
  statusChecked: PatentRecord[];
  patentRisk: 'Low' | 'Medium' | 'High';
}

/**
 * Byte AI orchestrator step: decides which specialized agent(s) a query needs.
 * Does NOT simply run both agents for every query.
 */
export function determineRequiredAgents(query: string): AgentType[] {
  const q = query.toLowerCase();

  const patentSignals = ['patent', 'patents', 'uspto', 'ep-', 'us-', 'filing', 'ip portfolio', 'lapsed'];
  const statusSignals = ['status', 'active', 'valid', 'expired', 'litigation', 'legal'];
  const competitorSignals = [
    'competitive', 'compare', 'comparison', 'vs', 'versus',
    'threat', 'activity', 'news', 'development', 'positioning', 'roadmap'
  ];

  const hasPatent = patentSignals.some(s => q.includes(s)) || statusSignals.some(s => q.includes(s));
  const hasCompetitor = competitorSignals.some(s => q.includes(s));

  const agents: AgentType[] = [];
  if (hasCompetitor) agents.push('competitor');
  if (hasPatent) agents.push('patent');

  if (agents.length === 0) agents.push('competitor');
  return agents;
}

/**
 * AGENT 1 — Competitor Intelligence Agent
 * Investigates competitor activity, technology focus, and positioning.
 * Can use conversation context / saved memory when the query doesn't name a
 * company explicitly (e.g. "check my competitor's latest activity").
 */
export async function competitorIntelligenceAgent(
  query: string,
  context: ConversationContext = {},
  longTermMemory: LongTermMemory = EMPTY_MEMORY
): Promise<AgentResult> {
  const explicit = extractCompanies(query);
  const companies = resolveCompanies(query, explicit, context);
  const steps: AgentExecutionStep[] = [];
  const findingsByCompany: CompetitorFindings[] = [];
  let stepCount = 1;

  let contextUsed: string | undefined;
  let memoryUsed: string | undefined;
  if (explicit.length === 0 && companies.length > 0) {
    if (longTermMemory.competitors.some(c => c.toLowerCase() === companies[0].toLowerCase())) {
      memoryUsed = `${companies[0]} is a monitored competitor`;
    } else if (context.competitor || (context.competitors && context.competitors.length > 0)) {
      contextUsed = `${companies.join(', ')}`;
    }
  }

  if (companies.length === 0) {
    return {
      agent: 'Competitor Intelligence Agent',
      success: false,
      findings: {
        message:
          "I don't currently have a competitor in the active context or saved memory. Which competitor should I investigate?"
      },
      confidence: 0,
      evidence: [],
      steps: []
    };
  }

  for (const company of companies) {
    const activity: CompetitorActivityRecord[] = competitorNewsSearch(company);
    steps.push({
      step: stepCount++,
      toolName: 'competitorNewsSearch',
      description: `Retrieved recent competitive activity for ${company}.`,
      input: company,
      output: activity,
      timestamp: new Date().toLocaleTimeString()
    });

    const patents = competitorPatentFinder(company);
    steps.push({
      step: stepCount++,
      toolName: 'competitorPatentFinder',
      description: `Cross-checked patent filing volume for ${company} to gauge technology investment.`,
      input: company,
      output: patents,
      timestamp: new Date().toLocaleTimeString()
    });

    const profile = getCompetitorProfile(company);
    const patentActivity = patents.length >= 3 ? 'High' : patents.length >= 1 ? 'Medium' : 'Low';

    findingsByCompany.push({
      competitor: profile.name,
      keyActivities: activity.slice(0, 3).map(a => a.headline),
      technologyFocus: profile.technologyFocus,
      patentActivity,
      recentDevelopments: activity.map(a => `${a.date}: ${a.headline}`),
      opportunities: profile.opportunities,
      threats: profile.threats
    });
  }

  return {
    agent: 'Competitor Intelligence Agent',
    success: true,
    findings: companies.length === 1 ? findingsByCompany[0] : findingsByCompany,
    confidence: 0.9,
    evidence: findingsByCompany.flatMap(f => f.recentDevelopments),
    steps,
    contextUsed,
    memoryUsed
  };
}

/**
 * AGENT 2 — Patent Intelligence Agent
 * Uses the EXISTING competitorPatentFinder + patentStatusChecker tools.
 * Reads conversation context so follow-up questions like "which of those are
 * still active?" resolve against the patents already found, and reads saved
 * memory so "check my competitor's latest patents" resolves a competitor.
 */
export async function patentIntelligenceAgent(
  query: string,
  context: ConversationContext = {},
  longTermMemory: LongTermMemory = EMPTY_MEMORY
): Promise<AgentResult> {
  const steps: AgentExecutionStep[] = [];
  let stepCount = 1;

  const q = query.toLowerCase();
  const explicit = extractCompanies(query);
  const explicitIds = query.match(/(US|EP)-\d{4}-[\dA-Z]{3,}/gi) || [];

  // Follow-up reference to a previous result set ("those", "these", "them")
  // with no new company/patent named explicitly in this query.
  const refersToPrevious = /\b(those|these|them|it)\b/.test(q);
  if (
    refersToPrevious &&
    explicit.length === 0 &&
    explicitIds.length === 0 &&
    context.patentsFound &&
    context.patentsFound.length > 0
  ) {
    const statusChecked = context.patentsFound.map(p => patentStatusChecker(p.id)!).filter(Boolean);
    steps.push({
      step: stepCount++,
      toolName: 'patentStatusChecker',
      description: `Used ${context.patentsFound.length} patent(s) already found for ${context.competitor || 'the current investigation'} from conversation context to verify status.`,
      input: context.patentsFound.map(p => p.id).join(', '),
      output: statusChecked,
      timestamp: new Date().toLocaleTimeString()
    });

    const highRisk = statusChecked.some(p => p.legalStatusDetails.litigationRisk === 'High');
    const medRisk = statusChecked.some(p => p.legalStatusDetails.litigationRisk === 'Medium');

    const findings: PatentFindings = {
      competitor: context.competitor || 'Previous search',
      patentsFound: context.patentsFound.length,
      relevantPatents: context.patentsFound,
      statusChecked,
      patentRisk: highRisk ? 'High' : medRisk ? 'Medium' : 'Low'
    };

    return {
      agent: 'Patent Intelligence Agent',
      success: true,
      findings,
      confidence: 0.9,
      evidence: statusChecked.map(p => `${p.id}: ${p.status}`),
      steps,
      contextUsed: `${context.competitor || 'previous search'}${context.topic ? ' + ' + context.topic : ''}`
    };
  }

  const companies = resolveCompanies(query, explicit, context);
  let contextUsed: string | undefined;
  let memoryUsed: string | undefined;
  if (explicit.length === 0 && companies.length > 0) {
    if (longTermMemory.competitors.some(c => c.toLowerCase() === companies[0].toLowerCase())) {
      memoryUsed = `${companies[0]} is a monitored competitor`;
    } else if (context.competitor || (context.competitors && context.competitors.length > 0)) {
      contextUsed = companies.join(', ');
    }
  }

  if (companies.length === 0 && explicitIds.length === 0) {
    return {
      agent: 'Patent Intelligence Agent',
      success: false,
      findings: {
        message:
          "I don't currently have a patent list in the active context. Which competitor or patent should I investigate?"
      },
      confidence: 0,
      evidence: [],
      steps: []
    };
  }

  const findingsByCompany: PatentFindings[] = [];

  for (const company of companies) {
    const found = competitorPatentFinder(company);
    steps.push({
      step: stepCount++,
      toolName: 'competitorPatentFinder',
      description: `Searched patent database for ${company} filings relevant to the query.`,
      input: `Company: ${company}`,
      output: found,
      timestamp: new Date().toLocaleTimeString()
    });

    const relevant = found.slice(0, 5);
    const statusChecked = relevant.map(p => patentStatusChecker(p.id)!).filter(Boolean);
    if (statusChecked.length > 0) {
      steps.push({
        step: stepCount++,
        toolName: 'patentStatusChecker',
        description: `Verified legal/maintenance status for ${statusChecked.length} relevant ${company} patent(s).`,
        input: statusChecked.map(p => p.id).join(', '),
        output: statusChecked,
        timestamp: new Date().toLocaleTimeString()
      });
    }

    const highRisk = statusChecked.some(p => p.legalStatusDetails.litigationRisk === 'High');
    const medRisk = statusChecked.some(p => p.legalStatusDetails.litigationRisk === 'Medium');

    findingsByCompany.push({
      competitor: company,
      patentsFound: found.length,
      relevantPatents: relevant,
      statusChecked,
      patentRisk: highRisk ? 'High' : medRisk ? 'Medium' : 'Low'
    });
  }

  // Explicit single patent-ID status checks not tied to a company mention
  for (const id of explicitIds) {
    const status = patentStatusChecker(id);
    if (status) {
      steps.push({
        step: stepCount++,
        toolName: 'patentStatusChecker',
        description: `Checked status for explicitly referenced patent ${id}.`,
        input: id,
        output: status,
        timestamp: new Date().toLocaleTimeString()
      });
      if (!findingsByCompany.some(f => f.relevantPatents.some(p => p.id === status.id))) {
        findingsByCompany.push({
          competitor: status.assignee,
          patentsFound: 1,
          relevantPatents: [status],
          statusChecked: [status],
          patentRisk: status.legalStatusDetails.litigationRisk
        });
      }
    }
  }

  return {
    agent: 'Patent Intelligence Agent',
    success: true,
    findings: findingsByCompany.length === 1 ? findingsByCompany[0] : findingsByCompany,
    confidence: 0.92,
    evidence: findingsByCompany.flatMap(f => f.relevantPatents.map(p => `${p.id}: ${p.title}`)),
    steps,
    contextUsed,
    memoryUsed
  };
}

export interface CombinedIntelligenceReport {
  companies: string[];
  competitiveActivity: Record<string, 'Low' | 'Medium' | 'High'>;
  patentActivity: Record<string, 'Low' | 'Medium' | 'High'>;
  threatScores: Record<string, number>;
  keyFinding: string;
  recommendation: string;
  confidence: number;
}

function scoreCompany(
  company: string,
  competitorResult: AgentResult | null,
  patentResult: AgentResult | null
): { competitive: 'Low' | 'Medium' | 'High'; patent: 'Low' | 'Medium' | 'High'; score: number } {
  let competitive: 'Low' | 'Medium' | 'High' = 'Medium';
  let patent: 'Low' | 'Medium' | 'High' = 'Medium';
  let score = 5;

  if (competitorResult) {
    const arr = Array.isArray(competitorResult.findings) ? competitorResult.findings as CompetitorFindings[] : [competitorResult.findings as CompetitorFindings];
    const match = arr.find(f => f.competitor.toLowerCase().includes(company.toLowerCase()));
    if (match) {
      const highImpactCount = match.keyActivities.length;
      competitive = highImpactCount >= 3 ? 'High' : highImpactCount >= 1 ? 'Medium' : 'Low';
      score += competitive === 'High' ? 2.5 : competitive === 'Medium' ? 1.2 : 0;
    }
  }

  if (patentResult) {
    const arr = Array.isArray(patentResult.findings) ? patentResult.findings as PatentFindings[] : [patentResult.findings as PatentFindings];
    const match = arr.find(f => f.competitor.toLowerCase().includes(company.toLowerCase()));
    if (match) {
      patent = match.patentsFound >= 3 ? 'High' : match.patentsFound >= 1 ? 'Medium' : 'Low';
      score += patent === 'High' ? 2.3 : patent === 'Medium' ? 1.1 : 0;
      if (match.patentRisk === 'High') score += 0.5;
    }
  }

  return { competitive, patent, score: Math.min(10, Math.round(score * 10) / 10) };
}

/**
 * Byte AI orchestrator: cross-analyzes agent results into one final report.
 */
export function generateCombinedIntelligence(
  query: string,
  competitorResult: AgentResult | null,
  patentResult: AgentResult | null
): CombinedIntelligenceReport {
  let companies = extractCompanies(query);
  if (companies.length === 0) {
    const fromCompetitor = Array.isArray(competitorResult?.findings)
      ? (competitorResult!.findings as CompetitorFindings[]).map(f => f.competitor)
      : competitorResult?.findings
      ? [(competitorResult!.findings as CompetitorFindings).competitor]
      : [];
    const fromPatent = Array.isArray(patentResult?.findings)
      ? (patentResult!.findings as PatentFindings[]).map(f => f.competitor)
      : patentResult?.findings
      ? [(patentResult!.findings as PatentFindings).competitor]
      : [];
    companies = Array.from(new Set([...fromCompetitor, ...fromPatent]));
  }

  const competitiveActivity: Record<string, 'Low' | 'Medium' | 'High'> = {};
  const patentActivity: Record<string, 'Low' | 'Medium' | 'High'> = {};
  const threatScores: Record<string, number> = {};

  for (const c of companies) {
    const { competitive, patent, score } = scoreCompany(c, competitorResult, patentResult);
    competitiveActivity[c] = competitive;
    patentActivity[c] = patent;
    threatScores[c] = score;
  }

  const ranked = [...companies].sort((a, b) => threatScores[b] - threatScores[a]);
  const leader = ranked[0];

  const keyFinding = companies.length > 1
    ? `${leader} currently demonstrates stronger competitive momentum across technology activity and patent development compared to ${ranked.slice(1).join(', ')}.`
    : `${companies[0]} shows ${competitiveActivity[companies[0]] || 'Medium'} competitive activity and ${patentActivity[companies[0]] || 'Medium'} patent activity.`;

  const recommendation = companies.length > 1
    ? `Monitor ${leader}'s technology roadmap and patent filings closely, and investigate potential overlap with your own product roadmap.`
    : `Continue monitoring ${companies[0]}'s technology roadmap and recent patent filings for early signals of competitive threat.`;

  const confidence = Math.round(
    (((competitorResult?.confidence || 0) + (patentResult?.confidence || 0)) /
      ((competitorResult ? 1 : 0) + (patentResult ? 1 : 0) || 1)) *
      100
  );

  return {
    companies,
    competitiveActivity,
    patentActivity,
    threatScores,
    keyFinding,
    recommendation,
    confidence
  };
}
