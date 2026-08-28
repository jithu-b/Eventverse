import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, ArrowUp, Send } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface ExicomFooterProps {
  onScrollToTop: () => void;
}

export const ExicomFooter: React.FC<ExicomFooterProps> = ({ onScrollToTop }) => {
  const { isBlush } = useTheme();

  return (
    <footer
      className={`relative mt-24 border-t overflow-hidden transition-colors duration-500 ${
        isBlush
          ? 'border-pink-200/70 bg-gradient-to-b from-transparent via-pink-50/50 to-pink-100/60'
          : 'border-slate-200 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-100/60'
      }`}
    >
      {/* Subtle bottom mesh ambient glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div
          className="animate-morph-1 absolute -bottom-[30%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[100px] transition-all duration-500"
          style={{
            background: isBlush
              ? 'radial-gradient(circle, rgba(254, 205, 222, 0.9) 0%, rgba(254, 226, 236, 0.4) 60%, transparent 80%)'
              : 'radial-gradient(circle, rgba(226, 232, 240, 0.9) 0%, rgba(241, 245, 249, 0.4) 60%, transparent 80%)',
            opacity: isBlush ? 0.6 : 0.4,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        {/* Editorial Community Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-semibold tracking-wider uppercase mb-8 shadow-xs ${
            isBlush ? 'text-pink-700' : 'text-slate-700'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isBlush ? 'text-pink-500' : 'text-slate-500'}`} />
          <span>Student Technology Collective</span>
        </motion.div>

        {/* Large Final Text */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className={`font-editorial text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-tight transition-colors duration-300 ${
            isBlush ? 'text-pink-950' : 'text-slate-900'
          }`}
        >
          PEOPLE MAKE THE COMMUNITY.
        </motion.h2>

        {/* Small Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className={`font-body text-base sm:text-lg md:text-xl max-w-xl mx-auto mt-5 leading-relaxed transition-colors duration-300 ${
            isBlush ? 'text-pink-950/70' : 'text-slate-600'
          }`}
        >
          Meet the team behind the ideas, events, and experiences.
        </motion.p>

        {/* Interactive CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="mailto:contact@techcommunity.org"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ${
              isBlush
                ? 'bg-pink-600 hover:bg-pink-700 shadow-pink-300/50 hover:shadow-pink-400/40'
                : 'bg-slate-900 hover:bg-slate-800 shadow-slate-300/50 hover:shadow-slate-400/40'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Connect with Exicom</span>
          </a>

          <button
            onClick={onScrollToTop}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/90 hover:bg-white font-semibold text-sm shadow-xs border hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ${
              isBlush
                ? 'text-pink-900 border-pink-200 hover:border-pink-300'
                : 'text-slate-900 border-slate-300 hover:border-slate-400'
            }`}
          >
            <ArrowUp className={`w-4 h-4 ${isBlush ? 'text-pink-600' : 'text-slate-700'}`} />
            <span>Back to Top</span>
          </button>
        </motion.div>

        {/* Bottom copyright & attribution bar */}
        <div
          className={`mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium ${
            isBlush ? 'border-pink-200/60 text-pink-950/60' : 'border-slate-200 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Exicom 2024–2025 • Student Technology Community</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Built with passion & craft for the student tech ecosystem</span>
            <Heart className={`w-3.5 h-3.5 inline-block ${isBlush ? 'text-pink-500 fill-pink-500' : 'text-rose-500 fill-rose-500'}`} />
          </div>
        </div>
      </div>
    </footer>
  );
};

