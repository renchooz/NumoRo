import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import ThemeToggle from "../components/ThemeToggle";
import GridCard from "../components/GridCard";
import { useTheme } from "../hooks/useTheme";
import { useDob } from "../state/DobContext";
import { useLoader } from "../state/LoaderContext";
import { calculateGrid } from "../utils/calculateGrid";

export default function LoshuGridPage() {
  const { isDark, setIsDark } = useTheme();
  const { dob, pm, dn } = useDob();
  const loader = useLoader();

  useEffect(() => {
    loader.show();
    const id = window.setTimeout(() => loader.hide(), 450);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grid = useMemo(
    () => (dob && pm != null && dn != null ? calculateGrid(dob, "loshu", pm, dn) : null),
    [dob, dn, pm]
  );

  if (!dob || pm == null || dn == null || !grid) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen bg-white bg-gradient-to-br from-emerald-100 via-cyan-100 to-violet-100 px-4 py-8 text-black dark:bg-gray-900 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-900 dark:text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xl">🔮🧭🌿✨</p>
            <h1 className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-300">
              Lo Shu Grid
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Traditional Lo Shu layout: 4-9-2 / 3-5-7 / 8-1-6.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/result"
              className="rounded-lg bg-white/60 px-3 py-2 text-sm font-medium text-slate-800 shadow-glass backdrop-blur-xl dark:bg-slate-950/40 dark:text-slate-100"
            >
              Back to Results
            </Link>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <GridCard
            title="Lo Shu 3×3 Grid"
            subtitle="Repeats are stacked to show frequency."
            grid={grid}
            accent="emerald"
          />
        </motion.div>
      </div>
    </main>
  );
}

