import { type FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import HistoryList from "../components/HistoryList";
import LoadingOrb from "../components/LoadingOrb";
import { useTheme } from "../hooks/useTheme";
import { genderOptions } from "../constants/genderOptions";
import { calculateNumerology, fetchHistory } from "../services/api";
import type { GenderOption, NumerologyResponse } from "../types/numerology";

const HomePage = () => {
  const { isDark, setIsDark } = useTheme();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<GenderOption>("");
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
      sessionStorage.setItem("numo-result", JSON.stringify(payload));
      navigate("/result", { state: { result: payload } });
    } catch (err) {
      setError("Unable to calculate numerology right now. Please verify your input and try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-cyan-100 px-4 py-8 text-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xl">🌈✨💫🦋</p>
            <h1 className="text-4xl font-extrabold text-fuchsia-700 dark:text-fuchsia-300">
              Numo Happy Numerology
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Cheerful insights for your life numbers 🎉
            </p>
          </div>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/40 bg-white/40 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40"
        >
          <h2 className="text-xl font-semibold">Tell us about you 🧿</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Fill your details and we will open your colorful numerology report on a new page.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Full Name 😀</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-xl border border-pink-200 bg-white/80 p-3 outline-none ring-pink-300 focus:ring dark:border-white/10 dark:bg-slate-800/70"
                placeholder="John Doe"
                required
                minLength={2}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Date of Birth 🎂</span>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="rounded-xl border border-cyan-200 bg-white/80 p-3 outline-none ring-cyan-300 focus:ring dark:border-white/10 dark:bg-slate-800/70"
                required
              />
            </label>

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-sm font-medium">Gender (optional) 🌸</span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as GenderOption)}
                className="rounded-xl border border-violet-200 bg-white/80 p-3 outline-none ring-violet-300 focus:ring dark:border-white/10 dark:bg-slate-800/70"
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
              className="md:col-span-2 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 p-3 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Calculating magic... ✨" : "See My Result Page 🚀"}
            </button>
          </form>

          {isLoading && <LoadingOrb />}
          {error && <p className="mt-4 text-sm text-rose-500">{error}</p>}
          <HistoryList history={history} />
        </motion.section>
      </div>
    </main>
  );
};

export default HomePage;
