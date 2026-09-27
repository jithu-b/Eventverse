import React, { useState } from 'react';
import { FileText, Upload, X } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminReportUploadProps {
  eventId: number;
  onSuccess: () => void;
}

export const AdminReportUpload: React.FC<AdminReportUploadProps> = ({ eventId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    highlights: [''],
    stats: {} as Record<string, any>,
    cover_image: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/reports/events/${eventId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create report');

      setFormData({ title: '', summary: '', highlights: [''], stats: {}, cover_image: '' });
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-[#F3DCE8] p-8 space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-[#EC4899]" />
        <h3 className="text-xl font-bold text-[#18131A]">Create Event Report</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

        <input
          type="text"
          placeholder="Report Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-[#F3DCE8] rounded-xl focus:border-[#EC4899] focus:outline-none"
        />

        <textarea
          placeholder="Report Summary"
          required
          rows={4}
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          className="w-full px-4 py-2 border border-[#F3DCE8] rounded-xl focus:border-[#EC4899] focus:outline-none"
        />

        <input
          type="url"
          placeholder="Cover Image URL"
          value={formData.cover_image}
          onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
          className="w-full px-4 py-2 border border-[#F3DCE8] rounded-xl focus:border-[#EC4899] focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {loading ? 'Creating...' : 'Create Report'}
        </button>
      </form>
    </motion.div>
  );
};
