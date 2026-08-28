import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Layers, MapPin, ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import { mediaUrl, Photo } from '../../api/photoApi';

export interface EventDeck {
  eventId: string;
  title: string;
  date: string;
  location: string;
  category: string;
  bannerImage?: string;
  photos: Photo[];
}

interface EventDeckCardProps {
  deck: EventDeck;
  index: number;
  onSelect: (deck: EventDeck) => void;
}

export const EventDeckCard: React.FC<EventDeckCardProps> = ({ deck, index, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-7, 7]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  }, [mouseX, mouseY]);

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const totalPhotos = deck.photos.length;
  const stackUrls = deck.photos.slice(0, 4).map((p) => mediaUrl(p.photo_url));
  const cover = stackUrls[0];
  const behind = stackUrls.slice(1);

  const layerConfigs = [
    { baseRotate: -6, baseX: -10, baseY: 10, hoverRotate: -13, hoverX: -24, hoverY: 12, scale: 0.92, opacity: 0.7, zIndex: 10 },
    { baseRotate: 5, baseX: 8, baseY: 6, hoverRotate: 11, hoverX: 20, hoverY: 8, scale: 0.95, opacity: 0.85, zIndex: 20 },
    { baseRotate: -2.5, baseX: -4, baseY: 3, hoverRotate: -5, hoverX: -10, hoverY: -6, scale: 0.98, opacity: 0.95, zIndex: 30 },
  ];

  return (
    <motion.div
      id={`event-deck-card-${deck.eventId}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.5), ease: [0.22, 1, 0.36, 1] }}
      className="group relative cursor-pointer select-none"
      onClick={() => onSelect(deck)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(deck); } }}
      aria-label={`Open gallery for ${deck.title}, ${totalPhotos} photos`}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        animate={{ y: isHovered ? -8 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className="relative w-full rounded-2xl p-4 md:p-5 bg-white/90 backdrop-blur-xl border border-[#F3DCE8] hover:border-[#EC4899]/50 shadow-lg hover:shadow-[0_25px_60px_-20px_rgba(236,72,153,0.35)] transition-all duration-500"
      >
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-pink-400/15 via-purple-300/10 to-pink-200/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />

        <div className="relative w-full aspect-[4/3] mb-5 flex items-center justify-center">
          <div className={`absolute bottom-1 w-4/5 h-7 bg-pink-900/10 rounded-full blur-xl transition-all duration-500 ${isHovered ? 'scale-110 opacity-80 translate-y-2' : 'scale-95 opacity-40'}`} />

          {behind.map((url, i) => {
            const cfg = layerConfigs[i] || layerConfigs[0];
            return (
              <motion.div
                key={`deck-layer-${i}`}
                style={{ zIndex: cfg.zIndex }}
                animate={{
                  rotate: isHovered ? cfg.hoverRotate : cfg.baseRotate,
                  x: isHovered ? cfg.hoverX : cfg.baseX,
                  y: isHovered ? cfg.hoverY : cfg.baseY,
                  scale: isHovered ? cfg.scale + 0.02 : cfg.scale,
                  opacity: isHovered ? 0.95 : cfg.opacity,
                }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-xl border border-white/60 bg-pink-50 pointer-events-none origin-bottom"
              >
                <img src={url} alt="" loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-transparent to-purple-500/10" />
              </motion.div>
            );
          })}

          <motion.div
            style={{ zIndex: 40 }}
            animate={{ scale: isHovered ? 1.02 : 1 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-full h-full rounded-xl overflow-hidden shadow-xl border border-white/70 bg-pink-50"
          >
            {cover ? (
              <img src={cover} alt={deck.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#DB2777]/40">
                <ImageIcon className="w-10 h-10" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-white/0" />

            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#DB2777] border border-pink-200 shadow-sm tracking-wide">
                <Layers className="w-3 h-3 text-[#EC4899]" />
                {totalPhotos} PHOTO{totalPhotos !== 1 ? 'S' : ''}
              </span>
            </div>

            {deck.category && (
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md text-white border border-white/20">
                  {deck.category}
                </span>
              </div>
            )}

          </motion.div>
        </div>
            <div className="relative rounded-xl overflow-hidden border border-[#F3DCE8] shadow-md mt-4">
              {(deck.bannerImage || cover) && (
                <img src={deck.bannerImage || cover} alt="" className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
              <div className="relative px-3.5 py-3">
                {deck.date && (
                  <p className="text-[10px] uppercase tracking-widest text-pink-100 mb-1 font-bold">{deck.date}</p>
                )}
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-base font-extrabold text-white tracking-tight line-clamp-1 font-outfit drop-shadow-sm">{deck.title}</h4>
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-white bg-white/20 group-hover:bg-[#EC4899] px-2.5 py-1 rounded-full border border-white/25 shrink-0 transition-colors">
                    <span>Open</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

        <div className="space-y-1.5">
          {deck.location && (
            <span className="flex items-center gap-1.5 text-xs text-[#6B6470]">
              <MapPin className="w-3.5 h-3.5 text-[#EC4899]/80 shrink-0" />
              <span className="truncate">{deck.location}</span>
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
