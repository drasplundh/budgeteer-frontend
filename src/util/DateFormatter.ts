// Parse 'YYYY-MM-DD' as a LOCAL date; returns null if invalid
function parseIsoLocal(s: string): Date | null {
  const [y, m, d] = s.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const valid =
    date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  return valid ? date : null;
}

export function dateFormat(dateString: string) {
  const date = parseIsoLocal(dateString);
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function shortDateFormat(dateString: string) {
  const date = parseIsoLocal(dateString);
  if (!date) return '';

  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
  return `${month}, ${getOrdinalDay(date.getDate())} ${date.getFullYear()}`;
}

function getOrdinalDay(day: number): string {
  const suffix =
    day % 10 === 1 && day !== 11 ? "st" :
    day % 10 === 2 && day !== 12 ? "nd" :
    day % 10 === 3 && day !== 13 ? "rd" :
    "th";

  return `${day}${suffix}`;
}

export function dateToIso(dateString?: string): string {
  if (!dateString) return '';
  const [mm, dd, yy] = dateString.split('/');
  if (!mm || !dd || !yy || yy.length !== 2) return '';

  const iso = `${2000 + parseInt(yy, 10)}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  return parseIsoLocal(iso) ? iso : '';   // '' if the date doesn't exist
}