import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Upload, X, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reportApi, EventReport } from '../api/reportApi';
import PdfFlipViewer from '../components/reports/PdfFlipViewer';
import { EventItem } from '../types';

interface ReportsPageProps {
  events: EventItem[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ events }) => {
  const { authUser } = useAuth();
  const isAdmin = authUser?.role === 'admin';
  const [reports, setReports] = useState<EventReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<EventReport | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const fetchReports = async () => {
    try {
      const data = await reportApi.list();
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EC4899]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#18131A] mb-4">Event Reports</h1>
        <p className="text-lg text-[#6B6470] max-w-2xl mx-auto">Flip through detailed reports from our events</p>
      </motion.div>

      {isAdmin && (
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            <Upload className="w-4 h-4" /> Upload Report
          </button>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-[#EC4899] mx-auto mb-4 opacity-50" />
          <p className="text-lg text-[#6B6470]">No reports yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, idx) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div
                  onClick={() => setViewing(report)}
                  className="relative h-48 bg-gradient-to-br from-[#EC4899] to-[#A855F7] overflow-hidden cursor-pointer"
                >
                  {report.event_thumbnail ? (
                    <img
                      src={report.event_thumbnail}
                      alt={report.event_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#18131A] mb-1 line-clamp-2">
                    {report.title || report.event_title}
                  </h3>
                  <p className="text-xs text-[#6B6470] mb-4">
                    {new Date(report.uploaded_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewing(report)}
                      className="flex-1 bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white py-2 rounded-xl font-bold hover:shadow-lg text-sm"
                    >
                      Read Report
                    </button>
                    {isAdmin && (
                      <button
                        onClick={async () => {
                          if (confirm('Delete this report?')) {
                            await reportApi.remove(report.id);
                            fetchReports();
                          }
                        }}
                        className="w-10 h-10 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {viewing && (
        <PdfFlipViewer
          pdfUrl={viewing.pdf_url}
          title={viewing.title || viewing.event_title}
          onClose={() => setViewing(null)}
        />
      )}

      {showUpload && (
        <UploadReportModal
          events={events}
          onClose={() => setShowUpload(false)}
          onUploaded={() => {
            setShowUpload(false);
            fetchReports();
          }}
        />
      )}
    </div>
  );
};

interface UploadReportModalProps {
  events: EventItem[];
  onClose: () => void;
  onUploaded: () => void;
}

const UploadReportModal: React.FC<UploadReportModalProps> = ({ events, onClose, onUploaded }) => {
  const [eventId, setEventId] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId || !file) return;
    setUploading(true);
    setError('');
    try {
      await reportApi.upload(eventId, file, title || undefined);
      onUploaded();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#18131A]">Upload Event Report</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

          <select
            required
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full px-4 py-2 border border-[#F3DCE8] rounded-xl focus:border-[#EC4899] focus:outline-none"
          >
            <option value="">Select event...</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Report title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-[#F3DCE8] rounded-xl focus:border-[#EC4899] focus:outline-none"
          />

          <input
            type="file"
            accept="application/pdf"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm"
          />

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Report'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
