import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowRight, X } from 'lucide-react';

interface Report {
  id: number;
  event_id: number;
  title: string;
  summary: string;
  highlights: string[];
  stats: Record<string, any>;
  cover_image: string;
  created_at: string;
  gallery_images: Array<{ id: number; image_url: string; caption: string }>;
}

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/reports');
        const data = await res.json();
        setReports(data.data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EC4899]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FFF8FC] to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#18131A] mb-4">Event Reports</h1>
          <p className="text-lg text-[#6B6470] max-w-2xl mx-auto">Explore highlights and insights from our amazing events</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, idx) => (
            <motion.div key={report.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} onClick={() => setSelectedReport(report)} className="group cursor-pointer">
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="relative h-48 bg-gradient-to-br from-[#EC4899] to-[#A855F7] overflow-hidden">
                  {report.cover_image ? (
                    <img src={report.cover_image} alt={report.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#18131A] mb-2 line-clamp-2">{report.title}</h3>
                  <p className="text-sm text-[#6B6470] mb-4 line-clamp-2">{report.summary}</p>
                  <button className="w-full bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white py-2 rounded-xl font-bold hover:shadow-lg flex items-center justify-center gap-2">
                    View Report <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-[#EC4899] mx-auto mb-4 opacity-50" />
            <p className="text-lg text-[#6B6470]">No reports yet</p>
          </div>
        )}
      </div>

      {selectedReport && <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />}
    </div>
  );
};

interface ReportModalProps {
  report: Report;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ report, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="relative h-48 sm:h-64 bg-gradient-to-br from-[#EC4899] to-[#A855F7]">
          {report.cover_image && <img src={report.cover_image} alt={report.title} className="w-full h-full object-cover" />}
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#18131A] mb-2">{report.title}</h2>
            <p className="text-sm text-[#6B6470]">{new Date(report.created_at).toLocaleDateString()}</p>
          </div>

          <p className="text-[#6B6470] leading-relaxed">{report.summary}</p>

          {Object.keys(report.stats).length > 0 && (
            <div>
              <h3 className="font-bold text-[#18131A] mb-4">Event Stats</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {Object.entries(report.stats).map(([key, value]) => (
                  <div key={key} className="bg-[#FFF1F7] rounded-2xl p-3 sm:p-4 text-center">
                    <p className="text-xs text-[#6B6470] capitalize mb-1">{key}</p>
                    <p className="text-lg sm:text-2xl font-bold text-[#EC4899]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.highlights.length > 0 && (
            <div>
              <h3 className="font-bold text-[#18131A] mb-4">✨ Highlights</h3>
              <ul className="space-y-2">
                {report.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#6B6470] text-sm sm:text-base">
                    <span className="text-[#EC4899] font-bold">▸</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.gallery_images && report.gallery_images.length > 0 && (
            <div>
              <h3 className="font-bold text-[#18131A] mb-4">📸 Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {report.gallery_images.map((img) => (
                  <div key={img.id} className="rounded-2xl overflow-hidden bg-gray-200">
                    <img src={img.image_url} alt={img.caption} className="w-full h-32 sm:h-40 object-cover hover:scale-105 transition-transform" />
                    {img.caption && <p className="text-xs text-[#6B6470] p-2 line-clamp-1">{img.caption}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
