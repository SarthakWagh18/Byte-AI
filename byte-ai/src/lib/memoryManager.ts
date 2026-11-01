// Byte AI Memory & Context Manager
//
// Provides two layers of memory:
//  - SHORT-TERM: an in-memory "current investigation" context that lives for
//    the session and lets follow-up questions ("which of those are still
//    active?") work without repeating the competitor/topic.
//  - LONG-TERM: a small localStorage-backed store of explicitly-saved facts
//    (monitored competitors / topics) that survives a page refresh.
//
// Both are read by the orchestrator (see AIAnalyst.tsx) and passed into the
// two specialized agents so agent behavior actually changes based on memory,
// not just the UI.

import { PatentRecord } from '../agent/patentTools';

export interface ConversationContext {
  competitor?: string;
  competitors?: string[];
  topic?: string;
  technology?: string;
  taskType?: string;
  patentsFound?: PatentRecord[];
  selectedPatents?: PatentRecord[];
  lastAction?: string;
  lastAgent?: string;
  lastTool?: string;
  timestamp?: string;
}

export interface LongTermMemory {
  competitors: string[];
  topics: string[];
}

const STORAGE_KEY = 'byte-ai-memory';
const EMPTY_MEMORY: LongTermMemory = { competitors: [], topics: [] };

// ------------------------------------------------------------------
// SHORT-TERM (in-memory, per session) conversation context
// ------------------------------------------------------------------

let conversationContext: ConversationContext = {};

export function getConversationContext(): ConversationContext {
  return { ...conversationContext };
}

export function updateConversationContext(patch: Partial<ConversationContext>): ConversationContext {
  conversationContext = {
    ...conversationContext,
    ...patch,
    timestamp: new Date().toLocaleTimeString()
  };
  return getConversationContext();
}

export function clearConversationContext(): ConversationContext {
  conversationContext = {};
  return getConversationContext();
}

// ------------------------------------------------------------------
// LONG-TERM (localStorage) persistent memory
// ------------------------------------------------------------------

function safeParseMemory(raw: string | null): LongTermMemory {
  if (!raw) return { ...EMPTY_MEMORY };
  try {
    const parsed = JSON.parse(raw);
    return {
      competitors: Array.isArray(parsed?.competitors) ? parsed.competitors.filter((v: unknown) => typeof v === 'string') : [],
      topics: Array.isArray(parsed?.topics) ? parsed.topics.filter((v: unknown) => typeof v === 'string') : []
    };
  } catch {
    // Corrupted data — start clean rather than crash the app.
    return { ...EMPTY_MEMORY };
  }
}

function persistMemory(memory: LongTermMemory): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    // localStorage unavailable (private browsing, quota, SSR, etc.) — memory
    // simply won't persist across refresh; never crash the app for this.
  }
}

export function getLongTermMemory(): LongTermMemory {
  try {
    return safeParseMemory(localStorage.getItem(STORAGE_KEY));
  } catch {
    return { ...EMPTY_MEMORY };
  }
}

export function saveMemory(type: 'competitor' | 'topic', value: string): LongTermMemory {
  const normalized = value.trim();
  const memory = getLongTermMemory();
  if (!normalized) return memory;

  const key = type === 'competitor' ? 'competitors' : 'topics';
  const alreadySaved = memory[key].some(v => v.toLowerCase() === normalized.toLowerCase());
  if (!alreadySaved) {
    memory[key] = [...memory[key], normalized];
    persistMemory(memory);
  }
  return memory;
}

export function removeMemory(type: 'competitor' | 'topic', value: string): LongTermMemory {
  const memory = getLongTermMemory();
  const key = type === 'competitor' ? 'competitors' : 'topics';
  memory[key] = memory[key].filter(v => v.toLowerCase() !== value.trim().toLowerCase());
  persistMemory(memory);
  return memory;
}

export function clearLongTermMemory(): LongTermMemory {
  persistMemory({ ...EMPTY_MEMORY });
  return { ...EMPTY_MEMORY };
}

/**
 * Given a query, decides which (if any) saved long-term memory is relevant.
 * Byte AI uses this rather than blindly injecting all saved memory into
 * every request.
 */
export function getRelevantMemory(query: string): { competitor?: string; note?: string } {
  const q = query.toLowerCase();
  const memory = getLongTermMemory();

  const referencesSavedCompetitor = q.includes('my competitor') || q.includes("competitor's");

  if (referencesSavedCompetitor && memory.competitors.length > 0) {
    const competitor = memory.competitors[0];
    return { competitor, note: `${competitor} is a monitored competitor` };
  }

  return {};
}

/**
 * Resolves which companies a query is "about", preferring (in order):
 * 1. Companies explicitly named in the current query
 * 2. Companies explicitly saved in long-term memory, when the query refers
 *    to "my competitor(s)"
 * 3. The competitor(s) already active in the short-term conversation context
 */
export function resolveCompanies(
  query: string,
  explicitCompanies: string[],
  context: ConversationContext
): string[] {
  if (explicitCompanies.length > 0) return explicitCompanies;

  const relevantMemory = getRelevantMemory(query);
  if (relevantMemory.competitor) return [relevantMemory.competitor];

  if (context.competitor) return [context.competitor];
  if (context.competitors && context.competitors.length > 0) return context.competitors;

  return [];
}

// ------------------------------------------------------------------
// Natural-language memory commands
// ------------------------------------------------------------------

export interface MemoryCommandResult {
  isMemoryCommand: boolean;
  responseText?: string;
  memory?: LongTermMemory;
}

/**
 * Detects and executes explicit memory commands like:
 *  "Remember NVIDIA as a competitor."
 *  "Remember that I am monitoring AI inference."
 *  "Forget NVIDIA."
 *  "Show my saved competitors." / "What competitors am I monitoring?"
 * Returns { isMemoryCommand: false } when the query is not a memory command,
 * so the orchestrator can fall through to normal agent routing.
 */
export function processMemoryCommand(query: string): MemoryCommandResult {
  const q = query.trim();
  const lower = q.toLowerCase();

  // "Remember X as a competitor."
  const rememberCompetitor = lower.match(/remember\s+(.+?)\s+as\s+a\s+competitor/i);
  if (rememberCompetitor) {
    const value = rememberCompetitor[1].trim();
    const memory = saveMemory('competitor', value);
    return { isMemoryCommand: true, responseText: `💾 Saved **${value}** as a monitored competitor.`, memory };
  }

  // "Remember that I am monitoring X." / "Remember X as a topic."
  const rememberTopic =
    lower.match(/remember\s+(?:that\s+)?i(?:'m| am)\s+monitoring\s+(.+)/i) ||
    lower.match(/remember\s+(.+?)\s+as\s+a\s+topic/i);
  if (rememberTopic) {
    const value = rememberTopic[1].trim().replace(/\.$/, '');
    const memory = saveMemory('topic', value);
    return { isMemoryCommand: true, responseText: `💾 Saved **${value}** as a monitored topic.`, memory };
  }

  // "Forget X."
  const forget = lower.match(/^forget\s+(.+)/i);
  if (forget) {
    const value = forget[1].trim().replace(/\.$/, '');
    const before = getLongTermMemory();
    const wasCompetitor = before.competitors.some(c => c.toLowerCase() === value.toLowerCase());
    const wasTopic = before.topics.some(t => t.toLowerCase() === value.toLowerCase());
    let memory = before;
    if (wasCompetitor) memory = removeMemory('competitor', value);
    if (wasTopic) memory = removeMemory('topic', value);
    if (!wasCompetitor && !wasTopic) {
      return { isMemoryCommand: true, responseText: `I don't have **${value}** saved in memory.`, memory: before };
    }
    return { isMemoryCommand: true, responseText: `🗑️ Removed **${value}** from saved memory.`, memory };
  }

  // "Show my saved competitors." / "What competitors am I monitoring?"
  if (
    (lower.includes('saved competitor') || lower.includes('competitors am i')) ||
    (lower.includes('show') && lower.includes('memory'))
  ) {
    const memory = getLongTermMemory();
    const competitorsText = memory.competitors.length > 0 ? memory.competitors.join(', ') : 'none saved yet';
    const topicsText = memory.topics.length > 0 ? memory.topics.join(', ') : 'none saved yet';
    return {
      isMemoryCommand: true,
      responseText: `🧠 **Saved competitors:** ${competitorsText}\n**Saved topics:** ${topicsText}`,
      memory
    };
  }

  return { isMemoryCommand: false };
}
