import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { attendanceApi } from "../../api/attendanceApi.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import "./Attendance.css";

const SCANNER_ELEMENT_ID = "qr-reader";

export default function QRScanner() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", message }
  const [manualCode, setManualCode] = useState("");
  const [recentCheckIns, setRecentCheckIns] = useState([]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScanner = async () => {
    setStatus(null);
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;
    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        handleScanSuccess,
        () => {} // ignore per-frame scan errors
      );
      setScanning(true);
    } catch (err) {
      setStatus({ type: "error", message: "Could not access camera. Check permissions." });
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {
        /* already stopped */
      }
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const handleScanSuccess = async (decodedText) => {
    await processCheckIn(decodedText);
  };

  const processCheckIn = async (code) => {
    try {
      const res = await attendanceApi.checkIn(eventId, code);
      setStatus({ type: "success", message: `${res.data.user_name} checked in!` });
      setRecentCheckIns((prev) => [res.data, ...prev].slice(0, 8));
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.error || "Invalid or expired QR code." });
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    processCheckIn(manualCode.trim());
    setManualCode("");
  };

  return (
    <div className="page container attendance-page">
      <div className="section-title text-center">
        <h2>Scan Attendance</h2>
        <p>Point the camera at a participant's QR code to check them in</p>
      </div>

      <div className="attendance-layout">
        <Card className="scanner-card">
          <Card.Body>
            <div id={SCANNER_ELEMENT_ID} className="qr-reader-viewport" />

            {status && (
              <div className={`attendance-status ${status.type === "success" ? "is-success" : "is-error"}`}>
                {status.message}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              {!scanning ? (
                <Button fullWidth onClick={startScanner}>
                  Start Scanning
                </Button>
              ) : (
                <Button fullWidth variant="outline" onClick={stopScanner}>
                  Stop Scanning
                </Button>
              )}
            </div>

            <form className="manual-checkin-form mt-4" onSubmit={handleManualSubmit}>
              <input
                className="event-textarea"
                style={{ resize: "none" }}
                placeholder="Or enter code manually..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
              />
              <Button type="submit" variant="secondary">
                Check In
              </Button>
            </form>
          </Card.Body>
        </Card>

        <Card className="recent-checkins-card">
          <Card.Header>
            <h4>Recent Check-ins</h4>
          </Card.Header>
          <Card.Body>
            {recentCheckIns.length === 0 ? (
              <p className="text-secondary">No check-ins yet this session.</p>
            ) : (
              <ul className="recent-checkins-list">
                {recentCheckIns.map((c, i) => (
                  <li key={i} className="animate-fade-in-up">
                    <span className="checkin-dot" />
                    {c.user_name}
                  </li>
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>
      </div>

      <div className="text-center mt-5">
        <Button variant="ghost" onClick={() => navigate(`/events/${eventId}`)}>
          Back to Event
        </Button>
      </div>
    </div>
  );
}