import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, Sparkles } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { saveImage } from '../../store/appStore';
import coupleMomentsImg from '../../assets/couple-moments.jpg';
import unstoppableSpiritImg from '../../assets/unstoppable-spirit.jpg';
import radiantLifeImg from '../../assets/radiant-life.jpg';

export default function GallerySection() {
  const { state, updatePhoto } = useApp();
  const name = state.settings.partnerName || 'My Love';
  const photos = state.photos;
  const fileInputRef = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      await saveImage(`gallery-${id}`, base64);
      updatePhoto(id, { url: base64 });
    };
    reader.readAsDataURL(file);
  };

  const rotations = ['-rotate-1', 'rotate-1.5', '-rotate-1.5', 'rotate-1'];

  return (
    <section className="py-24 px-4 max-w-5xl mx-auto relative">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-rose-200/25 rounded-full blur-[140px] pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 border border-rose-200/70 text-rose-600 text-xs tracking-widest uppercase font-semibold mb-3 shadow-xs"
        >
          <Sparkles size={13} className="text-amber-400" />
          <span>Keepsakes & Memories</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-3xl sm:text-5xl text-midnight font-normal"
        >
          Moments of{' '}
          <span className="font-script text-4xl sm:text-6xl text-gradient-rose font-bold">
            {name}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-sans text-sm sm:text-base text-midnight/70 font-light mt-3 max-w-md mx-auto"
        >
          Snapshots of your infectious joy, effortless grace, and pure light.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 relative z-10">
        {photos.map((photo, idx) => {
          const rotClass = rotations[idx % rotations.length];
          const isP1 = photo.id === 'p1';
          const isP2 = photo.id === 'p2';
          const isP3 = photo.id === 'p3';
          const isPermanent = isP1 || isP2 || isP3;
          const permanentImg = isP1 ? radiantLifeImg : isP2 ? unstoppableSpiritImg : isP3 ? coupleMomentsImg : null;
          const currentUrl = permanentImg || photo.url;

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: idx * 0.12 }}
              whileHover={{ scale: 1.03, rotate: 0 }}
              className={`p-4 pb-6 bg-white rounded-[28px] border border-rose-200/80 shadow-[0_16px_40px_-8px_rgba(244,114,182,0.2)] hover:shadow-[0_24px_50px_-8px_rgba(244,114,182,0.32)] transition-all duration-300 flex flex-col group relative ${rotClass}`}
            >
              {/* Cute Washi Tape sticker */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 h-5.5 bg-amber-100/95 border border-amber-200/90 -rotate-2 rounded-xs z-20 pointer-events-none shadow-xs flex items-center justify-center gap-1.5 backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span className="text-[9px] font-sans uppercase tracking-widest text-amber-800/80 font-bold">
                  {isPermanent ? 'forever precious ✨' : 'cherished ✨'}
                </span>
              </div>

              {/* Photo Frame */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-b from-rose-50/70 via-white to-pink-50/70 flex items-center justify-center border border-rose-100/80 shadow-inner">
                {currentUrl ? (
                  <>
                    <img
                      src={currentUrl}
                      alt={photo.caption}
                      className={`w-full h-full object-cover ${
                        isP1
                          ? 'object-[center_28%] brightness-[1.03] contrast-[1.03] saturate-[1.05]'
                          : isP2
                          ? 'object-[center_35%] brightness-[1.03] contrast-[1.03] saturate-[1.05]'
                          : isP3
                          ? 'object-[center_46%] brightness-[1.03] contrast-[1.04] saturate-[1.06]'
                          : ''
                      } group-hover:scale-105 transition-transform duration-700 ease-out`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-950/25 via-transparent to-transparent pointer-events-none" />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-rose-300">
                    <div className="w-16 h-16 rounded-full bg-rose-100/80 flex items-center justify-center mb-3 text-rose-500 shadow-inner">
                      <Heart size={28} className="text-rose-500 fill-rose-400/50" />
                    </div>
                    <span className="font-script text-2xl text-rose-600 font-bold mb-1">
                      {photo.caption}
                    </span>
                    <span className="text-[11px] font-sans text-midnight/50 uppercase tracking-wider font-medium">
                      Tap camera to add photo
                    </span>
                  </div>
                )}

                {/* Upload camera button only for customizable photos without a permanent image */}
                {!isPermanent && (
                  <>
                    <button
                      onClick={() => fileInputRef.current[photo.id]?.click()}
                      className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white/95 text-midnight hover:text-rose-600 hover:scale-110 shadow-md backdrop-blur-md transition-all cursor-pointer border border-rose-200/80"
                      title="Upload Photo"
                      aria-label="Upload photo"
                    >
                      <Camera size={15} />
                    </button>
                    <input
                      ref={(el) => {
                        fileInputRef.current[photo.id] = el;
                      }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpload(photo.id, e)}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              {/* Polaroid bottom caption */}
              <div className="mt-4 px-2 text-center">
                <p className="font-script text-2xl text-gradient-rose font-bold tracking-wide">
                  {photo.caption}
                </p>
                <span className="text-[10px] font-sans text-midnight/50 tracking-widest uppercase block mt-0.5 font-medium">
                  Cherished Memory
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
