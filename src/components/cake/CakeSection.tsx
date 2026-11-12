import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../hooks/useApp';

export default function CakeSection() {
  const { state } = useApp();
  const name = state.settings.partnerName || 'My Love';
  const occasion = state.settings.occasionTitle || 'Happy Birthday';
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishMade, setWishMade] = useState(false);

  const handleBlowCandles = () => {
    if (!candlesLit) return;
    setCandlesLit(false);
    setWishMade(true);

    try {
      // Confetti burst
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FDA4AF', '#F43F5E', '#FCD34D', '#F472B6', '#E9D5FF', '#FFFFFF'],
      });
      // Second delayed heart burst
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#FB7185', '#F59E0B', '#F43F5E'],
          shapes: ['circle'],
        });
      }, 350);
    } catch {
      // ignore
    }
  };

  const handleRelight = () => {
    setCandlesLit(true);
    setWishMade(false);
  };

  return (
    <section className="py-24 px-4 max-w-3xl mx-auto text-center relative">
      {/* Background warm glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-gradient-to-tr from-amber-200/30 via-rose-200/25 to-pink-100/25 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 border border-rose-200/70 text-rose-600 text-xs tracking-widest uppercase font-semibold mb-3 shadow-xs"
      >
        <Sparkles size={13} className="text-amber-400" />
        <span>A Moment Of Magic</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-serif text-3xl sm:text-5xl text-midnight font-normal mb-3"
      >
        Make A Wish,{' '}
        <span className="font-script text-4xl sm:text-6xl text-gradient-rose font-bold">
          {name}
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-sans text-sm sm:text-base text-midnight/70 font-light mb-12"
      >
        {candlesLit
          ? 'Close your eyes, hold your dearest dream in your heart, and click the cake to blow the candles! 🎂'
          : 'Your wish has flown straight into the stars ✨'}
      </motion.p>

      {/* Interactive Birthday Cake Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        onClick={handleBlowCandles}
        className={`relative inline-block p-10 sm:p-14 rounded-[40px] bg-gradient-to-b from-white/95 via-rose-50/70 to-amber-50/50 border border-rose-200/80 shadow-[0_25px_60px_rgba(244,114,182,0.22)] backdrop-blur-xl transition-all duration-300 ${
          candlesLit ? 'cursor-pointer hover:scale-103 hover:shadow-[0_30px_70px_rgba(244,114,182,0.3)]' : 'cursor-default'
        }`}
      >
        {/* Floating instruction pill */}
        {candlesLit && (
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-sans font-semibold tracking-wide shadow-md flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Click to Blow Candles</span>
            <Sparkles size={11} className="text-amber-200" />
          </motion.div>
        )}

        {/* Candles container */}
        <div className="flex justify-center gap-7 mb-1.5 relative z-10">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Animated Flame */}
              <AnimatePresence>
                {candlesLit ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{
                      scale: [1, 1.2, 0.95, 1],
                      y: [0, -2, 1, 0],
                      rotate: [0, i === 0 ? -3 : i === 2 ? 3 : 0, 0],
                    }}
                    exit={{ scale: 0, opacity: 0, y: -10 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.65 + i * 0.15,
                      ease: 'easeInOut',
                    }}
                    className="w-3.5 h-6 rounded-full bg-gradient-to-t from-amber-500 via-orange-300 to-yellow-100 shadow-[0_0_15px_rgba(251,191,36,0.95)] mb-1"
                  />
                ) : (
                  /* Gentle smoke puff when blown out */
                  <motion.div
                    initial={{ opacity: 0.7, y: 0, scale: 0.5 }}
                    animate={{ opacity: 0, y: -20, scale: 1.5 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="w-2 h-4 text-midnight/25 font-sans text-xs italic mb-1"
                  >
                    ~
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Wick */}
              <div className="w-[2px] h-2 bg-stone-700 rounded-full" />

              {/* Candle Body */}
              <div
                className={`w-4 h-14 rounded-t-sm shadow-sm flex flex-col justify-around py-1.5 ${
                  i === 1
                    ? 'bg-gradient-to-b from-rose-300 to-rose-400'
                    : 'bg-gradient-to-b from-amber-200 to-amber-300'
                }`}
              >
                <div className="w-full h-1 bg-white/40 -rotate-12" />
                <div className="w-full h-1 bg-white/40 -rotate-12" />
              </div>
            </div>
          ))}
        </div>

        {/* Multi-tiered Cake Illustration */}
        <div className="flex flex-col items-center relative">
          {/* Top Layer */}
          <div className="w-48 h-12 rounded-t-3xl bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200 border-t border-x border-rose-300/60 shadow-inner flex items-center justify-around px-4 relative overflow-hidden">
            <span className="w-3 h-3 rounded-full bg-rose-400 shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-amber-300 shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-rose-400 shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-amber-300 shadow-xs" />
          </div>

          {/* Drizzled Strawberry Glaze */}
          <div className="w-52 h-3.5 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 rounded-full -my-1 z-10 shadow-sm flex justify-around items-center px-3">
            <div className="w-2 h-3 bg-rose-400 rounded-b-full translate-y-1" />
            <div className="w-2.5 h-4 bg-pink-400 rounded-b-full translate-y-1.5" />
            <div className="w-2 h-3 bg-rose-400 rounded-b-full translate-y-1" />
          </div>

          {/* Bottom Cake Tier */}
          <div className="w-60 h-18 rounded-b-3xl bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50 border-b border-x border-rose-200/80 shadow-md flex flex-col items-center justify-center p-2 relative">
            <span className="font-script text-lg text-rose-500 font-bold">
              {occasion} {name}
            </span>
            <div className="flex gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
            </div>
          </div>

          {/* Golden Porcelain Plate */}
          <div className="w-72 h-4 rounded-full bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 border border-amber-300/80 shadow-md mt-1.5" />
        </div>
      </motion.div>

      {/* Post-blow message & action */}
      <div className="mt-8">
        <AnimatePresence>
          {wishMade && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 max-w-lg mx-auto p-7 rounded-[32px] glass-card border border-rose-200/90 shadow-[0_20px_50px_rgba(244,114,182,0.22)] backdrop-blur-xl"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-2 shadow-inner">
                <Heart size={22} className="fill-rose-500 text-rose-500 animate-pulse" />
              </div>
              <h4 className="font-serif text-2xl sm:text-3xl text-midnight font-medium">
                Your Wish Has Been Sent ✨
              </h4>
              <p className="font-serif italic text-base sm:text-lg text-rose-600 font-normal leading-relaxed">
                “May every prayer, hope, and beautiful ambition you held in your mind blossom into your reality this year.”
              </p>
              <div>
                <button
                  onClick={handleRelight}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-sans text-midnight/80 hover:text-white bg-rose-50 hover:bg-rose-500 border border-rose-200 transition-all duration-300 cursor-pointer font-medium shadow-xs"
                >
                  <RotateCcw size={13} />
                  <span>Relight Candles & Make Another Wish</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
