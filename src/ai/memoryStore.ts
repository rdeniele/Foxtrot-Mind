import AsyncStorage from '@react-native-async-storage/async-storage';

export type MemoryCategory = 'interest' | 'preference' | 'project' | 'goal' | 'fact' | 'other';
export type MemoryConfidence = 'stated' | 'preference' | 'tentative';

export interface MemoryItem {
  id: string;
  content: string;
  category: MemoryCategory;
  confidence: MemoryConfidence;
  createdAt: number;
  lastUsedAt: number;
  source?: string;
}

const KEY = 'foxtrotmind.memories';

async function readAll(): Promise<MemoryItem[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const writeAll = (memories: MemoryItem[]) => AsyncStorage.setItem(KEY, JSON.stringify(memories));

export async function listMemories(): Promise<MemoryItem[]> {
  const all = await readAll();
  return all.sort((a, b) => b.lastUsedAt - a.lastUsedAt);
}

export async function saveMemory(input: {
  content: string;
  category: MemoryCategory;
  confidence: MemoryConfidence;
  source?: string;
}): Promise<MemoryItem> {
  const all = await readAll();
  const now = Date.now();
  const item: MemoryItem = {
    id: `m-${now}-${Math.round(Math.random() * 1e6)}`,
    content: input.content.trim(),
    category: input.category,
    confidence: input.confidence,
    createdAt: now,
    lastUsedAt: now,
    source: input.source,
  };
  all.push(item);
  await writeAll(all);
  return item;
}

export async function updateMemory(id: string, changes: Partial<Pick<MemoryItem, 'content' | 'category'>>): Promise<void> {
  const all = await readAll();
  const index = all.findIndex(m => m.id === id);
  if (index === -1) return;
  all[index] = { ...all[index], ...changes };
  await writeAll(all);
}

export async function deleteMemory(id: string): Promise<void> {
  const all = await readAll();
  await writeAll(all.filter(m => m.id !== id));
}

export async function clearAllMemories(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}

/** Marks memories as recently relevant, e.g. after including them in a prompt. */
export async function touchMemories(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const all = await readAll();
  const now = Date.now();
  let changed = false;
  for (const m of all) {
    if (ids.includes(m.id)) {
      m.lastUsedAt = now;
      changed = true;
    }
  }
  if (changed) await writeAll(all);
}

export const CATEGORY_LABEL: Record<MemoryCategory, string> = {
  interest: 'Interest',
  preference: 'Preference',
  project: 'Project',
  goal: 'Goal',
  fact: 'Fact',
  other: 'Other',
};
