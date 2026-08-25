import { useRef, useState, useEffect, useCallback } from "react";
import "./BannerCropper.css";

const ASPECT_RATIO = 3; // width:height, e.g. 3:1 wide banner
const OUTPUT_WIDTH = 1200;
const OUTPUT_HEIGHT = Math.round(OUTPUT_WIDTH / ASPECT_RATIO);

/**
 * Simple dependency-free image cropper.
 * Props:
 *  - imageSrc: data URL of the picked file
 *  - onCancel: () => void
 *  - onCropComplete: (blob) => void   // cropped image as a PNG Blob
 */
export default function BannerCropper({ imageSrc, onCancel, onCropComplete }) {
  const frameRef = useRef(null);
  const imgRef = useRef(null);

  const [frameSize, setFrameSize] = useState({ w: 0, h: 0 });
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [baseScale, setBaseScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragState = useRef(null);

  // measure the crop frame once it's in the DOM
  useEffect(() => {
    if (frameRef.current) {
      const rect = frameRef.current.getBoundingClientRect();
      setFrameSize({ w: rect.width, h: rect.height });
    }
  }, []);

  const handleImageLoad = () => {
    const img = imgRef.current;
    const frame = frameRef.current;
    if (!img || !frame) return;
    const rect = frame.getBoundingClientRect();
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const scale = Math.max(rect.width / naturalW, rect.height / naturalH);
    setFrameSize({ w: rect.width, h: rect.height });
    setNatural({ w: naturalW, h: naturalH });
    setBaseScale(scale);
    // center the image initially
    const dispW = naturalW * scale;
    const dispH = naturalH * scale;
    setPos({ x: (rect.width - dispW) / 2, y: (rect.height - dispH) / 2 });
    setZoom(1);
  };

  const clampPos = useCallback(
    (x, y, currentZoom) => {
      const dispW = natural.w * baseScale * currentZoom;
      const dispH = natural.h * baseScale * currentZoom;
      const minX = Math.min(0, frameSize.w - dispW);
      const minY = Math.min(0, frameSize.h - dispH);
      return {
        x: Math.min(0, Math.max(minX, x)),
        y: Math.min(0, Math.max(minY, y)),
      };
    },
    [natural, baseScale, frameSize]
  );

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
  };

  const handlePointerMove = (e) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    const next = clampPos(dragState.current.origX + dx, dragState.current.origY + dy, zoom);
    setPos(next);
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  const handleZoomChange = (e) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
    setPos((prev) => clampPos(prev.x, prev.y, newZoom));
  };

  const handleConfirm = () => {
    const img = imgRef.current;
    if (!img || natural.w === 0) return;

    const dispW = natural.w * baseScale * zoom;
    const naturalScale = natural.w / dispW;

    const sourceX = -pos.x * naturalScale;
    const sourceY = -pos.y * naturalScale;
    const sourceWidth = frameSize.w * naturalScale;
    const sourceHeight = frameSize.h * naturalScale;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_WIDTH;
    canvas.height = OUTPUT_HEIGHT;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      OUTPUT_WIDTH,
      OUTPUT_HEIGHT
    );

    canvas.toBlob((blob) => {
      if (blob) onCropComplete(blob);
    }, "image/png");
  };

  return (
    <div className="cropper-overlay" onClick={onCancel}>
      <div className="cropper-panel glass-strong" onClick={(e) => e.stopPropagation()}>
        <h3 className="cropper-title">Position your banner</h3>
        <p className="cropper-hint">Drag to reposition, use the slider to zoom.</p>

        <div
          className="cropper-frame"
          ref={frameRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Crop preview"
            className="cropper-image"
            onLoad={handleImageLoad}
            draggable={false}
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
              width: natural.w * baseScale,
              height: natural.h * baseScale,
            }}
          />
        </div>

        <div className="cropper-zoom-row">
          <span>Zoom</span>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={handleZoomChange}
            className="cropper-zoom-slider"
          />
        </div>

        <div className="cropper-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleConfirm}>
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}
