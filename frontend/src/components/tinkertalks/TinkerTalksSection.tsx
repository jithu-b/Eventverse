import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, X, Trash2, UploadCloud, ImagePlus, Pencil } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { tinkerTalksApi, TinkerTalk } from '../../api/tinkerTalksApi';
import { bannerApi } from '../../api/bannerApi';

const BANNER_SECTION = 'tinkertalks';

export function TinkerTalksSection() {
  const { authUser } = useAuth();
  const isAdmin = authUser?.role === 'admin';
  const [talks, setTalks] = useState<TinkerTalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<TinkerTalk | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const refresh = () => {
    tinkerTalksApi.list().then(setTalks).catch(console.error).finally(() => setLoading(false));
  };

  const refreshBanner = () => {
    bannerApi.get(BANNER_SECTION).then(setBannerUrl).catch(console.error);
  };

  useEffect(() => { refresh(); refreshBanner(); }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this TinkerTalk?')) return;
    await tinkerTalksApi.remove(id);
    refresh();
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerUploading(true);
    try {
      const url = await bannerApi.set(BANNER_SECTION, file);
      setBannerUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setBannerUploading(false);
      e.target.value = '';
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#FCE7F3] to-[#F3E8FF] border border-[#F3DCE8] group">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt="TinkerTalks banner"
            className="w-full h-32 sm:h-48 object-cover"
          />
        ) : (
          <div className="w-full h-24 sm:h-32 flex items-center justify-center text-xs sm:text-sm text-[#A855F7] font-semibold">
            {isAdmin ? 'Add a banner for TinkerTalks' : 'TinkerTalks'}
          </div>
        )}
        {isAdmin && (
          <label className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/75 text-white text-xs font-semibold cursor-pointer transition-colors backdrop-blur-sm">
            {bannerUploading ? (
              'Uploading...'
            ) : (
              <>
                {bannerUrl ? <Pencil size={12} /> : <ImagePlus size={12} />}
                {bannerUrl ? 'Change banner' : 'Add banner'}
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="hidden"
              disabled={bannerUploading}
            />
          </label>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#DB2777]">
              TINKERTALKS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18131A] tracking-tight font-outfit mt-1">
            TinkerTalks
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6470]">
            Bite-sized videos from the TinkerHub community.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white text-sm font-semibold shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 transition-shadow self-start sm:self-auto"
          >
            <Plus size={16} /> Add TinkerTalk
          </button>
        )}
      </div>

      {(() => { const visibleTalks = showAll ? talks : talks.slice(0, 3); return (
      loading ? (
        <div className="text-sm text-[#6B6470]">Loading talks...</div>
      ) : talks.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-md border border-dashed border-[#F3DCE8] rounded-2xl p-8 text-center text-sm text-[#6B6470]">
          No TinkerTalks yet.{isAdmin ? ' Tap "Add TinkerTalk" to upload the first one.' : ' Check back soon!'}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
          {visibleTalks.map((talk) => (
            <motion.div
              key={talk.id}
              layout
              whileHover={{ y: -4 }}
              onClick={() => setActiveVideo(talk)}
              className="group relative shrink-0 w-64 sm:w-72 snap-start bg-white/90 backdrop-blur-md rounded-2xl border border-[#F3DCE8] hover:border-pink-300 hover:shadow-xl hover:shadow-pink-500/10 overflow-hidden cursor-pointer transition-all"
            >
              <div className="relative w-full aspect-video bg-black">
                {talk.thumbnail_url ? (
                  <img
                    src={talk.thumbnail_url}
                    alt={talk.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={talk.video_url}
                    preload="metadata"
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play size={20} className="text-[#DB2777] ml-0.5" fill="currentColor" />
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={(e) => handleDelete(talk.id, e)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-red-500 flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm text-[#18131A] truncate">{talk.title}</h3>
                {talk.description && (
                  <p className="text-xs text-[#6B6470] mt-1 line-clamp-2">{talk.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )
      ); })()}

      {!loading && talks.length > 3 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="px-5 py-2.5 rounded-xl border border-[#F3DCE8] bg-white/80 backdrop-blur-md text-sm font-semibold text-[#DB2777] hover:border-pink-300 hover:bg-white transition-colors"
          >
            {showAll ? 'Show less' : `View more (${talks.length - 3} more)`}
          </button>
        </div>
      )}

      <AnimatePresence>
        {activeVideo && (
          <VideoPlayerModal talk={activeVideo} onClose={() => setActiveVideo(null)} />
        )}
        {showUpload && (
          <AddTinkerTalkModal
            onClose={() => setShowUpload(false)}
            onUploaded={() => { setShowUpload(false); refresh(); }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function VideoPlayerModal({ talk, onClose }: { talk: TinkerTalk; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-black rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 bg-[#18131A]">
          <h3 className="text-white text-sm font-semibold truncate pr-4">{talk.title}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white shrink-0">
            <X size={20} />
          </button>
        </div>
        <video
          src={talk.video_url}
          controls
          autoPlay
          playsInline
          className="w-full max-h-[75vh] bg-black"
        />
        {talk.description && (
          <p className="px-4 py-3 text-sm text-white/70 bg-[#18131A]">{talk.description}</p>
        )}
      </motion.div>
    </motion.div>
  );
}

function AddTinkerTalkModal({ onClose, onUploaded }: { onClose: () => void; onUploaded: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !file) {
      setError('Title and video file are required.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      await tinkerTalksApi.upload(
        file,
        title.trim(),
        description.trim() || undefined,
        thumbnailFile || undefined
      );
      onUploaded();
    } catch (err: any) {
      setError(err.message || 'Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[#18131A] font-outfit">Add TinkerTalk</h3>
          <button onClick={onClose} className="text-[#6B6470] hover:text-[#18131A]">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-[#6B6470] mb-1 block">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Intro to Git in 3 minutes"
              className="w-full px-3 py-2.5 text-sm bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#6B6470] mb-1 block">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Short blurb about this talk"
              className="w-full px-3 py-2.5 text-sm bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#6B6470] mb-1 block">Video file</label>
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#F3DCE8] rounded-xl py-6 cursor-pointer hover:border-pink-300 transition-colors">
              <UploadCloud size={22} className="text-[#DB2777]" />
              <span className="text-xs text-[#6B6470] text-center px-4">
                {file ? file.name : 'Tap to choose from gallery or files'}
              </span>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#6B6470] mb-1 block">
              Thumbnail image (optional)
            </label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#F3DCE8] rounded-xl py-4 cursor-pointer hover:border-pink-300 transition-colors">
              <ImagePlus size={18} className="text-[#DB2777]" />
              <span className="text-xs text-[#6B6470] text-center px-4">
                {thumbnailFile ? thumbnailFile.name : 'Choose a cover image (or leave blank)'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white text-sm font-semibold shadow-lg shadow-pink-500/20 disabled:opacity-60"
        >
          {uploading ? 'Uploading...' : 'Upload TinkerTalk'}
        </button>
      </motion.div>
    </motion.div>
  );
}
