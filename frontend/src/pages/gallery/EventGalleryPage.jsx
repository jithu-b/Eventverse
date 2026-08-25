import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { photoApi } from "../../api/photoApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Gallery.css";

export default function EventGalleryPage() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState("");

  const canUpload = user?.role === "organizer" || user?.role === "admin";

  function loadPhotos() {
    setLoading(true);
    photoApi
      .list(eventId)
      .then((res) => setPhotos(res.data.photos || []))
      .catch((err) => console.error("Failed to load photos:", err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadPhotos();
  }, [eventId]);

  async function handleUpload(e) {
    e.preventDefault();
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    setProgress({ done: 0, total: files.length });

    let failCount = 0;
    for (let i = 0; i < files.length; i++) {
      try {
        const formData = new FormData();
        formData.append("event_id", eventId);
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

  async function handleDelete(photoId) {
    try {
      await photoApi.remove(photoId);
      loadPhotos();
    } catch (err) {
      console.error("Failed to delete photo:", err);
    }
  }

  if (loading) return <Loader fullScreen />;

  const eventTitle = photos[0]?.event_title || "Event";

  return (
    <div className="gallery-page stagger-down">
      <Link to="/gallery" className="gallery-back-link">← All events</Link>
      <h1>{eventTitle} — Gallery</h1>

      {canUpload && (
        <Card className="gallery-upload-card">
          <form onSubmit={handleUpload} className="gallery-upload-form">
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
            <Button type="submit" variant="primary" loading={uploading} disabled={files.length === 0}>
              {files.length > 1 ? `Upload ${files.length} Photos` : "Upload Photo"}
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
        <p className="gallery-empty">No photos for this event yet.</p>
      ) : (
        <div className="gallery-event-photo-grid">
          {photos.map((p) => (
            <div className="gallery-photo-item" key={p.id}>
              <img src={p.photo_url} alt={p.caption || eventTitle} />
              {p.caption && <p className="gallery-photo-caption">{p.caption}</p>}
              {canUpload && (
                <button className="gallery-photo-delete" onClick={() => handleDelete(p.id)}>
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
