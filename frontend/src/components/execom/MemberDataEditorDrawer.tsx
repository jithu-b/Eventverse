import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, RotateCcw, Image, Sparkles, User, Link2, Check, AlertCircle } from 'lucide-react';
import tinkerhubLogo from '../../assets/tinkerhub-logo.png';
import { ExicomMember } from './types';
import { execomApi } from '../../api/execomApi';
import { mediaUrl } from '../../api/photoApi';

interface MemberDataEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  members: ExicomMember[];
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

  const emptyMember: ExicomMember = {
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

  const handleFieldChange = (field: keyof ExicomMember, value: any) => {
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
      const url = await execomApi.uploadImage(file);
      handleFieldChange(field, url);
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
          className="fixed inset-0 bg-pink-950/30 backdrop-blur-xs"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="w-screen max-w-xl bg-white shadow-2xl border-l border-pink-200 flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-pink-100 flex items-center justify-between bg-gradient-to-r from-pink-50/70 to-rose-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-500 flex items-center justify-center shadow-xs overflow-hidden">
                  <img src={tinkerhubLogo} alt="TinkerHub" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-pink-950">
                    Customize Execom Data
                  </h2>
                  <p className="text-xs text-pink-700">
                    Edit portraits, names, roles & socials in real-time
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-pink-100 text-pink-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Member Selector Tabs */}
            <div className="flex overflow-x-auto p-3 gap-2 border-b border-pink-100 bg-pink-50/40">
              {editableMembers.map((m, idx) => (
                <div key={m.id} className="flex items-center gap-0.5">
                  <button
                    onClick={() => setSelectedMemberId(m.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      m.id === selectedMemberId
                        ? 'bg-pink-600 text-white shadow-xs'
                        : 'bg-white text-pink-900/80 hover:bg-pink-100 border border-pink-200/70'
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
                      className="p-0.5 rounded hover:bg-pink-100 text-pink-700 disabled:opacity-20 disabled:cursor-not-allowed"
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
                      className="p-0.5 rounded hover:bg-pink-100 text-pink-700 disabled:opacity-20 disabled:cursor-not-allowed"
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
                  const newMember: ExicomMember = {
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
                className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap bg-white text-pink-600 border border-dashed border-pink-300 hover:bg-pink-50 transition-all"
              >
                + Add Member
              </button>
            </div>

            {/* Form Inputs Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-left text-xs sm:text-sm">
              {/* Name & Role Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                    Member Name
                  </label>
                  <input
                    type="text"
                    value={currentMember.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30 text-pink-950 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={currentMember.role}
                    onChange={(e) => handleFieldChange('role', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30 text-pink-950 font-medium"
                  />
                </div>
              </div>

              {/* Class & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                    Class / Year
                  </label>
                  <input
                    type="text"
                    value={currentMember.class}
                    onChange={(e) => handleFieldChange('class', e.target.value)}
                    placeholder="e.g. S5 CSE"
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30 text-pink-950 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={currentMember.department}
                    onChange={(e) => handleFieldChange('department', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30 text-pink-950 font-medium"
                  />
                </div>
              </div>

              {/* Image 1: Main Portrait */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                  Primary Portrait
                </label>
                {currentMember.image && (
                  <img
                    src={mediaUrl(currentMember.image)}
                    alt="Preview"
                    className="w-full max-h-72 object-cover rounded-xl border border-pink-200 mb-2 bg-pink-50"
                  />
                )}
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('image', e.target.files?.[0] || null)}
                    className="flex-1 text-xs file:mr-2 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-pink-100 file:text-pink-700 file:font-bold"
                  />
                  {uploadingField === 'image' && <span className="text-[10px] text-pink-600 font-bold">Uploading...</span>}
                </div>
              </div>

              {/* Image 2: Secondary / Hover Image */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                  Hover / Candid Action Photo
                </label>
                {currentMember.hoverImage && (
                  <img
                    src={mediaUrl(currentMember.hoverImage)}
                    alt="Preview"
                    className="w-full max-h-72 object-cover rounded-xl border border-pink-200 mb-2 bg-pink-50"
                  />
                )}
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('hoverImage', e.target.files?.[0] || null)}
                    className="flex-1 text-xs file:mr-2 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-pink-100 file:text-pink-700 file:font-bold"
                  />
                  {uploadingField === 'hoverImage' && <span className="text-[10px] text-pink-600 font-bold">Uploading...</span>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={currentMember.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30 text-pink-950 font-normal"
                />
              </div>

              {/* Quote */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                  Personal Quote
                </label>
                <input
                  type="text"
                  value={currentMember.quote || ''}
                  onChange={(e) => handleFieldChange('quote', e.target.value)}
                  placeholder="Inspiring quote..."
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30 text-pink-950 font-normal"
                />
              </div>

              {/* Social Links */}
              <div className="pt-2 border-t border-pink-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-2">
                  Social Links
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-xs font-semibold text-pink-800">Instagram</span>
                    <input
                      type="text"
                      value={currentMember.social.instagram}
                      onChange={(e) => handleSocialChange('instagram', e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-pink-200 text-xs font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-xs font-semibold text-pink-800">GitHub</span>
                    <input
                      type="text"
                      value={currentMember.social.github}
                      onChange={(e) => handleSocialChange('github', e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-pink-200 text-xs font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-xs font-semibold text-pink-800">LinkedIn</span>
                    <input
                      type="text"
                      value={currentMember.social.linkedin}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-pink-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-pink-100 bg-pink-50/50 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  onResetMembers();
                  setEditableMembers(members);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-pink-800 hover:bg-pink-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-pink-900 hover:bg-pink-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-300 transition-all active:scale-95"
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
