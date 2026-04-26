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

function getEntryNumbers(entry: GridContent): number[] {
  if (Array.isArray(entry.numbers) && entry.numbers.length > 0) return entry.numbers;
  if (typeof entry.number === "number" && Number.isInteger(entry.number)) return [entry.number];
  return [];
}

export default function GridInterpretations({
  gridType,
  presentNumbers,
  missingNumbers
}: {
  gridType: GridType;
  presentNumbers: number[];
  missingNumbers: number[];
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

  const { presentMatches, missingMatches } = useMemo(() => {
    const pSet = new Set(presentNumbers);
    const mSet = new Set(missingNumbers);

    const relevant = (all ?? []).filter((d) => d.gridType === gridType);

    const presentMatches = relevant
      .filter((d) => {
        const nums = getEntryNumbers(d);
        return (d.type ?? "present") === "present" && nums.length > 0 && nums.every((n) => pSet.has(n));
      })
      .sort((a, b) => {
        const an = getEntryNumbers(a);
        const bn = getEntryNumbers(b);
        return an.length - bn.length || an.join(",").localeCompare(bn.join(","));
      });

    const missingMatches = relevant
      .filter((d) => {
        const nums = getEntryNumbers(d);
        return (d.type ?? "present") === "missing" && nums.length > 0 && nums.every((n) => mSet.has(n));
      })
      .sort((a, b) => {
        const an = getEntryNumbers(a);
        const bn = getEntryNumbers(b);
        return an.length - bn.length || an.join(",").localeCompare(bn.join(","));
      });

    return { presentMatches, missingMatches };
  }, [all, gridType, missingNumbers, presentNumbers]);

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

      {all && presentMatches.length === 0 && missingMatches.length === 0 ? (
        <div className="rounded-2xl border border-white/40 bg-white/35 px-4 py-3 text-sm text-slate-600 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-300">
          No matching insights found yet.
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <h4 className="mb-3 text-base font-extrabold text-emerald-700 dark:text-emerald-300">
            Present Insights
          </h4>
          {all && presentMatches.length === 0 ? (
            <div className="rounded-2xl border border-white/40 bg-white/35 px-4 py-3 text-sm text-slate-600 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-300">
              No matching present insights.
            </div>
          ) : null}
          <div className="grid gap-4">
            {presentMatches.map((item) => (
              <article
                key={item._id}
                className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/35 p-5 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-indigo-500/15" />
                <div className="relative">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h5 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      Combination: {getEntryNumbers(item).join(",")}
                    </h5>
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
        </div>

        <div>
          <h4 className="mb-3 text-base font-extrabold text-rose-700 dark:text-rose-300">
            Missing Insights
          </h4>
          {all && missingMatches.length === 0 ? (
            <div className="rounded-2xl border border-white/40 bg-white/35 px-4 py-3 text-sm text-slate-600 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-300">
              No matching missing insights.
            </div>
          ) : null}
          <div className="grid gap-4">
            {missingMatches.map((item) => (
              <article
                key={item._id}
                className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/35 p-5 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/15 via-fuchsia-500/10 to-indigo-500/15" />
                <div className="relative">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h5 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      Combination: {getEntryNumbers(item).join(",")}
                    </h5>
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
        </div>
      </div>
    </section>
  );
}

