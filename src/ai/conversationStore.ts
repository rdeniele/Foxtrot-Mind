import AsyncStorage from '@react-native-async-storage/async-storage';

import { ChatMessage, CompanionMode } from '@/data/sampleContent';

export interface StoredConversation {
  id: string;
  title: string;
  mode: CompanionMode;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

const KEY = 'foxtrotmind.conversations';

async function readAll(): Promise<StoredConversation[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const writeAll = (conversations: StoredConversation[]) => AsyncStorage.setItem(KEY, JSON.stringify(conversations));

export async function listConversations(): Promise<StoredConversation[]> {
  const all = await readAll();
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getConversation(id: string): Promise<StoredConversation | null> {
  const all = await readAll();
  return all.find(c => c.id === id) ?? null;
}

/** Upserts by id. Conversations with no messages are never persisted. */
export async function saveConversation(conversation: StoredConversation): Promise<void> {
  if (conversation.messages.length === 0) return;
  const all = await readAll();
  const index = all.findIndex(c => c.id === conversation.id);
  if (index === -1) {
    all.push(conversation);
  } else {
    all[index] = conversation;
  }
  await writeAll(all);
}

export async function deleteConversation(id: string): Promise<void> {
  const all = await readAll();
  await writeAll(all.filter(c => c.id !== id));
}

export async function clearAllConversations(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}

export function deriveTitle(firstUserMessage: string): string {
  const clean = firstUserMessage.replace(/\s+/g, ' ').trim();
  return clean.length > 42 ? `${clean.slice(0, 42).trim()}…` : clean || 'New conversation';
}

export function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
