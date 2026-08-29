import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'motion/react';
import { ArrowUpRight, Sparkles, Image as ImageIcon, Camera, Eye } from 'lucide-react';
import { ExicomMember } from '../../api/execomApi';
import { SocialLinks } from './SocialLinks';
import { useTheme } from './ThemeContext';
import { useIsMobileOrTablet } from '../../hooks/useIsMobileOrTablet';
import { mediaUrl } from '../../api/photoApi';

interface ExicomMemberCardProps {
  member: ExicomMember;
  onSelectMember: (member: ExicomMember) => void;
  index: number;
  priority?: boolean;
  onHoverMember?: (index: number) => void;
}

export const ExicomMemberCard: React.FC<ExicomMemberCardProps> = ({
  member,
  onSelectMember,
  index,
  priority = false,
  onHoverMember
}) => {
  const { isBlush } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const cardGlowRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [mobileShow3D, setMobileShow3D] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [, setSecondaryLoaded] = useState(false);

  // Motion values for smooth 3D tilt & magnetic pull
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);

  // Smooth springs for 3D physics & magnetic attraction
  const springConfig = { damping: 28, stiffness: 300 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const magneticSpringConfig = { damping: 18, stiffness: 220, mass: 0.5 };
  const smoothMagneticX = useSpring(magneticX, magneticSpringConfig);
  const smoothMagneticY = useSpring(magneticY, magneticSpringConfig);

  // Card Level 3D Tilt Rotations
  const rotateX = useTransform(smoothMouseY, [0, 1], [4.5, -4.5]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-4.5, 4.5]);

  // Floating 3D Foreground Photo Transform (Stronger tilt & parallax for pop-out effect)
  const popRotateX = useTransform(smoothMouseY, [0, 1], [7, -7]);
  const popRotateY = useTransform(smoothMouseX, [0, 1], [-7, 7]);
  const popTranslateX = useTransform(smoothMouseX, [0, 1], [-10, 10]);
  const popTranslateY = useTransform(smoothMouseY, [0, 1], [-10, 10]);

  // Background Primary Photo Recess Parallax
  const bgTranslateX = useTransform(smoothMouseX, [0, 1], [4, -4]);
  const bgTranslateY = useTransform(smoothMouseY, [0, 1], [4, -4]);

  // Check touch capabilities
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  // Optimized RAF mouse move handler for background glow and physics
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const xPercent = Math.max(0, Math.min(1, x / rect.width));
        const yPercent = Math.max(0, Math.min(1, y / rect.height));

        mouseX.set(xPercent);
        mouseY.set(yPercent);

        // Magnetic Pull Calculation: Pulls the card slightly towards cursor
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = x - centerX;
        const deltaY = y - centerY;

        // Proportional magnetic pull with bounded radius for natural tactile physics
        const pullFactor = 0.08;
        const maxPullX = 14;
        const maxPullY = 12;
        const pullX = Math.max(-maxPullX, Math.min(maxPullX, deltaX * pullFactor));
        const pullY = Math.max(-maxPullY, Math.min(maxPullY, deltaY * pullFactor));

        magneticX.set(pullX);
        magneticY.set(pullY);

        if (cardGlowRef.current) {
          const glowColor = isBlush ? 'rgba(244, 114, 182, 0.22)' : 'rgba(100, 116, 139, 0.2)';
          cardGlowRef.current.style.background = `radial-gradient(400px circle at ${(xPercent * 100).toFixed(1)}% ${(yPercent * 100).toFixed(1)}%, ${glowColor}, transparent 60%)`;
        }
      }
    });
  }, [isTouchDevice, isBlush, mouseX, mouseY, magneticX, magneticY]);

  const handleMouseEnter = useCallback(() => {
    if (!isTouchDevice) {
      setIsHovered(true);
      onHoverMember?.(index);
      if (cardGlowRef.current) {
        cardGlowRef.current.style.opacity = '1';
      }
    }
  }, [isTouchDevice, onHoverMember, index]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
    magneticX.set(0);
    magneticY.set(0);

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    if (cardGlowRef.current) {
      cardGlowRef.current.style.opacity = '0';
    }
  }, [mouseX, mouseY, magneticX, magneticY]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Toggle 3D view on mobile tap
  const handlePhotoTap = (e: React.MouseEvent) => {
    if (isTouchDevice) {
      e.stopPropagation();
      setMobileShow3D((prev) => !prev);
    }
  };

  const is3DActive = isTouchDevice ? mobileShow3D : isHovered;

  // Cinematic staggered entrance animation variants
  const isMobileCard = useIsMobileOrTablet();
  const cardEntranceVariants = isMobileCard ? {
    hidden: { opacity: 0, y: 16 },
    visible: (customIndex: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: Math.min(customIndex * 0.04, 0.2), ease: 'easeOut' },
    }),
  } : {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.94,
      filter: 'blur(4px)',
    },
    visible: (customIndex: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.85,
        delay: customIndex * 0.12,
        ease: [0.22, 1, 0.36, 1], // Cinematic cubic-bezier easing
      },
    }),
  };

  return (
    <motion.div
      variants={cardEntranceVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px', amount: 0.15 }}
      className="perspective-1200 w-full group select-none"
    >
      <motion.div
        id={`member-card-${member.id}`}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelectMember(member)}
        style={{
          x: isTouchDevice ? 0 : smoothMagneticX,
          y: isTouchDevice ? 0 : smoothMagneticY,
          rotateX: isTouchDevice ? 0 : rotateX,
          rotateY: isTouchDevice ? 0 : rotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        className={`relative w-full rounded-[32px] sm:rounded-[36px] glass-card glass-card-hover p-4 sm:p-5 transition-all duration-300 cursor-pointer overflow-visible backdrop-blur-xl ${
          is3DActive
            ? isBlush
              ? 'shadow-2xl shadow-pink-400/30 ring-1 ring-pink-400/60'
              : 'shadow-2xl shadow-slate-400/30 ring-1 ring-slate-400/60'
            : isBlush
            ? 'shadow-lg shadow-pink-200/20'
            : 'shadow-lg shadow-slate-200/40'
        }`}
        tabIndex={0}
        role="button"
        aria-label={`View full profile of ${member.name}, ${member.role}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectMember(member);
          }
        }}
      >
        {/* Cursor-following Glow inside Card */}
        {!isTouchDevice && (
          <div
            ref={cardGlowRef}
            className="pointer-events-none absolute inset-0 rounded-[32px] sm:rounded-[36px] opacity-0 transition-opacity duration-300 z-0"
            style={{
              willChange: 'background, opacity',
            }}
          />
        )}

        {/* Card Header: Number & Role Pill */}
        <div className="flex items-center justify-between gap-2 mb-3.5 px-1 relative z-10">
          <div className="flex items-center gap-2.5">
            <span
              className={`font-editorial text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-300 ${
                isBlush ? 'text-pink-900/80' : 'text-slate-800'
              }`}
            >
              {member.number}
            </span>
            <span className={`h-3.5 w-[1px] ${isBlush ? 'bg-pink-200' : 'bg-slate-200'}`} />
            <span
              className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full transition-colors duration-300 ${
                isBlush
                  ? 'text-pink-600 bg-pink-50/90 border border-pink-200/60'
                  : 'text-slate-700 bg-slate-100 border border-slate-200'
              }`}
            >
              {member.role}
            </span>
          </div>

          {/* Micro Action Button / Arrow */}
          <div
            className={`flex items-center gap-1 text-xs font-semibold tracking-wide transition-all duration-300 ${
              is3DActive
                ? isBlush
                  ? 'text-pink-600 translate-x-0 opacity-100'
                  : 'text-slate-900 translate-x-0 opacity-100'
                : isBlush
                ? 'text-pink-400/60 -translate-x-1 opacity-80'
                : 'text-slate-400 -translate-x-1 opacity-80'
            }`}
          >
            <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-medium">Profile</span>
            <div
              className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                isBlush
                  ? 'bg-pink-50 border-pink-200 text-pink-600 group-hover:bg-pink-500 group-hover:text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-700 group-hover:bg-slate-900 group-hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* 3D STAGE PHOTO CONTAINER */}
        <div
          onClick={handlePhotoTap}
          className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-[22px] perspective-1000 preserve-3d z-20"
        >
          {/* Skeleton placeholder while loading */}
          {!imageLoaded && (
            <div
              className={`absolute inset-0 rounded-[22px] flex items-center justify-center animate-pulse z-10 ${
                isBlush
                  ? 'bg-gradient-to-tr from-pink-50 via-rose-50 to-pink-100'
                  : 'bg-gradient-to-tr from-slate-50 via-slate-100 to-slate-200'
              }`}
            >
              <Sparkles className={`w-8 h-8 ${isBlush ? 'text-pink-300' : 'text-slate-400'}`} />
            </div>
          )}

          {/* BASE FRAME & PRIMARY PORTRAIT (Physical base card resting below) */}
          <motion.div
            animate={{
              transform: is3DActive
                ? 'translateZ(-24px) scale(0.94) rotate(-1.5deg)'
                : 'translateZ(0px) scale(1) rotate(0deg)',
              opacity: is3DActive ? 0.75 : 1,
              filter: is3DActive ? 'brightness(0.92) contrast(0.95)' : 'brightness(1) contrast(1)',
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              x: isTouchDevice ? 0 : bgTranslateX,
              y: isTouchDevice ? 0 : bgTranslateY,
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity, filter',
            }}
            className={`absolute inset-0 w-full h-full rounded-[22px] overflow-hidden border-2 shadow-inner z-10 ${
              isBlush ? 'bg-pink-100/50 border-pink-200/80' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <img
              src={member.image ? mediaUrl(member.image) : undefined}
              alt={`${member.name} - ${member.role}`}
              loading={priority ? 'eager' : 'lazy'}
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-cover object-center pointer-events-none"
            />
            <div
              className={`absolute inset-0 pointer-events-none ${
                isBlush
                  ? 'bg-gradient-to-t from-pink-950/30 via-transparent to-transparent'
                  : 'bg-gradient-to-t from-slate-950/30 via-transparent to-transparent'
              }`}
            />

            {/* Depth shadow cast by the lifting foreground card */}
            {is3DActive && (
              <div
                className={`absolute inset-0 backdrop-blur-[0.5px] transition-opacity duration-300 pointer-events-none ${
                  isBlush ? 'bg-pink-950/20' : 'bg-slate-950/20'
                }`}
              />
            )}
          </motion.div>

          {/* SECONDARY HOVER IMAGE CARD (Lifts out from behind with 3D perspective, z-index elevation, and physical drop shadow) */}
          <motion.div
            animate={{
              transform: is3DActive
                ? 'translateZ(64px) translateY(-10px) translateX(4px) rotate(2deg) scale(1.03)'
                : 'translateZ(-30px) translateY(12px) translateX(-4px) rotate(-3deg) scale(0.92)',
              opacity: is3DActive ? 1 : 0,
              zIndex: is3DActive ? 30 : 5,
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
              mass: 0.8,
            }}
            style={{
              rotateX: isTouchDevice ? 0 : popRotateX,
              rotateY: isTouchDevice ? 0 : popRotateY,
              x: isTouchDevice ? 0 : popTranslateX,
              y: isTouchDevice ? 0 : popTranslateY,
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity',
            }}
            className={`absolute inset-0 w-full h-full rounded-[20px] overflow-hidden pointer-events-none transition-shadow duration-300 ${
              is3DActive
                ? isBlush
                  ? 'shadow-[0_28px_45px_-12px_rgba(219,39,119,0.5),0_18px_30px_-8px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.8)] border-2 border-white'
                  : 'shadow-[0_28px_45px_-12px_rgba(15,23,42,0.35),0_18px_30px_-8px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.8)] border-2 border-white'
                : 'shadow-none border-transparent'
            }`}
          >
            {/* The Underlying Candid/Action Photo */}
            <img
              src={member.hoverImage ? mediaUrl(member.hoverImage) : undefined}
              alt={`${member.name} candid in action`}
              loading="lazy"
              onLoad={() => setSecondaryLoaded(true)}
              className="w-full h-full object-cover object-center filter brightness-[1.03] contrast-[1.03] pointer-events-none"
            />

            {/* Dynamic Light Sheen & Tint on 3D Floating Layer */}
            <div
              className={`absolute inset-0 pointer-events-none ${
                isBlush
                  ? 'bg-gradient-to-tr from-pink-900/35 via-transparent to-white/25'
                  : 'bg-gradient-to-tr from-slate-900/35 via-transparent to-white/25'
              }`}
            />
            <div className="absolute inset-0 shine-effect opacity-40 pointer-events-none" />

            {/* 3D Depth Specular Edge Highlight */}
            <div className="absolute inset-0 border border-white/50 rounded-[18px] pointer-events-none" />

            {/* Floating 3D Badge (Elevated further along Z-axis) */}
            <motion.div
              animate={{
                transform: is3DActive ? 'translateZ(30px)' : 'translateZ(0px)',
                opacity: is3DActive ? 1 : 0,
              }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border text-[10px] font-bold tracking-wider uppercase shadow-md pointer-events-none ${
                isBlush
                  ? 'bg-white/95 border-pink-300 text-pink-900'
                  : 'bg-white/95 border-slate-300 text-slate-900'
              }`}
            >
              <Sparkles className={`w-3 h-3 ${isBlush ? 'text-pink-500' : 'text-slate-700'}`} />
              <span>3D Live View</span>
            </motion.div>

            {/* Floating Caption at Bottom */}
            <motion.div
              animate={{
                transform: is3DActive ? 'translateZ(25px)' : 'translateZ(0px)',
                opacity: is3DActive ? 1 : 0,
              }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className={`absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-xl backdrop-blur-md border text-[11px] font-medium text-white shadow-lg pointer-events-none ${
                isBlush
                  ? 'bg-pink-950/85 border-pink-400/50'
                  : 'bg-slate-950/85 border-slate-500/50'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <Camera className={`w-3 h-3 ${isBlush ? 'text-pink-300' : 'text-slate-300'} shrink-0`} />
                <span className="truncate">{member.hoverCaption || 'Behind the scenes in action'}</span>
              </div>
              <Eye className={`w-3 h-3 ${isBlush ? 'text-pink-300' : 'text-slate-300'} shrink-0 ml-1`} />
            </motion.div>
          </motion.div>

          {/* Desktop Hover Cue (When not hovered) */}
          <div
            className={`pointer-events-none absolute bottom-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-semibold shadow-xs transition-opacity duration-300 ${
              isBlush
                ? 'bg-white/90 border-pink-200/80 text-pink-900'
                : 'bg-white/90 border-slate-200 text-slate-800'
            } ${!is3DActive && !isTouchDevice ? 'opacity-90' : 'opacity-0'}`}
          >
            <Sparkles className={`w-2.5 h-2.5 ${isBlush ? 'text-pink-500' : 'text-slate-600'}`} />
            <span>Hover for 3D</span>
          </div>

          {/* Touch Device Toggle Pill */}
          {isTouchDevice && (
            <button
              onClick={handlePhotoTap}
              className={`absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold shadow-sm active:scale-95 cursor-pointer ${
                isBlush
                  ? 'bg-white/95 border-pink-300 text-pink-700'
                  : 'bg-white/95 border-slate-300 text-slate-700'
              }`}
            >
              <ImageIcon className={`w-3.5 h-3.5 ${isBlush ? 'text-pink-500' : 'text-slate-600'}`} />
              <span>{mobileShow3D ? 'Portrait View' : '✦ 3D Action'}</span>
            </button>
          )}
        </div>

        {/* MEMBER INFORMATION BLOCK */}
        <div className="mt-4 pt-1 flex flex-col justify-between relative z-10">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <h3
                className={`font-display text-lg sm:text-xl font-bold tracking-tight transition-colors duration-200 ${
                  isBlush ? 'text-pink-950 group-hover:text-pink-600' : 'text-slate-950 group-hover:text-slate-700'
                }`}
              >
                {member.name}
              </h3>
              <p
                className={`text-xs font-semibold tracking-wide mt-0.5 ${
                  isBlush ? 'text-pink-800/70' : 'text-slate-600'
                }`}
              >
                {member.class} <span className={isBlush ? 'text-pink-300' : 'text-slate-300'}>•</span> {member.department}
              </p>
            </div>
          </div>

          {/* Short Bio */}
          <p
            className={`text-xs sm:text-sm line-clamp-2 mt-2 leading-relaxed font-normal ${
              isBlush ? 'text-pink-950/75' : 'text-slate-600'
            }`}
          >
            {member.description}
          </p>

          {/* Card Footer: Social Links & Quick View Trigger */}
          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 ${
              isBlush ? 'border-pink-100/80' : 'border-slate-100'
            }`}
          >
            <SocialLinks social={member.social} size="sm" />

            <span
              className={`text-[11px] font-bold uppercase tracking-wider group-hover:underline flex items-center gap-0.5 ${
                isBlush ? 'text-pink-600' : 'text-slate-900'
              }`}
            >
              Profile
              <ArrowUpRight className="w-3 h-3 inline-block" />
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};



