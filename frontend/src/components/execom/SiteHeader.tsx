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
            ? 'bg-white/85 backdrop-blur-md border-b border-pink-100/80 shadow-xs shadow-pink-100/40 py-3'
            : 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs shadow-slate-200/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs transition-all duration-300 ${
              isBlush
                ? 'bg-gradient-to-tr from-pink-500 to-rose-400 shadow-pink-300'
                : 'bg-gradient-to-tr from-slate-900 to-slate-700 shadow-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-display text-base sm:text-lg font-extrabold tracking-tight transition-colors duration-300 ${
                isBlush ? 'text-pink-950' : 'text-slate-900'
              }`}
            >
              NEXUS <span className={isBlush ? 'font-light text-pink-500' : 'font-light text-slate-500'}>TECH</span>
            </span>
            <span
              className={`text-[10px] font-semibold tracking-widest uppercase -mt-1 hidden sm:block transition-colors duration-300 ${
                isBlush ? 'text-pink-700' : 'text-slate-500'
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
                ? 'text-pink-900/80 hover:text-pink-950 hover:bg-pink-50/80'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
            }`}
          >
            Home
          </button>
          <button
            onClick={onScrollToMembers}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-xs cursor-pointer transition-all duration-300 ${
              isBlush
                ? 'bg-pink-500 hover:bg-pink-600 shadow-pink-300'
                : 'bg-slate-900 hover:bg-slate-800 shadow-slate-300'
            }`}
          >
            Execom 2026–27
          </button>
          <a
            href="#exicom-members"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
              isBlush
                ? 'text-pink-900/80 hover:text-pink-950 hover:bg-pink-50/80'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
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
                ? 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-800'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
            }`}
            title="Edit member data / Swap pictures"
          >
            <SlidersHorizontal className={`w-3.5 h-3.5 ${isBlush ? 'text-pink-600' : 'text-slate-700'}`} />
            <span className="hidden lg:inline">Customize Exicom</span>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-white text-xs font-semibold shadow-xs transition-all duration-200 ${
              isBlush
                ? 'bg-pink-950 hover:bg-pink-900'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            <span>Portal</span>
            <ArrowUpRight className={`w-3 h-3 ${isBlush ? 'text-pink-300' : 'text-slate-300'}`} />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl border ${
              isBlush ? 'bg-pink-50 border-pink-200 text-pink-800' : 'bg-slate-100 border-slate-300 text-slate-800'
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
            isBlush ? 'bg-white/95 border-pink-200' : 'bg-white/95 border-slate-200'
          }`}
        >
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 text-sm font-semibold rounded-lg ${
                isBlush ? 'text-pink-900 hover:bg-pink-50' : 'text-slate-900 hover:bg-slate-100'
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
                isBlush ? 'text-pink-600 bg-pink-50' : 'text-slate-900 bg-slate-100'
              }`}
            >
              Exicom Members (6)
            </button>
            <button
              onClick={() => {
                onOpenEditor();
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 text-sm font-semibold rounded-lg flex items-center justify-between ${
                isBlush ? 'text-pink-800 hover:bg-pink-50' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span>Customize Members</span>
              <SlidersHorizontal className={`w-4 h-4 ${isBlush ? 'text-pink-600' : 'text-slate-700'}`} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

