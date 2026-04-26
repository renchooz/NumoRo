import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../utils/adminAuth";
import type { GridContent, GridContentType, GridType } from "../types/gridContent";
import {
  createGridContent,
  deleteGridContent,
  fetchGridContentAll,
  updateGridContent
} from "../services/api";
import RichTextEditor from "../components/RichTextEditor";

function getErrorMessage(err: unknown, fallback: string) {
  if (!err || typeof err !== "object") return fallback;
  const maybeAxios = err as { message?: unknown; response?: { data?: { message?: unknown } } };
  const respMsg = maybeAxios.response?.data?.message;
  if (typeof respMsg === "string" && respMsg.trim()) return respMsg;
  if (typeof maybeAxios.message === "string" && maybeAxios.message.trim()) return maybeAxios.message;
  return fallback;
}

function normalizeEntryNumbers(entry: GridContent): number[] {
  if (Array.isArray(entry.numbers) && entry.numbers.length > 0) {
    return entry.numbers;
  }
  if (typeof entry.number === "number" && Number.isInteger(entry.number)) {
    return [entry.number];
  }
  return [];
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<GridContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterGridType, setFilterGridType] = useState<GridType | "all">("all");
  const [filterType, setFilterType] = useState<GridContentType | "all">("all");
  const [numbersQuery, setNumbersQuery] = useState<string>("");
  const [sort, setSort] = useState<"updatedDesc" | "createdDesc" | "createdAsc">("updatedDesc");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [gridType, setGridType] = useState<GridType>("loshu");
  const [type, setType] = useState<GridContentType>("present");
  const [numbersInput, setNumbersInput] = useState<string>("1,3,6");
  const [numbers, setNumbers] = useState<number[]>([1, 3, 6]);
  const [englishContent, setEnglishContent] = useState<string>("");
  const [hindiContent, setHindiContent] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const parseNumbers = (input: string): { ok: true; value: number[] } | { ok: false; message: string } => {
    const raw = input
      .split(/[,\s]+/g)
      .map((t) => t.trim())
      .filter(Boolean);
    const parsed = raw.map((t) => Number(t)).filter((n) => Number.isInteger(n));
    if (parsed.length === 0) return { ok: false, message: "At least 2 numbers are required" };
    const invalid = parsed.find((n) => n < 1 || n > 9);
    if (invalid != null) return { ok: false, message: "Numbers must be between 1 and 9." };
    const uniq = Array.from(new Set(parsed));
    if (uniq.length !== parsed.length) return { ok: false, message: "Remove duplicates from numbers." };
    if (uniq.length < 2) return { ok: false, message: "At least 2 numbers are required" };
    uniq.sort((a, b) => a - b);
    return { ok: true, value: uniq };
  };

  useEffect(() => {
    document.title = "Numo Admin";
  }, []);

  const refresh = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGridContentAll();
      setEntries(data);
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Failed to load grid content"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGridContentAll();
        if (!cancelled) setEntries(data);
      } catch (e: unknown) {
        if (!cancelled) setError(getErrorMessage(e, "Failed to load grid content"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isEditing = Boolean(editingId);
  const title = useMemo(() => (isEditing ? "Update Entry" : "Create Entry"), [isEditing]);

  const filteredEntries = useMemo(() => {
    const q = numbersQuery.trim();
    const want = q ? parseNumbers(q) : null;
    const wantSet = want && want.ok ? new Set(want.value) : null;

    const base = entries.filter((e) => {
      const entryNumbers = normalizeEntryNumbers(e);
      const entryType = e.type ?? "present";
      if (filterGridType !== "all" && e.gridType !== filterGridType) return false;
      if (filterType !== "all" && entryType !== filterType) return false;
      if (wantSet) {
        // match any overlap with query numbers, e.g. "1,3"
        if (!entryNumbers.some((n) => wantSet.has(n))) return false;
      }
      return true;
    });

    const key = sort;
    base.sort((a, b) => {
      if (key === "updatedDesc") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (key === "createdAsc") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return base;
  }, [entries, filterGridType, filterType, numbersQuery, sort]);

  const resetForm = () => {
    setEditingId(null);
    setGridType("loshu");
    setType("present");
    setNumbersInput("1,3,6");
    setNumbers([1, 3, 6]);
    setEnglishContent("");
    setHindiContent("");
    setError(null);
  };

  return (
    <main className="min-h-screen bg-white bg-gradient-to-br from-slate-100 via-indigo-100 to-fuchsia-100 px-4 py-8 text-black dark:bg-gray-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 dark:text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xl">🧩🛠️📚</p>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Admin Panel</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              CMS for grid interpretations (EN/HI rich content).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                adminLogout();
                navigate("/", { replace: true });
              }}
              className="rounded-xl bg-white/60 px-4 py-2 text-sm font-semibold text-slate-800 shadow-glass backdrop-blur-xl dark:bg-slate-950/40 dark:text-slate-100"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/40 bg-white/35 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{title}</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  GridType + Number is unique. Content is stored as HTML.
                </p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/30 bg-white/40 px-3 py-2 text-xs font-semibold shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40"
              >
                New
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const parsed = parseNumbers(numbersInput);
                if (!parsed.ok) {
                  setError(parsed.message);
                  return;
                }
                setNumbers(parsed.value);
                setSaving(true);
                setError(null);
                try {
                  if (editingId) {
                    await updateGridContent(editingId, {
                      gridType,
                      type,
                      numbers: parsed.value,
                      englishContent,
                      hindiContent
                    });
                  } else {
                    await createGridContent({
                      gridType,
                      type,
                      numbers: parsed.value,
                      englishContent,
                      hindiContent
                    });
                  }
                  await refresh();
                  resetForm();
                } catch (err: unknown) {
                  setError(getErrorMessage(err, "Save failed"));
                } finally {
                  setSaving(false);
                }
              }}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Grid Type</label>
                  <select
                    value={gridType}
                    onChange={(e) => setGridType(e.target.value as GridType)}
                    className="mt-2 w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-slate-900 shadow-glass outline-none backdrop-blur-xl focus:border-indigo-400 dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
                  >
                    <option value="loshu">Lo Shu</option>
                    <option value="pythagoras">Pythagoras</option>
                    <option value="vedic">Vedic</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as GridContentType)}
                    className="mt-2 w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-slate-900 shadow-glass outline-none backdrop-blur-xl focus:border-indigo-400 dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
                  >
                    <option value="present">Present Numbers</option>
                    <option value="missing">Missing Numbers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Numbers (comma separated)
                </label>
                <input
                  value={numbersInput}
                  onChange={(e) => {
                    setNumbersInput(e.target.value);
                    const parsed = parseNumbers(e.target.value);
                    if (parsed.ok) setNumbers(parsed.value);
                  }}
                  className="mt-2 w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-slate-900 shadow-glass outline-none backdrop-blur-xl placeholder:text-slate-500 focus:border-indigo-400 dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
                  placeholder="1,3,6,7"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {numbers.map((n) => (
                    <span
                      key={n}
                      className="rounded-full border border-white/30 bg-white/40 px-3 py-1 text-xs font-semibold text-slate-700 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/30 dark:text-slate-200"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  English Content (HTML)
                </label>
                <div className="mt-2">
                  <RichTextEditor
                    value={englishContent}
                    onChange={setEnglishContent}
                    placeholder="Write English interpretation…"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Hindi Content (HTML)
                </label>
                <div className="mt-2">
                  <RichTextEditor
                    value={hindiContent}
                    onChange={setHindiContent}
                    placeholder="हिंदी में व्याख्या लिखें…"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-glass transition hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
                >
                  {saving ? "Saving..." : isEditing ? "Update" : "Create"}
                </button>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-2xl border border-white/30 bg-white/40 px-5 py-3 text-sm font-semibold shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="rounded-3xl border border-white/40 bg-white/35 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">All Entries</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Filter, search, edit, or delete.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void refresh()}
                className="rounded-xl border border-white/30 bg-white/40 px-3 py-2 text-xs font-semibold shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40"
              >
                Refresh
              </button>
            </div>

            <div className="mb-4 grid gap-3 md:grid-cols-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Grid Type</label>
                <select
                  value={filterGridType}
                  onChange={(e) => setFilterGridType(e.target.value as GridType | "all")}
                  className="mt-2 w-full rounded-2xl border border-white/40 bg-white/40 px-3 py-2 text-sm shadow-glass outline-none backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
                >
                  <option value="all">All</option>
                  <option value="loshu">Lo Shu</option>
                  <option value="pythagoras">Pythagoras</option>
                  <option value="vedic">Vedic</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as GridContentType | "all")}
                  className="mt-2 w-full rounded-2xl border border-white/40 bg-white/40 px-3 py-2 text-sm shadow-glass outline-none backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
                >
                  <option value="all">All</option>
                  <option value="present">Present</option>
                  <option value="missing">Missing</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Search numbers</label>
                <input
                  value={numbersQuery}
                  onChange={(e) => setNumbersQuery(e.target.value)}
                  placeholder="e.g. 1,3"
                  className="mt-2 w-full rounded-2xl border border-white/40 bg-white/40 px-3 py-2 text-sm shadow-glass outline-none backdrop-blur-xl placeholder:text-slate-500 dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Sort</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="mt-2 w-full rounded-2xl border border-white/40 bg-white/40 px-3 py-2 text-sm shadow-glass outline-none backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
                >
                  <option value="updatedDesc">Updated (newest)</option>
                  <option value="createdDesc">Created (newest)</option>
                  <option value="createdAsc">Created (oldest)</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-sm text-slate-600 dark:text-slate-300">Loading…</div>
            ) : filteredEntries.length === 0 ? (
              <div className="text-sm text-slate-600 dark:text-slate-300">No entries yet.</div>
            ) : (
              <div className="space-y-3">
                {filteredEntries.map((e) => (
                  <article
                    key={e._id}
                    className="rounded-2xl border border-white/40 bg-white/40 p-4 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/30"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                          {e.gridType} • {e.type ?? "present"} • {normalizeEntryNumbers(e).join(",") || "-"}
                        </p>
                        <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                          Updated: {new Date(e.updatedAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(e._id);
                            setGridType(e.gridType);
                            setType(e.type ?? "present");
                            const entryNumbers = normalizeEntryNumbers(e);
                            setNumbersInput(entryNumbers.join(","));
                            setNumbers(entryNumbers.length > 0 ? entryNumbers : [1]);
                            setEnglishContent(e.englishContent || "");
                            setHindiContent(e.hindiContent || "");
                            setError(null);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="rounded-xl bg-indigo-100 px-3 py-2 text-xs font-semibold text-indigo-900 shadow-glass dark:bg-indigo-500/15 dark:text-indigo-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            setError(null);
                            const ok = window.confirm("Delete this entry permanently?");
                            if (!ok) return;
                            try {
                              await deleteGridContent(e._id);
                              await refresh();
                              if (editingId === e._id) resetForm();
                            } catch (err: unknown) {
                              setError(getErrorMessage(err, "Delete failed"));
                            }
                          }}
                          className="rounded-xl bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-900 shadow-glass dark:bg-rose-500/15 dark:text-rose-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/30 bg-white/35 p-3 text-sm text-slate-700 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/25 dark:text-slate-200">
                        <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-300">English</p>
                        <div className="rich-content" dangerouslySetInnerHTML={{ __html: e.englishContent || "" }} />
                      </div>
                      <div className="rounded-2xl border border-white/30 bg-white/35 p-3 text-sm text-slate-700 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/25 dark:text-slate-200">
                        <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-300">Hindi</p>
                        <div className="rich-content" dangerouslySetInnerHTML={{ __html: e.hindiContent || "" }} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

