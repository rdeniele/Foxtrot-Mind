import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FS from 'expo-file-system/legacy';

import { MODEL, ModelSpec } from './modelManifest';

export type ModelStatus = 'not_downloaded' | 'downloading' | 'downloaded' | 'corrupted';

export interface ModelInfo {
  spec: ModelSpec;
  status: ModelStatus;
  localPath: string | null;
}

const MODELS_DIR = `${FS.documentDirectory}models/`;
const STORAGE_HEADROOM = 200 * 1024 * 1024;
const STATE_KEY = 'foxtrotmind.model.status';
const MAX_ATTEMPTS = 6;

let activeJob: FS.DownloadResumable | null = null;
let cancelled = false;

const pathFor = (spec: ModelSpec) => `${MODELS_DIR}${spec.fileName}`;
const partPathFor = (spec: ModelSpec) => `${pathFor(spec)}.part`;
const remove = (uri: string) => FS.deleteAsync(uri, { idempotent: true });
const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

async function readStoredStatus(): Promise<ModelStatus> {
  const raw = await AsyncStorage.getItem(STATE_KEY);
  return raw === 'downloaded' || raw === 'corrupted' ? raw : 'not_downloaded';
}

const writeStoredStatus = (status: ModelStatus) => AsyncStorage.setItem(STATE_KEY, status);

/** Self-healing: trusts the filesystem over the cached status flag. */
export async function getModelInfo(): Promise<ModelInfo> {
  let status = await readStoredStatus();
  const path = pathFor(MODEL);
  const file = await FS.getInfoAsync(path);

  if (status === 'downloaded' && (!file.exists || file.size !== MODEL.sizeBytes)) {
    status = 'not_downloaded';
    await writeStoredStatus(status);
  } else if (status !== 'downloaded' && file.exists && file.size === MODEL.sizeBytes) {
    status = 'downloaded';
    await writeStoredStatus(status);
  }

  return { spec: MODEL, status, localPath: status === 'downloaded' ? path : null };
}

async function fetchWithResume(partPath: string, onProgress: (p: number) => void): Promise<void> {
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (cancelled) return;
    const info = await FS.getInfoAsync(partPath);
    const have = info.exists ? info.size : 0;
    if (have === MODEL.sizeBytes) return;

    const job = FS.createDownloadResumable(
      MODEL.url,
      partPath,
      {},
      p => onProgress(p.totalBytesWritten / MODEL.sizeBytes),
      have > 0 ? String(have) : undefined,
    );
    activeJob = job;
    try {
      const result = have > 0 ? await job.resumeAsync() : await job.downloadAsync();
      if (cancelled) return;
      if (result && (result.status === 200 || result.status === 206)) return;
      lastError = new Error(`HTTP ${result?.status ?? 'unknown'}`);
    } catch (e) {
      if (cancelled) return;
      lastError = e;
    }
    await sleep(Math.min(2000 * attempt, 10000));
  }
  const detail = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`The connection kept dropping (${detail}). Try again on a steadier connection.`);
}

/** Explicit, user-initiated download. Never happens automatically. */
export async function downloadModel(onProgress: (p: number) => void): Promise<void> {
  const free = await FS.getFreeDiskStorageAsync();
  if (free < MODEL.sizeBytes + STORAGE_HEADROOM) {
    const needMb = Math.ceil((MODEL.sizeBytes + STORAGE_HEADROOM) / 1048576);
    throw new Error(`Not enough storage. About ${needMb} MB of free space is needed.`);
  }

  await FS.makeDirectoryAsync(MODELS_DIR, { intermediates: true }).catch(() => undefined);
  const finalPath = pathFor(MODEL);
  const partPath = partPathFor(MODEL);
  await remove(partPath);
  cancelled = false;
  await writeStoredStatus('not_downloaded');

  try {
    await fetchWithResume(partPath, onProgress);
    if (cancelled) throw new Error('Download canceled.');

    const info = await FS.getInfoAsync(partPath);
    const size = info.exists ? info.size : 0;
    if (size !== MODEL.sizeBytes) {
      await writeStoredStatus('corrupted');
      throw new Error('The downloaded file is the wrong size. Please download again.');
    }
    await FS.moveAsync({ from: partPath, to: finalPath });
    await writeStoredStatus('downloaded');
  } catch (e) {
    await remove(partPath);
    const current = await readStoredStatus();
    if (current !== 'corrupted') await writeStoredStatus('not_downloaded');
    throw e;
  } finally {
    activeJob = null;
  }
}

export async function cancelDownload() {
  cancelled = true;
  await activeJob?.cancelAsync().catch(() => undefined);
}

export async function deleteModel(): Promise<void> {
  await remove(pathFor(MODEL));
  await remove(partPathFor(MODEL));
  await writeStoredStatus('not_downloaded');
}
