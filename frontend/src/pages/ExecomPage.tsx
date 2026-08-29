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
import { ExicomMember } from '../api/execomApi';
import { STATIC_EXECOM } from '../data/staticExecom';
import { useIsMobileOrTablet } from '../hooks/useIsMobileOrTablet';
import { useAuth } from '../context/AuthContext';

function ExecomPageInner() {
  const { authUser } = useAuth();
  const isAdmin = authUser?.role === 'admin';
  const isMobile = useIsMobileOrTablet();

  const [members, setMembers] = useState<ExicomMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<ExicomMember | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    setMembers(STATIC_EXECOM);
  }, []);

  const scrollToMembers = useCallback(() => {
    const el = document.getElementById('exicom-members');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans bg-[#faf7f9] text-[#2e1c24] selection:bg-pink-200 selection:text-pink-900">
      <PinkMeshBackground />
      <FloatingSparkles count={isMobile ? 10 : 34} />
      <ScrollProgressBar targetId="exicom-members" />

      <main className="relative z-10">
        <ExicomHero onScrollToMembers={scrollToMembers} />

        <ExicomGrid members={members} onSelectMember={(m) => setSelectedMember(m)} />
      </main>

      <ExicomFooter onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

      <MemberProfileModal
        member={selectedMember}
        allMembers={members}
        onClose={() => setSelectedMember(null)}
        onSelectMember={(m) => setSelectedMember(m)}
      />

    </div>
  );
}

export const ExecomPage: React.FC = () => (
  <ThemeProvider>
    <ExecomPageInner />
  </ThemeProvider>
);
