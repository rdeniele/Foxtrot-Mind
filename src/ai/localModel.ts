import { initLlama, type LlamaContext } from 'llama.rn';

import { CompanionMode } from '@/data/sampleContent';

import { getModelInfo } from './modelManager';

export class ModelNotReadyError extends Error {
  constructor(message = 'The AI model is not downloaded yet. Open Settings to download it.') {
    super(message);
    this.name = 'ModelNotReadyError';
  }
}

const toPath = (uri: string) => uri.replace(/^file:\/\//, '');

let ctx: LlamaContext | null = null;
let loading: Promise<void> | null = null;

// A single llama.cpp context can only run one completion at a time. The main
// reply and the background memory-extraction pass both call completion(), so
// every call is funneled through this queue to keep them strictly sequential.
let queue: Promise<unknown> = Promise.resolve();
function enqueue<T>(run: () => Promise<T>): Promise<T> {
  const result = queue.then(run, run);
  queue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

export function isModelLoaded() {
  return ctx !== null;
}

export function loadModel(): Promise<void> {
  if (ctx) return Promise.resolve();
  if (!loading) {
    loading = doLoad().finally(() => {
      loading = null;
    });
  }
  return loading;
}

async function doLoad() {
  const info = await getModelInfo();
  if (info.status !== 'downloaded' || !info.localPath) {
    throw new ModelNotReadyError();
  }
  try {
    ctx = await initLlama({
      model: toPath(info.localPath),
      n_ctx: 2048,
      n_batch: 256,
      n_threads: 4,
      n_gpu_layers: 0, // CPU: the most compatible choice across phones
      use_mlock: false,
    });
  } catch (e) {
    throw new Error(
      `Couldn't load the AI model (${(e as Error).message}). The file may be corrupted, or the phone is low on memory. Try re-downloading it in Settings.`,
    );
  }
}

export async function unloadModel() {
  const current = ctx;
  ctx = null;
  if (current) {
    await current.release().catch(() => undefined);
  }
}

const companionPrompts: Record<CompanionMode, string> = {
  Friend: 'You are a warm, relaxed friend having a natural conversation. Keep replies short (1-4 sentences), casual, and genuinely curious about the person — react to specifics they mentioned instead of generic small talk.',
  Listener: 'You are a calm, attentive listener. The person wants to vent. Reflect back what you hear in your own words and ask one gentle follow-up question. Do not jump to advice, solutions, or silver linings unless they ask for it.',
  'Idea Partner': 'You are an energetic idea partner helping develop concepts, plans, and projects. Build on what the person says, suggest one concrete next step at a time, and ask clarifying questions instead of listing options.',
  Teacher: 'You are a clear, patient teacher. Explain one idea at a time using simple language, everyday analogies, or short examples, matching the explanation to how much the person already seems to know. Check understanding with a quick question before moving on, and favor helping them reason it out over just stating the answer.',
  Challenger: 'You respectfully question assumptions and explore counterarguments. Be direct but kind, explain your reasoning, and invite them to push back. Never be dismissive or pile on more than one challenge at a time.',
  Coach: 'You help organize goals and next steps. Be encouraging without over-praising, and turn vague intentions into one small, specific, doable action at a time.',
};

export function buildSystemPrompt(mode: CompanionMode, memories: string[] = []): string {
  const base = [
    'You are Fox, the offline AI companion inside Foxtrot Mind, a private app for reading, thinking, and talking — everything runs on-device, nothing is sent anywhere.',
    companionPrompts[mode],
    'Sound human and expressive, never robotic or repetitive — vary your phrasing and do not reuse the same opening words turn after turn.',
    'Keep replies concise (usually 1-4 sentences) unless the person clearly wants depth. Ask a thoughtful follow-up question when it genuinely helps the conversation, not after every single message.',
    'If they ask you to solve a puzzle, riddle, or problem for them, offer a hint or a guiding question first instead of the full answer, unless they ask you to just tell them.',
    'Never claim to remember things from outside this conversation beyond what is listed below, and never claim to have taken an action (saved, reminded, scheduled) that you have not actually been told happened.',
  ];
  if (memories.length > 0) {
    base.push(`What you know about this person, from past conversations: ${memories.join('; ')}. Use this naturally when relevant — do not list it or announce that you remember things.`);
  }
  return base.join(' ');
}

const MAX_HISTORY_MESSAGES = 16;
const MAX_MEMORIES_IN_PROMPT = 6;

export interface GenerateOptions {
  onToken?: (token: string) => void;
  maxTokens?: number;
  memories?: string[];
}

function requireCtx(): LlamaContext {
  if (!ctx) throw new ModelNotReadyError();
  return ctx;
}

export async function generateReply(
  mode: CompanionMode,
  history: { role: 'user' | 'assistant'; text: string }[],
  opts: GenerateOptions = {},
): Promise<string> {
  // Keep the prompt within the model's context window: a short, fixed system
  // prompt plus only the most recent turns, rather than the whole conversation.
  const recentHistory = history.slice(-MAX_HISTORY_MESSAGES);
  const memories = (opts.memories ?? []).slice(0, MAX_MEMORIES_IN_PROMPT);
  const messages = [
    { role: 'system', content: buildSystemPrompt(mode, memories) },
    ...recentHistory.map(m => ({ role: m.role, content: m.text })),
  ];

  const activeCtx = requireCtx();
  const res = await enqueue(() =>
    activeCtx.completion(
      {
        messages,
        jinja: true,
        chat_template_kwargs: { enable_thinking: false },
        n_predict: opts.maxTokens ?? 220,
        temperature: 0.7,
        top_k: 40,
        top_p: 0.9,
      },
      data => {
        if (data.token) opts.onToken?.(data.token);
      },
    ),
  );

  const text = res.content ?? res.text ?? '';
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

export async function stopGeneration() {
  await ctx?.stopCompletion().catch(() => undefined);
}

const MEMORY_EXTRACTION_SCHEMA = {
  type: 'object',
  properties: {
    remember: { type: 'boolean' },
    content: { type: 'string' },
    category: { type: 'string', enum: ['interest', 'preference', 'project', 'goal', 'fact'] },
    confidence: { type: 'string', enum: ['stated', 'preference', 'tentative'] },
  },
  required: ['remember'],
  additionalProperties: false,
};

const EXTRACTION_SYSTEM_PROMPT = [
  'You extract durable personal facts worth remembering from one exchange of a conversation.',
  'Only set remember to true if the person clearly stated a lasting interest, preference, ongoing project, goal, or fact about themselves.',
  'Set remember to false for passing moods, one-off plans, questions, or anything temporary (e.g. "I am tired today" is NOT worth remembering).',
  'When remember is true, write content as a short third-person note under 12 words (e.g. "Enjoys detective mystery puzzles"), and pick the best category and confidence.',
].join(' ');

export interface MemoryCandidate {
  content: string;
  category: 'interest' | 'preference' | 'project' | 'goal' | 'fact';
  confidence: 'stated' | 'preference' | 'tentative';
}

/**
 * Lightweight, local pass over the latest exchange to find one durable memory
 * worth saving, if any. Runs on the same local model — no extra download.
 */
export async function extractMemoryCandidate(userText: string, assistantText: string): Promise<MemoryCandidate | null> {
  const activeCtx = ctx;
  if (!activeCtx) return null;
  try {
    const res = await enqueue(() =>
      activeCtx.completion({
        messages: [
          { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
          { role: 'user', content: `User said: "${userText}"\nFox replied: "${assistantText}"` },
        ],
        jinja: true,
        chat_template_kwargs: { enable_thinking: false },
        response_format: { type: 'json_schema', json_schema: { strict: true, schema: MEMORY_EXTRACTION_SCHEMA } },
        n_predict: 80,
        temperature: 0.2,
      }),
    );
    const raw = res.content ?? res.text ?? '';
    const parsed = JSON.parse(raw);
    if (!parsed?.remember || typeof parsed.content !== 'string' || !parsed.content.trim()) return null;
    return {
      content: parsed.content.trim(),
      category: parsed.category ?? 'fact',
      confidence: parsed.confidence ?? 'tentative',
    };
  } catch {
    // Extraction is a best-effort background nicety — never surface this as a user-facing error.
    return null;
  }
}
