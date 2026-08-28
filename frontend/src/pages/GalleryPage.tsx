import React, { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GradientButton } from '../components/common/GradientButton';
import { photoApi, Photo } from '../api/photoApi';
import { eventApi } from '../api/eventApi';
import { useAuth } from '../context/AuthContext';
import { EventDeckCard, EventDeck } from '../components/gallery/EventDeckCard';
import { PhotoMasonryModal } from '../components/gallery/PhotoMasonryModal';

export const GalleryPage: React.FC = () => {
  const { authUser } = useAuth();
  const isAdmin = authUser?.role === 'admin' || authUser?.role === 'organizer';
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [eventsMeta, setEventsMeta] = useState<{ id: string; title: string; date: string; location: string; category: string; bannerImage: string }[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadEventId, setUploadEventId] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<EventDeck | null>(null);

  function loadPhotos() {
    photoApi.list().then(setPhotos);
  }

  useEffect(() => {
    loadPhotos();
    eventApi.list().then((evs: any) =>
      setEventsMeta(evs.map((e: any) => ({ id: e.id, title: e.title, date: e.date, location: e.location, category: e.category, bannerImage: e.bannerImage })))
    );
  }, []);

  function openUpload() {
    setShowUpload(true);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadEventId || files.length === 0) return;
    await photoApi.uploadMultiple(uploadEventId, files);
    setFiles([]);
    setShowUpload(false);
    loadPhotos();
  }

  async function handleDeletePhoto(id: number) {
    if (!confirm('Delete this photo?')) return;
    await photoApi.remove(id);
    loadPhotos();
    setSelectedDeck((prev) => (prev ? { ...prev, photos: prev.photos.filter((p) => p.id !== id) } : prev));
  }

  const decks: EventDeck[] = useMemo(() => {
    const map = new Map<string, EventDeck>();
    photos.forEach((p) => {
      const key = String(p.event_id);
      if (!map.has(key)) {
        const meta = eventsMeta.find((e) => String(e.id) === key);
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
      map.get(key)!.photos.push(p);
    });
    return Array.from(map.values()).sort((a, b) => {
      const aLatest = a.photos[0]?.uploaded_at || '';
      const bLatest = b.photos[0]?.uploaded_at || '';
      return bLatest.localeCompare(aLatest);
    });
  }, [photos, eventsMeta]);

  useEffect(() => {
    if (selectedDeck) {
      const fresh = decks.find((d) => d.eventId === selectedDeck.eventId);
      setSelectedDeck(fresh || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decks]);

  return (
    <div className="space-y-10 max-w-7xl mx-auto" id="gallery-page-container">
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-pink-100 text-[#DB2777] rounded-full border border-pink-200">
          <ImageIcon className="w-3.5 h-3.5 text-[#EC4899]" />
          <span>CAMPUS MOMENTS & ARCHIVES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#18131A] font-outfit">Event Gallery</h1>
        <p className="text-xs sm:text-sm text-[#6B6470]">Real photos from TinkerHub SBCE events, organized by event.</p>
        {isAdmin && (
          <GradientButton size="sm" onClick={openUpload}>
            <Upload className="w-4 h-4" /> Upload Photo
          </GradientButton>
        )}
      </div>

      {showUpload && (
        <GlassCard className="max-w-md mx-auto p-4 space-y-3">
          <form onSubmit={handleUpload} className="space-y-3">
            <select value={uploadEventId} onChange={(e) => setUploadEventId(e.target.value)} required className="w-full px-3 py-2 border border-[#F3DCE8] rounded-xl text-xs">
              <option value="">Select event...</option>
              {eventsMeta.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
              required
              className="w-full text-xs"
            />
            {files.length > 0 && (
              <p className="text-[11px] text-[#6B6470]">{files.length} photo{files.length !== 1 ? 's' : ''} selected</p>
            )}
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => { setShowUpload(false); setFiles([]); }} className="px-3 py-2 text-xs font-bold text-[#6B6470] cursor-pointer">Cancel</button>
              <GradientButton type="submit" size="sm">Upload {files.length > 1 ? `(${files.length})` : ''}</GradientButton>
            </div>
          </form>
        </GlassCard>
      )}

      {decks.length === 0 ? (
        <p className="text-center text-xs text-[#6B6470] py-16">No photos uploaded yet.</p>
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
        isAdmin={isAdmin}
        onClose={() => setSelectedDeck(null)}
        onSelectDeck={setSelectedDeck}
        onDeletePhoto={handleDeletePhoto}
      />
    </div>
  );
};
