import React, { useState } from 'react';
import { PlusCircle, ImagePlus, Trash2, Plus } from 'lucide-react';
import { EventItem, RegistrationField } from '../../types';
import { Modal } from '../common/Modal';
import { GradientButton } from '../common/GradientButton';
import { eventApi } from '../../api/eventApi';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (event: EventItem) => void;
}

const inputClass =
  'w-full px-3.5 py-2.5 bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none text-xs sm:text-sm';

const FIELD_TYPES: { value: RegistrationField['type']; label: string }[] = [
  { value: 'short_text', label: 'Short answer' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'multiple_choice', label: 'Multiple choice' },
  { value: 'checkboxes', label: 'Checkboxes' },
  { value: 'dropdown', label: 'Dropdown' },
];

function newField(): RegistrationField {
  return {
    id: crypto.randomUUID(),
    label: '',
    type: 'short_text',
    required: false,
    options: [],
  };
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Workshops' | 'Hackathons' | 'Competitions' | 'Tech Talks' | 'Social'>('Workshops');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalSpots, setTotalSpots] = useState(100);
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<RegistrationField[]>([]);
  const [whatsappLink, setWhatsappLink] = useState('');

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setBanner(file);
    setBannerPreview(file ? URL.createObjectURL(file) : null);
  }

  function addField() {
    setFields((prev) => [...prev, newField()]);
  }

  function removeField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }

  function updateField(id: string, patch: Partial<RegistrationField>) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  function addOption(id: string) {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, options: [...(f.options || []), ''] } : f))
    );
  }

  function updateOption(id: string, idx: number, value: string) {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, options: (f.options || []).map((o, i) => (i === idx ? value : o)) }
          : f
      )
    );
  }

  function removeOption(id: string, idx: number) {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, options: (f.options || []).filter((_, i) => i !== idx) } : f
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      let bannerUrl: string | undefined;
      if (banner) {
        bannerUrl = await eventApi.uploadBanner(banner);
      }

      const created = await eventApi.create({
        title,
        description,
        category,
        location,
        start_time: startTime || null,
        end_time: endTime || null,
        registration_limit: totalSpots,
        banner_url: bannerUrl,
        thumbnail_url: bannerUrl,
        is_active: true,
        registration_fields: fields,
        whatsapp_link: whatsappLink || undefined,
      });
      onCreated(created);
      onClose();
    } catch (err: any) {
      console.error('Create event error:', err);
      setError(err?.message || 'Failed to create event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-[#EC4899]" />
          <span>Create New Campus Event</span>
        </div>
      }
      subtitle="Publish a workshop, hackathon, competition, or tech talk for TinkerHub SBCE"
      maxWidth="2xl"
      id="create-event-modal"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {error && (
          <div className="px-3 py-2 rounded-xl bg-[#FFF1F7] border border-[#F3DCE8] text-[#DB2777] text-xs font-semibold">
            {error}
          </div>
        )}

        <div>
          <label className="block font-bold text-[#18131A] mb-1">Event Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Next.js & Server Components Deep Dive"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#18131A] mb-1">Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as any)} className={inputClass}>
              <option value="Workshops">Workshops</option>
              <option value="Hackathons">Hackathons</option>
              <option value="Competitions">Competitions</option>
              <option value="Tech Talks">Tech Talks</option>
              <option value="Social">Social</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-[#18131A] mb-1">Total Spots *</label>
            <input
              type="number"
              required
              min={1}
              value={totalSpots}
              onChange={(e) => setTotalSpots(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#18131A] mb-1">Start Date & Time *</label>
            <input
              type="datetime-local"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block font-bold text-[#18131A] mb-1">End Date & Time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-[#18131A] mb-1">Venue / Location *</label>
          <input
            type="text"
            required
            placeholder="e.g. SBCE Main Seminar Hall"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block font-bold text-[#18131A] mb-1">Short Description *</label>
          <textarea
            rows={2}
            required
            placeholder="Brief overview for the event cards..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className="block font-bold text-[#18131A] mb-1.5">Event Banner</label>
          <label className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-dashed border-[#F3DCE8] hover:border-[#EC4899] rounded-xl cursor-pointer text-[#6B6470] text-xs sm:text-sm transition-colors">
            <ImagePlus className="w-4 h-4" />
            {banner ? banner.name : 'Choose a banner image'}
            <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
          </label>
          {bannerPreview && (
            <img src={bannerPreview} alt="Banner preview" className="mt-2 w-full h-32 object-cover rounded-xl" />
          )}
        </div>

        <div>
          <label className="block font-bold text-[#18131A] mb-1">WhatsApp Group Link (optional)</label>
          <input
            type="url"
            placeholder="https://chat.whatsapp.com/..."
            value={whatsappLink}
            onChange={(e) => setWhatsappLink(e.target.value)}
            className={inputClass}
          />
          <p className="text-[11px] text-[#6B6470] mt-1">
            Shown to participants right after they complete registration.
          </p>
        </div>

        <div className="pt-3 border-t border-[#F3DCE8]">
          <div className="flex items-center justify-between mb-2">
            <label className="block font-bold text-[#18131A]">Registration Form Questions</label>
            <button
              type="button"
              onClick={addField}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-[#DB2777] bg-[#FFF1F7] hover:bg-pink-100 rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Question
            </button>
          </div>
          <p className="text-[11px] text-[#6B6470] mb-3">
            Name and email are always collected. Add extra questions here if you need more for this event.
          </p>

          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.id} className="p-3 bg-white border border-[#F3DCE8] rounded-xl space-y-2">
                <div className="flex items-start gap-2">
                  <input
                    type="text"
                    placeholder="Question label (e.g. T-shirt size)"
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => removeField(field.id)}
                    className="p-2.5 text-[#6B6470] hover:text-[#DB2777] cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={field.type}
                    onChange={(e) => updateField(field.id, { type: e.target.value as RegistrationField['type'] })}
                    className={`${inputClass} w-auto`}
                  >
                    {FIELD_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#18131A] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    />
                    Required
                  </label>
                </div>

                {(field.type === 'multiple_choice' || field.type === 'checkboxes' || field.type === 'dropdown') && (
                  <div className="space-y-1.5 pl-1">
                    {(field.options || []).map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={`Option ${idx + 1}`}
                          value={opt}
                          onChange={(e) => updateOption(field.id, idx, e.target.value)}
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(field.id, idx)}
                          className="p-2 text-[#6B6470] hover:text-[#DB2777] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(field.id)}
                      className="text-[11px] font-bold text-[#DB2777] hover:underline cursor-pointer"
                    >
                      + Add option
                    </button>
                  </div>
                )}
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-[11px] text-[#6B6470] italic">No extra questions yet -- click "Add Question" to add one.</p>
            )}
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#F3DCE8]">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-[#6B6470] hover:text-[#18131A] cursor-pointer">
            Cancel
          </button>
          <GradientButton type="submit" size="md" disabled={submitting}>
            {submitting ? 'Publishing...' : 'Publish Event'}
          </GradientButton>
        </div>
      </form>
    </Modal>
  );
};
