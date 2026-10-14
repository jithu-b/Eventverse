import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Sparkles, Quote, CheckCircle2, Copy, Check, Camera, User } from 'lucide-react';
import { ExecomMember } from '../../api/execomApi';
import { SocialLinks } from './SocialLinks';
import { useTheme } from './ThemeContext';
import { mediaUrl } from '../../api/photoApi';

interface MemberProfileModalProps {
  member: ExecomMember | null;
  allMembers: ExicomMember[];
  onClose: () => void;
  onSelectMember: (member: ExicomMember) => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  member,
  allMembers,
  onClose,
  onSelectMember,
}) => {
  const { isBlush } = useTheme();
  const [activePhoto, setActivePhoto] = useState<'primary' | 'hover'>('primary');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Reset photo view whenever member changes
  useEffect(() => {
    setActivePhoto('primary');
    setCopiedEmail(false);
  }, [member?.id]);

  // Keyboard navigation & ESC handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!member) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        const currentIndex = allMembers.findIndex((m) => m.id === member.id);
        const nextIndex = (currentIndex + 1) % allMembers.length;
        onSelectMember(allMembers[nextIndex]);
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = allMembers.findIndex((m) => m.id === member.id);
        const prevIndex = (currentIndex - 1 + allMembers.length) % allMembers.length;
        onSelectMember(allMembers[prevIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [member, allMembers, onClose, onSelectMember]);

  if (!member) return null;

  const currentIndex = allMembers.findIndex((m) => m.id === member.id);
  const prevMember = allMembers[(currentIndex - 1 + allMembers.length) % allMembers.length];
  const nextMember = allMembers[(currentIndex + 1) % allMembers.length];

  const handleCopyEmail = () => {
    if (member.social.email) {
      navigator.clipboard?.writeText(member.social.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop with soft blur and theme tint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className={`fixed inset-0 backdrop-blur-md transition-colors duration-300 ${
            isBlush ? 'bg-red-950/40' : 'bg-slate-950/50'
          }`}
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] sm:rounded-[36px] glass-card z-10 my-auto text-left backdrop-blur-2xl transition-all duration-300 ${
            isBlush ? 'shadow-2xl shadow-red-950/20' : 'shadow-2xl shadow-slate-950/20'
          }`}
        >
          {/* Top Bar Controls */}
          <div
            className={`sticky top-0 z-30 flex items-center justify-between px-6 sm:px-8 py-4 bg-[#1F1C1C] border-b transition-colors duration-300 ${
              isBlush ? 'border-red-500/30' : 'border-white/10'
            }`}
          >
            {/* Quick Prev / Next member switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectMember(prevMember)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-200 cursor-pointer shadow-xs ${
                  isBlush
                    ? 'text-white300 bg-red-500/15 hover:bg-red-500/15 border-red-500/30'
                    : 'text-gray-200 bg-white/5 hover:bg-white/10 border-white/10'
                }`}
                title={`Previous: ${prevMember.name}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev ({prevMember.number})</span>
              </button>
              <span className={`text-xs font-bold ${isBlush ? 'text-white400' : 'text-slate-400'}`}>
                {currentIndex + 1} / {allMembers.length}
              </span>
              <button
                onClick={() => onSelectMember(nextMember)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-200 cursor-pointer shadow-xs ${
                  isBlush
                    ? 'text-white300 bg-red-500/15 hover:bg-red-500/15 border-red-500/30'
                    : 'text-gray-200 bg-white/5 hover:bg-white/10 border-white/10'
                }`}
                title={`Next: ${nextMember.name}`}
              >
                <span className="hidden sm:inline">Next ({nextMember.number})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-full border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 ${
                isBlush
                  ? 'bg-red-500/15 hover:bg-[#3A1A1C] text-[#E04848] hover:text-white950 border-red-500/30 focus:ring-red-400'
                  : 'bg-white/5 hover:bg-white/10 text-gray-200 hover:text-gray-200 border-white/10 focus:ring-slate-400'
              }`}
              aria-label="Close profile modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body: Split 2-Column on Desktop */}
          <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Large Interactive Photo & Visuals */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div
                className={`relative w-full aspect-[3/4] rounded-[24px] overflow-hidden shadow-xl border ${
                  isBlush
                    ? 'shadow-red-200/50 border-red-500/30 bg-red-500/15'
                    : 'shadow-slate-200/70 border-white/10 bg-white/5'
                }`}
              >
                {/* Photo Render */}
                <motion.img
                  key={activePhoto}
                  initial={{ opacity: 0.4, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  src={activePhoto === 'primary' ? mediaUrl(member.image) : mediaUrl(member.hoverImage)}
                  alt={`${member.name} - ${activePhoto === 'primary' ? 'Portrait' : 'In Action'}`}
                  className="w-full h-full object-cover object-center"
                />

                {/* Photo Badge */}
                <div
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full glass-card text-[11px] font-bold shadow-xs ${
                    isBlush ? 'text-white950' : 'text-gray-200'
                  }`}
                >
                  {activePhoto === 'primary' ? 'Official Portrait' : 'Field Action View'}
                </div>
              </div>

              {/* Dual Photo Switcher Tabs */}
              <div
                className={`mt-4 flex items-center justify-center p-1 rounded-2xl border w-full max-w-xs shadow-xs transition-colors duration-300 ${
                  isBlush ? 'bg-red-500/15 border-red-500/30' : 'bg-white/5 border-white/10'
                }`}
              >
                <button
                  onClick={() => setActivePhoto('primary')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    activePhoto === 'primary'
                      ? isBlush
                        ? 'bg-[#141012] text-white300 shadow-xs'
                        : 'bg-[#141012] text-gray-200 shadow-xs'
                      : isBlush
                      ? 'text-white950/70 hover:text-white950'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Studio</span>
                </button>
                <button
                  onClick={() => setActivePhoto('hover')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    activePhoto === 'hover'
                      ? isBlush
                        ? 'bg-[#141012] text-white300 shadow-xs'
                        : 'bg-[#141012] text-gray-200 shadow-xs'
                      : isBlush
                      ? 'text-white950/70 hover:text-white950'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>In Action</span>
                </button>
              </div>

              {/* Social links card below photo */}
              <div className="mt-6 w-full p-4 rounded-[22px] glass-card flex flex-col items-center text-center shadow-xs">
                <span
                  className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                    isBlush ? 'text-white950/80' : 'text-gray-200'
                  }`}
                >
                  Connect with {member.name.split(' ')[0]}
                </span>
                <SocialLinks social={member.social} size="md" showCopyToast={true} />

                {member.social.email && (
                  <button
                    onClick={handleCopyEmail}
                    className={`mt-3 flex items-center gap-1.5 text-xs font-medium hover:underline cursor-pointer ${
                      isBlush ? 'text-white300 hover:text-white950' : 'text-gray-200 hover:text-gray-200'
                    }`}
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span className="text-emerald-300 font-semibold">Email copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy email address</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Rich Member Narrative, Bio, Quotes & Initiatives */}
            <div className="md:col-span-7 flex flex-col justify-start">
              {/* Header Badges */}
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`font-editorial text-2xl font-bold ${
                    isBlush ? 'text-white950' : 'text-gray-200'
                  }`}
                >
                  {member.number}
                </span>
                <span
                  className={`px-3 py-1 rounded-full border text-xs font-bold tracking-wider uppercase ${
                    isBlush
                      ? 'bg-red-500/15 border-red-500/30 text-white300'
                      : 'bg-white/5 border-white/10 text-gray-200'
                  }`}
                >
                  {member.role}
                </span>
              </div>

              {/* Name */}
              <h2
                className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight ${
                  isBlush ? 'text-white950' : 'text-gray-200'
                }`}
              >
                {member.name}
              </h2>

              {/* Class & Department */}
              <p className={`text-sm font-semibold mt-1 ${isBlush ? 'text-white300' : 'text-gray-400'}`}>
                {member.class} <span className={`mx-1 ${isBlush ? 'text-white300' : 'text-slate-300'}`}>•</span> {member.department}
              </p>

              {/* Quote Banner */}
              {member.quote && (
                <div
                  className={`mt-5 p-4 rounded-2xl border-l-4 shadow-xs ${
                    isBlush
                      ? 'bg-gradient-to-r from-red-50 via-red-50 to-red-50 border-red-600 text-white950'
                      : 'bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 border-slate-700 text-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Quote className={`w-4 h-4 shrink-0 mt-0.5 ${isBlush ? 'text-white400' : 'text-gray-400'}`} />
                    <p
                      className={`font-editorial text-sm sm:text-base italic leading-relaxed ${
                        isBlush ? 'text-white950' : 'text-gray-200'
                      }`}
                    >
                      "{member.quote}"
                    </p>
                  </div>
                </div>
              )}

              {/* About / Description */}
              <div className="mt-6">
                <h3
                  className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                    isBlush ? 'text-white950' : 'text-gray-200'
                  }`}
                >
                  Role & Core Mission
                </h3>
                <p
                  className={`text-sm sm:text-base leading-relaxed ${
                    isBlush ? 'text-white950/80' : 'text-gray-200'
                  }`}
                >
                  {member.description}
                </p>
              </div>

              {/* Key Initiatives */}
              {member.keyInitiatives && member.keyInitiatives.length > 0 && (
                <div className="mt-6">
                  <h3
                    className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
                      isBlush ? 'text-white950' : 'text-gray-200'
                    }`}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isBlush ? 'text-white300' : 'text-gray-200'}`} />
                    Key Initiatives & Milestones
                  </h3>
                  <ul className="space-y-2.5">
                    {member.keyInitiatives.map((item, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-2.5 text-xs sm:text-sm ${
                          isBlush ? 'text-white950/80' : 'text-gray-200'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isBlush ? 'text-white300' : 'text-gray-200'
                          }`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technical / Core Skills Chips */}
              {member.skills && member.skills.length > 0 && (
                <div className="mt-6">
                  <h3
                    className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${
                      isBlush ? 'text-white950' : 'text-gray-200'
                    }`}
                  >
                    Domains of Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-xl bg-[#141012] border text-xs font-medium shadow-xs ${
                          isBlush ? 'border-red-500/30 text-white950' : 'border-white/10 text-gray-200'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

