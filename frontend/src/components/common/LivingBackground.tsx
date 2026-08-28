import React from 'react';

export const LivingBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
      id="living-bg-container"
    >
      {/* Base warm/pink tinted canvas */}
      <div className="absolute inset-0 bg-[#FFF8FC]" />

      {/* Soft floating pastel pink gradient mesh blob 1 (Top Left) */}
      <div 
        className="absolute -top-32 -left-28 w-[580px] h-[580px] rounded-full mix-blend-multiply filter blur-[95px] opacity-45 animate-drift-slow"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.45) 0%, rgba(243, 232, 255, 0.25) 70%, transparent 100%)'
        }}
      />

      {/* Soft floating lavender/purple gradient blob 2 (Top Right) */}
      <div 
        className="absolute top-20 -right-24 w-[520px] h-[520px] rounded-full mix-blend-multiply filter blur-[90px] opacity-35 animate-drift-reverse"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, rgba(236, 72, 153, 0.2) 65%, transparent 100%)'
        }}
      />

      {/* Subtle Cyan / Soft glow blob 3 (Mid-bottom) */}
      <div 
        className="absolute bottom-1/4 left-1/3 w-[460px] h-[460px] rounded-full mix-blend-multiply filter blur-[105px] opacity-25 animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.25) 0%, rgba(236, 72, 153, 0.15) 60%, transparent 100%)'
        }}
      />

      {/* Bottom deep pink accent blob 4 */}
      <div 
        className="absolute -bottom-24 -right-16 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-drift-slow"
        style={{
          background: 'radial-gradient(circle, rgba(219, 39, 119, 0.3) 0%, rgba(243, 232, 255, 0.4) 65%, transparent 100%)'
        }}
      />

      {/* Subtle micro dots pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#18131A 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Floating subtle micro-sparkles/dots for living ambiance */}
      <div className="absolute top-[18%] left-[12%] w-2 h-2 rounded-full bg-pink-400 opacity-30 animate-float-gentle" />
      <div className="absolute top-[42%] right-[16%] w-2.5 h-2.5 rounded-full bg-purple-400 opacity-25 animate-float-delayed" />
      <div className="absolute bottom-[30%] left-[22%] w-1.5 h-1.5 rounded-full bg-pink-500 opacity-35 animate-float-gentle" />
      <div className="absolute top-[70%] right-[32%] w-2 h-2 rounded-full bg-cyan-400 opacity-20 animate-float-delayed" />
    </div>
  );
};
