import { motion } from 'framer-motion';

// Deterministic floating petals
const PETALS = [
  { id: 1, left: '6%', size: 18, duration: 15, delay: 0.5, drift: -35, rotation: 30 },
  { id: 2, left: '16%', size: 22, duration: 18, delay: 2.2, drift: 25, rotation: 75 },
  { id: 3, left: '28%', size: 16, duration: 14, delay: 4.1, drift: -40, rotation: 120 },
  { id: 4, left: '39%', size: 24, duration: 20, delay: 1.0, drift: 30, rotation: 165 },
  { id: 5, left: '52%', size: 19, duration: 16, delay: 3.5, drift: -25, rotation: 210 },
  { id: 6, left: '63%', size: 23, duration: 19, delay: 0.8, drift: 35, rotation: 255 },
  { id: 7, left: '74%', size: 17, duration: 13, delay: 5.0, drift: -30, rotation: 300 },
  { id: 8, left: '86%', size: 21, duration: 17, delay: 2.8, drift: 20, rotation: 345 },
  { id: 9, left: '95%', size: 15, duration: 15, delay: 4.6, drift: -20, rotation: 60 },
];

// Deterministic floating hearts
const HEARTS = [
  { id: 1, left: '11%', size: 18, duration: 16, delay: 1.2, drift: 25, color: '#FB7185' },
  { id: 2, left: '24%', size: 22, duration: 19, delay: 3.8, drift: -30, color: '#F43F5E' },
  { id: 3, left: '46%', size: 15, duration: 14, delay: 0.3, drift: 20, color: '#FDA4AF' },
  { id: 4, left: '68%', size: 20, duration: 18, delay: 4.5, drift: -25, color: '#F472B6' },
  { id: 5, left: '82%', size: 16, duration: 15, delay: 2.1, drift: 18, color: '#FB7185' },
  { id: 6, left: '92%', size: 24, duration: 21, delay: 5.5, drift: -22, color: '#F43F5E' },
];

// Deterministic twinkling stars
const STARS = [
  { id: 1, left: '8%', top: '12%', size: 3, duration: 2.5, delay: 0.2 },
  { id: 2, left: '18%', top: '28%', size: 4, duration: 3.2, delay: 1.1 },
  { id: 3, left: '32%', top: '15%', size: 2.5, duration: 2.8, delay: 0.7 },
  { id: 4, left: '48%', top: '35%', size: 3.5, duration: 3.0, delay: 1.8 },
  { id: 5, left: '62%', top: '18%', size: 2.5, duration: 2.4, delay: 0.5 },
  { id: 6, left: '78%', top: '25%', size: 4, duration: 3.5, delay: 1.4 },
  { id: 7, left: '89%', top: '14%', size: 3, duration: 2.6, delay: 0.9 },
  { id: 8, left: '14%', top: '65%', size: 3, duration: 3.1, delay: 1.6 },
  { id: 9, left: '27%', top: '80%', size: 3.5, duration: 2.7, delay: 0.4 },
  { id: 10, left: '42%', top: '72%', size: 2.5, duration: 3.4, delay: 2.0 },
  { id: 11, left: '58%', top: '85%', size: 4, duration: 2.9, delay: 1.3 },
  { id: 12, left: '73%', top: '68%', size: 3, duration: 3.3, delay: 0.8 },
  { id: 13, left: '86%', top: '78%', size: 3.5, duration: 2.8, delay: 1.7 },
  { id: 14, left: '95%', top: '60%', size: 2.5, duration: 3.0, delay: 0.3 },
];

// Deterministic fluttering butterflies
const BUTTERFLIES = [
  { id: 1, startX: 12, startY: 25, duration: 22, delay: 0 },
  { id: 2, startX: 45, startY: 55, duration: 26, delay: 5 },
  { id: 3, startX: 78, startY: 35, duration: 24, delay: 10 },
];

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Soft ambient romantic glow pools */}
      <div className="absolute top-10 left-[12%] w-[500px] h-[500px] bg-rose-200/30 rounded-full blur-[150px]" />
      <div className="absolute top-[40%] right-[8%] w-[550px] h-[550px] bg-pink-100/35 rounded-full blur-[160px]" />
      <div className="absolute bottom-20 left-[18%] w-[480px] h-[480px] bg-amber-100/35 rounded-full blur-[150px]" />
      <div className="absolute top-[70%] right-[25%] w-[420px] h-[420px] bg-purple-100/25 rounded-full blur-[150px]" />

      {/* Floating glowing hearts */}
      {HEARTS.map((h) => (
        <motion.div
          key={`heart-${h.id}`}
          className="absolute"
          style={{ left: h.left, bottom: '-5%' }}
          animate={{
            y: ['0vh', '-110vh'],
            x: [0, h.drift, -h.drift / 2, 0],
            scale: [0.7, 1.1, 0.9, 0.6],
            opacity: [0, 0.75, 0.85, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill={h.color}
            className="drop-shadow-[0_2px_10px_rgba(244,63,94,0.35)]"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}

      {/* Floating petals */}
      {PETALS.map((p) => (
        <motion.div
          key={`petal-${p.id}`}
          className="absolute"
          style={{ left: p.left, top: '-5%' }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.drift, -p.drift / 2, 0],
            rotate: [p.rotation, p.rotation + 360],
            opacity: [0, 0.75, 0.85, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg
            width={p.size}
            height={p.size * 1.3}
            viewBox="0 0 24 32"
            fill="none"
            className="drop-shadow-[0_2px_8px_rgba(251,113,133,0.3)]"
          >
            <path
              d="M12 0C12 0 24 8 24 20C24 26.6274 18.6274 32 12 32C5.37258 32 0 26.6274 0 20C0 8 12 0 12 0Z"
              fill="url(#petalGradient)"
              opacity="0.85"
            />
            <defs>
              <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE2E4" />
                <stop offset="50%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#FB7185" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}

      {/* Tiny glowing stars */}
      {STARS.map((s) => (
        <motion.div
          key={`star-${s.id}`}
          className="absolute rounded-full bg-amber-200"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            boxShadow: '0 0 10px rgba(253, 230, 138, 0.9), 0 0 4px #F59E0B',
          }}
          animate={{
            opacity: [0.15, 0.95, 0.15],
            scale: [0.75, 1.35, 0.75],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Fluttering butterflies */}
      {BUTTERFLIES.map((b) => (
        <motion.div
          key={`butterfly-${b.id}`}
          className="absolute"
          style={{ left: `${b.startX}%`, top: `${b.startY}%` }}
          animate={{
            x: [0, 70, -30, 90, 0],
            y: [0, -45, -75, -25, 0],
            opacity: [0, 0.85, 0.95, 0.75, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="relative w-6 h-6">
            <svg viewBox="0 0 40 30" className="w-full h-full drop-shadow-[0_0_12px_rgba(244,114,182,0.6)]">
              <motion.path
                d="M20 15 C10 0, 0 5, 5 18 C8 24, 18 20, 20 15 Z"
                fill="#FBCFE8"
                stroke="#F472B6"
                strokeWidth="0.8"
                animate={{ rotateY: [0, 65, 0] }}
                transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '20px 15px' }}
              />
              <motion.path
                d="M20 15 C30 0, 40 5, 35 18 C32 24, 22 20, 20 15 Z"
                fill="#FDE68A"
                stroke="#F59E0B"
                strokeWidth="0.8"
                animate={{ rotateY: [0, -65, 0] }}
                transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '20px 15px' }}
              />
              <ellipse cx="20" cy="15" rx="1.5" ry="5" fill="#24162F" />
            </svg>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
