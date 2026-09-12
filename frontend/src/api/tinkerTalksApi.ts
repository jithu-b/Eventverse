import { supabase } from '../lib/supabase';

export interface TinkerTalk {
  id: number;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  created_at: string;
}

function mapTalk(row: any): TinkerTalk {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    video_url: row.video_url,
    thumbnail_url: row.thumbnail_url,
    created_at: row.created_at,
  };
}

async function uploadMediaFile(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(filename, file);
  if (error) throw error;
  const { data } = supabase.storage.from('media').getPublicUrl(filename);
  return data.publicUrl;
}

export const tinkerTalksApi = {
  list: async (): Promise<TinkerTalk[]> => {
    const { data, error } = await supabase
      .from('tinker_talks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapTalk);
  },
  upload: async (
    file: File,
    title: string,
    description?: string,
    thumbnailFile?: File
  ): Promise<TinkerTalk> => {
    const videoUrl = await uploadMediaFile(file, 'tinkertalks');
    const thumbnailUrl = thumbnailFile ? await uploadMediaFile(thumbnailFile, 'tinkertalks-thumbs') : null;
    const { data, error } = await supabase
      .from('tinker_talks')
      .insert({
        title,
        description: description || null,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
      })
      .select('*')
      .single();
    if (error) throw error;
    return mapTalk(data);
  },
  remove: async (id: number): Promise<void> => {
    const { error } = await supabase.from('tinker_talks').delete().eq('id', id);
    if (error) throw error;
  },
};
