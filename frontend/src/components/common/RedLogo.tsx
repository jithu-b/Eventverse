import React from 'react';
import logo from '../../assets/tinkerhub-logo.png';

export const RedLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative isolate shrink-0 rounded-[28%] bg-[#2A1214] border-2 border-[#B3282D]/70 overflow-hidden shadow-[0_0_16px_rgba(185,28,28,0.3)] ${className}`}>
    <div className="absolute inset-0 mix-blend-lighten">
      <div className="absolute inset-0 bg-black" />
      <img src={logo} alt="TinkerHub" className="absolute inset-0 w-full h-full object-contain p-[20%] [filter:grayscale(1)_invert(1)_contrast(4)]" />
      <div className="absolute inset-0 bg-[#E04848] mix-blend-multiply" />
    </div>
  </div>
);
