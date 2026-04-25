import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import ThemeToggle from "../components/ThemeToggle";
import GridCard from "../components/GridCard";
import { useTheme } from "../hooks/useTheme";
import { useDob } from "../state/DobContext";
import { useLoader } from "../state/LoaderContext";
import { calculateGrid } from "../utils/calculateGrid";

export default function VedicGridPage() {
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
    () => (dob && pm != null && dn != null ? calculateGrid(dob, "vedic", pm, dn) : null),
    [dob, dn, pm]
  );

  if (!dob || pm == null || dn == null || !grid) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen bg-white bg-gradient-to-br from-pink-100 via-violet-100 to-indigo-100 px-4 py-8 text-black dark:bg-gray-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 dark:text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xl">🌙🪬🕉️✨</p>
            <h1 className="text-4xl font-extrabold text-fuchsia-700 dark:text-fuchsia-300">
              Vedic Grid
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Presence/absence from your DOB digits in a clean 1–9 matrix.
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
            title="Vedic 3×3 Grid"
            subtitle="A modern, minimal grid view of your DOB frequency."
            grid={grid}
            accent="pink"
          />
        </motion.div>
      </div>
    </main>
  );
}

