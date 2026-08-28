import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from './ThemeContext';

export const PinkMeshBackground: React.FC = () => {
  const { isBlush } = useTheme();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none transition-colors duration-500">
      {/* Base background with mesh-bg overlay */}
      <div className={`absolute inset-0 transition-colors duration-500 ${isBlush ? 'bg-[#faf7f9]' : 'bg-[#ffffff]'} mesh-bg`} />

      {/* Primary Top Left Ambient Blob */}
      <div
        className={`blob animate-morph-1 absolute -top-[15%] -left-[10%] w-[650px] h-[650px] md:w-[850px] md:h-[850px] ${
          isBlush ? 'opacity-70 mix-blend-multiply blur-[80px]' : 'opacity-40 mix-blend-multiply blur-[90px]'
        } transition-all duration-700`}
        style={{
          background: isBlush
            ? 'radial-gradient(circle, rgba(254, 205, 222, 0.85) 0%, rgba(253, 232, 240, 0.45) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(226, 232, 240, 0.9) 0%, rgba(241, 245, 249, 0.5) 50%, transparent 70%)',
        }}
      />

      {/* Top Right Ambient Blob */}
      <div
        className={`blob animate-morph-2 absolute -top-[10%] -right-[12%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] ${
          isBlush ? 'opacity-65 mix-blend-multiply blur-[90px]' : 'opacity-45 mix-blend-multiply blur-[100px]'
        } transition-all duration-700`}
        style={{
          background: isBlush
            ? 'radial-gradient(circle, rgba(253, 186, 211, 0.8) 0%, rgba(254, 226, 236, 0.4) 55%, transparent 75%)'
            : 'radial-gradient(circle, rgba(203, 213, 225, 0.7) 0%, rgba(248, 250, 252, 0.45) 55%, transparent 75%)',
          animationDelay: '-4s',
        }}
      />

      {/* Mid Center Delicate Ribbon */}
      <div
        className={`blob animate-morph-1 absolute top-[40%] left-[20%] w-[550px] h-[550px] md:w-[750px] md:h-[750px] ${
          isBlush ? 'opacity-50 mix-blend-multiply blur-[100px]' : 'opacity-35 mix-blend-multiply blur-[110px]'
        } transition-all duration-700`}
        style={{
          background: isBlush
            ? 'radial-gradient(circle, rgba(251, 207, 232, 0.7) 0%, rgba(255, 241, 242, 0.45) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(226, 232, 240, 0.6) 0%, rgba(241, 245, 249, 0.4) 60%, transparent 80%)',
          animationDelay: '-8s',
        }}
      />

      {/* Lower Page Ambient Blob */}
      <div
        className={`blob animate-morph-2 absolute bottom-[5%] -right-[5%] w-[600px] h-[600px] md:w-[700px] md:h-[700px] ${
          isBlush ? 'opacity-55 mix-blend-multiply blur-[85px]' : 'opacity-40 mix-blend-multiply blur-[95px]'
        } transition-all duration-700`}
        style={{
          background: isBlush
            ? 'radial-gradient(circle, rgba(252, 218, 230, 0.75) 0%, rgba(255, 235, 242, 0.35) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(219, 228, 238, 0.65) 0%, rgba(248, 250, 252, 0.3) 50%, transparent 75%)',
          animationDelay: '-12s',
        }}
      />

      {/* Bottom Left Glow */}
      <div
        className={`blob animate-morph-1 absolute bottom-0 -left-[10%] w-[500px] h-[500px] md:w-[650px] md:h-[650px] ${
          isBlush ? 'opacity-45 mix-blend-multiply blur-[90px]' : 'opacity-30 mix-blend-multiply blur-[100px]'
        } transition-all duration-700`}
        style={{
          background: isBlush
            ? 'radial-gradient(circle, rgba(255, 215, 225, 0.65) 0%, rgba(254, 242, 242, 0.25) 60%, transparent 75%)'
            : 'radial-gradient(circle, rgba(226, 232, 240, 0.6) 0%, rgba(255, 255, 255, 0.2) 60%, transparent 75%)',
          animationDelay: '-16s',
        }}
      />

      {/* Subtle fine dot grid texture for editorial tactile feel */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${isBlush ? 'opacity-[0.22]' : 'opacity-[0.16]'}`}
        style={{
          backgroundImage: isBlush
            ? `radial-gradient(rgba(225, 137, 169, 0.25) 1px, transparent 1px)`
            : `radial-gradient(rgba(100, 116, 139, 0.22) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Floating decorative sparkles layer for Artistic Flair aesthetic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { id: 'sp-1', top: '12%', left: '8%', size: 'text-xl', icon: '✦', dur: 18, delay: 0, dx: [0, 12, -8, 0], dy: [0, -25, 0], rot: [0, 180, 360], blushColor: 'text-pink-300/60', minColor: 'text-slate-400/50' },
          { id: 'sp-2', top: '22%', right: '12%', size: 'text-2xl', icon: '✧', dur: 22, delay: 2.5, dx: [0, -15, 10, 0], dy: [0, 28, 0], rot: [360, 180, 0], blushColor: 'text-rose-400/50', minColor: 'text-zinc-500/40' },
          { id: 'sp-3', top: '38%', left: '5%', size: 'text-sm', icon: '✦', dur: 14, delay: 1, dx: [0, 10, 0], dy: [0, -18, 0], rot: [0, 90, 180], blushColor: 'text-pink-400/40', minColor: 'text-slate-400/35' },
          { id: 'sp-4', top: '48%', right: '7%', size: 'text-lg', icon: '✧', dur: 20, delay: 4, dx: [0, -12, 0], dy: [0, -22, 0], rot: [0, 120, 240, 360], blushColor: 'text-pink-300/55', minColor: 'text-zinc-400/45' },
          { id: 'sp-5', top: '62%', left: '14%', size: 'text-xl', icon: '✦', dur: 16, delay: 3, dx: [0, 16, -10, 0], dy: [0, 20, 0], rot: [0, 90, 180, 270, 360], blushColor: 'text-rose-300/50', minColor: 'text-slate-500/40' },
          { id: 'sp-6', top: '75%', right: '14%', size: 'text-2xl', icon: '✧', dur: 24, delay: 5.5, dx: [0, -18, 8, 0], dy: [0, -30, 0], rot: [360, 270, 90, 0], blushColor: 'text-pink-400/45', minColor: 'text-zinc-400/40' },
          { id: 'sp-7', top: '88%', left: '9%', size: 'text-base', icon: '✦', dur: 19, delay: 2, dx: [0, 14, -6, 0], dy: [0, -20, 0], rot: [0, 180, 360], blushColor: 'text-pink-300/50', minColor: 'text-slate-400/45' },
          { id: 'sp-8', top: '15%', right: '28%', size: 'text-sm', icon: '✦', dur: 15, delay: 6, dx: [0, -8, 6, 0], dy: [0, 15, 0], rot: [0, 90, 180], blushColor: 'text-rose-400/40', minColor: 'text-zinc-500/35' },
          { id: 'sp-9', top: '55%', left: '48%', size: 'text-xs', icon: '✧', dur: 21, delay: 7, dx: [0, 10, -10, 0], dy: [0, -16, 0], rot: [0, 180, 360], blushColor: 'text-pink-300/40', minColor: 'text-slate-400/35' },
          { id: 'sp-10', top: '82%', right: '40%', size: 'text-sm', icon: '✦', dur: 17, delay: 4.5, dx: [0, -10, 5, 0], dy: [0, 22, 0], rot: [360, 180, 0], blushColor: 'text-pink-400/35', minColor: 'text-zinc-400/30' },
          { id: 'sp-11', top: '30%', left: '25%', size: 'text-xs', icon: '✦', dur: 23, delay: 8, dx: [0, 8, -8, 0], dy: [0, -20, 0], rot: [0, 90, 180], blushColor: 'text-rose-300/45', minColor: 'text-slate-400/35' },
          { id: 'sp-12', top: '92%', right: '20%', size: 'text-lg', icon: '✧', dur: 20, delay: 3.5, dx: [0, 12, -12, 0], dy: [0, -24, 0], rot: [0, 180, 360], blushColor: 'text-pink-300/45', minColor: 'text-zinc-400/35' },
        ].map((s) => (
          <motion.div
            key={s.id}
            animate={{
              x: s.dx,
              y: s.dy,
              rotate: s.rot,
              opacity: [0.2, 0.65, 0.2],
              scale: [0.85, 1.15, 0.85],
            }}
            transition={{
              duration: s.dur,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: s.delay,
            }}
            style={{
              top: s.top,
              left: s.left,
              right: s.right,
            }}
            className={`absolute ${s.size} ${isBlush ? s.blushColor : s.minColor} select-none ${
              isBlush
                ? 'drop-shadow-[0_0_8px_rgba(244,114,182,0.4)]'
                : 'drop-shadow-[0_0_8px_rgba(148,163,184,0.35)]'
            } transition-colors duration-500`}
          >
            {s.icon}
          </motion.div>
        ))}

        {/* Delicate floating circular aura rings */}
        <motion.div
          animate={{
            y: [0, -25, 0],
            x: [0, 15, 0],
            scale: [1, 1.08, 1],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className={`absolute top-[65%] left-[8%] w-16 h-16 rounded-full border ${
            isBlush ? 'border-pink-300/40' : 'border-slate-300/40'
          } transition-colors duration-500`}
        />

        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -12, 0],
            scale: [1, 1.06, 1],
            opacity: [0.12, 0.3, 0.12],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className={`absolute top-[28%] right-[6%] w-20 h-20 rounded-full border ${
            isBlush ? 'border-rose-300/30' : 'border-slate-300/30'
          } transition-colors duration-500`}
        />
      </div>
    </div>
  );
};

