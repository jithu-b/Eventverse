import React from 'react';
import { Sparkles, Heart, Github, Linkedin, Twitter, Instagram, ArrowUp, MapPin, Mail, Globe } from 'lucide-react';
import tinkerhubLogo from '../../assets/tinkerhub-logo.png';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-24 border-t border-[#F3DCE8] bg-white/70 backdrop-blur-md pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#EC4899] to-[#A855F7] p-0.5 shadow-[0_0_10px_2px_rgba(255,255,255,0.35),0_0_14px_4px_rgba(236,72,153,0.18)]">
                <div className="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-[14px] flex items-center justify-center text-white overflow-hidden">
                  <div className="absolute inset-0 rounded-[14px] shadow-[inset_0_0_10px_2px_rgba(255,255,255,0.55)] pointer-events-none" />
                  <img
                    src={tinkerhubLogo}
                    alt="TinkerHub"
                    className="w-7 h-7 object-contain relative z-10 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                  />
                </div>
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-[#18131A] font-outfit">
                  Event<span className="text-gradient-pink">Verse</span>
                </span>
                <span className="ml-2 px-2 py-0.5 text-[9px] font-bold uppercase bg-pink-100 text-[#DB2777] rounded-full">
                  SBCE
                </span>
              </div>
            </div>

            <p className="text-xs text-[#6B6470] leading-relaxed">
              The official technology events, hackathons, live quizzes, and digital credentials platform for <strong>TinkerHub SBCE</strong> at Sri Buddha College of Engineering.
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://github.com/tinkerhub-sbce"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-[#FFF1F7] text-[#6B6470] hover:text-[#EC4899] hover:bg-pink-100 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/tinkerhub-sbce"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-[#FFF1F7] text-[#6B6470] hover:text-[#EC4899] hover:bg-pink-100 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/tinkerhub_sbce"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-[#FFF1F7] text-[#6B6470] hover:text-[#EC4899] hover:bg-pink-100 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18131A]">Platform</h4>
            <ul className="space-y-2 text-xs text-[#6B6470]">
              <li>
                <button onClick={() => onNavigate('discover')} className="hover:text-[#EC4899] transition-colors cursor-pointer">
                  Discover Events
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-[#EC4899] transition-colors cursor-pointer">
                  Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('leaderboard')} className="hover:text-[#EC4899] transition-colors cursor-pointer">
                  Live Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-[#EC4899] transition-colors cursor-pointer">
                  Campus Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('execom')} className="hover:text-[#EC4899] transition-colors cursor-pointer">
                  TinkerHub Execom Team
                </button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18131A]">Features</h4>
            <ul className="space-y-2 text-xs text-[#6B6470]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                <span>Timed Technical Quizzes</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Live QR Attendance Check-in</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>Verified Digital Certificates</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                <span>24hr Hackathon Sprints</span>
              </li>
            </ul>
          </div>

          {/* Location & College info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18131A]">Campus Base</h4>
            <div className="space-y-2 text-xs text-[#6B6470]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#EC4899] shrink-0 mt-0.5" />
                <span>Sri Buddha College of Engineering, Ayathil, Elavumthitta - Pattoor Road, Alappuzha, Kerala 690529</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#EC4899] shrink-0" />
                <span>tinkerhub@sbce.ac.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#EC4899] shrink-0" />
                <span>tinkerhub.org · sbce.ac.in</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 pt-6 border-t border-[#F3DCE8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6470]">
            <p className="flex flex-wrap items-center gap-1.5">
              <span>TinkerHub SBCE</span>
              <Heart className="w-3.5 h-3.5 text-[#EC4899] fill-pink-500" />
              <span>crafted by</span>

              <a
                href="https://github.com/jithu-b"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#DB2777] hover:underline"
              >
                Jithu
              </a>

              <span className="text-[#6B6470]">·</span>

              <a
                href="https://github.com/jithu-b"
                target="_blank"
                rel="noreferrer"
                className="text-[#6B6470] hover:text-[#EC4899] transition-colors"
                aria-label="Jithu's GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.instagram.com/_jithx.u_"
                target="_blank"
                rel="noreferrer"
                className="text-[#6B6470] hover:text-[#EC4899] transition-colors"
                aria-label="Jithu's Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="text-[#6B6470] hover:text-[#EC4899] transition-colors"
                aria-label="Jithu's LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#FFF1F7] hover:bg-pink-100 text-[#DB2777] border border-[#F3DCE8] transition-all cursor-pointer"
            id="scroll-to-top-btn"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
