import React, { useState } from 'react';
import { PlusCircle, ImagePlus } from 'lucide-react';
import { EventItem } from '../../types';
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

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setBanner(file);
    setBannerPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('location', location);
      if (startTime) formData.append('start_time', startTime);
      if (endTime) formData.append('end_time', endTime);
      formData.append('registration_limit', String(totalSpots));
      if (banner) formData.append('banner', banner);

      const created = await eventApi.create(formData);
      onCreated(created);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create event. Please try again.');
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

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#F3DCE8]">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-[#6B6470] hover:text-[#18131A] cursor-pointer">
            Cancel
          </button>
          <GradientButton type="submit" size="md" disabled={submitting}>
            {submitting ? 'Publishing...' : 'Publish Event 🚀'}
          </GradientButton>
        </div>
      </form>
    </Modal>
  );
};
