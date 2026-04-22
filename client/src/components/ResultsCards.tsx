import { motion } from "framer-motion";
import type { NumberMeanings } from "../types/numerology";

interface ResultsCardsProps {
  numbers: {
    lifePathNumber: number;
    expressionNumber: number;
    soulUrgeNumber: number;
    personalityNumber: number;
  };
  meanings: NumberMeanings;
}

const cards = [
  { key: "lifePathNumber", title: "Life Path", meaningKey: "lifePath" },
  { key: "expressionNumber", title: "Expression / Destiny", meaningKey: "expression" },
  { key: "soulUrgeNumber", title: "Soul Urge", meaningKey: "soulUrge" },
  { key: "personalityNumber", title: "Personality", meaningKey: "personality" }
] as const;

const ResultsCards = ({ numbers, meanings }: ResultsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card, idx) => (
        <motion.article
          key={card.key}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08 }}
          className="rounded-2xl border border-white/40 bg-white/35 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40"
        >
          <p className="text-sm text-slate-500 dark:text-slate-300">{card.title}</p>
          <h3 className="mt-2 text-3xl font-semibold text-violet-700 dark:text-violet-300">
            {numbers[card.key]}
          </h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{meanings[card.meaningKey]}</p>
        </motion.article>
      ))}
    </div>
  );
};

export default ResultsCards;
