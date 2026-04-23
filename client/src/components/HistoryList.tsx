import type { NumerologyResponse } from "../types/numerology";

interface HistoryListProps {
  history: NumerologyResponse[];
}

const HistoryList = ({ history }: HistoryListProps) => {
  if (!history.length) {
    return null;
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/40 bg-white/30 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/30">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Recent History</h3>
      <div className="mt-4 space-y-3">
        {history.map((item) => (
          <div
            key={item._id ?? `${item.fullName}-${item.dateOfBirth}`}
            className="rounded-xl bg-white/60 p-3 dark:bg-slate-800/50"
          >
            <p className="font-medium text-slate-700 dark:text-slate-100">{item.fullName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-300">DOB: {item.dateOfBirth}</p>
            <p className="text-xs text-slate-500 dark:text-slate-300">Mobile: {item.mobileNumber}</p>
            <p className="text-xs text-violet-700 dark:text-violet-300">
              PM {item.pm} | CN {item.cn} | DN {item.dn}
            </p>
            <p className="text-xs text-fuchsia-700 dark:text-fuchsia-300">
              NCN {item.nameCompound} | Name Final {item.nameFinal}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HistoryList;
