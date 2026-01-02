// Shared week/date utilities (local-time safe)
// Monday is week start.

export function startOfWeekMonday(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay(); // Sun=0, Mon=1...
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  x.setDate(x.getDate() + diff);
  return x;
}

export function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + Number(n || 0));
  return x;
}

// YYYY-MM-DD in LOCAL time (avoids UTC toISOString() date drift)
export function isoDate(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const da = String(x.getDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}

export function parseISODate(iso) {
  if (!iso) return null;
  const [y, m, d] = String(iso).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function formatWeekRange(weekStartISO) {
  const start = parseISODate(weekStartISO);
  if (!start) return '';
  const end = addDays(start, 6);
  const fmt = (dt) => dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  return `${fmt(start)} – ${fmt(end)}`;
}
