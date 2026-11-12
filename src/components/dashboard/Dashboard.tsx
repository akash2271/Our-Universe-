import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, Sparkles, Lock, Unlock, ArrowRight } from 'lucide-react';
import BackgroundEffects from '../shared/BackgroundEffects';
import AudioPlayer from '../shared/AudioPlayer';
import HeroSection from '../hero/HeroSection';
import AboutDivya from '../about/AboutDivya';
import CakeSection from '../cake/CakeSection';
import GallerySection from '../gallery/GallerySection';
import FinalLetter from '../letter/FinalLetter';
import PrivateMomentsView from '../moments/PrivateMomentsView';
import SettingsPanel from '../settings/SettingsPanel';
import { useApp } from '../../hooks/useApp';
import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
  const { state } = useApp();
  const { user, logout } = useAuth();
  const name = state.settings.partnerName || 'My Love';

  // Two separate options: 'special-day' and 'private-moments'
  const [activeTab, setActiveTab] = useState<'special-day' | 'private-moments'>('special-day');
  const [showSettings, setShowSettings] = useState(false);

  const handleTabChange = (tab: 'special-day' | 'private-moments') => {
    if (activeTab === 'private-moments' && tab === 'special-day') {
      logout(); // Auto-lock when leaving private section
    }
    setActiveTab(tab);
  };

  return (
    <div className="relative min-h-screen text-midnight font-sans selection:bg-rose-200 selection:text-rose-700">
      {/* Gentle ambient floating petals & stars */}
      <BackgroundEffects />

      {/* ── TOP NAVIGATION BAR (TWO SEPARATE OPTIONS) ── */}
      <header className="sticky top-0 z-30 w-full px-4 py-3.5 bg-white/70 backdrop-blur-xl border-b border-rose-200/50 shadow-[0_4px_25px_rgba(244,114,182,0.08)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo / Title */}
          <div className="hidden sm:flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="font-serif text-sm tracking-wider text-midnight font-medium">
              {name}'s Little Universe
            </span>
            <span className="text-xs text-rose-500">❤️</span>
          </div>

          {/* Dual Option Segmented Switcher */}
          <div className="flex items-center p-1 rounded-full bg-white/80 border border-rose-200/60 shadow-sm backdrop-blur-xl mx-auto sm:mx-0">
            <button
              onClick={() => handleTabChange('special-day')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-sans font-medium transition-all duration-300 cursor-pointer ${
                activeTab === 'special-day'
                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-[0_4px_16px_rgba(244,63,94,0.35)] scale-[1.02]'
                  : 'text-midnight/70 hover:text-rose-600'
              }`}
            >
              <Sparkles size={13} className={activeTab === 'special-day' ? 'text-amber-200 animate-pulse' : 'text-rose-400'} />
              <span>Today's Special Day</span>
            </button>

            <button
              onClick={() => handleTabChange('private-moments')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-sans font-medium transition-all duration-300 cursor-pointer ${
                activeTab === 'private-moments'
                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-[0_4px_16px_rgba(244,63,94,0.35)] scale-[1.02]'
                  : 'text-midnight/70 hover:text-rose-600'
              }`}
            >
              {user ? (
                <Unlock size={13} className={activeTab === 'private-moments' ? 'text-amber-200' : 'text-emerald-500'} />
              ) : (
                <Lock size={13} className={activeTab === 'private-moments' ? 'text-amber-200' : 'text-rose-400'} />
              )}
              <span>Private Moments</span>
            </button>
          </div>

          {/* Settings Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2.5 rounded-full bg-white/85 hover:bg-white text-midnight/70 hover:text-rose-600 shadow-sm border border-rose-200/60 transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105"
              title="Personalize Settings"
              aria-label="Settings"
            >
              <SettingsIcon size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Unobtrusive Floating Audio Controller (Bottom Right) */}
      <AudioPlayer />

      {/* ── MAIN CONTENT AREA ── */}
      <main className="relative z-20">
        <AnimatePresence mode="wait">
          {activeTab === 'special-day' ? (
            /* ── OPTION 1: TODAY'S SPECIAL DAY ── */
            <motion.div
              key="special-day"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <HeroSection />
              <AboutDivya />
              <CakeSection />
              <GallerySection />
              <FinalLetter />

              {/* Bottom Invitation to Private Moments */}
              <div className="max-w-2xl mx-auto px-4 my-16 text-center">
                <div
                  onClick={() => handleTabChange('private-moments')}
                  className="relative p-7 sm:p-9 rounded-[32px] glass-card hover:shadow-[0_20px_50px_rgba(244,114,182,0.22)] border border-rose-200/80 transition-all duration-500 cursor-pointer group overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-50 text-rose-500 flex items-center justify-center mx-auto mb-3 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Lock size={20} className="text-rose-500" />
                  </div>
                  <h4 className="font-serif text-2xl text-midnight font-medium group-hover:text-rose-600 transition-colors">
                    Looking for Our Little Universe?
                  </h4>
                  <p className="font-serif italic text-base text-midnight/70 font-light mt-1.5">
                    “Some moments deserve to stay forever.”
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs font-sans text-rose-500 font-semibold mt-4 px-4 py-2 rounded-full bg-rose-50 border border-rose-200/60 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shadow-xs">
                    <span>Enter Our Private Moments</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ── OPTION 2: PRIVATE MOMENTS & SCRAPBOOK UNIVERSE ── */
            <motion.div
              key="private-moments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <PrivateMomentsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Minimal Romantic Footer */}
      <footer className="py-14 px-4 text-center border-t border-rose-200/50 text-xs text-midnight/60">
        <p className="font-serif italic text-base text-rose-500 mb-1.5 flex items-center justify-center gap-1.5">
          <span>{name}'s Little Universe</span>
          <span className="animate-pulse text-sm">❤️</span>
        </p>
        <p className="font-sans font-light text-midnight/60">
          Crafted with love to celebrate and preserve our most cherished moments.
        </p>
      </footer>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
