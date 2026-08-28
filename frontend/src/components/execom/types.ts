export interface MemberSocial {
  instagram: string;
  github: string;
  linkedin: string;
  twitter?: string;
  email?: string;
}

export interface ExicomMember {
  id: number;
  number: string;
  name: string;
  role: string;
  class: string;
  department: string;
  image: string;
  hoverImage: string;
  hoverCaption?: string;
  description: string;
  quote?: string;
  keyInitiatives?: string[];
  skills?: string[];
  social: MemberSocial;
}

export type LayoutViewMode = 'editorial' | 'grid';

export type ThemeMode = 'blush' | 'minimalist';
