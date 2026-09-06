import React, { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon, Plus, X } from 'lucide-react';
import { EventDeckCard, EventDeck } from '../components/gallery/EventDeckCard';
import { PhotoMasonryModal } from '../components/gallery/PhotoMasonryModal';
import { photoApi } from '../api/photoApi';
import { eventApi, EventItem } from '../api/eventApi';
import { useAuth } from '../context/AuthContext';

export const GalleryPage: React.FC = () => {
  const { authUser } = useAuth();
  const isAdmin = authUser?.role === 'admin';

  const [photos, setPhotos] = useState<Awaited<ReturnType<typeof photoApi.list>>>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<EventDeck | null>(null);

  const [showUpload, setShowUpload] = useState(false);
  const [uploadEventId, setUploadEventId] = useState('');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const loadPhotos = () => {
    photoApi.list().then(setPhotos);
  };

  useEffect(() => {
    loadPhotos();
    eventApi.list().then(setEvents);
  }, []);

  const decks: EventDeck[] = useMemo(() => {
    const map = new Map<string, EventDeck>();
    photos.forEach((p) => {
      const key = String(p.event_id);
      if (!map.has(key)) {
        const meta = events.find((e) => String(e.id) === key);
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
    return Array.from(map.values());
  }, [photos, events]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadEventId || uploadFiles.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < uploadFiles.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${uploadFiles.length}...`);
        await photoApi.upload(uploadEventId, uploadFiles[i], uploadCaption || undefined);
      }
      setUploadFiles([]);
      setUploadCaption('');
      setShowUpload(false);
      loadPhotos();
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    await photoApi.remove(photoId);
    loadPhotos();
    setSelectedDeck(null);
  };

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
          <button
            onClick={() => setShowUpload((v) => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-pink-600 text-white text-xs font-bold shadow-md hover:bg-pink-700 transition-colors"
          >
            {showUpload ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showUpload ? 'Cancel' : 'Add Photos'}
          </button>
        )}
      </div>

      {isAdmin && showUpload && (
        <form onSubmit={handleUpload} className="max-w-md mx-auto bg-white border border-[#F3DCE8] rounded-2xl p-5 space-y-3">
          <select
            value={uploadEventId}
            onChange={(e) => setUploadEventId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[#F3DCE8] rounded-xl text-xs"
          >
            <option value="">Select an event...</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
            className="w-full text-xs"
          />
          <input
            type="text"
            placeholder="Caption (optional, applies to all)"
            value={uploadCaption}
            onChange={(e) => setUploadCaption(e.target.value)}
            className="w-full px-3 py-2 border border-[#F3DCE8] rounded-xl text-xs"
          />
          {uploadProgress && <p className="text-xs text-[#DB2777] font-semibold">{uploadProgress}</p>}
          <button
            type="submit"
            disabled={uploading || !uploadEventId || uploadFiles.length === 0}
            className="w-full py-2.5 rounded-xl bg-pink-600 text-white text-xs font-bold disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : `Upload ${uploadFiles.length || ''} Photo${uploadFiles.length === 1 ? '' : 's'}`}
          </button>
        </form>
      )}

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
        isAdmin={isAdmin}
        onClose={() => setSelectedDeck(null)}
        onSelectDeck={setSelectedDeck}
        onDeletePhoto={handleDeletePhoto}
      />
    </div>
  );
};
