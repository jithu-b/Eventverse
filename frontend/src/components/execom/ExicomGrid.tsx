import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Columns, Sparkles, Quote, User } from 'lucide-react';
import { ExicomMember, LayoutViewMode } from './types';
import { ExicomMemberCard } from './ExicomMemberCard';
import { useTheme } from './ThemeContext';

interface ExicomGridProps {
  members: ExicomMember[];
  onSelectMember: (member: ExicomMember) => void;
}

export const ExicomGrid: React.FC<ExicomGridProps> = ({ members, onSelectMember }) => {
  const { isBlush } = useTheme();
  const [viewMode, setViewMode] = useState<LayoutViewMode>('editorial');
  const [activeMemberIndex, setActiveMemberIndex] = useState<number>(0);

  // Active member for counter metadata
  const currentActiveMember = members[activeMemberIndex] || members[0];
  const activeFormattedIndex = currentActiveMember?.number || String(activeMemberIndex + 1).padStart(2, '0');
  const totalFormattedCount = String(members.length).padStart(2, '0');

  const scrollToMember = (member: ExicomMember, index: number) => {
    setActiveMemberIndex(index);
    const element = document.getElementById(`member-card-${member.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Asymmetric layout member pointers
  const lead1 = members.find((m) => m.id === 1) || members[0];
  const lead2 = members.find((m) => m.id === 2) || members[1];
  const focalMember3 = members.find((m) => m.id === 3) || members[2];
  const coord1 = members.find((m) => m.id === 4) || members[3];
  const coord2 = members.find((m) => m.id === 5) || members[4];
  const outreachMember6 = members.find((m) => m.id === 6) || members[5];

  // Container variants for staggered entrance sequence
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const quoteVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section id="exicom-members" className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12 md:py-20">
      {/* Section Header & View Mode Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12 pb-6 border-b transition-colors duration-300 ${
          isBlush ? 'border-pink-200/60' : 'border-slate-200'
        }`}
      >
        <div>
          <div
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-1.5 transition-colors duration-300 ${
              isBlush ? 'text-pink-600' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2024–2025 Board</span>
          </div>
          <h2
            className={`font-editorial text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight transition-colors duration-300 ${
              isBlush ? 'text-pink-950' : 'text-slate-900'
            }`}
          >
            The Executive Council
          </h2>
        </div>

        {/* Right Section: Member Index Counter & View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 self-stretch lg:self-auto justify-between sm:justify-end">
          {/* ELEGANT MEMBER INDEX COUNTER DISPLAY */}
          <div
            id="exicom-member-counter-display"
            className={`flex items-center gap-3 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl glass-card backdrop-blur-xl border shadow-xs transition-colors duration-300 ${
              isBlush ? 'border-pink-200/80' : 'border-slate-200'
            }`}
          >
            {/* Number Index in Editorial Typography */}
            <div className="flex items-baseline gap-1">
              <span
                className={`text-[10px] uppercase font-bold tracking-widest mr-0.5 ${
                  isBlush ? 'text-pink-500' : 'text-slate-500'
                }`}
              >
                No.
              </span>
              <motion.span
                key={activeFormattedIndex}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`font-editorial text-2xl sm:text-3xl font-bold tracking-tight inline-block min-w-[1.75ch] transition-colors duration-300 ${
                  isBlush ? 'text-pink-950' : 'text-slate-900'
                }`}
              >
                {activeFormattedIndex}
              </motion.span>
              <span
                className={`font-editorial text-base sm:text-lg font-medium ${
                  isBlush ? 'text-pink-400' : 'text-slate-400'
                }`}
              >
                / {totalFormattedCount}
              </span>
            </div>

            {/* Subtle Divider */}
            <div className={`h-6 w-px ${isBlush ? 'bg-pink-200/70' : 'bg-slate-200'}`} />

            {/* Interactive Index Pill Buttons */}
            <div className="flex items-center gap-1">
              {members.map((member, idx) => {
                const isActive = activeMemberIndex === idx;
                return (
                  <button
                    key={member.id}
                    id={`counter-pip-${member.id}`}
                    onClick={() => scrollToMember(member, idx)}
                    onMouseEnter={() => setActiveMemberIndex(idx)}
                    title={`${member.name} (${member.role})`}
                    className={`font-editorial text-xs sm:text-sm font-bold w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      isActive
                        ? isBlush
                          ? 'bg-pink-500 text-white shadow-xs scale-105 ring-1 ring-pink-400'
                          : 'bg-slate-900 text-white shadow-xs scale-105 ring-1 ring-slate-700'
                        : isBlush
                        ? 'text-pink-800/80 hover:text-pink-950 hover:bg-pink-100/70'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                  >
                    {member.number}
                  </button>
                );
              })}
            </div>

            {/* Active Member Tooltip Tag (Desktop) */}
            <div
              className={`hidden xl:flex items-center gap-1.5 pl-1.5 text-xs border-l max-w-[160px] truncate ${
                isBlush ? 'text-pink-900 border-pink-200/60' : 'text-slate-700 border-slate-200'
              }`}
            >
              <User className={`w-3 h-3 shrink-0 ${isBlush ? 'text-pink-500' : 'text-slate-500'}`} />
              <span className="font-medium truncate">{currentActiveMember?.name}</span>
            </div>
          </div>

          {/* View Mode Controls */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-card backdrop-blur-xl shadow-xs">
            <button
              onClick={() => setViewMode('editorial')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                viewMode === 'editorial'
                  ? isBlush
                    ? 'bg-pink-500 text-white shadow-xs shadow-pink-300'
                    : 'bg-slate-900 text-white shadow-xs shadow-slate-300'
                  : isBlush
                  ? 'text-pink-800 hover:text-pink-950 hover:bg-pink-50/80'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Editorial Layout</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                viewMode === 'grid'
                  ? isBlush
                    ? 'bg-pink-500 text-white shadow-xs shadow-pink-300'
                    : 'bg-slate-900 text-white shadow-xs shadow-slate-300'
                  : isBlush
                  ? 'text-pink-800 hover:text-pink-950 hover:bg-pink-50/80'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Gallery Grid</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Dynamic Layout Rendering */}
      <AnimatePresence mode="wait">
        {viewMode === 'editorial' ? (
          <motion.div
            key="editorial-layout"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            variants={gridContainerVariants}
            className="space-y-16 md:space-y-24"
          >
            {/* ROW 1: CAMPUS LEAD (01) & BIT LEAD (02) - Dynamic Asymmetric Two-Column */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* 01 Campus Lead (Left - Prominent 6 cols) */}
              <div className="md:col-span-6 lg:col-span-6">
                <div className="mb-3 hidden md:block">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-widest ${
                      isBlush ? 'text-pink-500' : 'text-slate-600'
                    }`}
                  >
                    Leadership Anchor
                  </span>
                </div>
                {lead1 && (
                  <ExicomMemberCard
                    member={lead1}
                    onSelectMember={onSelectMember}
                    index={0}
                    priority={true}
                    onHoverMember={setActiveMemberIndex}
                  />
                )}
              </div>

              {/* 02 BIT Lead (Right - Offset 6 cols with top margin for editorial offset) */}
              <div className="md:col-span-6 lg:col-span-6 md:mt-12 lg:mt-16">
                <div className="mb-3 hidden md:block">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-widest ${
                      isBlush ? 'text-pink-500' : 'text-slate-600'
                    }`}
                  >
                    Technical Foundation
                  </span>
                </div>
                {lead2 && (
                  <ExicomMemberCard
                    member={lead2}
                    onSelectMember={onSelectMember}
                    index={1}
                    priority={true}
                    onHoverMember={setActiveMemberIndex}
                  />
                )}
              </div>
            </div>

            {/* EDITORIAL QUOTE & CENTERPIECE CONNECTOR */}
            <motion.div
              variants={quoteVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="relative my-10 py-10 px-6 sm:px-12 rounded-[32px] sm:rounded-[36px] glass-card text-center max-w-4xl mx-auto shadow-xs"
            >
              <Quote className={`w-8 h-8 mx-auto mb-3 ${isBlush ? 'text-pink-400' : 'text-slate-400'}`} />
              <p
                className={`font-editorial text-lg sm:text-xl md:text-2xl italic leading-snug ${
                  isBlush ? 'text-pink-900/90' : 'text-slate-800'
                }`}
              >
                "Cultivating an open engineering culture where curiosity fuels code, hardware, and lifelong friendships."
              </p>
              <div
                className={`mt-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest ${
                  isBlush ? 'text-pink-600' : 'text-slate-600'
                }`}
              >
                <span>Executive Leadership Guild</span>
              </div>
            </motion.div>

            {/* ROW 2: 03 LEARNING COORDINATOR (Center Focal Feature) */}
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-4">
                <span
                  className={`inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full ${
                    isBlush ? 'text-pink-600 bg-pink-100/70' : 'text-slate-700 bg-slate-100'
                  }`}
                >
                  Educational Core & Dev Pathways
                </span>
              </div>
              {focalMember3 && (
                <ExicomMemberCard
                  member={focalMember3}
                  onSelectMember={onSelectMember}
                  index={2}
                  onHoverMember={setActiveMemberIndex}
                />
              )}
            </div>

            {/* ROW 3: 04 HEAD COORDINATOR & 05 HEAD COORDINATOR (Dynamic Staggered 2-Column) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* 04 Head Coordinator */}
              <div className="md:col-span-6 lg:col-span-6 md:mt-8">
                <div className="mb-3 hidden md:block">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-widest ${
                      isBlush ? 'text-pink-400' : 'text-slate-500'
                    }`}
                  >
                    Operations & Summit Lead
                  </span>
                </div>
                {coord1 && (
                  <ExicomMemberCard
                    member={coord1}
                    onSelectMember={onSelectMember}
                    index={3}
                    onHoverMember={setActiveMemberIndex}
                  />
                )}
              </div>

              {/* 05 Head Coordinator */}
              <div className="md:col-span-6 lg:col-span-6">
                <div className="mb-3 hidden md:block">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-widest ${
                      isBlush ? 'text-pink-400' : 'text-slate-500'
                    }`}
                  >
                    Infrastructure & Sourcing
                  </span>
                </div>
                {coord2 && (
                  <ExicomMemberCard
                    member={coord2}
                    onSelectMember={onSelectMember}
                    index={4}
                    onHoverMember={setActiveMemberIndex}
                  />
                )}
              </div>
            </div>

            {/* ROW 4: 06 OUTREACH LEAD (Center / Wide Balanced Anchor) */}
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-4">
                <span
                  className={`inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full ${
                    isBlush ? 'text-pink-600 bg-pink-100/70' : 'text-slate-700 bg-slate-100'
                  }`}
                >
                  External Alliances & Community Growth
                </span>
              </div>
              {outreachMember6 && (
                <ExicomMemberCard
                  member={outreachMember6}
                  onSelectMember={onSelectMember}
                  index={5}
                  onHoverMember={setActiveMemberIndex}
                />
              )}
            </div>
          </motion.div>
        ) : (
          /* GALLERY GRID MODE (Balanced 3-column / 2-row clean display) */
          <motion.div
            key="grid-layout"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            variants={gridContainerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {members.map((member, index) => (
              <ExicomMemberCard
                key={member.id}
                member={member}
                onSelectMember={onSelectMember}
                index={index}
                onHoverMember={setActiveMemberIndex}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};


