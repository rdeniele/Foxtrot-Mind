import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import * as localModel from './localModel';
import * as modelManager from './modelManager';
import { MODEL } from './modelManifest';
import { ModelStatus } from './modelManager';

interface ModelContextValue {
  spec: typeof MODEL;
  status: ModelStatus;
  progress: number;
  error: string | null;
  loaded: boolean;
  busy: boolean;
  refresh: () => Promise<void>;
  startDownload: () => Promise<void>;
  cancelDownload: () => Promise<void>;
  removeModel: () => Promise<void>;
  loadModel: () => Promise<void>;
  unloadModel: () => Promise<void>;
}

const ModelContext = createContext<ModelContextValue | null>(null);

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ModelStatus>('not_downloaded');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const info = await modelManager.getModelInfo();
    setStatus(info.status);
    setLoaded(localModel.isModelLoaded());
  }, []);

  useEffect(() => {
    let cancelled = false;
    modelManager.getModelInfo().then(info => {
      if (cancelled) return;
      setStatus(info.status);
      setLoaded(localModel.isModelLoaded());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const startDownload = useCallback(async () => {
    setError(null);
    setProgress(0);
    setStatus('downloading');
    try {
      await modelManager.downloadModel(p => setProgress(p));
    } catch (e) {
      setError((e as Error).message);
    }
    await refresh();
  }, [refresh]);

  const cancelDownload = useCallback(async () => {
    await modelManager.cancelDownload();
  }, []);

  const removeModel = useCallback(async () => {
    await localModel.unloadModel();
    setLoaded(false);
    await modelManager.deleteModel();
    await refresh();
  }, [refresh]);

  const doLoadModel = useCallback(async () => {
    setError(null);
    setBusy(true);
    try {
      await localModel.loadModel();
      setLoaded(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, []);

  const doUnloadModel = useCallback(async () => {
    await localModel.unloadModel();
    setLoaded(false);
  }, []);

  const value = useMemo<ModelContextValue>(
    () => ({
      spec: MODEL,
      status,
      progress,
      error,
      loaded,
      busy,
      refresh,
      startDownload,
      cancelDownload,
      removeModel,
      loadModel: doLoadModel,
      unloadModel: doUnloadModel,
    }),
    [status, progress, error, loaded, busy, refresh, startDownload, cancelDownload, removeModel, doLoadModel, doUnloadModel],
  );

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
}

export function useModel() {
  const ctx = useContext(ModelContext);
  if (!ctx) throw new Error('useModel must be used within a ModelProvider');
  return ctx;
}
