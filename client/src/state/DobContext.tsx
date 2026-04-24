import React, { createContext, useContext, useMemo, useState } from "react";
import type { NumerologyResponse } from "../types/numerology";

type DobContextValue = {
  dob: string | null;
  setDob: (dob: string | null) => void;
};

const DobContext = createContext<DobContextValue | null>(null);

const getStoredDob = () => {
  try {
    const stored = sessionStorage.getItem("numo-result");
    if (!stored) return null;
    const parsed = JSON.parse(stored) as NumerologyResponse;
    return typeof parsed?.dateOfBirth === "string" ? parsed.dateOfBirth : null;
  } catch {
    return null;
  }
};

export function DobProvider({ children }: { children: React.ReactNode }) {
  const [dob, setDobState] = useState<string | null>(() => getStoredDob());

  const setDob = (next: string | null) => {
    setDobState(next);
  };

  const value = useMemo(() => ({ dob, setDob }), [dob]);

  return <DobContext.Provider value={value}>{children}</DobContext.Provider>;
}

export function useDob() {
  const ctx = useContext(DobContext);
  if (!ctx) {
    throw new Error("useDob must be used within DobProvider");
  }
  return ctx;
}

