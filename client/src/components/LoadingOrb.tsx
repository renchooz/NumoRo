import { motion } from "framer-motion";

const LoadingOrb = () => {
  return (
    <motion.div
      className="mx-auto mt-6 h-12 w-12 rounded-full border-4 border-violet-300 border-t-violet-700"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}
    />
  );
};

export default LoadingOrb;
