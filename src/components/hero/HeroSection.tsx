import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../hooks/useApp';
import divyaPortrait from '../../assets/divya-portrait.jpg';

export default function HeroSection() {
  const { state } = useApp();
  const name = state.settings.partnerName || 'Divya';
  const occasion = state.settings.occasionTitle || 'Happy Birthday';
  const [loveCount, setLoveCount] = useState<number>(100);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);

  const handleSendLove = () => {
    setLoveCount((prev) => prev + 1);
    const newHeart = { id: Date.now() + Math.random(), x: (Math.random() - 0.5) * 80 };
    setFloatingHearts((prev) => [...prev.slice(-10), newHeart]);

    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FDA4AF', '#F43F5E', '#FB7185', '#FBBF24'],
        shapes: ['circle'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-16 px-4 text-center overflow-hidden">
      {/* Delicate ambient warm rose glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-rose-200/40 via-pink-100/35 to-amber-100/30 rounded-full blur-[140px] pointer-events-none" />

      {/* Romantic top badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/85 border border-rose-200/80 text-rose-600 shadow-sm backdrop-blur-xl mb-6 hover:scale-105 transition-transform"
      >
        <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
        <span className="font-sans text-xs tracking-widest uppercase font-semibold text-rose-600">
          {occasion}, My Everything
        </span>
        <Sparkles size={14} className="text-amber-400" />
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-midnight tracking-tight mb-2"
      >
        {occasion},
        <span className="block font-script text-6xl sm:text-8xl md:text-9xl text-gradient-rose font-bold mt-1 tracking-normal drop-shadow-[0_4px_30px_rgba(244,63,94,0.3)]">
          {name}
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-serif text-lg sm:text-2xl text-midnight/75 italic font-light max-w-xl mx-auto mb-8 leading-relaxed"
      >
        “In all the vast and infinite universe, you are my favorite star.”
      </motion.p>

      {/* Portrait Frame (Polaroid / Locket style) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative group my-3"
      >
        {/* Soft floating washi tape at top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-amber-100/90 border border-amber-200/80 -rotate-1 rounded-xs z-30 pointer-events-none shadow-sm backdrop-blur-xs flex items-center justify-center">
          <span className="text-[10px] font-sans uppercase tracking-widest text-amber-800/80 font-bold">
            forever precious ✨
          </span>
        </div>

        {/* Outer glowing frame */}
        <div className="relative p-3 rounded-[38px] bg-gradient-to-tr from-rose-200 via-amber-100/90 to-rose-300 shadow-[0_25px_60px_-10px_rgba(244,114,182,0.32)] ring-1 ring-white/90">
          <div className="relative w-68 h-84 sm:w-80 sm:h-100 rounded-[30px] overflow-hidden bg-white flex items-center justify-center border border-white/90 shadow-inner">
            <img
              src={divyaPortrait}
              alt={`${name}'s Birthday Portrait`}
              className="w-full h-full object-cover object-[center_18%] brightness-[1.03] contrast-[1.02] saturate-[1.04] group-hover:scale-104 transition-transform duration-700 ease-out"
            />

            {/* Soft romantic ambient gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-rose-950/60 via-transparent to-rose-900/10 pointer-events-none" />

            {/* Corner floating badge */}
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-rose-100 text-[11px] font-script text-rose-600 font-bold shadow-md flex items-center gap-1 pointer-events-none">
              <span>Pure Radiance</span>
              <Sparkles size={11} className="text-amber-400" />
            </div>

            {/* Bottom subtitle matching the romantic UI */}
            <div className="absolute bottom-0 inset-x-0 p-4 pt-12 bg-gradient-to-t from-midnight/70 via-midnight/25 to-transparent pointer-events-none flex flex-col items-center text-center">
              <h3 className="font-script text-3xl sm:text-4xl text-white font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
                {name}
              </h3>
              <p className="font-sans text-[10px] sm:text-xs text-rose-100 uppercase tracking-widest font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.65)] mt-0.5">
                The Light Of My Life
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interactive "Send Love" button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-7 flex flex-col items-center gap-3 relative"
      >
        <button
          onClick={handleSendLove}
          className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-rose-500 via-rose-400 to-pink-500 text-white font-sans text-xs font-semibold tracking-wide shadow-[0_10px_30px_rgba(244,63,94,0.4)] hover:shadow-[0_14px_36px_rgba(244,63,94,0.52)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Heart size={16} className="fill-white group-hover:scale-125 transition-transform animate-pulse" />
          <span>Tap to Send Love</span>
          <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-xs font-mono font-bold">
            {loveCount}
          </span>
        </button>

        {/* Bursting floating hearts on click */}
        <div className="absolute -top-12 pointer-events-none">
          <AnimatePresence>
            {floatingHearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{ opacity: 1, y: 0, scale: 0.5, x: heart.x }}
                animate={{ opacity: 0, y: -70, scale: 1.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute text-rose-500"
              >
                <Heart size={20} className="fill-rose-500" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Heartfelt celebration note */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-8 max-w-lg w-full p-6 rounded-3xl glass-card border border-rose-200/80 shadow-[0_12px_35px_rgba(244,114,182,0.15)] backdrop-blur-xl"
      >
        <p className="font-serif italic text-sm sm:text-base text-midnight/80 leading-relaxed">
          ✨ Wishing you a life bathed in sunshine, whispered dreams fulfilled, and endless reasons to smile.
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about-divya"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 0.9 }, y: { repeat: Infinity, duration: 2, ease: 'easeInOut' } }}
        className="mt-10 inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest text-rose-500 hover:text-rose-600 font-medium transition-colors"
      >
        <span>Discover What Makes You Special</span>
        <ChevronDown size={14} />
      </motion.a>
    </section>
  );
}
