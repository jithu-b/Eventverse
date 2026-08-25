import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { eventApi } from "../../api/eventApi.js";
import Card from "../../components/ui/Card.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Calendar.css";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [eventsRes, regsRes] = await Promise.all([
          eventApi.list(),
          eventApi.myRegistrations(),
        ]);
        if (cancelled) return;
        setEvents(eventsRes.data.events || []);
        const regs = regsRes.data.registrations || [];
        setRegisteredIds(new Set(regs.map((r) => r.event_id)));
      } catch (err) {
        console.error("Failed to load calendar data:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const eventsByDate = useMemo(() => {
    const map = {};
    for (const ev of events) {
      if (!ev.start_time) continue;
      const d = new Date(ev.start_time);
      const key = dateKey(d);
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    }
    return map;
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }

  const goPrevMonth = () => {
    setCursor(new Date(year, month - 1, 1));
    setSelectedKey(null);
  };
  const goNextMonth = () => {
    setCursor(new Date(year, month + 1, 1));
    setSelectedKey(null);
  };
  const goToday = () => {
    const now = new Date();
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedKey(dateKey(now));
  };

  const todayKey = dateKey(new Date());
  const selectedEvents = selectedKey ? eventsByDate[selectedKey] || [] : [];

  if (loading) return <Loader fullScreen />;

  return (
    <div className="calendar-page stagger-down">
      <div className="calendar-header">
        <h1>Event Calendar</h1>
        <div className="calendar-nav">
          <button className="calendar-nav-btn" onClick={goPrevMonth}>‹</button>
          <span className="calendar-month-label">{MONTH_NAMES[month]} {year}</span>
          <button className="calendar-nav-btn" onClick={goNextMonth}>›</button>
          <button className="calendar-today-btn" onClick={goToday}>Today</button>
        </div>
      </div>

      <Card className="calendar-card">
        <div className="calendar-weekday-row">
          {WEEKDAY_LABELS.map((w) => (
            <div key={w} className="calendar-weekday">{w}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {cells.map((date, idx) => {
            if (!date) {
              return <div key={`empty-${idx}`} className="calendar-cell calendar-cell-empty" />;
            }
            const key = dateKey(date);
            const dayEvents = eventsByDate[key] || [];
            const hasEvents = dayEvents.length > 0;
            const hasRegistered = dayEvents.some((ev) => registeredIds.has(ev.id));
            const isToday = key === todayKey;
            const isSelected = key === selectedKey;
            return (
              <button
                key={key}
                className={`calendar-cell ${hasEvents ? "calendar-cell-has-events" : ""} ${isToday ? "calendar-cell-today" : ""} ${isSelected ? "calendar-cell-selected" : ""}`}
                onClick={() => setSelectedKey(isSelected ? null : key)}
              >
                <span className="calendar-cell-day">{date.getDate()}</span>
                {hasEvents && (
                  <span className={`calendar-cell-dot ${hasRegistered ? "calendar-cell-dot-registered" : ""}`} />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {selectedKey && (
        <Card className="calendar-selected-card">
          <h2>
            {selectedEvents.length === 0
              ? "No events on this day"
              : `Events on ${selectedKey}`}
          </h2>
          {selectedEvents.length > 0 && (
            <ul className="calendar-event-list">
              {selectedEvents.map((ev) => (
                <li key={ev.id} className="calendar-event-item">
                  <Link to={`/events/${ev.id}`}>{ev.title}</Link>
                  {registeredIds.has(ev.id) && (
                    <span className="calendar-registered-badge">Registered</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {events.length === 0 && (
        <Card className="calendar-selected-card">
          <p>No upcoming events yet.</p>
        </Card>
      )}
    </div>
  );
}
