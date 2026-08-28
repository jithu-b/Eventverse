import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Github, Linkedin, Mail, Twitter, Check } from 'lucide-react';
import { MemberSocial } from './types';

interface SocialLinksProps {
  social: MemberSocial;
  size?: 'sm' | 'md' | 'lg';
  showCopyToast?: boolean;
  className?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  social,
  size = 'md',
  showCopyToast = false,
  className = ''
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, url: string, key: string) => {
    if (!showCopyToast) return;
    e.stopPropagation();
    navigator.clipboard?.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const buttonSizes = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const links = [
    {
      key: 'instagram',
      name: 'Instagram',
      url: social.instagram,
      icon: Instagram,
      color: 'hover:text-pink-600 hover:border-pink-300 hover:bg-pink-50'
    },
    {
      key: 'github',
      name: 'GitHub',
      url: social.github,
      icon: Github,
      color: 'hover:text-zinc-900 hover:border-pink-300 hover:bg-pink-50'
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      url: social.linkedin,
      icon: Linkedin,
      color: 'hover:text-pink-700 hover:border-pink-300 hover:bg-pink-50'
    },
    ...(social.twitter
      ? [
          {
            key: 'twitter',
            name: 'Twitter / X',
            url: social.twitter,
            icon: Twitter,
            color: 'hover:text-pink-600 hover:border-pink-300 hover:bg-pink-50'
          }
        ]
      : []),
    ...(social.email
      ? [
          {
            key: 'email',
            name: 'Email',
            url: `mailto:${social.email}`,
            icon: Mail,
            color: 'hover:text-pink-600 hover:border-pink-300 hover:bg-pink-50'
          }
        ]
      : [])
  ];

  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      onClick={(e) => e.stopPropagation()}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05
          }
        }
      }}
    >
      {links.map((link, index) => {
        const Icon = link.icon;
        const isCopied = copiedKey === link.key;
        const isHovered = hoveredKey === link.key;

        return (
          <motion.a
            key={link.key}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${link.name}: ${link.url}`}
            aria-label={link.name}
            onMouseEnter={() => setHoveredKey(link.key)}
            onMouseLeave={() => setHoveredKey(null)}
            onContextMenu={(e) => handleCopy(e, link.url, link.key)}
            variants={{
              hidden: { opacity: 0, scale: 0.6, y: 8 },
              visible: {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  type: 'spring',
                  stiffness: 420,
                  damping: 24,
                  mass: 0.8,
                  delay: index * 0.03
                }
              }
            }}
            whileHover={{
              scale: 1.14,
              y: -3,
              transition: {
                type: 'spring',
                stiffness: 450,
                damping: 15,
                mass: 0.5
              }
            }}
            whileTap={{
              scale: 0.9,
              y: 0,
              transition: {
                type: 'spring',
                stiffness: 600,
                damping: 20
              }
            }}
            className={`group relative flex items-center justify-center rounded-full bg-white/90 border border-pink-100/90 text-pink-900/70 shadow-xs backdrop-blur-xs transition-colors duration-200 ${buttonSizes[size]} ${link.color} focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-1`}
          >
            {isCopied ? (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                <Check className={`${iconSizes[size]} text-emerald-600`} />
              </motion.div>
            ) : (
              <motion.div
                animate={isHovered ? { scale: 1.15, rotate: -8 } : { scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 14
                }}
              >
                <Icon className={iconSizes[size]} />
              </motion.div>
            )}

            {/* Micro spring-animated tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, y: 4, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 2, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-pink-950 px-2 py-0.5 text-[10px] font-medium tracking-wide text-pink-50 shadow-md whitespace-nowrap z-30"
                >
                  {isCopied ? 'Copied URL!' : link.name}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.a>
        );
      })}
    </motion.div>
  );
};
