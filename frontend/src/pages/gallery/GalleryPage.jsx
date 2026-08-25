import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { photoApi } from "../../api/photoApi.js";
import { eventApi } from "../../api/eventApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Gallery.css";

export default function GalleryPage() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showUpload, setShowUpload] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState("");

  const canUpload = user?.role === "organizer" || user?.role === "admin";

  function loadPhotos() {
    setLoading(true);
    photoApi
      .list()
      .then((res) => setPhotos(res.data.photos || []))
      .catch((err) => console.error("Failed to load photos:", err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  function openUploadPanel() {
    setShowUpload(true);
    if (events.length === 0) {
      setEventsLoading(true);
      eventApi
        .list()
        .then((res) => setEvents(res.data.events || []))
        .catch((err) => console.error("Failed to load events:", err))
        .finally(() => setEventsLoading(false));
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!selectedEventId || files.length === 0) return;
    setUploading(true);
    setError("");
    setProgress({ done: 0, total: files.length });

    let failCount = 0;
    for (let i = 0; i < files.length; i++) {
      try {
        const formData = new FormData();
        formData.append("event_id", selectedEventId);
        formData.append("photo", files[i]);
        if (caption) formData.append("caption", caption);
        await photoApi.upload(formData);
      } catch (err) {
        failCount += 1;
      }
      setProgress({ done: i + 1, total: files.length });
    }

    if (failCount > 0) {
      setError(`${failCount} of ${files.length} photo(s) failed to upload.`);
    }
    setFiles([]);
    setCaption("");
    setUploading(false);
    loadPhotos();
  }

  const eventGroups = photos.reduce((acc, p) => {
    if (!acc[p.event_id]) acc[p.event_id] = { title: p.event_title, photos: [] };
    acc[p.event_id].photos.push(p);
    return acc;
  }, {});

  if (loading) return <Loader fullScreen />;

  return (
    <div className="gallery-page stagger-down">
      <div className="gallery-page-header">
        <h1>Event Gallery</h1>
        {canUpload && !showUpload && (
          <Button variant="primary" onClick={openUploadPanel}>
            Upload Photos
          </Button>
        )}
      </div>

      {canUpload && showUpload && (
        <Card className="gallery-upload-card">
          <form onSubmit={handleUpload} className="gallery-upload-form">
            <select
              className="gallery-event-select"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              <option value="">
                {eventsLoading ? "Loading events…" : "Select an event…"}
              </option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
            <label className="gallery-file-input-label">
              📷 Choose Files
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                multiple
                className="gallery-file-input-hidden"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </label>
            <input
              type="text"
              placeholder="Caption for all photos (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="gallery-caption-input"
            />
            <Button
              type="submit"
              variant="primary"
              loading={uploading}
              disabled={!selectedEventId || files.length === 0}
            >
              {files.length > 1 ? `Upload ${files.length} Photos` : "Upload"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowUpload(false)}>
              Cancel
            </Button>
          </form>
          {files.length > 0 && !uploading && (
            <p className="gallery-upload-hint">{files.length} file(s) selected</p>
          )}
          {uploading && (
            <p className="gallery-upload-hint">
              Uploading {progress.done} of {progress.total}…
            </p>
          )}
          {error && <p className="gallery-upload-error">{error}</p>}
        </Card>
      )}

      {photos.length === 0 ? (
        <p className="gallery-empty">No photos uploaded yet. Check back soon!</p>
      ) : (
        <div className="gallery-carousel-track">
          {[...photos, ...photos].map((p, idx) => (
            <div className="gallery-carousel-item" key={`${p.id}-${idx}`}>
              <img src={p.photo_url} alt={p.caption || p.event_title} />
              <span className="gallery-carousel-caption">{p.event_title}</span>
            </div>
          ))}
        </div>
      )}

      <h2 className="gallery-section-heading">Browse by Event</h2>
      <div className="gallery-event-grid">
        {Object.entries(eventGroups).map(([eventId, group]) => (
          <Link to={`/gallery/event/${eventId}`} key={eventId} className="gallery-event-card">
            <img src={group.photos[0].photo_url} alt={group.title} />
            <div className="gallery-event-card-body">
              <h3>{group.title}</h3>
              <p>{group.photos.length} photo{group.photos.length !== 1 ? "s" : ""}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
