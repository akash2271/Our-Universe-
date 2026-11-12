import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RotateCcw, Trash2, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

interface SettingsPanelProps {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { state, updateSettings, resetState, deleteTodaySpecialDay } = useApp();
  const [name, setName] = useState(state.settings.partnerName || '');
  const [occasionTitle, setOccasionTitle] = useState(state.settings.occasionTitle || 'Happy Birthday');
  const [date, setDate] = useState(state.settings.birthdayDate || '');
  const [letter, setLetter] = useState(state.settings.personalLetter || '');
  const [musicUrl, setMusicUrl] = useState(state.settings.musicUrl || '');
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = () => {
    updateSettings({
      partnerName: name.trim(),
      occasionTitle: occasionTitle.trim() || 'Happy Birthday',
      birthdayDate: date,
      personalLetter: letter,
      musicUrl: musicUrl.trim(),
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset everything back to default celebration data (Divya)?')) {
      resetState();
      setName('Divya');
      setOccasionTitle('Happy Birthday');
      setDate('2027-01-15');
      onClose();
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const fresh = await deleteTodaySpecialDay();
      setName('');
      setOccasionTitle('Happy Birthday');
      setDate(fresh.settings.birthdayDate);
      setLetter(fresh.settings.personalLetter);
      setMusicUrl('');
      setShowDeleteConfirm(false);
      setDeleteMessage("Today's Special Day has been cleared! A fresh canvas in the exact same format is ready. Enter your new details below and click 'Save Changes' ✨");
    } catch {
      alert('Could not delete Today\'s Special Day.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
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
        className="relative z-10 w-full max-w-xl p-6 sm:p-8 rounded-[32px] bg-white shadow-2xl border border-rose-200/90 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100 mb-6">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-full bg-rose-50 text-rose-500">
              <Sparkles size={16} />
            </span>
            <h3 className="font-serif text-2xl text-midnight font-normal">
              Personalize Special Day
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-rose-50 text-midnight/60 hover:text-midnight transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success Alert after Deletion */}
        <AnimatePresence>
          {deleteMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-start gap-2.5 leading-relaxed"
            >
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>{deleteMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {/* Partner / Special Person Name */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-midnight/70 mb-1.5 font-semibold">
              Special Person's Name
            </label>
            <input
              type="text"
              placeholder="e.g. Divya, Maya, Alex, Priya..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200/50 font-sans text-sm text-midnight"
            />
          </div>

          {/* Occasion / Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-midnight/70 mb-1.5 font-semibold">
                Occasion / Celebration Title
              </label>
              <input
                type="text"
                placeholder="e.g. Happy Birthday, Happy Anniversary..."
                value={occasionTitle}
                onChange={(e) => setOccasionTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200/50 font-sans text-xs text-midnight"
              />
            </div>

            {/* Special Date */}
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-midnight/70 mb-1.5 font-semibold">
                Special Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200/50 font-sans text-xs text-midnight"
              />
            </div>
          </div>

          {/* Personal Letter Text */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-midnight/70 mb-1.5 font-semibold">
              Personal Letter Text
            </label>
            <textarea
              rows={6}
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              placeholder="Write your heartfelt letter here..."
              className="w-full px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200/50 font-sans text-sm text-midnight leading-relaxed"
            />
          </div>

          {/* Custom Background Music URL */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-midnight/70 mb-1.5 font-semibold">
              Custom Background Music URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://example.com/audio.mp3 (leave empty for soft chimes)"
              value={musicUrl}
              onChange={(e) => setMusicUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200/50 font-sans text-xs text-midnight"
            />
          </div>

          {/* ── TODAY'S SPECIAL DAY MANAGEMENT OPTION (DELETE CURRENT & START NEW) ── */}
          <div className="pt-2">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-pink-50/70 border border-rose-200/90 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-600 mt-0.5">
                  <Trash2 size={16} />
                </div>
                <div>
                  <h4 className="font-serif text-base text-midnight font-medium">
                    Delete "Today's Special Day"
                  </h4>
                  <p className="text-xs font-sans text-midnight/65 leading-relaxed mt-0.5">
                    Delete the current celebration photos (hero portrait and keepsakes gallery), letter, and name to create a brand new special day in the exact same format.
                  </p>
                </div>
              </div>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-2.5 px-4 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-rose-600 font-sans text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:border-rose-400"
                >
                  <Trash2 size={14} />
                  <span>Delete "Today's Special Day" & Start New</span>
                </button>
              ) : (
                /* Confirmation Card */
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-50/95 border border-red-200 space-y-3"
                >
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle size={16} />
                    <span className="font-sans text-xs font-bold uppercase tracking-wider">
                      Are you sure you want to delete this special day?
                    </span>
                  </div>
                  <p className="text-xs font-sans text-red-800/80 leading-relaxed">
                    This will clear the current celebration's portrait photo, gallery photos, and personal letter so you can make a fresh new special day in this exact same format.
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="px-3.5 py-1.5 rounded-lg bg-white border border-stone-200 text-midnight/70 hover:text-midnight text-xs font-sans cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      disabled={isDeleting}
                      className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-sans font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                      <span>{isDeleting ? 'Deleting...' : 'Yes, Delete & Start Fresh'}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-rose-100">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 text-xs font-sans text-midnight/50 hover:text-rose-600 transition-colors cursor-pointer"
            title="Restore original Divya template"
          >
            <RotateCcw size={12} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-sans text-xs font-semibold transition-all shadow-md cursor-pointer hover:scale-105"
          >
            {saved ? (
              <>
                <Check size={14} />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}