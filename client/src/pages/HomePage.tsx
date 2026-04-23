import { type FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import HistoryList from "../components/HistoryList";
import LoadingOrb from "../components/LoadingOrb";
import { useTheme } from "../hooks/useTheme";
import { calculateNumerology, fetchHistory } from "../services/api";
import type { NumerologyResponse } from "../types/numerology";
import "react-datepicker/dist/react-datepicker.css";

const DOB_REGEX = /^\d{2}-\d{2}-\d{4}$/;

const isValidDob = (value: string) => {
  if (!DOB_REGEX.test(value)) {
    return false;
  }

  const [day, month, year] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const formatDob = (value: Date) => format(value, "dd-MM-yyyy");

const HomePage = () => {
  const { isDark, setIsDark } = useTheme();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [history, setHistory] = useState<NumerologyResponse[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const disabled = useMemo(
    () => !firstName.trim() || !dateOfBirth || !mobileNumber.trim() || isLoading,
    [firstName, dateOfBirth, mobileNumber, isLoading]
  );

  useEffect(() => {
    fetchHistory()
      .then((items) => setHistory(items))
      .catch(() => setHistory([]));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const formattedDob = dateOfBirth ? formatDob(dateOfBirth) : "";

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!isValidDob(formattedDob)) {
      setError("Please enter a valid date in DD-MM-YYYY format.");
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber.trim())) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = await calculateNumerology({
        firstName: firstName.trim(),
        middleName: middleName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        dateOfBirth: formattedDob,
        mobileNumber: mobileNumber.trim(),
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
    <main className="min-h-screen bg-white bg-gradient-to-br from-yellow-100 via-pink-100 to-cyan-100 px-4 py-8 text-black dark:bg-gray-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 dark:text-white">
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
              <span className="text-sm font-medium">First Name 😀</span>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-xl border border-pink-200 bg-white/80 p-3 outline-none ring-pink-300 focus:ring dark:border-white/10 dark:bg-slate-800/70"
                placeholder="First name"
                required
                minLength={1}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Middle Name (optional) 🌼</span>
              <input
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="rounded-xl border border-amber-200 bg-white/80 p-3 outline-none ring-amber-300 focus:ring dark:border-white/10 dark:bg-slate-800/70"
                placeholder="Middle name"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Last Name (optional) 🌟</span>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-xl border border-lime-200 bg-white/80 p-3 outline-none ring-lime-300 focus:ring dark:border-white/10 dark:bg-slate-800/70"
                placeholder="Last name"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Date of Birth 🎂</span>
              <DatePicker
                selected={dateOfBirth}
                onChange={(date: Date | null) => setDateOfBirth(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select DOB from calendar"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
                className="w-full rounded-xl border border-cyan-200 bg-white/80 p-3 outline-none ring-cyan-300 focus:ring dark:border-white/10 dark:bg-slate-800/70"
                wrapperClassName="w-full"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Mobile Number 📱</span>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="rounded-xl border border-violet-200 bg-white/80 p-3 outline-none ring-violet-300 focus:ring dark:border-white/10 dark:bg-slate-800/70"
                placeholder="10-digit mobile number"
                pattern="\d{10}"
                required
              />
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
