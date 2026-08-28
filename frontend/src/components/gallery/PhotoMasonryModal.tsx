import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Layers, ArrowLeft, ArrowRight, Trash2, Maximize2 } from 'lucide-react';
import { mediaUrl, Photo } from '../../api/photoApi';
import { EventDeck } from './EventDeckCard';

interface PhotoMasonryModalProps {
  deck: EventDeck | null;
  allDecks: EventDeck[];
  isOpen: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onSelectDeck: (deck: EventDeck) => void;
  onDeletePhoto: (photoId: number) => void;
}

export const PhotoMasonryModal: React.FC<PhotoMasonryModalProps> = ({
  deck,
  allDecks,
  isOpen,
  isAdmin,
  onClose,
  onSelectDeck,
  onDeletePhoto,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null);
        else onClose();
      }
      if (lightboxIndex !== null && deck) {
        if (e.key === 'ArrowRight') setLightboxIndex((i) => (i === null ? null : (i + 1) % deck.photos.length));
        if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i === null ? null : (i - 1 + deck.photos.length) % deck.photos.length));
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, lightboxIndex, deck, onClose]);

  useEffect(() => {
    setLightboxIndex(null);
  }, [deck?.eventId]);

  if (!isOpen || !deck) return null;

  const currentIdx = allDecks.findIndex((d) => d.eventId === deck.eventId);
  const prevDeck = currentIdx > 0 ? allDecks[currentIdx - 1] : allDecks[allDecks.length - 1];
  const nextDeck = currentIdx < allDecks.length - 1 ? allDecks[currentIdx + 1] : allDecks[0];

  const lightboxPhoto = lightboxIndex !== null ? deck.photos[lightboxIndex] : null;

  return (
    <AnimatePresence>
      <motion.div
        id={`event-gallery-modal-${deck.eventId}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-[#FFF8FC] overflow-y-auto min-h-screen"
      >
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-10 py-4 bg-white/90 backdrop-blur-xl border-b border-[#F3DCE8]">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-pink-50 hover:bg-[#EC4899] hover:text-white text-[#DB2777] transition-all border border-pink-200 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Events</span>
          </button>

          <span className="hidden sm:block text-xs font-bold text-[#18131A] truncate max-w-sm">{deck.title}</span>

          <button
            id="event-modal-close-button"
            onClick={onClose}
            className="p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-[#DB2777] border border-pink-200 transition-colors cursor-pointer"
            aria-label="Close gallery"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <section className="relative w-full min-h-[280px] md:min-h-[340px] flex items-end pb-8 pt-16 px-4 md:px-10 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {deck.photos[0] && (
              <img src={mediaUrl(deck.photos[0].photo_url)} alt="" className="w-full h-full object-cover filter brightness-[0.75] scale-105" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8FC] via-[#FFF8FC]/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#18131A]/35 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-6xl mx-auto space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {deck.category && (
                <span className="px-3 py-1 rounded-full font-bold tracking-widest uppercase bg-white/20 text-white border border-white/30 text-[10px] backdrop-blur-md">
                  {deck.category}
                </span>
              )}
              {deck.date && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  {deck.date}
                </span>
              )}
              {deck.location && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 text-xs">
                  <MapPin className="w-3.5 h-3.5" />
                  {deck.location}
                </span>
              )}
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 text-xs">
                <Layers className="w-3.5 h-3.5" />
                {deck.photos.length} Photos
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-outfit drop-shadow-lg">{deck.title}</h1>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-4 md:px-10 py-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {deck.photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.5) }}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-white border border-[#F3DCE8] hover:border-[#EC4899]/40 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setLightboxIndex(index)}
              >
                <img
                  src={mediaUrl(photo.photo_url)}
                  alt={photo.caption || deck.title}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="p-1.5 rounded-full bg-black/50 backdrop-blur-md text-white">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
                {photo.caption && (
                  <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-xs text-white font-medium line-clamp-2">{photo.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </main>

        <footer className="border-t border-[#F3DCE8] bg-white py-10 px-4 md:px-10 mt-8">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => { onSelectDeck(prevDeck); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-pink-50/60 hover:bg-pink-100 border border-[#F3DCE8] transition-all text-left group w-full sm:w-auto cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#EC4899]" />
              <div>
                <div className="text-[10px] font-bold text-[#6B6470] uppercase">Previous</div>
                <div className="text-sm font-bold text-[#18131A]">{prevDeck.title}</div>
              </div>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-pink-100 hover:bg-[#EC4899] hover:text-white text-xs font-bold text-[#DB2777] border border-pink-200 transition-colors cursor-pointer"
            >
              Back to All Events
            </button>
            <button
              onClick={() => { onSelectDeck(nextDeck); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-pink-50/60 hover:bg-pink-100 border border-[#F3DCE8] transition-all text-right group w-full sm:w-auto sm:flex-row-reverse cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 text-[#EC4899]" />
              <div>
                <div className="text-[10px] font-bold text-[#6B6470] uppercase">Next</div>
                <div className="text-sm font-bold text-[#18131A]">{nextDeck.title}</div>
              </div>
            </button>
          </div>
        </footer>

        {lightboxPhoto && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-5 right-5 z-10 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            {isAdmin && (
              <button
                onClick={() => { onDeletePhoto(lightboxPhoto.id); setLightboxIndex(null); }}
                className="absolute top-5 left-5 z-10 p-2.5 bg-white/10 hover:bg-red-600 text-white rounded-full cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            {deck.photos.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex((lightboxIndex! - 1 + deck.photos.length) % deck.photos.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setLightboxIndex((lightboxIndex! + 1) % deck.photos.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full cursor-pointer"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div className="max-w-4xl w-full">
              <img src={mediaUrl(lightboxPhoto.photo_url)} alt={lightboxPhoto.caption || deck.title} className="w-full max-h-[75vh] object-contain rounded-2xl" />
              {lightboxPhoto.caption && (
                <p className="text-center text-white/80 text-sm mt-4">{lightboxPhoto.caption}</p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
