import React, { useState } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminGalleryUploadProps {
  eventId: number;
  reportId: number;
  onSuccess: () => void;
}

export const AdminGalleryUpload: React.FC<AdminGalleryUploadProps> = ({ eventId, reportId, onSuccess }) => {
  const [formData, setFormData] = useState({
    image_url: '',
    caption: '',
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/reports/events/${eventId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to add image');

      setFormData({ image_url: '', caption: '', order: 0 });
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-[#F3DCE8] p-6 space-y-4">
      <div className="flex items-center gap-3">
        <ImageIcon className="w-6 h-6 text-[#EC4899]" />
        <h3 className="font-bold text-[#18131A]">Add Gallery Image</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <div className="bg-red-100 text-red-700 p-2 rounded-lg text-sm">{error}</div>}

        <input
          type="url"
          placeholder="Image URL"
          required
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="w-full px-4 py-2 text-sm border border-[#F3DCE8] rounded-xl focus:border-[#EC4899] focus:outline-none"
        />

        <input
          type="text"
          placeholder="Image Caption"
          value={formData.caption}
          onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
          className="w-full px-4 py-2 text-sm border border-[#F3DCE8] rounded-xl focus:border-[#EC4899] focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white py-2 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 text-sm flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {loading ? 'Uploading...' : 'Add Image'}
        </button>
      </form>
    </motion.div>
  );
};
