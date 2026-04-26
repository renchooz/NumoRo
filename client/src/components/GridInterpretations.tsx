import { useEffect, useMemo, useState } from "react";
import type { GridContent, GridType } from "../types/gridContent";
import { fetchGridContentAll } from "../services/api";

type Lang = "en" | "hi";

const LANG_KEY = "numo-lang";

function loadLang(): Lang {
  const raw = localStorage.getItem(LANG_KEY);
  return raw === "hi" ? "hi" : "en";
}

let cache: { at: number; data: GridContent[] } | null = null;

async function fetchWithCache(): Promise<GridContent[]> {
  const now = Date.now();
  if (cache && now - cache.at < 60_000) return cache.data;
  const data = await fetchGridContentAll();
  cache = { at: now, data };
  return data;
}

function getErrorMessage(err: unknown, fallback: string) {
  if (!err || typeof err !== "object") return fallback;
  const maybeAxios = err as { message?: unknown; response?: { data?: { message?: unknown } } };
  const respMsg = maybeAxios.response?.data?.message;
  if (typeof respMsg === "string" && respMsg.trim()) return respMsg;
  if (typeof maybeAxios.message === "string" && maybeAxios.message.trim()) return maybeAxios.message;
  return fallback;
}

export default function GridInterpretations({
  gridType,
  presentNumbers
}: {
  gridType: GridType;
  presentNumbers: number[];
}) {
  const [lang, setLang] = useState<Lang>(() => loadLang());
  const [all, setAll] = useState<GridContent[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        const data = await fetchWithCache();
        if (!cancelled) setAll(data);
      } catch (e: unknown) {
        if (!cancelled) setError(getErrorMessage(e, "Failed to load interpretations"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const presentSet = new Set(presentNumbers);
    return (all ?? [])
      .filter((d) => d.gridType === gridType && presentSet.has(d.number))
      .sort((a, b) => a.number - b.number);
  }, [all, gridType, presentNumbers]);

  return (
    <section className="mt-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Grid Interpretations
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Dynamic content based on numbers present in your grid.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/40 bg-white/40 p-1 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/30">
          <button
            type="button"
            onClick={() => {
              setLang("en");
              localStorage.setItem(LANG_KEY, "en");
            }}
            className={
              lang === "en"
                ? "rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-3 py-2 text-xs font-semibold text-white"
                : "rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
            }
          >
            English
          </button>
          <button
            type="button"
            onClick={() => {
              setLang("hi");
              localStorage.setItem(LANG_KEY, "hi");
            }}
            className={
              lang === "hi"
                ? "rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-3 py-2 text-xs font-semibold text-white"
                : "rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
            }
          >
            हिंदी
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      {all && filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/40 bg-white/35 px-4 py-3 text-sm text-slate-600 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-300">
          No interpretation entries found for these present numbers yet.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => (
          <article
            key={item._id}
            className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/35 p-5 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-fuchsia-500/10 to-cyan-500/15" />
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Number {item.number}
                </h4>
                <span className="rounded-xl border border-white/30 bg-white/40 px-3 py-1 text-xs font-semibold text-slate-700 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/30 dark:text-slate-200">
                  {item.gridType}
                </span>
              </div>

              <div
                className="rich-content text-sm text-slate-700 dark:text-slate-200"
                dangerouslySetInnerHTML={{
                  __html: lang === "en" ? item.englishContent || "" : item.hindiContent || ""
                }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

