import React, { createContext, useContext, useMemo, useState } from 'react';

import { CompanionMode } from '@/data/sampleContent';

export type ResponseLength = 'short' | 'balanced' | 'long';

export const RESPONSE_LENGTH_TOKENS: Record<ResponseLength, number> = {
  short: 120,
  balanced: 220,
  long: 400,
};

interface AppState {
  onboardingComplete: boolean;
  completeOnboarding: () => void;
  goals: string[];
  setGoals: (g: string[]) => void;
  timePreference: string | null;
  setTimePreference: (t: string) => void;
  companionMode: CompanionMode;
  setCompanionMode: (m: CompanionMode) => void;
  responseLength: ResponseLength;
  setResponseLength: (r: ResponseLength) => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [goals, setGoals] = useState<string[]>([]);
  const [timePreference, setTimePreference] = useState<string | null>(null);
  const [companionMode, setCompanionMode] = useState<CompanionMode>('Friend');
  const [responseLength, setResponseLength] = useState<ResponseLength>('balanced');

  const value = useMemo<AppState>(
    () => ({
      onboardingComplete,
      completeOnboarding: () => setOnboardingComplete(true),
      goals,
      setGoals,
      timePreference,
      setTimePreference,
      companionMode,
      setCompanionMode,
      responseLength,
      setResponseLength,
    }),
    [onboardingComplete, goals, timePreference, companionMode, responseLength],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
