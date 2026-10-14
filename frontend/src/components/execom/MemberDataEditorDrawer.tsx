import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, RotateCcw, Image, Sparkles, User, Link2, Check, AlertCircle } from 'lucide-react';
import tinkerhubLogo from '../../assets/tinkerhub-logo.png';
import { ExecomMember } from './types';
import { execomApi } from '../../api/execomApi';
import { mediaUrl } from '../../api/photoApi';

interface MemberDataEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  members: ExecomMember[];
  onSaveMembers: (updated: ExicomMember[]) => void;
  onResetMembers: () => void;
}

export const MemberDataEditorDrawer: React.FC<MemberDataEditorDrawerProps> = ({
  isOpen,
  onClose,
  members,
  onSaveMembers,
  onResetMembers,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<number>(1);
  const [editableMembers, setEditableMembers] = useState<ExicomMember[]>(members);
  const [saveToast, setSaveToast] = useState(false);

  // Synchronize when members prop updates
  React.useEffect(() => {
    setEditableMembers(members);
  }, [members]);

  const emptyMember: ExecomMember = {
    id: 0,
    number: '',
    name: '',
    role: '',
    class: '',
    department: '',
    image: '',
    hoverImage: '',
    hoverCaption: '',
    description: '',
    quote: '',
    keyInitiatives: [],
    skills: [],
    social: { instagram: '', github: '', linkedin: '', twitter: '', email: '' },
  };
  const currentMember =
    editableMembers.find((m) => m.id === selectedMemberId) || editableMembers[0] || emptyMember;

  const handleFieldChange = (field: keyof ExecomMember, value: any) => {
    setEditableMembers((prev) => {
      const exists = prev.some((m) => m.id === selectedMemberId);
      if (!exists) {
        return [...prev, { ...currentMember, id: selectedMemberId, [field]: value }];
      }
      return prev.map((m) => (m.id === selectedMemberId ? { ...m, [field]: value } : m));
    });
  };

  const handleSocialChange = (key: string, value: string) => {
    setEditableMembers((prev) => {
      const exists = prev.some((m) => m.id === selectedMemberId);
      if (!exists) {
        return [...prev, { ...currentMember, id: selectedMemberId, social: { ...currentMember.social, [key]: value } }];
      }
      return prev.map((m) =>
        m.id === selectedMemberId
          ? { ...m, social: { ...m.social, [key]: value } }
          : m
      );
    });
  };

  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleFileUpload = async (field: 'image' | 'hoverImage', file: File | null) => {
    if (!file) return;
    setUploadingField(field);
    try {
      const { supabase } = await import('../../lib/supabase');
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('execom').upload(path, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('execom').getPublicUrl(path);
      handleFieldChange(field, data.publicUrl);
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = () => {
    onSaveMembers(editableMembers);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-red-950/30 backdrop-blur-xs"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="w-screen max-w-xl bg-[#141012] shadow-2xl border-l border-red-500/30 flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-red-100 flex items-center justify-between bg-gradient-to-r from-red-50/70 to-red-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-xs overflow-hidden">
                  <img src={tinkerhubLogo} alt="TinkerHub" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-white950">
                    Customize Execom Data
                  </h2>
                  <p className="text-xs text-white300">
                    Edit portraits, names, roles & socials in real-time
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#3A1A1C] text-[#E04848] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Member Selector Tabs */}
            <div className="flex overflow-x-auto p-3 gap-2 border-b border-red-100 bg-red-500/15">
              {editableMembers.map((m, idx) => (
                <div key={m.id} className="flex items-center gap-0.5">
                  <button
                    onClick={() => setSelectedMemberId(m.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      m.id === selectedMemberId
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-[#141012] text-white950/80 hover:bg-red-500/15 border border-red-500/30'
                    }`}
                  >
                    {m.number} • {m.role}
                  </button>
                  <div className="flex flex-col">
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        const arr = [...editableMembers];
                        [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                        setEditableMembers(arr.map((mm, i) => ({ ...mm, number: String(i + 1).padStart(2, '0') })));
                      }}
                      className="p-0.5 rounded hover:bg-[#3A1A1C] text-[#E04848] disabled:opacity-20 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      disabled={idx === editableMembers.length - 1}
                      onClick={() => {
                        const arr = [...editableMembers];
                        [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
                        setEditableMembers(arr.map((mm, i) => ({ ...mm, number: String(i + 1).padStart(2, '0') })));
                      }}
                      className="p-0.5 rounded hover:bg-[#3A1A1C] text-[#E04848] disabled:opacity-20 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const newId = Math.max(0, ...editableMembers.map((m) => m.id)) + 1;
                  const newMember: ExecomMember = {
                    id: newId,
                    number: String(editableMembers.length + 1).padStart(2, '0'),
                    name: 'New Member',
                    role: 'Role',
                    class: '',
                    department: '',
                    image: '',
                    hoverImage: '',
                    hoverCaption: '',
                    description: '',
                    quote: '',
                    keyInitiatives: [],
                    skills: [],
                    social: { instagram: '', github: '', linkedin: '', email: '' },
                  };
                  setEditableMembers((prev) => [...prev, newMember]);
                  setSelectedMemberId(newId);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap bg-[#141012] text-white300 border border-dashed border-red-500/30 hover:bg-red-500/15 transition-all"
              >
                + Add Member
              </button>
            </div>

            {/* Form Inputs Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-left text-xs sm:text-sm">
              {/* Name & Role Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white950 mb-1">
                    Member Name
                  </label>
                  <input
                    type="text"
                    value={currentMember.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-400 bg-red-500/15 text-white950 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white950 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={currentMember.role}
                    onChange={(e) => handleFieldChange('role', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-400 bg-red-500/15 text-white950 font-medium"
                  />
                </div>
              </div>

              {/* Class & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white950 mb-1">
                    Class / Year
                  </label>
                  <input
                    type="text"
                    value={currentMember.class}
                    onChange={(e) => handleFieldChange('class', e.target.value)}
                    placeholder="e.g. S5 CSE"
                    className="w-full px-3 py-2 rounded-xl border border-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-400 bg-red-500/15 text-white950 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white950 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={currentMember.department}
                    onChange={(e) => handleFieldChange('department', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-400 bg-red-500/15 text-white950 font-medium"
                  />
                </div>
              </div>

              {/* Image 1: Main Portrait */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white950 mb-1">
                  Primary Portrait
                </label>
                {currentMember.image && (
                  <img
                    src={mediaUrl(currentMember.image)}
                    alt="Preview"
                    className="w-full max-h-72 object-cover rounded-xl border border-red-500/30 mb-2 bg-red-500/15"
                  />
                )}
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('image', e.target.files?.[0] || null)}
                    className="flex-1 text-xs file:mr-2 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-red-500/15 file:text-white300 file:font-bold"
                  />
                  {uploadingField === 'image' && <span className="text-[10px] text-white300 font-bold">Uploading...</span>}
                </div>
              </div>

              {/* Image 2: Secondary / Hover Image */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white950 mb-1">
                  Hover / Candid Action Photo
                </label>
                {currentMember.hoverImage && (
                  <img
                    src={mediaUrl(currentMember.hoverImage)}
                    alt="Preview"
                    className="w-full max-h-72 object-cover rounded-xl border border-red-500/30 mb-2 bg-red-500/15"
                  />
                )}
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('hoverImage', e.target.files?.[0] || null)}
                    className="flex-1 text-xs file:mr-2 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-red-500/15 file:text-white300 file:font-bold"
                  />
                  {uploadingField === 'hoverImage' && <span className="text-[10px] text-white300 font-bold">Uploading...</span>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white950 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={currentMember.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-400 bg-red-500/15 text-white950 font-normal"
                />
              </div>

              {/* Quote */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white950 mb-1">
                  Personal Quote
                </label>
                <input
                  type="text"
                  value={currentMember.quote || ''}
                  onChange={(e) => handleFieldChange('quote', e.target.value)}
                  placeholder="Inspiring quote..."
                  className="w-full px-3 py-2 rounded-xl border border-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-400 bg-red-500/15 text-white950 font-normal"
                />
              </div>

              {/* Social Links */}
              <div className="pt-2 border-t border-red-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-white950 mb-2">
                  Social Links
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-xs font-semibold text-white300">Instagram</span>
                    <input
                      type="text"
                      value={currentMember.social.instagram}
                      onChange={(e) => handleSocialChange('instagram', e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-red-500/30 text-xs font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-xs font-semibold text-white300">GitHub</span>
                    <input
                      type="text"
                      value={currentMember.social.github}
                      onChange={(e) => handleSocialChange('github', e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-red-500/30 text-xs font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-xs font-semibold text-white300">LinkedIn</span>
                    <input
                      type="text"
                      value={currentMember.social.linkedin}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-red-500/30 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-red-100 bg-red-500/15 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  onResetMembers();
                  setEditableMembers(members);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white300 hover:bg-red-500/15 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white950 hover:bg-red-500/15"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-md shadow-red-300 transition-all active:scale-95"
                >
                  {saveToast ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Apply Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
