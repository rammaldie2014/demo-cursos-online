const LOCALE = 'es-PE';

/** Convierte una fecha local a `YYYY-MM-DD` sin desfases de zona horaria. */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function formatLongDate(isoOrDate: string | Date): string {
  const date = typeof isoOrDate === 'string' ? toDate(isoOrDate) : isoOrDate;
  return new Intl.DateTimeFormat(LOCALE, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export function formatShortDate(isoOrDate: string | Date): string {
  const date = typeof isoOrDate === 'string' ? toDate(isoOrDate) : isoOrDate;
  return new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export function formatMonthYear(date: Date): string {
  const text = new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' }).format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toDate(iso: string): Date {
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) ? fromIsoDate(iso) : new Date(iso);
}
