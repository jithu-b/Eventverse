import { supabase } from '../lib/supabase';

async function uploadBannerFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `banners/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(filename, file);
  if (error) throw error;
  const { data } = supabase.storage.from('media').getPublicUrl(filename);
  return data.publicUrl;
}

export const bannerApi = {
  get: async (section: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('section_banners')
      .select('image_url')
      .eq('section', section)
      .maybeSingle();
    if (error) throw error;
    return data?.image_url || null;
  },
  set: async (section: string, file: File): Promise<string> => {
    const imageUrl = await uploadBannerFile(file);
    const { error } = await supabase
      .from('section_banners')
      .upsert({ section, image_url: imageUrl, updated_at: new Date().toISOString() });
    if (error) throw error;
    return imageUrl;
  },
  remove: async (section: string): Promise<void> => {
    const { error } = await supabase.from('section_banners').delete().eq('section', section);
    if (error) throw error;
  },
};
