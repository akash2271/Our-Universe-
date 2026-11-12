import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Sparkles,
  Search,
  Plus,
  LogOut,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import type { TimelineMemory } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { fetchMemories, deleteMemoryApi } from '../../services/api';
import MemoryScrapbookView from '../timeline/MemoryScrapbookView';
import MemoryDetailModal from '../timeline/MemoryDetailModal';
import MemoryFormModal from '../timeline/MemoryFormModal';

export default function PrivateMomentsView() {
  const { user, login, logout } = useAuth();

  // Common credentials login state (No admin concept - shared for both)
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Memories & Discovery state
  const [memories, setMemories] = useState<TimelineMemory[]>([]);
  const [loadingMemories, setLoadingMemories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'past' | 'upcoming'>('all');

  // Modals state
  const [viewingMemory, setViewingMemory] = useState<TimelineMemory | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<TimelineMemory | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadMemories = async () => {
    try {
      setLoadingMemories(true);
      const data = await fetchMemories();
      setMemories(data);
    } catch {
      // ignore
    } finally {
      setLoadingMemories(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadMemories();
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      await login(usernameInput.trim(), passwordInput.trim());
      await loadMemories();
      showToast('Welcome to Our Shared Universe ✨');
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Incorrect common username or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Available Years
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    memories.forEach((m) => {
      const y = new Date(m.date).getFullYear();
      if (!isNaN(y)) years.add(y.toString());
    });
    return Array.from(years).sort();
  }, [memories]);

  // Filtered Memories (by status, year, and search)
  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) {
        return false;
      }

      if (selectedYear !== 'all') {
        const memYear = new Date(m.date).getFullYear().toString();
        if (memYear !== selectedYear) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesDesc = (m.description || '').toLowerCase().includes(q);
        const matchesNote = (m.shortNote || '').toLowerCase().includes(q);
        const matchesLoc = (m.location || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesNote && !matchesLoc) return false;
      }

      return true;
    });
  }, [memories, statusFilter, selectedYear, searchQuery]);

  const handleSaved = (saved: TimelineMemory) => {
    setMemories((prev) => {
      const exists = prev.some((m) => m.id === saved.id);
      if (exists) {
        return prev.map((m) => (m.id === saved.id ? saved : m));
      }
      return [...prev, saved].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });
    showToast(editingMemory ? 'Memory updated ✨' : 'New memory & photos preserved ✨');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMemoryApi(id);
      setMemories((prev) => prev.filter((m) => m.id !== id));
      showToast('Memory removed.');
    } catch {
      alert('Could not delete memory.');
    }
  };

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto min-h-[85vh] relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-5 py-2.5 rounded-full bg-midnight text-cream shadow-xl text-xs font-sans flex items-center gap-2"
          >
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!user ? (
        /* ── COMMON PASSWORD GATE (Single common password to unlock) ── */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto my-12 p-8 sm:p-10 rounded-[36px] glass-card border border-rose-200/90 shadow-[0_25px_60px_-10px_rgba(244,114,182,0.25)] backdrop-blur-xl text-center"
        >
          <div className="w-18 h-18 mx-auto rounded-full bg-gradient-to-br from-rose-100 to-pink-50 border border-rose-200/80 flex items-center justify-center text-rose-500 shadow-inner mb-6 ring-4 ring-rose-50">
            <Lock size={28} className="animate-pulse" />
          </div>

          <p className="font-sans text-xs uppercase tracking-widest text-rose-600 font-semibold mb-2">
            Private & Protected Sanctuary
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl text-midnight font-normal mb-2">
            Our Private Moments
          </h2>

          <p className="font-serif italic text-base text-midnight/70 font-light leading-relaxed mb-6">
            “Some moments deserve to stay forever.”
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-wider text-midnight/70 mb-1.5 font-semibold">
                Username
              </label>
              <input
                type="text"
                required
                placeholder="Enter your username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/90 border border-rose-200 text-sm font-sans text-midnight focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[11px] font-sans uppercase tracking-wider text-midnight/70 mb-1.5 font-semibold">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/90 border border-rose-200 text-sm font-sans text-midnight focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 shadow-inner"
              />
            </div>

            {loginError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-500 via-rose-400 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-sans text-xs font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <KeyRound size={15} />
              <span>{loginLoading ? 'Opening Our Universe...' : 'Unlock Private Moments'}</span>
            </button>
          </form>
        </motion.div>
      ) : (
        /* ── AUTHENTICATED PRIVATE MOMENTS SCRAPBOOK CANVAS (No Categories, No Admin concept) ── */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-rose-200/60">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-sans text-xs uppercase tracking-widest text-rose-600 font-semibold">
                  Shared Couple Collection
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-sans text-midnight/55">Shared Access • Both Can Add & Modify</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl text-midnight font-normal tracking-tight">
                OUR LITTLE <span className="text-gradient-rose font-medium">UNIVERSE</span>
              </h2>
              <p className="font-serif italic text-base text-midnight/70 font-light mt-1">
                “Some moments deserve to stay forever.”
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setEditingMemory(null);
                  setFormOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-sans text-xs font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              >
                <Plus size={15} />
                <span>+ Attach New Memory</span>
              </button>

              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 hover:bg-rose-50 border border-rose-200/80 text-midnight/70 hover:text-rose-600 text-xs font-sans transition-colors cursor-pointer"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Search & Timeline Status Filters (Categories removed) */}
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-midnight/40" />
                <input
                  type="text"
                  placeholder="Search moments by title, story, note..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-full bg-white/90 border border-rose-200 text-xs font-sans text-midnight placeholder-midnight/40 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200/50 shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-midnight/40 hover:text-midnight cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Year Selector */}
              {availableYears.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs font-sans text-midnight/60">
                  <span className="text-[11px] uppercase text-midnight/50 font-semibold mr-1">Year:</span>
                  <button
                    onClick={() => setSelectedYear('all')}
                    className={`px-3 py-1 rounded-full text-xs font-sans transition-all cursor-pointer ${
                      selectedYear === 'all'
                        ? 'bg-midnight text-white font-medium shadow-xs'
                        : 'bg-white/90 text-midnight/60 hover:text-midnight border border-rose-200/80'
                    }`}
                  >
                    All
                  </button>
                  {availableYears.map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setSelectedYear(yr)}
                      className={`px-3 py-1 rounded-full text-xs font-sans transition-all cursor-pointer ${
                        selectedYear === yr
                          ? 'bg-midnight text-white font-medium shadow-xs'
                          : 'bg-white/90 text-midnight/60 hover:text-midnight border border-rose-200/80'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Simple Status Filter Tabs (All / Past Memories / Upcoming Plans) */}
            <div className="flex items-center gap-2">
              {[
                { id: 'all' as const, label: 'All Memories' },
                { id: 'past' as const, label: 'Past Moments' },
                { id: 'upcoming' as const, label: 'Upcoming Plans 🌟' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium shadow-xs scale-102'
                      : 'bg-white/90 text-midnight/70 hover:text-rose-600 border border-rose-200/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── NOT A LIST: Scrapbook Photo Album Grid (No Categories) ── */}
          {loadingMemories ? (
            <div className="text-center py-20 text-midnight/40 font-serif italic">
              Opening our scrapbook universe...
            </div>
          ) : filteredMemories.length > 0 ? (
            <MemoryScrapbookView
              memories={filteredMemories}
              onSelectMemory={(m) => setViewingMemory(m)}
              onMemoryUpdated={(updated) => handleSaved(updated)}
            />
          ) : (
            <div className="text-center py-16 p-8 rounded-3xl bg-white/60 border border-rose-100 max-w-md mx-auto">
              <Sparkles size={28} className="mx-auto text-rose-300 mb-2" />
              <h4 className="font-serif text-lg text-midnight font-medium">No moments found</h4>
              <p className="text-xs font-sans text-midnight/50 mt-1">
                Try clearing your search or year filter.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Memory Scrapbook Detail Page Viewer */}
      <MemoryDetailModal
        memory={viewingMemory}
        allMemories={filteredMemories}
        onClose={() => setViewingMemory(null)}
        onNavigate={(mem) => setViewingMemory(mem)}
        onEdit={(mem) => {
          setViewingMemory(null);
          setEditingMemory(mem);
          setFormOpen(true);
        }}
        onDelete={(id) => handleDelete(id)}
        onUpdated={(updated) => handleSaved(updated)}
      />

      {/* Memory Form Modal (Create / Edit & Attach photos) */}
      <MemoryFormModal
        isOpen={formOpen}
        editingMemory={editingMemory}
        onClose={() => {
          setFormOpen(false);
          setEditingMemory(null);
        }}
        onSaved={handleSaved}
      />
    </div>
  );
}
