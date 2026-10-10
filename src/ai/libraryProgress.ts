import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLETED_KEY = 'foxtrotmind.library.completed';
const BOOKMARKED_KEY = 'foxtrotmind.library.bookmarked';

async function readSet(key: string): Promise<Record<string, number>> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
}

export async function isCompleted(articleId: string): Promise<boolean> {
  const all = await readSet(COMPLETED_KEY);
  return articleId in all;
}

export async function markCompleted(articleId: string): Promise<void> {
  const all = await readSet(COMPLETED_KEY);
  all[articleId] = Date.now();
  await AsyncStorage.setItem(COMPLETED_KEY, JSON.stringify(all));
}

export async function listCompletedIds(): Promise<string[]> {
  const all = await readSet(COMPLETED_KEY);
  return Object.keys(all);
}

export async function isBookmarked(articleId: string): Promise<boolean> {
  const all = await readSet(BOOKMARKED_KEY);
  return articleId in all;
}

export async function toggleBookmark(articleId: string): Promise<boolean> {
  const all = await readSet(BOOKMARKED_KEY);
  if (articleId in all) {
    delete all[articleId];
    await AsyncStorage.setItem(BOOKMARKED_KEY, JSON.stringify(all));
    return false;
  }
  all[articleId] = Date.now();
  await AsyncStorage.setItem(BOOKMARKED_KEY, JSON.stringify(all));
  return true;
}

export async function listBookmarkedIds(): Promise<string[]> {
  const all = await readSet(BOOKMARKED_KEY);
  return Object.keys(all);
}
