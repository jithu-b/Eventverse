import React, { useEffect, useState, useCallback } from 'react';
import { PinkMeshBackground } from '../components/execom/PinkMeshBackground';
import { FloatingSparkles } from '../components/execom/FloatingSparkles';
import { ScrollProgressBar } from '../components/execom/ScrollProgressBar';
import { ExicomHero } from '../components/execom/ExicomHero';
import { ExicomGrid } from '../components/execom/ExicomGrid';
import { MemberProfileModal } from '../components/execom/MemberProfileModal';
import { ExicomFooter } from '../components/execom/ExicomFooter';
import { MemberDataEditorDrawer } from '../components/execom/MemberDataEditorDrawer';
import { ThemeProvider } from '../components/execom/ThemeContext';
import { execomApi, ExicomMember } from '../api/execomApi';
import { useAuth } from '../context/AuthContext';

function ExecomPageInner() {
  const { authUser } = useAuth();
  const isAdmin = authUser?.role === 'admin';

  const [members, setMembers] = useState<ExicomMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<ExicomMember | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const load = useCallback(() => {
    execomApi.list().then(setMembers);
  }, []);

  useEffect(load, [load]);

  const handleSaveMembers = async (updated: ExicomMember[]) => {
    const saved = await execomApi.saveBulk(updated);
    setMembers(saved);
  };

  const handleResetMembers = () => {
    load();
  };

  const scrollToMembers = useCallback(() => {
    const el = document.getElementById('exicom-members');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans bg-[#faf7f9] text-[#2e1c24] selection:bg-pink-200 selection:text-pink-900">
      <PinkMeshBackground />
      <FloatingSparkles count={34} />
      <ScrollProgressBar targetId="exicom-members" />

      <main className="relative z-10">
        <ExicomHero onScrollToMembers={scrollToMembers} />

        {isAdmin && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-4 py-2 rounded-full bg-pink-600 text-white text-xs font-bold shadow-md hover:bg-pink-700 transition-colors"
            >
              Edit Execom Members
            </button>
          </div>
        )}

        <ExicomGrid members={members} onSelectMember={(m) => setSelectedMember(m)} />
      </main>

      <ExicomFooter onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

      <MemberProfileModal
        member={selectedMember}
        allMembers={members}
        onClose={() => setSelectedMember(null)}
        onSelectMember={(m) => setSelectedMember(m)}
      />

      {isAdmin && (
        <MemberDataEditorDrawer
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          members={members}
          onSaveMembers={handleSaveMembers}
          onResetMembers={handleResetMembers}
        />
      )}
    </div>
  );
}

export const ExecomPage: React.FC = () => (
  <ThemeProvider>
    <ExecomPageInner />
  </ThemeProvider>
);
