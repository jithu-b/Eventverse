import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { certificateApi } from "../../api/certificateApi.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Certificate.css";

export default function CertificateView() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    certificateApi
      .getById(id)
      .then((res) => setCertificate(res.data.certificate))
      .catch(() => setError("Certificate not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await certificateApi.download(id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download certificate.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Loader fullScreen label="Loading certificate..." />;
  if (error) {
    return (
      <div className="page container">
        <div className="events-empty glass-panel">{error}</div>
      </div>
    );
  }
  if (!certificate) return null;

  return (
    <div className="page container certificate-page">
      <div className="certificate-frame glass-panel animate-scale-in">
        <div className="certificate-inner">
          <span className="brand-mark certificate-mark" />
          <p className="certificate-eyebrow">Certificate of Participation</p>
          <h1 className="certificate-name">{certificate.user_name}</h1>
          <p className="certificate-body">
            has successfully participated in
          </p>
          <h2 className="certificate-event">{certificate.event_title}</h2>
          <p className="certificate-date">
            Issued on {new Date(certificate.issued_at).toLocaleDateString()}
          </p>

          <div className="certificate-seal">
            <SealIcon />
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center mt-6">
        <Button onClick={handleDownload} loading={downloading}>
          Download PDF
        </Button>
        <Link to={`/events/${certificate.event_id}`} className="btn btn-outline">
          Back to Event
        </Link>
      </div>
    </div>
  );
}

function SealIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="5" />
      <path d="M8.5 12.5L7 22l5-3 5 3-1.5-9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}