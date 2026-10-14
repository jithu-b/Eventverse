import React, { useState, useEffect } from 'react';
import { Sparkles, SlidersHorizontal, ArrowUpRight, Menu, X } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface SiteHeaderProps {
  onOpenEditor: () => void;
  onScrollToMembers: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ onOpenEditor, onScrollToMembers }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isBlush } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? isBlush
            ? 'bg-[#1F1C1C] border-b border-red-100/80 shadow-xs shadow-red-100/40 py-3'
            : 'bg-[#1F1C1C] border-b border-white/10 shadow-xs shadow-slate-200/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs transition-all duration-300 ${
              isBlush
                ? 'bg-gradient-to-tr from-red-600 to-red-400 shadow-red-300'
                : 'bg-gradient-to-tr from-slate-900 to-slate-700 shadow-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-display text-base sm:text-lg font-extrabold tracking-tight transition-colors duration-300 ${
                isBlush ? 'text-white950' : 'text-gray-200'
              }`}
            >
              NEXUS <span className={isBlush ? 'font-light text-white300' : 'font-light text-gray-400'}>TECH</span>
            </span>
            <span
              className={`text-[10px] font-semibold tracking-widest uppercase -mt-1 hidden sm:block transition-colors duration-300 ${
                isBlush ? 'text-white300' : 'text-gray-400'
              }`}
            >
              Student Community
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full glass-card backdrop-blur-xl shadow-xs">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
              isBlush
                ? 'text-white950/80 hover:text-white950 hover:bg-red-500/15'
                : 'text-gray-200 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            Home
          </button>
          <button
            onClick={onScrollToMembers}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-xs cursor-pointer transition-all duration-300 ${
              isBlush
                ? 'bg-red-600 hover:bg-red-700 shadow-red-300'
                : 'bg-slate-900 hover:bg-slate-800 shadow-slate-300'
            }`}
          >
            Execom 2026–27
          </button>
          <a
            href="#exicom-members"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
              isBlush
                ? 'text-white950/80 hover:text-white950 hover:bg-red-500/15'
                : 'text-gray-200 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            Initiatives
          </a>
        </nav>

        {/* Right CTA / Customizer Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onOpenEditor}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-xs transition-all duration-200 cursor-pointer ${
              isBlush
                ? 'bg-red-500/15 hover:bg-red-500/15 border-red-500/30 text-white300'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200'
            }`}
            title="Edit member data / Swap pictures"
          >
            <SlidersHorizontal className={`w-3.5 h-3.5 ${isBlush ? 'text-white300' : 'text-gray-200'}`} />
            <span className="hidden lg:inline">Customize Execom</span>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-white text-xs font-semibold shadow-xs transition-all duration-200 ${
              isBlush
                ? 'bg-red-950 hover:bg-red-950'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            <span>Portal</span>
            <ArrowUpRight className={`w-3 h-3 ${isBlush ? 'text-white300' : 'text-slate-300'}`} />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl border ${
              isBlush ? 'bg-red-500/15 border-red-500/30 text-white300' : 'bg-white/5 border-white/10 text-gray-200'
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden px-4 pt-3 pb-4 backdrop-blur-lg border-b shadow-md ${
            isBlush ? 'bg-white/5 border-red-500/30' : 'bg-white/5 border-white/10'
          }`}
        >
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 text-sm font-semibold rounded-lg ${
                isBlush ? 'text-white950 hover:bg-red-500/15' : 'text-gray-200 hover:bg-white/5'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                onScrollToMembers();
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 text-sm font-semibold rounded-lg ${
                isBlush ? 'text-white300 bg-red-500/15' : 'text-gray-200 bg-white/5'
              }`}
            >
              Execom Members (6)
            </button>
            <button
              onClick={() => {
                onOpenEditor();
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 text-sm font-semibold rounded-lg flex items-center justify-between ${
                isBlush ? 'text-white300 hover:bg-red-500/15' : 'text-gray-200 hover:bg-white/5'
              }`}
            >
              <span>Customize Members</span>
              <SlidersHorizontal className={`w-4 h-4 ${isBlush ? 'text-white300' : 'text-gray-200'}`} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

