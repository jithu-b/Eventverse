import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowDown, Users, Award } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface ExecomHeroProps {
  onScrollToMembers: () => void;
}

export const ExicomHero: React.FC<ExicomHeroProps> = ({ onScrollToMembers }) => {
  const { isBlush } = useTheme();
  const letters = 'EXECOM'.split('');

  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Editorial Pill Tag */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-semibold tracking-wider uppercase mb-8 backdrop-blur-xl shadow-xs transition-colors duration-300 ${
          isBlush ? 'text-white300' : 'text-gray-200'
        }`}
      >
        <span
          className={`flex h-2 w-2 rounded-full animate-pulse ${
            isBlush ? 'bg-red-600 ring-2 ring-red-300' : 'bg-slate-800 ring-2 ring-slate-400'
          }`}
        />
        <span>Executive Committee 2026–2027</span>
        <span className={isBlush ? 'text-white300' : 'text-slate-300'}>•</span>
        <span className={isBlush ? 'text-white950/60 font-medium' : 'text-gray-400 font-medium'}>
          Student Tech Community
        </span>
      </motion.div>

      {/* Main Massive EXICOM Heading with Staggered Letter Mask Reveal */}
      <div className="overflow-hidden mb-3">
        <motion.h1
          style={{ fontSize: 'clamp(2.5rem, 13vw, 10.5rem)' }}
          className={`font-display whitespace-nowrap font-extrabold tracking-tight leading-none text-transparent bg-clip-text select-none transition-all duration-500 ${
            isBlush
              ? 'bg-gradient-to-b from-[#2E1213] via-[#5C1C1F] to-[#7F1D1D]'
              : 'bg-gradient-to-b from-[#090D16] via-[#1E293B] to-[#475569]'
          }`}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
              },
            },
          }}
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              className={`inline-block transition-transform duration-300 hover:scale-105 ${
                isBlush ? 'hover:text-white300' : 'hover:text-gray-400'
              }`}
              variants={{
                hidden: {
                  y: '100%',
                  opacity: 0,
                  rotateX: 45,
                },
                visible: {
                  y: '0%',
                  opacity: 1,
                  rotateX: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      {/* Supporting Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`font-editorial text-xl sm:text-2xl md:text-3xl lg:text-4xl italic font-normal tracking-wide mb-6 transition-colors duration-300 ${
          isBlush ? 'text-white950/90' : 'text-gray-200'
        }`}
      >
        THE PEOPLE BEHIND THE COMMUNITY
      </motion.h2>

      {/* Thin animated drawing pink line */}
      <div className="w-full max-w-xl my-4 px-6">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`h-[1.5px] w-full bg-gradient-to-r ${
            isBlush
              ? 'from-transparent via-red-400 to-transparent'
              : 'from-transparent via-slate-400 to-transparent'
          }`}
        />
      </div>

      {/* Short Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
        className={`font-body text-base sm:text-lg md:text-xl max-w-2xl font-normal leading-relaxed mb-10 transition-colors duration-300 ${
          isBlush ? 'text-white950/70' : 'text-gray-400'
        }`}
      >
        Meet the people who{' '}
        <span className={`font-semibold ${isBlush ? 'text-white950' : 'text-gray-200'}`}>lead</span>,{' '}
        <span className={`font-semibold ${isBlush ? 'text-white950' : 'text-gray-200'}`}>build</span>,{' '}
        <span className={`font-semibold ${isBlush ? 'text-white950' : 'text-gray-200'}`}>connect</span>, and{' '}
        <span className={`font-semibold ${isBlush ? 'text-white950' : 'text-gray-200'}`}>grow</span> our student
        technology collective.
      </motion.p>

      {/* Quick Community Stats Chips */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12"
      >
        <div
          className={`flex items-center gap-2 px-5 py-2.5 rounded-[24px] glass-card text-sm font-medium shadow-xs transition-colors duration-300 ${
            isBlush ? 'text-white950/90' : 'text-gray-200'
          }`}
        >
          <Users className={`w-4 h-4 ${isBlush ? 'text-white300' : 'text-gray-200'}`} />
          <span>6 Core Leaders</span>
        </div>
        <div
          className={`flex items-center gap-2 px-5 py-2.5 rounded-[24px] glass-card text-sm font-medium shadow-xs transition-colors duration-300 ${
            isBlush ? 'text-white950/90' : 'text-gray-200'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${isBlush ? 'text-white300' : 'text-gray-200'}`} />
          <span>500+ Active Members</span>
        </div>
        <div
          className={`flex items-center gap-2 px-5 py-2.5 rounded-[24px] glass-card text-sm font-medium shadow-xs transition-colors duration-300 ${
            isBlush ? 'text-white950/90' : 'text-gray-200'
          }`}
        >
          <Award className={`w-4 h-4 ${isBlush ? 'text-white300' : 'text-gray-200'}`} />
          <span>12+ Annual Initiatives</span>
        </div>
      </motion.div>

      {/* Action / Scroll button */}
      <motion.button
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.25 }}
        onClick={onScrollToMembers}
        className={`group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-white font-medium text-sm tracking-wide shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer hover:-translate-y-0.5 ${
          isBlush
            ? 'bg-gradient-to-r from-red-600 via-red-600 to-red-700 shadow-red-300/40 hover:shadow-lg hover:shadow-red-300/60 focus:ring-red-400'
            : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 shadow-slate-400/30 hover:shadow-lg hover:shadow-slate-400/50 focus:ring-slate-700'
        }`}
      >
        <span>Explore The Execom</span>
        <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
      </motion.button>
    </section>
  );
};

