// Competitor Intelligence data source used by the Competitor Intelligence Agent.
// This mirrors the shape/style of agent/patentTools.ts so both specialized
// agents share consistent conventions (mock DB + a callable "tool" function).

export interface CompetitorActivityRecord {
  company: string;
  ticker: string;
  headline: string;
  date: string;
  category: 'Product Launch' | 'Research' | 'Partnership' | 'Hiring' | 'Funding/Capex' | 'Legal';
  impact: 'Low' | 'Medium' | 'High';
}

export const COMPETITOR_ACTIVITY_DB: CompetitorActivityRecord[] = [
  { company: 'NVIDIA', ticker: 'NVDA', headline: 'Announced next-gen AI inference accelerator with 2x throughput per watt', date: '2026-06-02', category: 'Product Launch', impact: 'High' },
  { company: 'NVIDIA', ticker: 'NVDA', headline: 'Expanded CUDA ecosystem with new quantized inference libraries', date: '2026-05-14', category: 'Research', impact: 'Medium' },
  { company: 'NVIDIA', ticker: 'NVDA', headline: 'Signed multi-year supply partnership with hyperscaler for datacenter GPUs', date: '2026-04-20', category: 'Partnership', impact: 'High' },
  { company: 'NVIDIA', ticker: 'NVDA', headline: 'Aggressively hiring for edge-AI silicon teams', date: '2026-03-11', category: 'Hiring', impact: 'Medium' },
  { company: 'AMD', ticker: 'AMD', headline: 'Launched MI-series accelerator targeting LLM training clusters', date: '2026-05-28', category: 'Product Launch', impact: 'High' },
  { company: 'AMD', ticker: 'AMD', headline: 'Published research on chiplet-based inference scaling', date: '2026-05-02', category: 'Research', impact: 'Medium' },
  { company: 'AMD', ticker: 'AMD', headline: 'Partnered with cloud provider to co-develop unified memory fabric', date: '2026-03-30', category: 'Partnership', impact: 'Medium' },
  { company: 'AMD', ticker: 'AMD', headline: 'Increased capex guidance for datacenter accelerator production', date: '2026-02-18', category: 'Funding/Capex', impact: 'Medium' },
  { company: 'Qualcomm', ticker: 'QCOM', headline: 'Unveiled mobile NPU with improved on-device LLM efficiency', date: '2026-05-19', category: 'Product Launch', impact: 'Medium' },
  { company: 'Qualcomm', ticker: 'QCOM', headline: 'Steady patent filing cadence in edge-AI NPU architectures', date: '2026-04-05', category: 'Research', impact: 'Low' },
  { company: 'Apple', ticker: 'AAPL', headline: 'Expanded on-device AI memory management for next-gen Neural Engine', date: '2026-05-25', category: 'Research', impact: 'Medium' },
  { company: 'Apple', ticker: 'AAPL', headline: 'Filed multiple pending patents on KV-cache compression', date: '2026-04-12', category: 'Legal', impact: 'Medium' },
  { company: 'Broadcom', ticker: 'AVGO', headline: 'Facing litigation risk over interconnect patent dispute', date: '2026-03-08', category: 'Legal', impact: 'High' },
  { company: 'Broadcom', ticker: 'AVGO', headline: 'Continued custom AI accelerator design wins with hyperscalers', date: '2026-02-22', category: 'Partnership', impact: 'Medium' },
];

export interface CompetitorProfile {
  name: string;
  ticker: string;
  technologyFocus: string;
  opportunities: string[];
  threats: string[];
}

export const COMPETITOR_PROFILES: Record<string, CompetitorProfile> = {
  NVIDIA: {
    name: 'NVIDIA Corporation',
    ticker: 'NVDA',
    technologyFocus: 'AI Inference Accelerators, LLM Serving Infrastructure & CUDA Ecosystem',
    opportunities: ['Differentiate on power efficiency where NVIDIA still trails on perf/watt', 'Target hyperscalers not yet locked into CUDA tooling'],
    threats: ['Dominant ecosystem lock-in via CUDA', 'Aggressive multi-year supply partnerships with hyperscalers']
  },
  AMD: {
    name: 'AMD',
    ticker: 'AMD',
    technologyFocus: 'Datacenter Accelerators, Chiplet Architectures & Unified Memory Fabric',
    opportunities: ['Open-source ROCm tooling still maturing — window to lead on developer experience', 'Chiplet cost advantage at scale'],
    threats: ['Rapidly closing the training-throughput gap with NVIDIA', 'Growing hyperscaler co-design partnerships']
  },
  Qualcomm: {
    name: 'Qualcomm Technologies',
    ticker: 'QCOM',
    technologyFocus: 'Mobile NPU & Edge Neural Architectures',
    opportunities: ['Edge-AI efficiency leadership still open to challenge'],
    threats: ['Steady, well-protected patent portfolio in mobile NPU space']
  },
  Apple: {
    name: 'Apple Inc.',
    ticker: 'AAPL',
    technologyFocus: 'On-Device AI Memory & Neural Engine',
    opportunities: ['Ecosystem is closed — limited direct competitive overlap outside on-device AI'],
    threats: ['Deep vertical integration between silicon and OS-level AI memory management']
  },
  Broadcom: {
    name: 'Broadcom Inc.',
    ticker: 'AVGO',
    technologyFocus: 'Interconnect & Custom AI Accelerator Design',
    opportunities: ['Ongoing litigation exposure creates near-term uncertainty for customers'],
    threats: ['Deep hyperscaler custom-silicon relationships']
  }
};

export const KNOWN_COMPANIES = Object.keys(COMPETITOR_PROFILES);

/**
 * "Tool": searches recent competitor activity/news for a given company.
 * Used by the Competitor Intelligence Agent.
 */
export function competitorNewsSearch(company: string): CompetitorActivityRecord[] {
  const lower = company.toLowerCase();
  const results = COMPETITOR_ACTIVITY_DB.filter(r => r.company.toLowerCase() === lower || lower.includes(r.company.toLowerCase()));
  return results.length > 0 ? results : COMPETITOR_ACTIVITY_DB.filter(r => r.company === 'NVIDIA');
}

export function getCompetitorProfile(company: string): CompetitorProfile {
  const match = KNOWN_COMPANIES.find(c => c.toLowerCase() === company.toLowerCase() || company.toLowerCase().includes(c.toLowerCase()));
  return COMPETITOR_PROFILES[match || 'NVIDIA'];
}

/**
 * Detects which known companies are explicitly mentioned in a free-text query.
 * Returns an empty array when none are mentioned (callers should fall back to
 * conversation context / saved memory rather than guessing a default company).
 */
export function extractCompanies(query: string): string[] {
  const q = query.toLowerCase();
  return KNOWN_COMPANIES.filter(c => q.includes(c.toLowerCase()));
}

const TOPIC_KEYWORDS: { match: string[]; label: string }[] = [
  { match: ['ai inference', 'inference'], label: 'AI Inference' },
  { match: ['ai chips', 'ai chip'], label: 'AI Chips' },
  { match: ['edge ai', 'edge computing'], label: 'Edge AI' },
  { match: ['llm training', 'training cluster', 'large language model'], label: 'LLM Training' },
  { match: ['npu', 'neural processing unit'], label: 'NPU / Edge Neural Architectures' },
  { match: ['interconnect'], label: 'Interconnect' },
  { match: ['memory', 'kv-cache', 'kv cache'], label: 'AI Memory' }
];

/**
 * Extracts a human-readable "topic" from a free-text query, if any known
 * technology keyword is present. Returns undefined when nothing matches.
 */
export function extractTopic(query: string): string | undefined {
  const q = query.toLowerCase();
  const found = TOPIC_KEYWORDS.find(t => t.match.some(m => q.includes(m)));
  return found?.label;
}
