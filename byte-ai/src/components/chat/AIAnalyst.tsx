import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  Zap,
  Brain,
  Building2,
  ShieldCheck,
  Wrench,
  X,
  Trash2
} from 'lucide-react';
import { PatentRecord } from '../../agent/patentTools';
import { extractTopic } from '../../agent/competitorTools';
import {
  determineRequiredAgents,
  competitorIntelligenceAgent,
  patentIntelligenceAgent,
  generateCombinedIntelligence,
  AgentResult,
  CombinedIntelligenceReport,
  CompetitorFindings,
  PatentFindings
} from '../../agent/agents';
import {
  ConversationContext,
  LongTermMemory,
  getConversationContext,
  updateConversationContext,
  clearConversationContext,
  getLongTermMemory,
  clearLongTermMemory,
  removeMemory,
  processMemoryCommand
} from '../../lib/memoryManager';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  activityLog?: string[];
  competitorResult?: AgentResult;
  patentResult?: AgentResult;
  combinedReport?: CombinedIntelligenceReport | null;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AIAnalyst: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [context, setContext] = useState<ConversationContext>(getConversationContext());
  const [longTermMemory, setLongTermMemory] = useState<LongTermMemory>(getLongTermMemory());
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: "Hello! I am **Byte AI**, your autonomous competitive intelligence orchestrator.\n\nI dynamically route analyst queries to two specialized agents — the **Competitor Intelligence Agent** and the **Patent Intelligence Agent** — and I remember what we're investigating, so you can ask follow-up questions naturally. Try `Remember NVIDIA as a competitor`, or one of the examples below.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const presetExamples = [
    { label: '1. Patent Discovery', query: 'Find NVIDIA patents related to AI inference', expectedAgents: ['patent'] },
    { label: '2. Follow-up (uses context)', query: 'Which of those are still active?', expectedAgents: ['patent'] },
    { label: '3. Remember a competitor', query: 'Remember NVIDIA as a competitor.', expectedAgents: ['memory'] },
    { label: '4. Use saved memory', query: "Check my competitor's latest patents", expectedAgents: ['patent'] },
    { label: '5. Competitor Activity', query: "Analyze NVIDIA's recent competitive activity", expectedAgents: ['competitor'] },
    {
      label: '6. Multi-Agent Comparison',
      query: 'Compare NVIDIA and AMD based on their recent competitive activity and patent activity. Which company represents a bigger threat?',
      expectedAgents: ['competitor', 'patent']
    }
  ];

  const handleSend = async (queryToSend?: string) => {
    const q = (queryToSend || inputQuery).trim();
    if (!q || isProcessing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    if (!queryToSend) setInputQuery('');
    setIsProcessing(true);

    // --- Memory commands are intercepted before agent routing ---
    const memoryCommand = processMemoryCommand(q);
    if (memoryCommand.isMemoryCommand) {
      await wait(300);
      if (memoryCommand.memory) setLongTermMemory(memoryCommand.memory);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: memoryCommand.responseText || '',
          activityLog: ['💾 Detected memory command — handled without invoking agents'],
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      setIsProcessing(false);
      return;
    }

    const msgId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      { id: msgId, sender: 'agent', text: '', activityLog: [], timestamp: new Date().toLocaleTimeString() }
    ]);

    const pushLog = (line: string) => {
      setMessages(prev =>
        prev.map(m => (m.id === msgId ? { ...m, activityLog: [...(m.activityLog || []), line] } : m))
      );
    };

    await wait(250);
    pushLog('🧠 Understanding objective...');
    await wait(300);
    pushLog('✓ Objective identified');

    await wait(200);
    pushLog('📋 Reading short-term context & saved memory...');

    const currentContext = getConversationContext();
    const currentMemory = getLongTermMemory();

    const required = determineRequiredAgents(q);

    await wait(250);
    pushLog('🤖 Selecting specialized agents...');
    await wait(250);
    if (required.includes('competitor')) pushLog('✓ Competitor Intelligence Agent selected');
    if (required.includes('patent')) pushLog('✓ Patent Intelligence Agent selected');

    let competitorResult: AgentResult | undefined;
    let patentResult: AgentResult | undefined;

    if (required.includes('competitor')) {
      await wait(350);
      pushLog('— 🤖 COMPETITOR INTELLIGENCE AGENT —');
      competitorResult = await competitorIntelligenceAgent(q, currentContext, currentMemory);
      if (competitorResult.contextUsed) pushLog(`🧠 Using conversation context: ${competitorResult.contextUsed}`);
      if (competitorResult.memoryUsed) pushLog(`💾 Using saved memory: ${competitorResult.memoryUsed}`);
      competitorResult.steps.forEach(s => pushLog(`🔧 ${s.toolName} → ${s.description}`));
      pushLog(competitorResult.success ? '✓ Competitive activity analyzed' : '⚠ Unable to determine a competitor');
    }

    if (required.includes('patent')) {
      await wait(350);
      pushLog('— ⚖️ PATENT INTELLIGENCE AGENT —');
      patentResult = await patentIntelligenceAgent(q, currentContext, currentMemory);
      if (patentResult.contextUsed) pushLog(`🧠 Using conversation context: ${patentResult.contextUsed}`);
      if (patentResult.memoryUsed) pushLog(`💾 Using saved memory: ${patentResult.memoryUsed}`);
      patentResult.steps.forEach(s => pushLog(`🔧 ${s.toolName} → ${s.description}`));
      pushLog(patentResult.success ? '✓ Patent intelligence gathered' : '⚠ No patent context available');
    }

    const bothSucceeded = !!competitorResult?.success && !!patentResult?.success;

    await wait(250);
    pushLog('🧠 BYTE AI ORCHESTRATOR — cross-referencing findings...');

    const combinedReport = bothSucceeded
      ? generateCombinedIntelligence(q, competitorResult!, patentResult!)
      : null;

    await wait(250);
    pushLog('💾 Updating conversation context...');

    // --- Update short-term context from whatever succeeded this turn ---
    const patch: Partial<ConversationContext> = { lastAction: q };
    const topic = extractTopic(q);
    if (topic) patch.topic = topic;

    if (competitorResult?.success) {
      const cf = Array.isArray(competitorResult.findings)
        ? (competitorResult.findings as CompetitorFindings[])[0]
        : (competitorResult.findings as CompetitorFindings);
      if (cf) patch.competitor = cf.competitor;
      patch.lastAgent = 'Competitor Intelligence Agent';
      const lastStep = competitorResult.steps[competitorResult.steps.length - 1];
      if (lastStep) patch.lastTool = lastStep.toolName;
    }
    if (patentResult?.success) {
      const pf = Array.isArray(patentResult.findings)
        ? (patentResult.findings as PatentFindings[])[0]
        : (patentResult.findings as PatentFindings);
      if (pf) {
        patch.competitor = patch.competitor || pf.competitor;
        patch.patentsFound = pf.relevantPatents;
        patch.selectedPatents = pf.statusChecked.length > 0 ? pf.statusChecked : undefined;
      }
      patch.lastAgent = 'Patent Intelligence Agent';
      const lastStep = patentResult.steps[patentResult.steps.length - 1];
      if (lastStep) patch.lastTool = lastStep.toolName;
    }
    if (required.includes('competitor') && required.includes('patent')) {
      patch.taskType = 'Competitive & Patent Comparison';
    } else if (required.includes('patent')) {
      patch.taskType = 'Patent Investigation';
    } else {
      patch.taskType = 'Competitor Analysis';
    }

    const updatedContext = updateConversationContext(patch);
    setContext(updatedContext);

    let synthesisText = '';
    if (combinedReport) {
      synthesisText = `${combinedReport.keyFinding}\n\n**Recommendation:** ${combinedReport.recommendation}`;
    } else if (patentResult && !patentResult.success) {
      synthesisText = (patentResult.findings as { message: string }).message;
    } else if (competitorResult && !competitorResult.success) {
      synthesisText = (competitorResult.findings as { message: string }).message;
    } else if (patentResult && !competitorResult) {
      const findings = Array.isArray(patentResult.findings) ? patentResult.findings[0] : patentResult.findings;
      const pf = findings as PatentFindings | undefined;
      synthesisText = pf
        ? `Found ${pf.patentsFound} patent filing(s) for ${pf.competitor}. Reviewed status of ${pf.statusChecked.length} patent(s) — overall patent risk: **${pf.patentRisk}**.`
        : 'Patent intelligence gathered.';
    } else if (competitorResult && !patentResult) {
      const findings = Array.isArray(competitorResult.findings) ? competitorResult.findings[0] : competitorResult.findings;
      const cf = findings as CompetitorFindings | undefined;
      synthesisText = cf
        ? `${cf.competitor} shows ${cf.patentActivity.toLowerCase()} patent activity alongside recent moves in ${cf.technologyFocus}.`
        : 'Competitive intelligence gathered.';
    }

    setMessages(prev =>
      prev.map(m =>
        m.id === msgId
          ? { ...m, text: synthesisText, competitorResult, patentResult, combinedReport }
          : m
      )
    );
    setIsProcessing(false);
  };

  const handleClearContext = () => {
    setContext(clearConversationContext());
  };

  const handleClearMemory = () => {
    setLongTermMemory(clearLongTermMemory());
  };

  const handleRemoveMemoryItem = (type: 'competitor' | 'topic', value: string) => {
    setLongTermMemory(removeMemory(type, value));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-[#0f172a] via-[#111a2e] to-[#0b1329] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Byte AI — Autonomous Analyst</h2>
              <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Multi-Agent + Memory
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Orchestrates agents with context via{' '}
              <code className="text-blue-300 bg-slate-800 px-1.5 py-0.5 rounded">determineRequiredAgents(query)</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-purple-950/60 border border-purple-800/60 text-purple-300 px-2.5 py-1.5 rounded-lg">
            <Building2 className="w-3.5 h-3.5" />
            Competitor Agent
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 px-2.5 py-1.5 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5" />
            Patent Agent
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Competitor Intelligence Agent</p>
                <p className="text-[11px] text-slate-400">Competitive activity, technology focus & comparison</p>
              </div>
            </div>
            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Patent Intelligence Agent</p>
                <p className="text-[11px] text-slate-400">Patent discovery & legal-status analysis</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {presetExamples.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(ex.query)}
                disabled={isProcessing}
                className="p-3.5 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/40 rounded-xl text-left transition-all duration-200 group flex flex-col justify-between disabled:opacity-50"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-blue-400 mb-1">
                    <span>{ex.label}</span>
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-3">"{ex.query}"</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center gap-1.5 flex-wrap">
                  {ex.expectedAgents.map(a => (
                    <span
                      key={a}
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        a === 'competitor'
                          ? 'bg-purple-950/80 text-purple-300 border border-purple-800/50'
                          : a === 'patent'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-800/50'
                      }`}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-[#0b101c] border border-slate-800/90 rounded-2xl min-h-[500px] flex flex-col justify-between shadow-2xl overflow-hidden">
            <div className="p-6 overflow-y-auto space-y-6 max-h-[650px]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'agent' && (
                    <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 mt-1">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div className={`max-w-3xl space-y-3 w-full ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.sender === 'user' ? (
                      <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none text-sm font-medium shadow-md ml-auto w-fit">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl rounded-tl-none space-y-4 shadow-lg">
                        {msg.activityLog && msg.activityLog.length > 0 && (
                          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 space-y-1.5 font-mono">
                            {msg.activityLog.map((line, i) => (
                              <div key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                                <span>{line}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {msg.text && (
                          <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">{msg.text}</div>
                        )}

                        {msg.combinedReport && (
                          <div className="bg-[#080d1a] border border-blue-800/40 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
                              <Brain className="w-3.5 h-3.5" />
                              Byte AI — Final Intelligence Report
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {msg.combinedReport.companies.map(c => (
                                <div key={c} className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-white">{c}</span>
                                    <span className="text-xs font-mono font-bold text-blue-300">
                                      {msg.combinedReport!.threatScores[c]?.toFixed(1)} / 10
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                                    <span>Competitive Activity</span>
                                    <span className="text-slate-200 font-semibold">{msg.combinedReport!.competitiveActivity[c]}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                                    <span>Patent Activity</span>
                                    <span className="text-slate-200 font-semibold">{msg.combinedReport!.patentActivity[c]}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold">
                              Confidence: {msg.combinedReport.confidence}%
                            </div>
                          </div>
                        )}

                        {msg.patentResult && msg.patentResult.steps.length > 0 && (
                          <AgentStepsPanel
                            title="Patent Intelligence Agent"
                            color="emerald"
                            icon={<ShieldCheck className="w-3.5 h-3.5" />}
                            steps={msg.patentResult.steps}
                          />
                        )}

                        {msg.competitorResult && msg.competitorResult.steps.length > 0 && (
                          <AgentStepsPanel
                            title="Competitor Intelligence Agent"
                            color="purple"
                            icon={<Building2 className="w-3.5 h-3.5" />}
                            steps={msg.competitorResult.steps}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex gap-4 items-center text-blue-400 text-sm font-medium bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span>Byte AI is orchestrating specialized agents...</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#080c16] border-t border-slate-800/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask Byte AI, or say 'Remember NVIDIA as a competitor'..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-24 py-3.5 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isProcessing}
                  className="absolute right-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md"
                >
                  <span>Execute</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Memory panel */}
        <div className="lg:col-span-1">
          <div className="bg-[#0b101c] border border-slate-800/90 rounded-2xl p-5 space-y-5 shadow-2xl sticky top-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Brain className="w-4 h-4 text-blue-400" />
              Memory
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Current Context</p>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                <MemoryField label="Competitor" value={context.competitor} />
                <MemoryField label="Topic" value={context.topic} />
                <MemoryField label="Task" value={context.taskType} />
                <MemoryField label="Last Agent" value={context.lastAgent} />
                <MemoryField label="Last Tool" value={context.lastTool} />
                <MemoryField
                  label="Patents Found"
                  value={context.patentsFound && context.patentsFound.length > 0 ? String(context.patentsFound.length) : undefined}
                />
                {!context.competitor && !context.topic && !context.lastAgent && (
                  <p className="text-[11px] text-slate-500 italic">No active investigation yet.</p>
                )}
              </div>
              <button
                onClick={handleClearContext}
                className="w-full text-[11px] text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-800/60 rounded-lg py-1.5 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear Context
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Saved Memory</p>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 space-y-3 text-xs">
                <MemoryList
                  label="Competitors"
                  items={longTermMemory.competitors}
                  onRemove={(v) => handleRemoveMemoryItem('competitor', v)}
                />
                <MemoryList
                  label="Topics"
                  items={longTermMemory.topics}
                  onRemove={(v) => handleRemoveMemoryItem('topic', v)}
                />
                {longTermMemory.competitors.length === 0 && longTermMemory.topics.length === 0 && (
                  <p className="text-[11px] text-slate-500 italic">Nothing saved yet. Try "Remember NVIDIA as a competitor."</p>
                )}
              </div>
              <button
                onClick={handleClearMemory}
                className="w-full text-[11px] text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-800/60 rounded-lg py-1.5 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear Memory
              </button>
              <p className="text-[10px] text-slate-500">Persists across page refresh via localStorage.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MemoryField: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200 font-medium text-right">{value}</span>
    </div>
  );
};

const MemoryList: React.FC<{ label: string; items: string[]; onRemove: (value: string) => void }> = ({
  label,
  items,
  onRemove
}) => {
  if (items.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <p className="text-slate-400 text-[10px] uppercase tracking-wider">{label}</p>
      <div className="space-y-1">
        {items.map(item => (
          <div key={item} className="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 rounded-lg px-2 py-1">
            <span className="text-slate-200 text-[11px]">• {item}</span>
            <button onClick={() => onRemove(item)} className="text-slate-500 hover:text-red-400">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AgentStepsPanel: React.FC<{
  title: string;
  color: 'purple' | 'emerald';
  icon: React.ReactNode;
  steps: { step: number; toolName: string; description: string; input: string; output: any }[];
}> = ({ title, color, icon, steps }) => {
  const colorClasses =
    color === 'purple'
      ? 'text-purple-300 border-purple-800/50 bg-purple-950/40'
      : 'text-emerald-300 border-emerald-800/50 bg-emerald-950/40';

  return (
    <div className="space-y-2 pt-2">
      <div className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${color === 'purple' ? 'text-purple-300' : 'text-emerald-300'}`}>
        {icon}
        {title}
      </div>
      {steps.map((step) => (
        <div key={step.step} className={`rounded-lg p-3 border space-y-1.5 ${colorClasses}`}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold flex items-center gap-1.5">
              <Wrench className="w-3 h-3" />
              {step.toolName}()
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Executed
            </span>
          </div>
          <p className="text-[11px] text-slate-300">{step.description}</p>
          <div className="text-[10px] text-slate-400 font-mono">
            Input: <span className="text-slate-200">{step.input}</span>
          </div>
          <ToolOutputSummary output={step.output} />
        </div>
      ))}
    </div>
  );
};

const ToolOutputSummary: React.FC<{ output: any }> = ({ output }) => {
  if (Array.isArray(output)) {
    if (output.length === 0) return <div className="text-[10px] text-slate-500">No results found.</div>;
    return (
      <div className="text-[10px] text-slate-400 space-y-1 pt-1">
        {output.slice(0, 4).map((item: PatentRecord | { headline?: string; id?: string }, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <Zap className="w-2.5 h-2.5 text-blue-400 flex-shrink-0" />
            <span className="text-slate-300">
              {(item as PatentRecord).id ? `${(item as PatentRecord).id} — ${(item as PatentRecord).title}` : (item as any).headline}
            </span>
          </div>
        ))}
        {output.length > 4 && <div className="text-slate-500">+ {output.length - 4} more</div>}
      </div>
    );
  }
  if (output && typeof output === 'object' && 'id' in output) {
    const p = output as PatentRecord;
    return (
      <div className="text-[10px] text-slate-400 pt-1">
        <span className="text-slate-300 font-mono">{p.id}</span> — Status:{' '}
        <span className="text-emerald-400 font-semibold">{p.status}</span>
      </div>
    );
  }
  return null;
};
