import axiosClient from './axiosClient';
import { EventItem } from '../types';
import { mediaUrl } from './photoApi';

function mapEvent(e: any): EventItem {
  const start = e.start_time ? new Date(e.start_time) : null;
  const end = e.end_time ? new Date(e.end_time) : null;
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
  };
}

export const eventApi = {
  list: async (): Promise<EventItem[]> => {
    const res = await axiosClient.get('/events');
    return (res.data.events || []).map(mapEvent);
  },
  getById: async (id: string): Promise<EventItem | null> => {
    const res = await axiosClient.get(`/events/${id}`);
    return res.data.event ? mapEvent(res.data.event) : null;
  },
  create: async (formData: FormData): Promise<EventItem> => {
    const res = await axiosClient.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapEvent(res.data.event);
  },
  update: async (id: string, formData: FormData): Promise<EventItem> => {
    const res = await axiosClient.put(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapEvent(res.data.event);
  },
  remove: async (id: string): Promise<void> => {
    await axiosClient.delete(`/events/${id}`);
  },
  register: async (id: string): Promise<void> => {
    await axiosClient.post(`/events/${id}/register`);
  },
};
