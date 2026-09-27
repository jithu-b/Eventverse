import { supabase } from '../lib/supabase';

export interface EventReport {
  id: number;
  event_id: number;
  event_title: string;
  event_thumbnail: string;
  title: string | null;
  pdf_url: string;
  uploaded_at: string;
}

function mapReport(row: any): EventReport {
  return {
    id: row.id,
    event_id: row.event_id,
    event_title: row.events?.title || '',
    event_thumbnail: row.events?.thumbnail_url || row.events?.banner_url || '',
    title: row.title,
    pdf_url: row.pdf_url,
    uploaded_at: row.uploaded_at,
  };
}

async function uploadPdf(eventId: string, file: File): Promise<string> {
  const filename = `reports/${eventId}/${crypto.randomUUID()}.pdf`;
  const { error } = await supabase.storage.from('media').upload(filename, file, {
    contentType: 'application/pdf',
    upsert: true,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('media').getPublicUrl(filename);
  return data.publicUrl;
}

export const reportApi = {
  list: async (): Promise<EventReport[]> => {
    const { data, error } = await supabase
      .from('event_reports')
      .select('*, events(title, thumbnail_url, banner_url)')
      .order('uploaded_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapReport);
  },
  getByEventId: async (eventId: string): Promise<EventReport | null> => {
    const { data, error } = await supabase
      .from('event_reports')
      .select('*, events(title, thumbnail_url, banner_url)')
      .eq('event_id', eventId)
      .maybeSingle();
    if (error) throw error;
    return data ? mapReport(data) : null;
  },
  upload: async (eventId: string, file: File, title?: string): Promise<EventReport> => {
    const pdfUrl = await uploadPdf(eventId, file);
    const { data, error } = await supabase
      .from('event_reports')
      .upsert(
        { event_id: Number(eventId), pdf_url: pdfUrl, title: title || null, uploaded_at: new Date().toISOString() },
        { onConflict: 'event_id' }
      )
      .select('*, events(title, thumbnail_url, banner_url)')
      .single();
    if (error) throw error;
    return mapReport(data);
  },
  remove: async (id: number): Promise<void> => {
    const { error } = await supabase.from('event_reports').delete().eq('id', id);
    if (error) throw error;
  },
};
