export function dateFormat(dateString: string) {
    return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
}).format(new Date(dateString));
}

export function shortDateFormat(dateString: string) {
  const date = new Date(dateString);

  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}, ${getOrdinalDay(day)} ${year}`;
}

function getOrdinalDay(day: number): string {
  const suffix =
    day % 10 === 1 && day !== 11 ? "st" :
    day % 10 === 2 && day !== 12 ? "nd" :
    day % 10 === 3 && day !== 13 ? "rd" :
    "th";

  return `${day}${suffix}`;
}

export function dateToIso(dateString: string): string {
  const [mm, dd, yy] = dateString.split('/');
  if (!mm || !dd || !yy) throw new Error(`Invalid date: ${dateString}`);

  const year = 2000 + parseInt(yy, 10); // adjust if you need to support 1900s
  const month = mm.padStart(2, '0');
  const day = dd.padStart(2, '0');

  return `${year}-${month}-${day}`;
}