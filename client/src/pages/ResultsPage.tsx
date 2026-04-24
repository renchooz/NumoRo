import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ResultsCards from "../components/ResultsCards";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../hooks/useTheme";
import { useDob } from "../state/DobContext";
import { useLoader } from "../state/LoaderContext";
import { shareResult } from "../utils/share";
import type { NumerologyResponse } from "../types/numerology";

interface LocationState {
  result?: NumerologyResponse;
}

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, setIsDark } = useTheme();
  const { setDob } = useDob();
  const loader = useLoader();
  const [showKnowMore, setShowKnowMore] = useState(false);

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

  useEffect(() => {
    if (result?.dateOfBirth) {
      setDob(result.dateOfBirth);
    }
  }, [result?.dateOfBirth, setDob]);

  if (!result) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white bg-gradient-to-br from-emerald-100 via-cyan-100 to-violet-100 px-4 py-8 text-black dark:bg-gray-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 dark:text-white">
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

          <section className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Know More
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Explore advanced DOB grids with a premium astrology-like view.
                </p>
              </div>

              <button
                onClick={() => setShowKnowMore((v) => !v)}
                className="rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.01]"
              >
                Know More About Your DOB
              </button>
            </div>

            {showKnowMore ? (
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    loader.show();
                    setDob(result.dateOfBirth);
                    navigate("/pythagoras-grid");
                  }}
                  className="group rounded-2xl border border-white/40 bg-white/35 p-5 text-left shadow-glass backdrop-blur-xl transition dark:border-white/10 dark:bg-slate-900/40"
                >
                  <p className="text-sm text-slate-500 dark:text-slate-300">Option 1</p>
                  <h4 className="mt-1 text-xl font-extrabold text-indigo-700 dark:text-indigo-300">
                    Pythagoras Grid
                  </h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Classic 1–9 matrix with repeats highlighted.
                  </p>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    loader.show();
                    setDob(result.dateOfBirth);
                    navigate("/loshu-grid");
                  }}
                  className="group rounded-2xl border border-white/40 bg-white/35 p-5 text-left shadow-glass backdrop-blur-xl transition dark:border-white/10 dark:bg-slate-900/40"
                >
                  <p className="text-sm text-slate-500 dark:text-slate-300">Option 2</p>
                  <h4 className="mt-1 text-xl font-extrabold text-emerald-700 dark:text-emerald-300">
                    Lo Shu Grid
                  </h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Traditional Lo Shu layout: 4-9-2 / 3-5-7 / 8-1-6.
                  </p>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    loader.show();
                    setDob(result.dateOfBirth);
                    navigate("/vedic-grid");
                  }}
                  className="group rounded-2xl border border-white/40 bg-white/35 p-5 text-left shadow-glass backdrop-blur-xl transition dark:border-white/10 dark:bg-slate-900/40"
                >
                  <p className="text-sm text-slate-500 dark:text-slate-300">Option 3</p>
                  <h4 className="mt-1 text-xl font-extrabold text-fuchsia-700 dark:text-fuchsia-300">
                    Vedic Grid
                  </h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Presence/absence focused view in a modern grid.
                  </p>
                </motion.button>
              </div>
            ) : null}
          </section>

          <section className="mt-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">
              Name Numerology
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-white/40 bg-white/35 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40"
              >
                <p className="text-sm text-slate-500 dark:text-slate-300">Name Compound Number (NCN)</p>
                <h3 className="mt-2 text-3xl font-semibold text-violet-700 dark:text-violet-300">
                  {result.nameCompound}
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{result.meanings.nameCompound}</p>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="rounded-2xl border border-white/40 bg-white/35 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40"
              >
                <p className="text-sm text-slate-500 dark:text-slate-300">Final Name Number</p>
                <h3 className="mt-2 text-3xl font-semibold text-violet-700 dark:text-violet-300">
                  {result.nameFinal}
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{result.meanings.nameFinal}</p>
              </motion.article>
            </div>
          </section>

          <section className="mt-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">
              Mobile Numerology
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="rounded-2xl border border-white/40 bg-white/35 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40"
              >
                <p className="text-sm text-slate-500 dark:text-slate-300">Mobile Compound Number (MCN)</p>
                <h3 className="mt-2 text-3xl font-semibold text-violet-700 dark:text-violet-300">
                  {result.mobileCompound}
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{result.meanings.mobileCompound}</p>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="rounded-2xl border border-white/40 bg-white/35 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40"
              >
                <p className="text-sm text-slate-500 dark:text-slate-300">Final Mobile Number</p>
                <h3 className="mt-2 text-3xl font-semibold text-violet-700 dark:text-violet-300">
                  {result.mobileFinal}
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{result.meanings.mobileFinal}</p>
              </motion.article>
            </div>
          </section>
        </motion.section>
      </div>
    </main>
  );
};

export default ResultsPage;
