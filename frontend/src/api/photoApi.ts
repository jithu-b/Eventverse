import axiosClient from './axiosClient';

const API_ORIGIN = ((import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
export const mediaUrl = (path: string) => (path?.startsWith('http') ? path : `${API_ORIGIN}${path}`);

export interface Photo {
  id: number;
  event_id: number;
  event_title: string;
  photo_url: string;
  caption: string | null;
  uploaded_at: string;
}

export const photoApi = {
  list: async (eventId?: string): Promise<Photo[]> => {
    const res = await axiosClient.get('/photos', { params: eventId ? { event_id: eventId } : {} });
    return res.data.photos || [];
  },
  upload: async (eventId: string, file: File, caption?: string): Promise<Photo> => {
    const fd = new FormData();
    fd.append('event_id', eventId);
    fd.append('photo', file);
    if (caption) fd.append('caption', caption);
    const res = await axiosClient.post('/photos', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.photo;
  },
  uploadMultiple: async (eventId: string, files: File[], caption?: string): Promise<Photo[]> => {
    const fd = new FormData();
    fd.append('event_id', eventId);
    files.forEach((f) => fd.append('photos', f));
    if (caption) fd.append('caption', caption);
    const res = await axiosClient.post('/photos', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.photos || [];
  },
  remove: async (id: number): Promise<void> => {
    await axiosClient.delete(`/photos/${id}`);
  },
};
