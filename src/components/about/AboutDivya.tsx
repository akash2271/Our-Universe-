import { motion } from 'framer-motion';
import { Sun, Heart, Shield, Sparkles, Star } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

const iconMap: Record<string, typeof Sun> = {
  Sun,
  Heart,
  Shield,
  Sparkles,
  Star,
};

const cardThemeStyles = [
  { bg: 'from-white/95 via-rose-50/80 to-pink-50/70', border: 'border-rose-200/80', iconBg: 'bg-rose-100/90 text-rose-500', seal: '❤️' },
  { bg: 'from-white/95 via-pink-50/80 to-rose-50/70', border: 'border-pink-200/80', iconBg: 'bg-pink-100/90 text-pink-500', seal: '✨' },
  { bg: 'from-white/95 via-amber-50/80 to-rose-50/70', border: 'border-amber-200/80', iconBg: 'bg-amber-100/90 text-amber-600', seal: '🌟' },
  { bg: 'from-white/95 via-purple-50/80 to-pink-50/70', border: 'border-purple-200/80', iconBg: 'bg-purple-100/90 text-purple-500', seal: '💫' },
  { bg: 'from-white/95 via-rose-50/85 to-amber-50/75', border: 'border-rose-200/90', iconBg: 'bg-rose-100/90 text-rose-500', seal: '💖' },
];

export default function AboutDivya() {
  const { state } = useApp();
  const name = state.settings.partnerName || 'My Love';
  const cards = state.specialCards;

  return (
    <section id="about-divya" className="py-24 px-4 max-w-5xl mx-auto relative">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 bg-rose-200/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 border border-rose-200/70 text-rose-600 text-xs tracking-widest uppercase font-semibold mb-3 shadow-xs"
        >
          <Heart size={12} className="fill-rose-500 text-rose-500" />
          <span>Reasons Why You Are Cherished</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl text-midnight font-normal leading-tight"
        >
          Do you know how{' '}
          <span className="font-script text-4xl sm:text-6xl md:text-7xl text-gradient-rose font-bold block sm:inline">
            truly precious
          </span>{' '}
          you are?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-sans text-sm sm:text-base text-midnight/70 max-w-lg mx-auto mt-4 font-light leading-relaxed"
        >
          A gentle tribute to the quiet grace, radiant laughter, and unforgettable kindness that make you completely one of a kind, {name}.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 relative z-10">
        {cards.map((card, idx) => {
          const Icon = iconMap[card.icon] || Sparkles;
          const isFullWidth = idx === 4;
          const theme = cardThemeStyles[idx % cardThemeStyles.length];

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: idx * 0.1 }}
              whileHover={{ y: -6, scale: 1.015 }}
              className={`relative p-7 sm:p-8 rounded-[32px] bg-gradient-to-br ${theme.bg} ${theme.border} border shadow-[0_12px_35px_-5px_rgba(244,114,182,0.14)] hover:shadow-[0_22px_45px_-8px_rgba(244,114,182,0.25)] backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                isFullWidth ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Cute top tape or sticker */}
              <div className="absolute top-3.5 right-4 text-base opacity-85 group-hover:scale-125 transition-transform">
                {theme.seal}
              </div>

              <div>
                <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center mb-6 shadow-sm group-hover:rotate-6 transition-transform`}>
                  <Icon size={22} />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-rose-600 font-bold">
                    Chapter 0{idx + 1}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-midnight font-medium mb-3 tracking-wide group-hover:text-rose-600 transition-colors">
                  {card.title}
                </h3>

                <p className="font-script text-xl sm:text-2xl text-rose-600 font-bold leading-relaxed mb-4">
                  “{card.quote}”
                </p>

                <p className="font-sans text-xs sm:text-sm text-midnight/70 leading-relaxed font-light">
                  {card.description}
                </p>
              </div>

              <div className="pt-5 mt-6 border-t border-rose-100/80 flex items-center justify-between text-xs font-sans text-midnight/50">
                <span className="flex items-center gap-1 font-serif italic text-rose-600">
                  <Heart size={12} className="fill-rose-400 text-rose-400 inline" />
                  Beloved quality
                </span>
                <span className="font-script text-base text-rose-600 font-semibold">for {name}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
