import { supabase } from '../lib/supabase';

export interface Registrant {
  id: string;
  event_id: number;
  name: string;
  email: string;
  dept: string | null;
  year: string | null;
  created_at: string;
  responses?: Record<string, any>;
}

export const registrationApi = {
  register: async (
    eventId: string,
    details: { name: string; email: string; dept: string; year: string },
    responses?: Record<string, any>
  ) => {
    const { error } = await supabase
      .from('registrations')
      .insert({
        event_id: Number(eventId),
        name: details.name,
        email: details.email,
        dept: details.dept,
        year: details.year,
        responses: responses || {},
      });
    if (error) throw error;

    const { count } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', Number(eventId));

    await supabase
      .from('events')
      .update({ registration_count: count || 0 })
      .eq('id', Number(eventId));
  },

  listForEvent: async (eventId: string): Promise<Registrant[]> => {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', Number(eventId))
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  listForEmail: async (email: string): Promise<Registrant[]> => {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};
