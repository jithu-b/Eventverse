import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import "./QRCodeBox.css";

export default function QRCodeBox({ value, size = 220, label }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, { width: size, margin: 1 }, (err) => {
        if (err) console.error("QR render error:", err);
      });
    }
  }, [value, size]);

  return (
    <div className="qr-box glass-panel">
      <canvas ref={canvasRef} />
      {label && <p className="qr-label">{label}</p>}
    </div>
  );
}
