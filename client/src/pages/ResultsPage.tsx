import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ResultsCards from "../components/ResultsCards";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../hooks/useTheme";
import { shareResult } from "../utils/share";
import type { NumerologyResponse } from "../types/numerology";

interface LocationState {
  result?: NumerologyResponse;
}

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, setIsDark } = useTheme();

  const result = useMemo(() => {
    const fromState = (location.state as LocationState | null)?.result;
    if (fromState) {
      return fromState;
    }

    const stored = sessionStorage.getItem("numo-result");
    return stored ? (JSON.parse(stored) as NumerologyResponse) : null;
  }, [location.state]);

  useEffect(() => {
    if (!result) {
      navigate("/", { replace: true });
    }
  }, [navigate, result]);

  if (!result) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-100 via-cyan-100 to-violet-100 px-4 py-8 text-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xl">🎊🔮🌟🎉</p>
            <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-300">Your Cosmic Result</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {result.fullName}, here is your happy numerology snapshot 💖
            </p>
          </div>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>

        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/40 bg-white/40 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Date of Birth: {result.dateOfBirth}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Mobile Number: {result.mobileNumber}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Vibe: Joyful • Intuitive • Powerful 💫
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => shareResult(result)}
                className="rounded-lg bg-indigo-100 px-3 py-2 text-sm font-medium text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-100"
              >
                Share 🎁
              </button>
              <Link
                to="/"
                className="rounded-lg bg-fuchsia-100 px-3 py-2 text-sm font-medium text-fuchsia-800 dark:bg-fuchsia-900/60 dark:text-fuchsia-100"
              >
                Recalculate 🔁
              </Link>
            </div>
          </div>

          <ResultsCards
            numbers={{
              pm: result.pm,
              cn: result.cn,
              dn: result.dn
            }}
            meanings={result.meanings}
          />
        </motion.section>
      </div>
    </main>
  );
};

export default ResultsPage;
