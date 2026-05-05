import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import GridCard from "../components/GridCard";
import GridInterpretations from "../components/GridInterpretations";
import { useTheme } from "../hooks/useTheme";
import { useDob } from "../state/DobContext";
import { useLoader } from "../state/LoaderContext";
import { calculateGrid } from "../utils/calculateGrid";
import { generateCycle, getBirthYearFromDob, getPersonalYearSequence } from "../utils/personalYear";

const planetMap: Record<number, string> = {
  1: "Sun",
  2: "Moon",
  3: "Jupiter",
  4: "Rahu",
  5: "Mercury",
  6: "Venus",
  7: "Ketu",
  8: "Shani",
  9: "Mars"
};

function formatDate(day: number, month: number, year: number): string {
  return `${day}/${month}/${year}`;
}

export default function VedicGridPage() {
  const { isDark, setIsDark } = useTheme();
  const { dob, pm, dn } = useDob();
  const loader = useLoader();
  const [openSection, setOpenSection] = useState<"year" | "month" | "day" | null>(null);

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
  const birthYear = useMemo(() => (dob ? getBirthYearFromDob(dob) : null), [dob]);
  const personalYearSequence = useMemo(() => {
    if (birthYear == null || pm == null) return [];
    return getPersonalYearSequence(birthYear, pm);
  }, [birthYear, pm]);
  const cycleSequence = useMemo(() => (pm == null ? [] : generateCycle(pm)), [pm]);
  const dobParts = useMemo(
    () => (dob ? dob.match(/^\s*(\d{1,2})\D+(\d{1,2})\D+(\d{2}|\d{4})\s*$/) : null),
    [dob]
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

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-bold text-fuchsia-700 dark:text-fuchsia-300">Vedic Timeline</h2>

          <div className="overflow-hidden rounded-xl border border-fuchsia-200/70 bg-white/70 dark:border-fuchsia-900/60 dark:bg-slate-950/50">
            <button
              type="button"
              onClick={() => setOpenSection((prev) => (prev === "year" ? null : "year"))}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="font-semibold">Personal Year</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{openSection === "year" ? "−" : "+"}</span>
            </button>
            <motion.div
              initial={false}
              animate={{
                height: openSection === "year" ? "auto" : 0,
                opacity: openSection === "year" ? 1 : 0
              }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-fuchsia-100 px-4 py-4 dark:border-fuchsia-900/50">
                {birthYear == null ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Could not detect birth year from DOB. Personal Year is unavailable.
                  </p>
                ) : personalYearSequence.length === 0 ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Personal Year could not be calculated because PM is missing or invalid.
                  </p>
                ) : (
                  <>
                    <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
                      Personal Year Cycle
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {personalYearSequence.map((yearValue, index) => {
                        const startYear = index === 0 ? birthYear : personalYearSequence[index - 1];
                        const sequenceNumber = cycleSequence[index];
                        const planetName = sequenceNumber ? planetMap[sequenceNumber] : "Unknown";
                        const day = dobParts ? Number.parseInt(dobParts[1], 10) : NaN;
                        const month = dobParts ? Number.parseInt(dobParts[2], 10) : NaN;
                        const hasValidDateParts = Number.isFinite(day) && Number.isFinite(month);
                        const startLabel = hasValidDateParts
                          ? formatDate(day, month, startYear)
                          : String(startYear);
                        const endLabel = hasValidDateParts ? formatDate(day, month, yearValue) : String(yearValue);

                        return (
                        <div
                          key={`${yearValue}-${index}`}
                          className="rounded-lg border border-fuchsia-200/70 bg-fuchsia-50/70 px-3 py-2 text-sm font-medium text-fuchsia-800 dark:border-fuchsia-800/60 dark:bg-fuchsia-900/20 dark:text-fuchsia-200"
                        >
                          <span className="text-fuchsia-900 dark:text-fuchsia-100">
                            {startLabel} - {endLabel}
                          </span>
                          {" = "}
                          <span className="font-extrabold">{planetName}</span>
                        </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          <div className="overflow-hidden rounded-xl border border-fuchsia-200/70 bg-white/70 dark:border-fuchsia-900/60 dark:bg-slate-950/50">
            <button
              type="button"
              onClick={() => setOpenSection((prev) => (prev === "month" ? null : "month"))}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="font-semibold">Personal Month</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{openSection === "month" ? "−" : "+"}</span>
            </button>
            <motion.div
              initial={false}
              animate={{
                height: openSection === "month" ? "auto" : 0,
                opacity: openSection === "month" ? 1 : 0
              }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-fuchsia-100 px-4 py-4 dark:border-fuchsia-900/50">
                <p className="text-sm text-slate-600 dark:text-slate-300">Coming soon.</p>
              </div>
            </motion.div>
          </div>

          <div className="overflow-hidden rounded-xl border border-fuchsia-200/70 bg-white/70 dark:border-fuchsia-900/60 dark:bg-slate-950/50">
            <button
              type="button"
              onClick={() => setOpenSection((prev) => (prev === "day" ? null : "day"))}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="font-semibold">Personal Day</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{openSection === "day" ? "−" : "+"}</span>
            </button>
            <motion.div
              initial={false}
              animate={{
                height: openSection === "day" ? "auto" : 0,
                opacity: openSection === "day" ? 1 : 0
              }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-fuchsia-100 px-4 py-4 dark:border-fuchsia-900/50">
                <p className="text-sm text-slate-600 dark:text-slate-300">Coming soon.</p>
              </div>
            </motion.div>
          </div>
        </section>

        <GridInterpretations gridType="vedic" presentNumbers={grid.present} missingNumbers={grid.missing} />
      </div>
    </main>
  );
}

