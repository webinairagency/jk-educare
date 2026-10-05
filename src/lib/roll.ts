/**
 * Turns whatever a student types into the roll number format: "jk 12", "JK0012", "jk_0012", "0012"
 * all become JK-0012. Old style numbers (JK-B1-0002) keep their batch part. Returns "" if there is
 * no number in the text.
 */
export function normalizeRoll(input: string): string {
  const s = (input || "").toUpperCase().trim();
  const old = s.match(/B(\d+)[^0-9]*(\d+)\s*$/);          // JK-B1-0002 style
  if (old) return `JK-B${old[1]}-${old[2].padStart(4, "0")}`;
  const digits = s.replace(/[^0-9]/g, "");
  if (digits.length === 0 || digits.length > 6) return "";
  return `JK-${digits.padStart(4, "0")}`;
}
