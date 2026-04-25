import React, { createContext, useContext, useMemo, useState } from "react";
import type { NumerologyResponse } from "../types/numerology";

type DobContextValue = {
  dob: string | null;
  pm: number | null;
  dn: number | null;
  setDob: (dob: string | null) => void;
  setNumerology: (data: { dob: string | null; pm: number | null; dn: number | null }) => void;
};

const DobContext = createContext<DobContextValue | null>(null);

const getStoredNumerology = () => {
  try {
    const stored = sessionStorage.getItem("numo-result");
    if (!stored) return { dob: null, pm: null, dn: null };
    const parsed = JSON.parse(stored) as NumerologyResponse;
    const dob = typeof parsed?.dateOfBirth === "string" ? parsed.dateOfBirth : null;
    const pm = typeof parsed?.pm === "number" && Number.isFinite(parsed.pm) ? parsed.pm : null;
    const dn = typeof parsed?.dn === "number" && Number.isFinite(parsed.dn) ? parsed.dn : null;
    return { dob, pm, dn };
  } catch {
    return { dob: null, pm: null, dn: null };
  }
};

export function DobProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ dob: string | null; pm: number | null; dn: number | null }>(
    () => getStoredNumerology()
  );

  const setDob = (next: string | null) => {
    setState((prev) => ({ ...prev, dob: next }));
  };

  const setNumerology = (data: { dob: string | null; pm: number | null; dn: number | null }) => {
    setState(data);
  };

  const value = useMemo(
    () => ({ dob: state.dob, pm: state.pm, dn: state.dn, setDob, setNumerology }),
    [state.dob, state.pm, state.dn]
  );

  return <DobContext.Provider value={value}>{children}</DobContext.Provider>;
}

export function useDob() {
  const ctx = useContext(DobContext);
  if (!ctx) {
    throw new Error("useDob must be used within DobProvider");
  }
  return ctx;
}

