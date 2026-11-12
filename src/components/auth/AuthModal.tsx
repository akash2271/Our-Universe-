import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('divyaAdmin2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 600);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setRolePreset = (role: 'admin' | 'viewer') => {
    if (role === 'admin') {
      setUsername('admin');
      setPassword('divyaAdmin2026!');
    } else {
      setUsername('divya');
      setPassword('celebrate2026!');
    }
    setError(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/50 backdrop-blur-sm"
      >
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white shadow-2xl border border-rose-100 text-midnight"
        >
          <div className="flex items-center justify-between pb-4 border-b border-rose-50 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                <Lock size={16} />
              </div>
              <h3 className="font-serif text-xl text-midnight font-medium">Private Access</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-rose-50 text-midnight/50 hover:text-midnight transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Role Switcher Chips */}
          <div className="flex gap-2 p-1 bg-cream rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => setRolePreset('admin')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                username === 'admin'
                  ? 'bg-white shadow-sm text-rose-600 font-semibold'
                  : 'text-midnight/60 hover:text-midnight'
              }`}
            >
              👑 Owner (Admin)
            </button>
            <button
              type="button"
              onClick={() => setRolePreset('viewer')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                username === 'divya'
                  ? 'bg-white shadow-sm text-rose-600 font-semibold'
                  : 'text-midnight/60 hover:text-midnight'
              }`}
            >
              🌸 Divya (Viewer)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-midnight/60 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:outline-none focus:border-rose-400 font-sans text-sm text-midnight"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-midnight/60 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:outline-none focus:border-rose-400 font-sans text-sm text-midnight"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-sans text-sm font-medium shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : success ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Access Granted</span>
                </>
              ) : (
                <>
                  <KeyRound size={16} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-rose-50 text-center">
            <p className="text-[11px] font-sans text-midnight/40 leading-relaxed">
              Admin can create, edit, upload and delete memories.<br />
              Viewer can browse the timeline and private scrapbook.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

