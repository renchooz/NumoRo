import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../utils/adminAuth";
import type { GridContent, GridType } from "../types/gridContent";
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

export default function AdminPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<GridContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [gridType, setGridType] = useState<GridType>("loshu");
  const [number, setNumber] = useState<number>(1);
  const [englishContent, setEnglishContent] = useState<string>("");
  const [hindiContent, setHindiContent] = useState<string>("");
  const [saving, setSaving] = useState(false);

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

  const resetForm = () => {
    setEditingId(null);
    setGridType("loshu");
    setNumber(1);
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
                setSaving(true);
                setError(null);
                try {
                  if (editingId) {
                    await updateGridContent(editingId, { gridType, number, englishContent, hindiContent });
                  } else {
                    await createGridContent({ gridType, number, englishContent, hindiContent });
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
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Number</label>
                  <select
                    value={number}
                    onChange={(e) => setNumber(Number(e.target.value))}
                    className="mt-2 w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-slate-900 shadow-glass outline-none backdrop-blur-xl focus:border-indigo-400 dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
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
                  Edit to prefill the form, or delete.
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

            {loading ? (
              <div className="text-sm text-slate-600 dark:text-slate-300">Loading…</div>
            ) : entries.length === 0 ? (
              <div className="text-sm text-slate-600 dark:text-slate-300">No entries yet.</div>
            ) : (
              <div className="space-y-3">
                {entries.map((e) => (
                  <article
                    key={e._id}
                    className="rounded-2xl border border-white/40 bg-white/40 p-4 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/30"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                          {e.gridType} • {e.number}
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
                            setNumber(e.number);
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

