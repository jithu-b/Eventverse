import { supabase } from '../lib/supabase';
import { EventItem } from '../types';
import { mediaUrl } from './photoApi';

function mapEvent(e: any): EventItem {
  const start = e.start_time && !isNaN(new Date(e.start_time).getTime()) ? new Date(e.start_time) : null;
  const end = e.end_time && !isNaN(new Date(e.end_time).getTime()) ? new Date(e.end_time) : null;
  const rawStatus = e.status
    ? ((e.status.charAt(0).toUpperCase() + e.status.slice(1)) as EventItem['status'])
    : e.is_active ? 'Upcoming' : 'Completed';
  const hasPassed = end ? end.getTime() < Date.now() : (start ? start.getTime() < Date.now() : false);
  const status = hasPassed && rawStatus !== 'Cancelled' ? 'Completed' : rawStatus;

  return {
    id: String(e.id),
    title: e.title,
    subtitle: e.subtitle || '',
    description: e.description || '',
    detailedAbout: e.detailed_about || '',
    category: (e.category || 'Workshops') as EventItem['category'],
    status,
    date: start ? start.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : '',
    rawDate: start ? start.toISOString().slice(0, 10) : '',
    time: start && end
      ? `${start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
      : '',
    location: e.location || '',
    locationDetails: e.location_details || '',
    bannerImage: e.banner_url ? mediaUrl(e.banner_url) : '',
    thumbnail: e.thumbnail_url ? mediaUrl(e.thumbnail_url) : (e.banner_url ? mediaUrl(e.banner_url) : ''),
    totalSpots: e.registration_limit ?? 50,
    registeredCount: e.registration_count ?? 0,
    registrationOpen: !!e.is_active && (e.registration_count ?? 0) < (e.registration_limit ?? 50),
    featured: !!e.featured,
    speakers: e.speakers || [],
    whatYouWillLearn: e.what_you_will_learn || [],
    prerequisites: e.prerequisites || [],
    schedule: e.schedule || [],
    tags: e.tags || [],
    quizId: undefined,
    hasAttendance: true,
    hasCertificate: !!e.certificate_enabled,
    organizer: {
      name: e.organizer_name || '',
      role: e.organizer_role || '',
      avatar: e.organizer_avatar || '',
      contactEmail: e.organizer_email || '',
    },
    entryFee: 'Free',
    registerFormUrl: e.register_form_url || '',
    registrationFields: e.registration_fields || [],
    whatsappLink: e.whatsapp_link || '',
  };
}

export interface EventInput {
  title: string;
  description?: string;
  category?: string;
  location?: string;
  start_time?: string | null;
  end_time?: string | null;
  registration_limit?: number;
  banner_url?: string;
  thumbnail_url?: string;
  is_active?: boolean;
  register_form_url?: string;
  registration_fields?: any[];
  whatsapp_link?: string;
}

export const eventApi = {
  list: async (): Promise<EventItem[]> => {
    const { data, error } = await supabase.from('events').select('*').order('start_time', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapEvent);
  },
  getById: async (id: string): Promise<EventItem | null> => {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
    if (error) return null;
    return data ? mapEvent(data) : null;
  },
  create: async (input: EventInput): Promise<EventItem> => {
    const { data, error } = await supabase.from('events').insert(input).select().single();
    if (error) throw error;
    return mapEvent(data);
  },
  update: async (id: string, input: Partial<EventInput>): Promise<EventItem> => {
    const { data, error } = await supabase.from('events').update(input).eq('id', id).select().single();
    if (error) throw error;
    return mapEvent(data);
  },
  remove: async (id: string): Promise<void> => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  },
  uploadBanner: async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const filename = `banners/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(filename, file);
    if (error) throw error;
    const { data } = supabase.storage.from('media').getPublicUrl(filename);
    return data.publicUrl;
  },
};

export async function getLatestEvent(): Promise<EventItem | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return mapEvent(data);
}
