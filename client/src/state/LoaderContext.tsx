/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from "react";
import Loader from "../components/Loader";

type LoaderContextValue = {
  isLoading: boolean;
  show: () => void;
  hide: () => void;
};

const LoaderContext = createContext<LoaderContextValue | null>(null);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo<LoaderContextValue>(
    () => ({
      isLoading,
      show: () => setIsLoading(true),
      hide: () => setIsLoading(false)
    }),
    [isLoading]
  );

  return (
    <LoaderContext.Provider value={value}>
      {children}
      <Loader open={isLoading} />
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx) {
    throw new Error("useLoader must be used within LoaderProvider");
  }
  return ctx;
}

