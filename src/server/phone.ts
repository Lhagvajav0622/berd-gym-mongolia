/** Mongolian mobile numbers: 8 digits, starting 6–9. Stored without +976. */
export function normalizePhone(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("976")) d = d.slice(3);
  return /^[6-9]\d{7}$/.test(d) ? d : null;
}

export function formatPhone(p: string | null | undefined): string {
  if (!p) return "";
  return p.length === 8 ? `${p.slice(0, 4)} ${p.slice(4)}` : p;
}
