import { supabase } from '../lib/supabase';

const API_ORIGIN = '';
export const mediaUrl = (path: string) => (path?.startsWith('http') ? path : `${API_ORIGIN}${path}`);

export interface Photo {
  id: number;
  event_id: number;
  event_title: string;
  photo_url: string;
  caption: string | null;
  uploaded_at: string;
}

function mapPhoto(row: any): Photo {
  return {
    id: row.id,
    event_id: row.event_id,
    event_title: row.events?.title || '',
    photo_url: row.photo_url,
    caption: row.caption,
    uploaded_at: row.uploaded_at,
  };
}

async function uploadFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `gallery/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(filename, file);
  if (error) throw error;
  const { data } = supabase.storage.from('media').getPublicUrl(filename);
  return data.publicUrl;
}

export const photoApi = {
  list: async (eventId?: string): Promise<Photo[]> => {
    let query = supabase.from('photos').select('*, events(title)').order('uploaded_at', { ascending: false });
    if (eventId) query = query.eq('event_id', eventId);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapPhoto);
  },
  upload: async (eventId: string, file: File, caption?: string): Promise<Photo> => {
    const photoUrl = await uploadFile(file);
    const { data, error } = await supabase
      .from('photos')
      .insert({ event_id: Number(eventId), photo_url: photoUrl, caption: caption || null })
      .select('*, events(title)')
      .single();
    if (error) throw error;
    return mapPhoto(data);
  },
  uploadMultiple: async (eventId: string, files: File[], caption?: string): Promise<Photo[]> => {
    const results: Photo[] = [];
    for (const file of files) {
      results.push(await photoApi.upload(eventId, file, caption));
    }
    return results;
  },
  remove: async (id: number): Promise<void> => {
    const { error } = await supabase.from('photos').delete().eq('id', id);
    if (error) throw error;
  },
};
