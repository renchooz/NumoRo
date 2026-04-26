import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { adminLogin, isAdminLoggedIn } from "../utils/adminAuth";

type LocationState = { from?: string };

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = useMemo(() => (location.state as LocationState | null)?.from || "/admin", [location.state]);

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdminLoggedIn()) {
      navigate(from, { replace: true });
    }
  }, [from, navigate]);

  return (
    <main className="min-h-screen bg-white bg-gradient-to-br from-indigo-100 via-fuchsia-100 to-cyan-100 px-4 py-10 text-black dark:bg-gray-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 dark:text-white">
      <div className="mx-auto max-w-md">
        <header className="mb-6">
          <p className="text-xl">🔐🛡️✨</p>
          <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-300">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Sign in to manage grid interpretations (CMS).
          </p>
        </header>

        <section className="rounded-3xl border border-white/40 bg-white/35 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);
              const res = adminLogin(email, password);
              if (!res.ok) {
                setError(res.message);
                return;
              }
              navigate(from, { replace: true });
            }}
          >
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-2 w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-slate-900 shadow-glass outline-none backdrop-blur-xl placeholder:text-slate-500 focus:border-indigo-400 dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
                placeholder="admin@gmail.com"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-2 w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-slate-900 shadow-glass outline-none backdrop-blur-xl placeholder:text-slate-500 focus:border-indigo-400 dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
                placeholder="admin123"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-glass transition hover:scale-[1.01]"
            >
              Login
            </button>

            <div className="flex items-center justify-between text-sm">
              <Link to="/" className="text-slate-700 underline-offset-4 hover:underline dark:text-slate-200">
                Back to app
              </Link>
              <span className="text-slate-500 dark:text-slate-400">Hardcoded auth (temporary)</span>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

