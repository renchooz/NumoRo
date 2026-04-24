import { AnimatePresence, motion } from "framer-motion";

type LoaderProps = {
  open: boolean;
};

const orbitTransition = {
  duration: 3.8,
  repeat: Infinity,
  ease: "linear" as const
};

export default function Loader({ open }: LoaderProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] grid place-items-center bg-slate-950/70 backdrop-blur-xl"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="relative mx-auto w-[min(560px,92vw)] rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glass">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
              <motion.div
                className="absolute -left-20 -top-16 h-56 w-56 rounded-full bg-fuchsia-500/25 blur-3xl"
                animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-16 -right-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl"
                animate={{ x: [0, -30, 0], y: [0, -26, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="relative mb-6 h-28 w-28">
                <motion.div
                  className="absolute inset-0 rounded-full border border-white/20"
                  animate={{ rotate: 360 }}
                  transition={orbitTransition}
                  style={{
                    background:
                      "conic-gradient(from 90deg, rgba(236,72,153,.55), rgba(139,92,246,.5), rgba(34,211,238,.5), rgba(236,72,153,.55))"
                  }}
                />
                <div className="absolute inset-[10px] rounded-full bg-slate-950/60 ring-1 ring-white/10" />
                <motion.div
                  className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-[0_0_18px_rgba(255,255,255,.8)]"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.65, 1, 0.65] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-300/90"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "0 0" }}
                />
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                Calculating Your Destiny...
              </h2>
              <p className="mt-2 max-w-md text-sm text-white/70">
                Aligning your DOB frequencies, grids, and cosmic insights.
              </p>

              <div className="mt-6 flex gap-2">
                <motion.span
                  className="h-2.5 w-2.5 rounded-full bg-white/70"
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.span
                  className="h-2.5 w-2.5 rounded-full bg-white/70"
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.15 }}
                />
                <motion.span
                  className="h-2.5 w-2.5 rounded-full bg-white/70"
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

