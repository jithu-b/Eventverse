import "./EventForm.css";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventApi } from "../../api/eventApi.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import BannerCropper from "../../components/shared/BannerCropper.jsx";
import "./Events.css";

const emptyForm = {
  title: "",
  description: "",
  start_time: "",
  end_time: "",
  registration_limit: 50,
  quiz_enabled: false,
  certificate_enabled: false,
};

export default function EventForm() {
  const { eventId: id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [rawImageSrc, setRawImageSrc] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isEdit) return;
    eventApi.getById(id).then((res) => {
      const ev = res.data.event;
      setForm({
        title: ev.title,
        description: ev.description,
        start_time: ev.start_time,
        end_time: ev.end_time,
        registration_limit: ev.registration_limit,
        quiz_enabled: ev.quiz_enabled,
        certificate_enabled: ev.certificate_enabled,
      });
      setBannerPreview(ev.banner_url);
    });
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setRawImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (blob) => {
    const croppedFile = new File([blob], "banner.png", { type: "image/png" });
    setBanner(croppedFile);
    setBannerPreview(URL.createObjectURL(blob));
    setRawImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropCancel = () => {
    setRawImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (banner) formData.append("banner", banner);

    try {
      const res = isEdit ? await eventApi.update(id, formData) : await eventApi.create(formData);
      navigate(`/events/${res.data.event.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container stagger-down" style={{ maxWidth: 700, margin: "0 auto" }}>
      <div className="section-title">
        <h2>{isEdit ? "Edit Event" : "Create New Event"}</h2>
        <p>Fill in the details below — you can enable the quiz any time.</p>
      </div>

      <Card>
          {error && <div className="auth-error-banner mb-4">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div>
              <label className="input-label">Banner image</label>
              <div className="event-banner-upload mt-2">
                {bannerPreview && (
                  <img src={bannerPreview} alt="Banner preview" className="event-banner-preview" />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                />
              </div>
            </div>

            <Input label="Event title" name="title" value={form.title} onChange={handleChange} required />

            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea
                className="event-textarea"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start time"
                type="datetime-local"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
              />
              <Input
                label="End time"
                type="datetime-local"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
              />
            </div>

            <Input
              label="Registration limit"
              type="number"
              name="registration_limit"
              value={form.registration_limit}
              onChange={handleChange}
              min={1}
            />

            <div className="event-toggle-group">
              <ToggleRow
                label="Enable Quiz"
                name="quiz_enabled"
                checked={form.quiz_enabled}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" fullWidth loading={loading}>
              {isEdit ? "Save Changes" : "Create Event"}
            </Button>
          </form>
      </Card>

      {rawImageSrc && (
        <BannerCropper
          imageSrc={rawImageSrc}
          onCancel={handleCropCancel}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}

function ToggleRow({ label, name, checked, onChange }) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <span className={`toggle-switch ${checked ? "is-on" : ""}`}>
        <input type="checkbox" name={name} checked={checked} onChange={onChange} />
        <span className="toggle-knob" />
      </span>
    </label>
  );
}
