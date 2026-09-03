export function dateFormat(dateString: string) {
    return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
}).format(new Date(dateString));
}

export function dateToIso(dateString: string): string {
  const [mm, dd, yy] = dateString.split('/');
  if (!mm || !dd || !yy) throw new Error(`Invalid date: ${dateString}`);

  const year = 2000 + parseInt(yy, 10); // adjust if you need to support 1900s
  const month = mm.padStart(2, '0');
  const day = dd.padStart(2, '0');

  return `${year}-${month}-${day}`;
}