import React from 'react';
import { Sparkles, Heart, Github, Linkedin, Twitter, Instagram, ArrowUp, MapPin, Mail, Globe } from 'lucide-react';
import { RedLogo } from './RedLogo';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-24 border-t border-[#3B3535] bg-[#1F1C1C] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <RedLogo className="w-9 h-9" />
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white font-outfit">
                  Event<span className="text-gradient-pink">Verse</span>
                </span>
                <span className="ml-2 px-2 py-0.5 text-[9px] font-bold uppercase bg-red-500/15 text-[#E04848] rounded-full">
                  SBCE
                </span>
              </div>
            </div>

            <p className="text-xs text-[#B3ABAB] leading-relaxed">
              The official technology events, hackathons, live quizzes, and digital credentials platform for <strong>TinkerHub SBCE</strong> at Sree Buddha College of Engineering.
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://github.com/tinkerhub-sbce"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-[#141012] text-[#B3ABAB] hover:text-[#E04848] hover:bg-red-500/15 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/tinkerhub-sbce"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-[#141012] text-[#B3ABAB] hover:text-[#E04848] hover:bg-red-500/15 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/tinkerhub_sbce"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-[#141012] text-[#B3ABAB] hover:text-[#E04848] hover:bg-red-500/15 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-xs text-[#B3ABAB]">
              <li>
                <button onClick={() => onNavigate('discover')} className="hover:text-[#E04848] transition-colors cursor-pointer">
                  Discover Events
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-[#E04848] transition-colors cursor-pointer">
                  Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-[#E04848] transition-colors cursor-pointer">
                  Campus Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('execom')} className="hover:text-[#E04848] transition-colors cursor-pointer">
                  TinkerHub Execom Team
                </button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Features</h4>
            <ul className="space-y-2 text-xs text-[#B3ABAB]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                <span>Timed Technical Quizzes</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-700" />
                <span>Live QR Attendance Check-in</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>Verified Digital Certificates</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>24hr Hackathon Sprints</span>
              </li>
            </ul>
          </div>

          {/* Location & College info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Campus Base</h4>
            <div className="space-y-2 text-xs text-[#B3ABAB]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E04848] shrink-0 mt-0.5" />
                <span>Sree Buddha College of Engineering, Ayathil, Elavumthitta - Pattoor Road, Alappuzha, Kerala 690529</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E04848] shrink-0" />
                <span>tinkerhub@sbce.ac.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#E04848] shrink-0" />
                <span>tinkerhub.org · sbce.ac.in</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 pt-6 border-t border-[#3B3535] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B3ABAB]">
            <p className="flex flex-wrap items-center gap-1.5">
              <span>TinkerHub SBCE</span>
              <Heart className="w-3.5 h-3.5 text-[#E04848] fill-red-600" />
              <span>crafted by</span>

              <a
                href="https://github.com/jithu-b"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#E04848] hover:underline"
              >
                Jithu
              </a>

              <span className="text-[#B3ABAB]">·</span>

              <a
                href="https://github.com/jithu-b"
                target="_blank"
                rel="noreferrer"
                className="text-[#B3ABAB] hover:text-[#E04848] transition-colors"
                aria-label="Jithu's GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.instagram.com/_jithx.u_"
                target="_blank"
                rel="noreferrer"
                className="text-[#B3ABAB] hover:text-[#E04848] transition-colors"
                aria-label="Jithu's Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.linkedin.com/in/jithu-biju-66a247234/"
                target="_blank"
                rel="noreferrer"
                className="text-[#B3ABAB] hover:text-[#E04848] transition-colors"
                aria-label="Jithu's LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#141012] hover:bg-red-500/15 text-[#E04848] border border-[#B3282D] transition-all cursor-pointer"
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
