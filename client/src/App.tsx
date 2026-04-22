import { type FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "./components/ThemeToggle";
import ResultsCards from "./components/ResultsCards";
import HistoryList from "./components/HistoryList";
import LoadingOrb from "./components/LoadingOrb";
import { useTheme } from "./hooks/useTheme";
import { genderOptions } from "./constants/genderOptions";
import { calculateNumerology, fetchHistory } from "./services/api";
import { shareResult } from "./utils/share";
import type { GenderOption, NumerologyResponse } from "./types/numerology";
import babaLogo from "./assets/baba-logo.png";

function App() {
  const { isDark, setIsDark } = useTheme();
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<GenderOption>("");
  const [result, setResult] = useState<NumerologyResponse | null>(null);
  const [history, setHistory] = useState<NumerologyResponse[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const disabled = useMemo(
    () => !fullName.trim() || !dateOfBirth || isLoading,
    [fullName, dateOfBirth, isLoading]
  );

  useEffect(() => {
    fetchHistory()
      .then((items) => setHistory(items))
      .catch(() => setHistory([]));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = await calculateNumerology({
        fullName: fullName.trim(),
        dateOfBirth,
        gender: gender || undefined,
        saveHistory: true
      });
      setResult(payload);

      const latestHistory = await fetchHistory();
      setHistory(latestHistory);
    } catch (err) {
      setError("Unable to calculate numerology right now. Please verify your input and try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-fuchsia-100 via-violet-100 to-cyan-100 px-4 py-8 text-slate-900 transition dark:from-slate-950 dark:via-violet-950 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={babaLogo}
              alt="Baba logo"
              className="h-32 w-32 rounded-2xl border border-white/40 object-cover shadow-glass md:h-44 md:w-44"
            />
            <h1 className="text-3xl font-bold md:text-4xl">Baba Ka Ashirwad</h1>
          </div>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/40 bg-white/35 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40"
        >
          <h2 className="text-xl font-semibold">Discover your core numbers</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Enter your details to generate your Life Path, Expression, Soul Urge, and Personality
            numbers.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm">Full Name</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-xl border border-white/40 bg-white/70 p-3 outline-none ring-violet-300 focus:ring dark:border-white/10 dark:bg-slate-800/60"
                placeholder="John Doe"
                required
                minLength={2}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm">Date of Birth</span>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="rounded-xl border border-white/40 bg-white/70 p-3 outline-none ring-violet-300 focus:ring dark:border-white/10 dark:bg-slate-800/60"
                required
              />
            </label>

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-sm">Gender (optional)</span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as GenderOption)}
                className="rounded-xl border border-white/40 bg-white/70 p-3 outline-none ring-violet-300 focus:ring dark:border-white/10 dark:bg-slate-800/60"
              >
                <option value="">Select a gender</option>
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              disabled={disabled}
              className="md:col-span-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 p-3 font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Calculating..." : "Calculate Numerology"}
            </button>
          </form>

          {isLoading && <LoadingOrb />}
          {error && <p className="mt-4 text-sm text-rose-500">{error}</p>}

          {result && (
            <section className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Result</h3>
                <button
                  onClick={() => shareResult(result)}
                  className="rounded-lg bg-violet-100 px-3 py-2 text-sm font-medium text-violet-800 dark:bg-violet-900/60 dark:text-violet-100"
                >
                  Share Result
                </button>
              </div>
              <ResultsCards
                numbers={{
                  lifePathNumber: result.lifePathNumber,
                  expressionNumber: result.expressionNumber,
                  soulUrgeNumber: result.soulUrgeNumber,
                  personalityNumber: result.personalityNumber
                }}
                meanings={result.meanings}
              />
            </section>
          )}

          <HistoryList history={history} />
        </motion.section>
      </div>
    </main>
  );
}

export default App;
