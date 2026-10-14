import React from 'react';

export const LivingBackground: React.FC = () => (
  <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none" aria-hidden="true" id="living-bg-container">
    <div className="absolute inset-0 bg-[#0A0809]" />
    <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(220,38,38,0.10) 0 1px, transparent 1px 64px)' }} />
    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full blur-[120px] opacity-40 sm:animate-drift-slow" style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.55), transparent 70%)' }} />
    <div className="hidden sm:block absolute -bottom-40 -right-24 w-[560px] h-[560px] rounded-full blur-[110px] opacity-30 animate-drift-reverse" style={{ background: 'radial-gradient(circle, rgba(153,27,27,0.6), transparent 70%)' }} />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
  </div>
);
