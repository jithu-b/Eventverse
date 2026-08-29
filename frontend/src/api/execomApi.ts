import axiosClient from './axiosClient';

export type LayoutViewMode = 'editorial' | 'grid';

export type LayoutViewMode = 'editorial' | 'grid';

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

export const execomApi = {
  list: async (): Promise<ExicomMember[]> => (await axiosClient.get('/execom')).data.members || [],
  saveBulk: async (members: ExicomMember[]): Promise<ExicomMember[]> =>
    (await axiosClient.put('/execom/bulk', { members })).data.members || [],
  remove: async (id: number): Promise<void> => {
    await axiosClient.delete(`/execom/${id}`);
  },
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await axiosClient.post('/execom/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.url;
  },
};
