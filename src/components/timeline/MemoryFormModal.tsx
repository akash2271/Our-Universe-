import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Trash2, Check, AlertCircle } from 'lucide-react';
import type { TimelineMemory } from '../../types';
import { createMemoryApi, updateMemoryApi, uploadPhotosApi } from '../../services/api';

interface MemoryFormModalProps {
  isOpen: boolean;
  editingMemory: TimelineMemory | null;
  onClose: () => void;
  onSaved: (savedMemory: TimelineMemory) => void;
}

export default function MemoryFormModal({
  isOpen,
  editingMemory,
  onClose,
  onSaved,
}: MemoryFormModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [shortNote, setShortNote] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingMemory) {
      setTitle(editingMemory.title || '');
      setDate(editingMemory.date || new Date().toISOString().split('T')[0]);
      setTime(editingMemory.time || '');
      setLocation(editingMemory.location || '');
      setDescription(editingMemory.description || '');
      setShortNote(editingMemory.shortNote || '');
      setPhotos(editingMemory.photos || []);
      setCoverPhoto(editingMemory.coverPhoto || '');
    } else {
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setTime('');
      setLocation('');
      setDescription('');
      setShortNote('');
      setPhotos([]);
      setCoverPhoto('');
    }
    setError(null);
  }, [editingMemory, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      // Upload to server
      const uploadedUrls = await uploadPhotosApi(files);
      const combined = [...photos, ...uploadedUrls];
      setPhotos(combined);
      if (!coverPhoto && uploadedUrls.length > 0) {
        setCoverPhoto(uploadedUrls[0]);
      }
    } catch {
      // Fallback to local base64 reader if upload endpoint fails or offline
      const promises = files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      const base64Photos = await Promise.all(promises);
      const combined = [...photos, ...base64Photos];
      setPhotos(combined);
      if (!coverPhoto && base64Photos.length > 0) {
        setCoverPhoto(base64Photos[0]);
      }
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (indexToRemove: number) => {
    const removedUrl = photos[indexToRemove];
    const nextPhotos = photos.filter((_, i) => i !== indexToRemove);
    setPhotos(nextPhotos);

    if (coverPhoto === removedUrl) {
      setCoverPhoto(nextPhotos[0] || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) {
      setError('Please provide a title and date.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const memoryPayload = {
        title: title.trim(),
        date,
        time: time.trim() || undefined,
        location: location.trim() || undefined,
        description: description.trim(),
        shortNote: shortNote.trim(),
        coverPhoto: coverPhoto || photos[0] || '',
        photos,
      };

      let saved: TimelineMemory;
      if (editingMemory) {
        saved = await updateMemoryApi(editingMemory.id, memoryPayload);
      } else {
        saved = await createMemoryApi(memoryPayload);
      }

      onSaved(saved);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save memory.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-midnight/60 backdrop-blur-sm overflow-y-auto"
      >
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-2xl my-auto rounded-[32px] bg-white shadow-2xl border border-rose-200/90 text-midnight flex flex-col max-h-[92vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-rose-50">
            <h3 className="font-serif text-2xl text-midnight font-normal">
              {editingMemory ? 'Edit Memory' : 'Add to Our Universe'}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-rose-50 text-midnight/50 hover:text-midnight transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-midnight/60 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Starlight Picnic at the Orchard"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:outline-none focus:border-rose-400 font-sans text-sm text-midnight"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-midnight/60 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:outline-none focus:border-rose-400 font-sans text-xs text-midnight"
                />
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-midnight/60 mb-1">
                  Time (Optional)
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:outline-none focus:border-rose-400 font-sans text-xs text-midnight"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-midnight/60 mb-1">
                Location (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Riverside Cafe, Paris, Living Room"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:outline-none focus:border-rose-400 font-sans text-sm text-midnight"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-midnight/60 mb-1">
                Personal Description / Story
              </label>
              <textarea
                rows={4}
                placeholder="Write the full memory story here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:outline-none focus:border-rose-400 font-sans text-sm text-midnight leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-midnight/60 mb-1">
                Short Note / Quote
              </label>
              <input
                type="text"
                placeholder="e.g. “Proof that the best memories are never scheduled.”"
                value={shortNote}
                onChange={(e) => setShortNote(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:outline-none focus:border-rose-400 font-sans text-sm text-midnight"
              />
            </div>

            {/* Photos upload & gallery */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-sans uppercase tracking-wider text-midnight/60">
                  Photographs
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <Camera size={13} />
                  {uploading ? 'Uploading...' : 'Upload Photos'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {photos.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-cream/70 border border-rose-50">
                  {photos.map((url, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 group ${
                        coverPhoto === url ? 'border-rose-500 shadow-sm' : 'border-transparent'
                      }`}
                    >
                      <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />

                      {/* Set as Cover button */}
                      <button
                        type="button"
                        onClick={() => setCoverPhoto(url)}
                        className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-sans font-medium transition-all ${
                          coverPhoto === url
                            ? 'bg-rose-500 text-white'
                            : 'bg-black/60 text-white/90 opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        {coverPhoto === url ? 'Cover' : 'Set Cover'}
                      </button>

                      {/* Delete photo button */}
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 rounded-2xl border-2 border-dashed border-rose-200/80 hover:border-rose-400 bg-cream/40 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                >
                  <Upload size={22} className="text-rose-400 mb-1.5" />
                  <span className="font-sans text-xs text-midnight/70 font-medium">
                    Click to browse and upload photographs
                  </span>
                  <span className="text-[10px] text-midnight/40 font-sans mt-0.5">
                    JPG, PNG, WebP up to 15MB each
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-rose-50">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-sans text-midnight/60 hover:text-midnight transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || uploading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-sans text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50 hover:scale-105"
              >
                <Check size={14} />
                <span>{loading ? 'Saving...' : editingMemory ? 'Update Memory' : 'Save Memory'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

