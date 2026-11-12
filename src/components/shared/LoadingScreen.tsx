import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FFF8F6] text-midnight"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute w-80 h-80 bg-rose-200/30 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-pink-50 flex items-center justify-center text-rose-500 shadow-md mb-4 ring-4 ring-rose-50/80"
      >
        <Heart size={28} className="fill-rose-500 text-rose-500" />
      </motion.div>

      <p className="relative z-10 font-serif italic text-base sm:text-lg text-midnight/75">
        Preparing your celebration with love... ✨
      </p>
    </motion.div>
  );
}
