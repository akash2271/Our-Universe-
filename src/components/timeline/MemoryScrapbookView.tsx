import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react';
import type { TimelineMemory } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { attachPhotosToMemoryApi } from '../../services/api';

interface MemoryScrapbookViewProps {
  memories: TimelineMemory[];
  onSelectMemory: (mem: TimelineMemory) => void;
  onMemoryUpdated: (updated: TimelineMemory) => void;
}

export default function MemoryScrapbookView({
  memories,
  onSelectMemory,
  onMemoryUpdated,
}: MemoryScrapbookViewProps) {
  const { user } = useAuth();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleCardAttach = async (memoryId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const updated = await attachPhotosToMemoryApi(memoryId, files);
      onMemoryUpdated(updated);
    } catch {
      alert('Could not attach photos.');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {memories.map((mem, idx) => {
        const isUpcoming = mem.status === 'upcoming';
        const photoCount = (mem.photos?.length || 0) + (mem.coverPhoto ? 1 : 0);

        return (
          <motion.div
            key={mem.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            whileHover={{ y: -6, scale: 1.015 }}
            onClick={() => onSelectMemory(mem)}
            className="group relative rounded-[28px] bg-white border border-rose-200/80 shadow-[0_14px_35px_-8px_rgba(244,114,182,0.18)] hover:shadow-[0_24px_50px_-8px_rgba(244,114,182,0.3)] transition-all duration-300 p-4 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            {/* Scrapbook Tape / Corner Pin Accent */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-amber-100/90 border border-amber-200/80 rotate-[-1deg] rounded-xs z-20 pointer-events-none shadow-xs" />

            <div>
              {/* Photo Area (Polaroid style) */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60 border border-rose-100 flex items-center justify-center mb-3.5 shadow-inner">
                {mem.coverPhoto ? (
                  <img
                    src={mem.coverPhoto}
                    alt={mem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center text-rose-300">
                    <Camera size={34} className="stroke-1 text-rose-400 mb-1.5" />
                    <span className="font-serif italic text-xs text-midnight/70">
                      Cherished Memory
                    </span>
                  </div>
                )}

                {/* Photo Count Badge */}
                <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-sans font-medium bg-black/65 text-white backdrop-blur-xs flex items-center gap-1 shadow-sm">
                  <Camera size={11} />
                  <span>{photoCount > 0 ? `${photoCount} Photos` : 'Add Photo'}</span>
                </span>

                {/* Upcoming Badge */}
                {isUpcoming && (
                  <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold bg-amber-400 text-amber-950 shadow-sm flex items-center gap-1">
                    <Sparkles size={11} />
                    Upcoming Plan
                  </span>
                )}

                {/* Quick Attach Photo Icon */}
                {user && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRefs.current[mem.id]?.click();
                    }}
                    className="absolute bottom-2 right-2 p-2 rounded-full bg-white/95 text-midnight/70 hover:text-rose-500 shadow-md backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Attach Photos to this memory"
                  >
                    <Camera size={13} />
                  </button>
                )}
                <input
                  ref={(el) => {
                    fileInputRefs.current[mem.id] = el;
                  }}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleCardAttach(mem.id, e)}
                  className="hidden"
                />
              </div>

              {/* Date & Location Bar */}
              <div className="flex items-center justify-between text-xs font-sans text-midnight/55 mb-2 px-1">
                <span className="flex items-center gap-1 text-rose-600 font-semibold">
                  <Calendar size={12} />
                  {new Date(mem.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>

                {mem.location && (
                  <span className="flex items-center gap-1 text-midnight/45 truncate max-w-[120px]">
                    <MapPin size={11} />
                    {mem.location}
                  </span>
                )}
              </div>

              {/* Title */}
              <h4 className="font-serif text-lg text-midnight font-medium leading-snug group-hover:text-rose-600 transition-colors px-1">
                {mem.title}
              </h4>

              {/* Short Note */}
              {mem.shortNote && (
                <p className="font-serif italic text-xs text-midnight/75 mt-1 line-clamp-2 px-1">
                  “{mem.shortNote}”
                </p>
              )}
            </div>

            {/* Bottom Card Action */}
            <div className="pt-3 mt-4 border-t border-rose-100/80 flex items-center justify-between text-[11px] font-sans px-1">
              <span className="text-rose-500 font-medium group-hover:underline">
                Open Scrapbook Page →
              </span>
              <span className="text-midnight/40 text-[10px] font-medium">
                {new Date(mem.date).getFullYear()}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
