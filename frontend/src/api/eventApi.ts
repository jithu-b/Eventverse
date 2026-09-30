uploadBanner: async (file: File): Promise<string> => {
  const filename = `banners/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage.from('media').upload(filename, file);
  if (error) throw error;
  const { data } = supabase.storage.from('media').getPublicUrl(filename);
  return data.publicUrl;
},
