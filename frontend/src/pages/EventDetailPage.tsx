import React, { useEffect, useState } from 'react';
import { Trash2, Edit2, MapPin, Clock, Users, Share2, Bookmark, MessageCircle, QrCode, CheckCircle2, Trophy, XCircle, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { EventItem } from '../types';
import { GradientButton } from '../components/common/GradientButton';
import { GlassCard } from '../components/common/GlassCard';
import { supabase } from '../lib/supabase';
import { reportApi, EventReport } from '../api/reportApi';
import PdfFlipViewer from '../components/reports/PdfFlipViewer';

interface EventDetailPageProps {
  event: EventItem;
  onBack: () => void;
  onRegister: (eventId: string) => void;
  isRegistered: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (eventId: string) => void;
  onOpenQRScanner: () => void;
  onDelete?: () => void;
  onEdit?: (event: EventItem) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  event, onBack, onRegister, isRegistered, isBookmarked, onToggleBookmark, onOpenQRScanner, onDelete, onEdit
}) => {
  const bookmarkClasses = isBookmarked ? 'bg-[#DC2626] text-white shadow-lg' : 'bg-white/5 text-white hover:bg-[#141012]';
  const [report, setReport] = useState<EventReport | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [viewingReport, setViewingReport] = useState(false);
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await reportApi.getByEventId(event.id);
        setReport(data);
      } catch (err) {
        console.error('Error fetching report:', err);
      }
    };
    const fetchPhotos = async () => {
      try {
        const { data } = await supabase
          .from('photos')
          .select('*')
          .eq('event_id', event.id)
          .order('uploaded_at', { ascending: false });
        setPhotos(data || []);
      } catch (err) {
        console.error('Error fetching photos:', err);
      }
    };
    fetchReport();
    fetchPhotos();
  }, [event.id]);

  const capacityPercent = (event.registeredCount / event.totalSpots) * 100;
  const eventDate = new Date(event.rawDate);
  const today = new Date();
  
  // Parse end time from "HH:MM AM/PM - HH:MM AM/PM" format
  const timeRange = event.time.split(' - ');
  const endTimeStr = timeRange[1]; // e.g., "09:30 PM"
  const [time, period] = endTimeStr.trim().split(' ');
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours);
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  
  const eventEndTime = new Date(event.rawDate);
  eventEndTime.setHours(hour, parseInt(minutes), 0, 0);
  
  const hasEventPassed = eventEndTime < today;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={onBack} className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#E04848] hover:text-[#E04848] transition-colors cursor-pointer">
        ← Back to Events
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative h-64 sm:h-96 rounded-3xl overflow-hidden shadow-xl">
        <img src={event.bannerImage || event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1313] via-transparent to-transparent" />
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2">
          <span className="px-3 py-1.5 text-xs sm:text-sm font-extrabold uppercase bg-[#DC2626] text-white rounded-full shadow-lg">{event.category}</span>
        </div>
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-2">
          <button onClick={() => onToggleBookmark(event.id)} className={`p-2.5 sm:p-3 rounded-full backdrop-blur-md transition-all cursor-pointer ${bookmarkClasses}`}>
            <Bookmark className="w-5 h-5 sm:w-6 sm:h-6" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <button onClick={() => navigator.share?.({ title: event.title, url: window.location.href })} className="p-2.5 sm:p-3 rounded-full bg-white/5 text-white hover:bg-[#141012] backdrop-blur-md transition-all cursor-pointer">
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit tracking-tight">{event.title}</h1>
            {event.subtitle && <p className="text-base sm:text-lg text-[#B3ABAB]">{event.subtitle}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-3 sm:gap-4">
            <GlassCard className="p-3 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#B3ABAB] mb-1"><Clock className="w-4 h-4 text-[#E04848]" /><span>Date & Time</span></div>
              <p className="text-sm sm:text-base font-bold text-white">{event.date}</p>
              <p className="text-xs sm:text-sm text-[#B3ABAB]">{event.time}</p>
            </GlassCard>
            <GlassCard className="p-3 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#B3ABAB] mb-1"><MapPin className="w-4 h-4 text-[#E04848]" /><span>Location</span></div>
              <p className="text-sm sm:text-base font-bold text-white">{event.location}</p>
            </GlassCard>
            <GlassCard className="p-3 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#B3ABAB] mb-1"><Users className="w-4 h-4 text-[#E04848]" /><span>Capacity</span></div>
              <p className="text-sm sm:text-base font-bold text-white">{event.registeredCount}/{event.totalSpots}</p>
              <div className="mt-1.5 w-full bg-white/10 rounded-full h-1.5"><div className="bg-gradient-to-r from-[#DC2626] to-[#B91C1C] h-1.5 rounded-full" style={{ width: `${capacityPercent}%` }} /></div>
            </GlassCard>
            <GlassCard className="p-3 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#B3ABAB] mb-1"><Trophy className="w-4 h-4 text-[#E04848]" /><span>Status</span></div>
              <p className="text-sm sm:text-base font-bold text-white">{event.status}</p>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">About</h2>
            <p className="text-sm sm:text-base text-[#B3ABAB] leading-relaxed">{event.description}</p>
          </motion.div>

        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 space-y-4">
          <div className="space-y-2.5">
            {!isRegistered && !hasEventPassed && event.registrationOpen && event.registeredCount < event.totalSpots && <GradientButton size="lg" onClick={() => onRegister(event.id)} className="w-full">Register Now</GradientButton>}
            {!isRegistered && !hasEventPassed && event.registrationOpen && event.registeredCount >= event.totalSpots && <div className="w-full px-4 py-3 bg-red-500/15 border border-red-500/30 text-red-300 text-center font-bold rounded-2xl flex items-center justify-center gap-2"><XCircle className="w-5 h-5" />Event Full - No Spots Available</div>}
            {hasEventPassed && <div className="w-full px-4 py-3 bg-white/5 border border-white/10 text-gray-200 text-center font-bold rounded-2xl flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5" />Completed</div>}
            {isRegistered && !hasEventPassed && <div className="w-full px-4 py-3 bg-[#1C3A2A] border border-green-500/30 text-[#4ADE80] text-center font-bold rounded-2xl flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5" />Registered ✓</div>}
            {event.hasAttendance && !hasEventPassed && <button onClick={onOpenQRScanner} className="w-full px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:shadow-lg rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"><QrCode className="w-5 h-5" />Check-in with QR</button>}
            {event.whatsappLink && !hasEventPassed && <a href={event.whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full px-4 py-3 text-sm font-bold text-[#4ADE80] bg-[#1C3A2A] hover:bg-[#1C3A2A] border border-green-500/30 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"><MessageCircle className="w-5 h-5" />Join WhatsApp Group</a>}
          </div>
          {(onEdit || onDelete) && <div className="p-4 bg-[#141012] border border-[#B3282D] rounded-2xl space-y-2">
            {onEdit && <button onClick={() => onEdit(event)} className="w-full px-4 py-2.5 text-sm font-bold text-[#E04848] hover:text-white bg-[#141012] hover:bg-[#DC2626] border border-[#B3282D] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"><Edit2 className="w-4 h-4" />Edit Event</button>}
            {onDelete && <button onClick={onDelete} className="w-full px-4 py-2.5 text-sm font-bold text-red-300 hover:text-white bg-[#141012] hover:bg-red-600 border border-red-500/30 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" />Delete Event</button>}
          </div>}
        </motion.div>
      </div>
    
        {/* Event Report Section */}
        {report && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-2xl font-bold text-white">📋 Event Report</h2>
            <div className="bg-gradient-to-br from-[#141012] to-[#141012] rounded-3xl border border-[#B3282D] p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-full sm:w-40 h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-[#DC2626] to-[#B91C1C] shrink-0 flex items-center justify-center">
                {report.event_thumbnail ? (
                  <img src={report.event_thumbnail} alt={report.title || report.event_title} className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-12 h-12 text-white opacity-70" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <h3 className="text-lg font-bold text-white">{report.title || `${event.title} Report`}</h3>
                <p className="text-sm text-[#B3ABAB]">Uploaded {new Date(report.uploaded_at).toLocaleDateString()}</p>
                <button
                  onClick={() => setViewingReport(true)}
                  className="mt-2 px-6 py-2.5 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  Read Report
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {!report && event.status === 'Completed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-white">📋 Event Report</h2>
            <div className="bg-gradient-to-br from-[#141012] to-[#141012] rounded-3xl border border-[#B3282D] p-6">
              <p className="text-[#B3ABAB]">Report coming soon...</p>
            </div>
          </motion.div>
        )}

        {photos.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-2xl font-bold text-white">📸 Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((photo: any) => (
                <div key={photo.id} className="rounded-2xl overflow-hidden bg-white/10">
                  <img
                    src={photo.photo_url}
                    alt={photo.caption || ''}
                    className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {photo.caption && (
                    <p className="text-xs text-[#B3ABAB] p-2">{photo.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {viewingReport && report && (
          <PdfFlipViewer
            pdfUrl={report.pdf_url}
            title={report.title || `${event.title} Report`}
            onClose={() => setViewingReport(false)}
          />
        )}

        </div>
  );
};
