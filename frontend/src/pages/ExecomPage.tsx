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
import { supabase } from '../lib/supabase';
import { useIsMobileOrTablet } from '../hooks/useIsMobileOrTablet';
import { useAuth } from '../context/AuthContext';

function ExecomPageInner() {
  const { authUser } = useAuth();
  const isAdmin = authUser?.role === 'admin';
  const isMobile = useIsMobileOrTablet();

  const [members, setMembers] = useState<ExicomMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<ExicomMember | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const loadMembers = useCallback(() => {
    supabase
      .from('execom_members')
      .select('*')
      .order('position', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to load execom members', error);
          return;
        }
        const mapped = (data || []).map((m: any) => ({
          id: m.id,
          number: m.number,
          name: m.name,
          role: m.role,
          class: m.class_name,
          department: m.department,
          image: m.image,
          hoverImage: m.hover_image,
          hoverCaption: m.hover_caption,
          description: m.description,
          quote: m.quote,
          keyInitiatives: m.key_initiatives || [],
          skills: m.skills || [],
          social: m.social || {},
        }));
        setMembers(mapped);
      });
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleSaveMembers = async (updated: ExicomMember[]) => {
    const rows = updated.map((m, idx) => ({
      id: m.id && m.id > 0 && members.some((existing) => existing.id === m.id) ? m.id : undefined,
      number: m.number,
      name: m.name,
      role: m.role,
      class_name: m.class,
      department: m.department,
      image: m.image,
      hover_image: m.hoverImage,
      hover_caption: m.hoverCaption || '',
      description: m.description,
      quote: m.quote || '',
      key_initiatives: m.keyInitiatives || [],
      skills: m.skills || [],
      social: m.social || {},
      position: idx,
    }));

    const currentIds = members.map((m) => m.id);
    const updatedIds = updated.filter((m) => currentIds.includes(m.id)).map((m) => m.id);
    const removedIds = currentIds.filter((id) => !updatedIds.includes(id));
    if (removedIds.length > 0) {
      await supabase.from('execom_members').delete().in('id', removedIds);
    }

    for (const row of rows) {
      if (row.id) {
        const { id, ...fields } = row;
        await supabase.from('execom_members').update(fields).eq('id', id);
      } else {
        const { id, ...fields } = row;
        await supabase.from('execom_members').insert(fields);
      }
    }

    loadMembers();
  };

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

        {isAdmin && (
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-pink-500 text-white text-sm font-bold shadow-md hover:bg-pink-600 transition-colors"
            >
              Edit Execom Members
            </button>
          </div>
        )}

        <ExicomGrid members={members} onSelectMember={(m) => setSelectedMember(m)} />
      </main>
      <MemberDataEditorDrawer
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        members={members}
        onSaveMembers={handleSaveMembers}
        onResetMembers={loadMembers}
      />

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
