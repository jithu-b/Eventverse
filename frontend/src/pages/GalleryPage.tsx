import React, { useMemo, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { EventDeckCard, EventDeck } from '../components/gallery/EventDeckCard';
import { PhotoMasonryModal } from '../components/gallery/PhotoMasonryModal';
import { STATIC_GALLERY } from '../data/staticGallery';
import { STATIC_EVENTS } from '../data/staticEvents';

export const GalleryPage: React.FC = () => {
  const [selectedDeck, setSelectedDeck] = useState<EventDeck | null>(null);

  const decks: EventDeck[] = useMemo(() => {
    const map = new Map<string, EventDeck>();
    STATIC_GALLERY.forEach((p) => {
      const key = String(p.event_id);
      if (!map.has(key)) {
        const meta = STATIC_EVENTS.find((e) => String(e.id) === key);
        map.set(key, {
          eventId: key,
          title: p.event_title || meta?.title || 'Untitled Event',
          date: meta?.date || '',
          location: meta?.location || '',
          category: meta?.category || 'Event',
          bannerImage: meta?.bannerImage || '',
          photos: [],
        });
      }
      map.get(key)!.photos.push(p as any);
    });
    return Array.from(map.values());
  }, []);

  return (
    <div className="space-y-10 max-w-7xl mx-auto" id="gallery-page-container">
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-pink-100 text-[#DB2777] rounded-full border border-pink-200">
          <ImageIcon className="w-3.5 h-3.5 text-[#EC4899]" />
          <span>CAMPUS MOMENTS & ARCHIVES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#18131A] font-outfit">Event Gallery</h1>
        <p className="text-xs sm:text-sm text-[#6B6470]">Real photos from TinkerHub SBCE events, organized by event.</p>
      </div>

      {decks.length === 0 ? (
        <p className="text-center text-xs text-[#6B6470] py-16">No photos yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pb-10">
          {decks.map((deck, index) => (
            <EventDeckCard key={deck.eventId} deck={deck} index={index} onSelect={setSelectedDeck} />
          ))}
        </div>
      )}

      <PhotoMasonryModal
        deck={selectedDeck}
        allDecks={decks}
        isOpen={selectedDeck !== null}
        isAdmin={false}
        onClose={() => setSelectedDeck(null)}
        onSelectDeck={setSelectedDeck}
        onDeletePhoto={() => {}}
      />
    </div>
  );
};
