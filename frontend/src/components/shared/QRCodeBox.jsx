import { QRCodeCanvas } from "qrcode.react";
import "./QRCodeBox.css";

/**
 * Displays a scannable QR code for event registration/attendance,
 * with a download button.
 *
 * value: the encoded string (e.g. `${eventId}:${qrSecret}`)
 */
export default function QRCodeBox({ value, label = "Scan to check in", size = 200 }) {
  const handleDownload = () => {
    const canvas = document.getElementById("event-qr-canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "eventverse-qr.png";
    link.click();
  };

  return (
    <div className="qr-box glass-panel">
      <div className="qr-canvas-wrapper">
        <QRCodeCanvas
          id="event-qr-canvas"
          value={value || "eventverse"}
          size={size}
          bgColor="transparent"
          fgColor="var(--text-primary)"
          level="H"
          includeMargin
        />
      </div>
      <p className="qr-label">{label}</p>
      <button className="btn btn-outline btn-sm" onClick={handleDownload}>
        Download QR
      </button>
    </div>
  );
}