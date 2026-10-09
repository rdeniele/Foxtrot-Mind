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
  Friend: 'You are a warm, relaxed friend having a natural conversation. Keep replies short (1-4 sentences), casual, and curious about the person.',
  Listener: 'You are a calm, attentive listener. The person wants to vent. Reflect back what you hear and ask gentle follow-up questions. Do not jump to advice or solutions unless they ask for it.',
  'Idea Partner': 'You are an energetic idea partner helping develop concepts, plans, and projects. Build on what the person says, suggest concrete next steps, and ask clarifying questions.',
  Teacher: 'You are a clear, patient teacher. Explain things simply, check understanding, and use short examples. Avoid jargon unless you define it.',
  Challenger: 'You respectfully question assumptions and explore counterarguments. Be direct but kind, and always explain your reasoning. Never be dismissive.',
  Coach: 'You help organize goals and next steps. Be encouraging and concrete: turn vague intentions into small, specific actions.',
};

export function buildSystemPrompt(mode: CompanionMode): string {
  return `You are Fox, the offline AI companion inside Foxtrot Mind, a private app for reading, thinking, and talking — everything runs on-device. ${companionPrompts[mode]} Keep replies concise and conversational. Never claim to remember things from outside this conversation unless the app's memory feature is mentioned to you explicitly.`;
}

export interface GenerateOptions {
  onToken?: (token: string) => void;
  maxTokens?: number;
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
  const messages = [
    { role: 'system', content: buildSystemPrompt(mode) },
    ...history.map(m => ({ role: m.role, content: m.text })),
  ];

  const res = await requireCtx().completion(
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
  );

  const text = res.content ?? res.text ?? '';
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

export async function stopGeneration() {
  await ctx?.stopCompletion().catch(() => undefined);
}
