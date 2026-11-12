import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

export default function AudioPlayer() {
  const { state, updateSettings } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const customMusicUrl = state.settings.musicUrl;
  const isEnabled = state.settings.musicEnabled;

  // Gentle music-box chime synthesizer when no audio URL is loaded
  const playSynthesizedMelody = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Ethereal music box chords: C, G, Am, F, Em
      const chords = [
        [523.25, 659.25, 783.99], // C, E, G
        [392.00, 493.88, 587.33], // G, B, D
        [440.00, 523.25, 659.25], // A, C, E
        [349.23, 440.00, 523.25], // F, A, C
        [659.25, 783.99, 1046.50], // E, G, C5
      ];
      let step = 0;

      const triggerNote = () => {
        if (!ctx) return;
        const currentChord = chords[step % chords.length];
        const freq = currentChord[Math.floor(Math.random() * currentChord.length)];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.08 * volume, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.5);

        step++;
      };

      triggerNote();
      synthIntervalRef.current = window.setInterval(triggerNote, 1200);
    } catch (e) {
      console.warn('Audio synthesis not supported', e);
    }
  };

  const stopSynthesizedMelody = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  const togglePlayback = () => {
    if (!isEnabled) {
      updateSettings({ musicEnabled: true });
    }

    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      stopSynthesizedMelody();
      setIsPlaying(false);
    } else {
      if (customMusicUrl && audioRef.current) {
        audioRef.current.play().catch(() => playSynthesizedMelody());
      } else {
        playSynthesizedMelody();
      }
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopSynthesizedMelody();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2"
      onMouseEnter={() => setShowVolume(true)}
      onMouseLeave={() => setShowVolume(false)}
    >
      {customMusicUrl && (
        <audio
          ref={audioRef}
          src={customMusicUrl}
          loop
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Volume slider popover */}
      <AnimatePresence>
        {showVolume && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 border border-rose-200/80 shadow-xl backdrop-blur-md"
          >
            <Music size={12} className="text-rose-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-18 h-1 accent-rose-500 bg-rose-100 rounded-lg cursor-pointer"
              aria-label="Volume Control"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Mute toggle pill */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={togglePlayback}
        className={`relative flex items-center justify-center p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 cursor-pointer ${
          isPlaying
            ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_0_22px_rgba(244,63,94,0.45)]'
            : 'bg-white/90 hover:bg-white text-midnight/70 hover:text-rose-600 border border-rose-200/80 shadow-md'
        }`}
        aria-label={isPlaying ? 'Mute Music' : 'Play Music'}
        title={isPlaying ? 'Music Playing (Click to Mute)' : 'Play Birthday Melody'}
      >
        {isPlaying ? (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border border-rose-300"
              animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Volume2 size={18} className="relative z-10" />
          </>
        ) : (
          <VolumeX size={18} />
        )}
      </motion.button>
    </div>
  );
}
