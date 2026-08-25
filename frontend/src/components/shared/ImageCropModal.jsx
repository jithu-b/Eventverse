import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage.js";
import "./ImageCropModal.css";

/**
 * Reusable image crop modal.
 *
 * Props:
 *  - imageSrc: object URL or data URL of the source image
 *  - aspect: crop aspect ratio, e.g. 1 for square, 4/5 for portrait (default 1)
 *  - fileName: name to give the resulting File (default "cropped.jpg")
 *  - onCancel: () => void
 *  - onComplete: (file) => void   // called with the cropped File
 */
export default function ImageCropModal({
  imageSrc,
  aspect = 1,
  fileName = "cropped.jpg",
  onCancel,
  onComplete,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleCropComplete = useCallback((_croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const file = await getCroppedImg(imageSrc, croppedAreaPixels, fileName);
      onComplete(file);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="crop-modal-overlay" onClick={onCancel}>
      <div className="crop-modal-panel" onClick={(e) => e.stopPropagation()}>
        <h3 className="crop-modal-title">Position your photo</h3>
        <p className="crop-modal-hint">Drag to reposition, use the slider to zoom.</p>

        <div className="crop-modal-stage">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="crop-modal-zoom-row">
          <span>Zoom</span>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="crop-modal-zoom-slider"
          />
        </div>

        <div className="crop-modal-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Crop"}
          </button>
        </div>
      </div>
    </div>
  );
}
