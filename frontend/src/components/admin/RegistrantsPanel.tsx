import React, { useEffect, useState } from 'react';
import { Download, Users, ChevronLeft } from 'lucide-react';
import { EventItem } from '../../types';
import { eventApi } from '../../api/eventApi';
import { registrationApi, Registrant } from '../../api/registrationApi';

export const RegistrantsPanel: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRegs, setLoadingRegs] = useState(false);

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
          <div className="overflow-x-auto border border-[#F3DCE8] rounded-2xl">
            <table className="w-full text-xs sm:text-sm">
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
                </tr>
              </thead>
              <tbody>
                {registrants.map((r) => (
                  <tr key={r.id} className="border-t border-[#F3DCE8]">
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
    <div className="w-full max-w-2xl">
      <h2 className="text-lg font-bold text-[#18131A] mb-4">Select an Event</h2>
      <div className="space-y-2">
        {events.map((evt) => (
          <button
            key={evt.id}
            onClick={() => openEvent(evt)}
            className="w-full flex items-center justify-between text-left px-4 py-3 border border-[#F3DCE8] rounded-xl hover:border-[#EC4899] transition-colors"
          >
            <div>
              <p className="font-bold text-sm text-[#18131A]">{evt.title}</p>
              <p className="text-xs text-[#6B6470]">{evt.date}</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#EC4899]">
              <Users className="w-3.5 h-3.5" /> {evt.registeredCount} registered
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
