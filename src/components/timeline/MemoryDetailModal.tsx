import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  Camera,
  CheckCircle2,
} from 'lucide-react';
import type { TimelineMemory } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { attachPhotosToMemoryApi } from '../../services/api';

interface MemoryDetailModalProps {
  memory: TimelineMemory | null;
  allMemories: TimelineMemory[];
  onClose: () => void;
  onNavigate: (mem: TimelineMemory) => void;
  onEdit: (mem: TimelineMemory) => void;
  onDelete: (id: string) => void;
  onUpdated?: (updated: TimelineMemory) => void;
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr).getTime();
  const now = new Date().getTime();
  const diff = target - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function MemoryDetailModal({
  memory,
  allMemories,
  onClose,
  onNavigate,
  onEdit,
  onDelete,
  onUpdated,
}: MemoryDetailModalProps) {
  const { user } = useAuth();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (memory) {
      setSelectedPhoto(memory.coverPhoto || memory.photos[0] || null);
    }
  }, [memory]);

  if (!memory) return null;

  const currentIndex = allMemories.findIndex((m) => m.id === memory.id);
  const prevMemory = currentIndex > 0 ? allMemories[currentIndex - 1] : null;
  const nextMemory = currentIndex < allMemories.length - 1 ? allMemories[currentIndex + 1] : null;

  const isUpcoming = memory.status === 'upcoming';
  const daysUntil = isUpcoming ? getDaysUntil(memory.date) : 0;

  const handleDeleteClick = () => {
    if (confirm(`Are you sure you want to delete "${memory.title}"? This cannot be undone.`)) {
      onDelete(memory.id);
      onClose();
    }
  };

  const handleAttachPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const updated = await attachPhotosToMemoryApi(memory.id, files);
      if (onUpdated) onUpdated(updated);
      setSelectedPhoto(updated.coverPhoto || updated.photos[updated.photos.length - 1]);
      setToast('Photos attached successfully! ✨');
      setTimeout(() => setToast(null), 2500);
    } catch {
      alert('Could not attach photos. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const allPhotos = [
    ...(memory.coverPhoto ? [memory.coverPhoto] : []),
    ...(memory.photos || []),
  ].filter((v, i, a) => a.indexOf(v) === i); // unique

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-midnight/60 backdrop-blur-md overflow-y-auto"
      >
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.94, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-3xl my-auto rounded-[32px] bg-[#FFF9F6] border border-rose-200/90 shadow-2xl overflow-hidden text-midnight flex flex-col max-h-[92vh]"
        >
          {/* Toast inside modal */}
          {toast && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-midnight text-cream text-xs flex items-center gap-1.5 shadow-lg">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>{toast}</span>
            </div>
          )}

          {/* Top Scrapbook Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-white/85 border-b border-rose-100 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-rose-50 text-rose-500">
                <Sparkles size={16} />
              </span>
              <span className="font-sans text-xs uppercase tracking-widest text-midnight/60 font-medium">
                {isUpcoming ? 'Upcoming Moment' : 'Cherished Moment'}
              </span>
              {isUpcoming && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                  in {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {user && (
                <>
                  {/* Direct Attach Photos Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer border border-rose-200"
                    title="Attach Photographs"
                  >
                    <Camera size={14} />
                    <span>{uploading ? 'Attaching...' : 'Attach Photos'}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleAttachPhotos}
                    className="hidden"
                  />

                  <button
                    onClick={() => onEdit(memory)}
                    className="p-2 rounded-full hover:bg-rose-50 text-midnight/60 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Edit Memory"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="p-2 rounded-full hover:bg-red-50 text-midnight/60 hover:text-red-500 transition-colors cursor-pointer"
                    title="Delete Memory"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-rose-50 text-midnight/60 hover:text-midnight transition-colors cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Title & Date Metadata */}
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl text-midnight font-normal leading-snug">
                {memory.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-midnight/55 mt-2.5">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-rose-400" />
                  {new Date(memory.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>

                {memory.time && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} className="text-rose-400" />
                    {memory.time}
                  </span>
                )}

                {memory.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-rose-400" />
                    {memory.location}
                  </span>
                )}

                <span className="font-sans text-[11px] text-midnight/40">
                  📷 {allPhotos.length} {allPhotos.length === 1 ? 'Photo attached' : 'Photos attached'}
                </span>
              </div>
            </div>

            {/* Main Featured Photo (if available) */}
            {selectedPhoto ? (
              <div className="relative rounded-2xl overflow-hidden bg-black/5 aspect-[16/10] max-h-[380px] shadow-sm border border-rose-100 flex items-center justify-center group">
                <img
                  src={selectedPhoto}
                  alt={memory.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              /* If no photo attached yet, offer a clean prompt */
              user && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 rounded-2xl border-2 border-dashed border-rose-200 hover:border-rose-400 bg-white/50 text-center cursor-pointer transition-colors"
                >
                  <Camera size={26} className="mx-auto text-rose-400 mb-2" />
                  <p className="font-sans text-xs text-midnight/70 font-medium">
                    No photo attached yet. Click to attach photos to this memory!
                  </p>
                </div>
              )
            )}

            {/* Additional Photo Gallery Thumbnails */}
            {allPhotos.length > 1 && (
              <div className="space-y-1.5">
                <span className="text-xs font-sans text-midnight/50 font-medium">
                  Attached Photo Gallery ({allPhotos.length}):
                </span>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  {allPhotos.map((p, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setSelectedPhoto(p)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        selectedPhoto === p
                          ? 'border-rose-400 shadow-md scale-102'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p} alt={`Photo ${pIdx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Written Story */}
            {memory.description && (
              <div className="p-6 rounded-2xl bg-white/70 border border-rose-100/70 shadow-sm">
                <p className="font-serif text-base sm:text-lg text-midnight/85 leading-relaxed font-light whitespace-pre-line">
                  {memory.description}
                </p>
              </div>
            )}

            {/* Short Note / Scrapbook Post-it */}
            {memory.shortNote && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50/70 border border-amber-200/50 shadow-sm flex items-start gap-3">
                <span className="text-amber-500 mt-0.5">✨</span>
                <div>
                  <span className="font-sans text-[11px] uppercase tracking-wider text-amber-700 font-semibold block mb-0.5">
                    A Little Note
                  </span>
                  <p className="font-serif italic text-sm text-midnight/80">
                    “{memory.shortNote}”
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Previous / Next Scrapbook Navigation */}
          <div className="px-6 py-3.5 bg-white/70 border-t border-rose-100/60 flex items-center justify-between text-xs font-sans text-midnight/60">
            {prevMemory ? (
              <button
                onClick={() => onNavigate(prevMemory)}
                className="flex items-center gap-1.5 hover:text-rose-500 transition-colors cursor-pointer py-1"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline truncate max-w-[150px]">{prevMemory.title}</span>
                <span className="sm:hidden">Previous</span>
              </button>
            ) : (
              <div />
            )}

            <span className="font-sans text-[11px] text-midnight/40">
              {currentIndex + 1} of {allMemories.length}
            </span>

            {nextMemory ? (
              <button
                onClick={() => onNavigate(nextMemory)}
                className="flex items-center gap-1.5 hover:text-rose-500 transition-colors cursor-pointer py-1"
              >
                <span className="hidden sm:inline truncate max-w-[150px]">{nextMemory.title}</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <div />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
