import React, { useEffect, useState } from 'react';
import { Download, Users, ChevronLeft, Trash2, Calendar, ChevronRight } from 'lucide-react';
import { EventItem } from '../../types';
import { eventApi } from '../../api/eventApi';
import { registrationApi, Registrant } from '../../api/registrationApi';

export const RegistrantsPanel: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    eventApi.list().then((evs) => {
      setEvents(evs);
      setLoading(false);
    });
  }, []);

  function openEvent(evt: EventItem) {
    setSelected(evt);
    setLoadingRegs(true);
    registrationApi.listForEvent(evt.id).then((regs) => {
      setRegistrants(regs);
      setLoadingRegs(false);
    });
  }

  async function handleDelete(reg: Registrant) {
    if (!selected) return;
    const ok = window.confirm(`Remove ${reg.name}'s registration? This cannot be undone.`);
    if (!ok) return;
    setDeletingId(reg.id);
    try {
      await registrationApi.remove(reg.id, selected.id);
      setRegistrants((prev) => prev.filter((r) => r.id !== reg.id));
    } catch (err) {
      alert('Failed to delete registration. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  function exportCsv() {
    if (!selected) return;
    const customFields = selected.registrationFields || [];
    const header = ['Name', 'Email', 'Department', 'Year', ...customFields.map((f) => f.label), 'Registered At']
      .map((v) => `"${v}"`)
      .join(',') + '\n';
    const rows = registrants
      .map((r) => {
        const base = [r.name, r.email, r.dept || '', r.year || ''];
        const custom = customFields.map((f) => {
          const val = r.responses?.[f.id];
          return Array.isArray(val) ? val.join('; ') : (val ?? '');
        });
        const formattedDate = new Date(r.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
        return [...base, ...custom, formattedDate].map((v) => `"${v}"`).join(',');
      })
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selected.title.replace(/[^a-z0-9]+/gi, '-')}-registrants.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <p className="text-center text-sm text-[#6B6470] py-8">Loading events...</p>;

  if (selected) {
    return (
      <div className="w-full max-w-4xl">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1 text-xs font-bold text-[#6B6470] hover:text-[#18131A] mb-4"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Events
        </button>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#18131A]">{selected.title} — Registrants</h2>
          <button
            onClick={exportCsv}
            disabled={registrants.length === 0}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-[#F3DCE8] hover:border-[#EC4899] disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
        {loadingRegs ? (
          <p className="text-sm text-[#6B6470]">Loading registrants...</p>
        ) : registrants.length === 0 ? (
          <p className="text-sm text-[#6B6470]">No one has registered for this event yet.</p>
        ) : (
          <div className="overflow-x-auto border border-[#F3DCE8] rounded-2xl bg-white shadow-sm">
            <table className="w-full text-xs sm:text-sm bg-white">
              <thead>
                <tr className="bg-[#FFF1F7] text-left">
                  <th className="px-4 py-2.5 font-bold text-[#18131A]">Name</th>
                  <th className="px-4 py-2.5 font-bold text-[#18131A]">Email</th>
                  <th className="px-4 py-2.5 font-bold text-[#18131A]">Department</th>
                  <th className="px-4 py-2.5 font-bold text-[#18131A]">Year</th>
                  {(selected.registrationFields || []).map((f) => (
                    <th key={f.id} className="px-4 py-2.5 font-bold text-[#18131A]">{f.label}</th>
                  ))}
                  <th className="px-4 py-2.5 font-bold text-[#18131A]">Registered</th>
                  <th className="px-4 py-2.5 font-bold text-[#18131A]"></th>
                </tr>
              </thead>
              <tbody>
                {registrants.map((r) => (
                  <tr key={r.id} className="border-t border-[#F3DCE8] bg-white">
                    <td className="px-4 py-2.5">{r.name}</td>
                    <td className="px-4 py-2.5">{r.email}</td>
                    <td className="px-4 py-2.5">{r.dept || '—'}</td>
                    <td className="px-4 py-2.5">{r.year || '—'}</td>
                    {(selected.registrationFields || []).map((f) => {
                      const val = r.responses?.[f.id];
                      const display = Array.isArray(val) ? val.join(', ') : (val || '—');
                      return <td key={f.id} className="px-4 py-2.5">{display}</td>;
                    })}
                    <td className="px-4 py-2.5 text-[#6B6470]">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => handleDelete(r)}
                        disabled={deletingId === r.id}
                        className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 disabled:opacity-40 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {deletingId === r.id ? 'Removing...' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[#18131A]">Select an Event</h2>
        <p className="text-xs text-[#6B6470] mt-0.5">Choose an event to view and manage its registrants.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {events.map((evt) => (
          <button
            key={evt.id}
            onClick={() => openEvent(evt)}
            className={`group relative text-left p-4 rounded-2xl border hover:shadow-lg transition-all overflow-hidden ${
              evt.status === 'Upcoming'
                ? 'border-[#BBEBC9] bg-[#F2FBF4] hover:border-[#4ADE80] hover:shadow-[#4ADE80]/10'
                : 'border-[#F3DCE8] bg-white hover:border-transparent hover:shadow-[#EC4899]/10'
            }`}
          >
            {evt.status === 'Upcoming' && (
              <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A]">
                Live
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFF1F7] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-sm text-[#18131A] truncate">{evt.title}</p>
                <p className="flex items-center gap-1 text-xs text-[#6B6470] mt-1">
                  <Calendar className="w-3 h-3" /> {evt.date}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#D9C3D1] group-hover:text-[#EC4899] transition-colors shrink-0 mt-0.5" />
            </div>
            <div className="relative mt-3 flex items-center gap-1.5">
              <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFF1F7] text-[#EC4899]">
                <Users className="w-3 h-3" /> {evt.registeredCount} registered
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
