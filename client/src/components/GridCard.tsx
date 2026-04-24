import { motion } from "framer-motion";
import clsx from "clsx";
import type { CalculatedGrid } from "../utils/calculateGrid";
import { formatCellValue } from "../utils/calculateGrid";

type GridCardProps = {
  title: string;
  subtitle?: string;
  grid: CalculatedGrid;
  accent?: "pink" | "indigo" | "emerald";
};

const accentStyles: Record<NonNullable<GridCardProps["accent"]>, string> = {
  pink: "from-pink-500 via-fuchsia-500 to-violet-500",
  indigo: "from-indigo-500 via-violet-500 to-fuchsia-500",
  emerald: "from-emerald-500 via-cyan-500 to-indigo-500"
};

export default function GridCard({ title, subtitle, grid, accent = "indigo" }: GridCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/40 bg-white/35 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
          ) : null}
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            DOB used: <span className="font-semibold">{grid.dob}</span>
          </p>
        </div>
        <div className="rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-sm shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40">
          <p className="text-slate-700 dark:text-slate-200">
            <span className="font-semibold">Present Numbers:</span> {grid.present.join(", ") || "—"}
          </p>
          <p className="mt-1 text-slate-700 dark:text-slate-200">
            <span className="font-semibold">Missing Numbers:</span> {grid.missing.join(", ") || "—"}
          </p>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {grid.cells.map((cell, idx) => {
          const isPresent = cell.count > 0;
          const isRepeat = cell.count > 1;
          return (
            <motion.div
              key={`${cell.n}-${idx}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * idx }}
              className={clsx(
                "relative flex h-24 items-center justify-center overflow-hidden rounded-2xl border shadow-glass",
                "bg-white/40 backdrop-blur-xl dark:bg-slate-950/30",
                isPresent ? "border-white/50 dark:border-white/15" : "border-white/20 dark:border-white/10"
              )}
            >
              {isPresent ? (
                <>
                  <div
                    className={clsx(
                      "absolute inset-0 opacity-90",
                      "bg-gradient-to-br",
                      accentStyles[accent]
                    )}
                    style={{ filter: "saturate(1.1)" }}
                  />
                  <div className="absolute inset-0 bg-slate-950/40" />
                  <div
                    className={clsx(
                      "absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl",
                      "bg-white/35"
                    )}
                  />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-white/5 dark:from-white/10 dark:to-transparent" />
              )}

              <div className="relative z-10 text-center">
                <p
                  className={clsx(
                    "text-3xl font-extrabold tracking-tight",
                    isPresent ? "text-white drop-shadow-[0_0_14px_rgba(255,255,255,.5)]" : "text-slate-400 dark:text-slate-500"
                  )}
                >
                  {isPresent ? formatCellValue(cell.n, cell.count) : cell.n}
                </p>
                {isPresent ? (
                  <p className={clsx("mt-1 text-xs text-white/75", isRepeat && "font-semibold")}>
                    {isRepeat ? `repeat ×${cell.count}` : "present"}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">missing</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

