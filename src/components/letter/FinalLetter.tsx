import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

export default function FinalLetter() {
  const { state } = useApp();
  const letter = state.settings.personalLetter;

  return (
    <section className="py-24 px-4 max-w-3xl mx-auto relative">
      {/* Soft warm aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl h-80 bg-rose-200/25 rounded-full blur-[130px] pointer-events-none" />

      <div className="text-center mb-12 relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 border border-rose-200/70 text-rose-600 text-xs uppercase tracking-widest font-semibold mb-3 shadow-xs"
        >
          <Heart size={12} className="fill-rose-500 text-rose-500" />
          <span>A Love Letter From The Heart</span>
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-3xl sm:text-5xl text-midnight font-normal"
        >
          Before This Little Celebration Ends...
        </motion.h2>
      </div>

      {/* Elegant Letter Container */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="p-8 sm:p-14 rounded-[36px] letter-parchment border border-rose-200/80 shadow-[0_25px_60px_-15px_rgba(244,114,182,0.22)] relative z-10"
      >
        {/* Romantic Couple Sticker in Top Right Corner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: 4 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 4 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          whileHover={{ scale: 1.08, rotate: 0 }}
          className="absolute top-3 right-3 sm:top-5 sm:right-6 md:top-6 md:right-7 z-20 transition-transform cursor-pointer group"
          title="Us Forever ❤️"
        >
          {/* Subtle golden washi tape pinning the sticker */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-3 sm:h-3.5 bg-amber-100/90 border border-amber-200/80 -rotate-3 rounded-xs z-30 shadow-xs pointer-events-none" />

          <img
            src="/couple-sticker.png"
            alt="Couple Sticker"
            className="w-20 sm:w-28 md:w-32 h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.14)] group-hover:drop-shadow-[0_14px_28px_rgba(244,63,94,0.25)] select-none transition-all duration-300"
            draggable={false}
          />
        </motion.div>

        {/* Vintage 3D Wax Seal with Heart */}
        <div className="w-13 h-13 rounded-full wax-seal flex items-center justify-center text-white/95 shadow-md mx-auto mb-8 border border-red-300/40">
          <Heart size={20} className="fill-white drop-shadow-sm" />
        </div>

        {/* Letter body */}
        <div className="font-serif text-base sm:text-lg text-midnight/85 leading-relaxed font-light whitespace-pre-line space-y-4">
          {letter}
        </div>

        {/* Decorative footer seal */}
        <div className="mt-12 pt-6 border-t border-rose-200/70 flex items-center justify-end">
          <span className="font-script text-2xl text-rose-600 font-bold">With All My Love ❤️</span>
        </div>
      </motion.div>
    </section>
  );
}
