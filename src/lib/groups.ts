// The +2 groups and the subjects each one studies. A student who picks a group automatically
// gets the classes, study material and updates for those subjects (and for NEET / JEE).
// Pure data and helpers, safe for server and client components.

export type GroupDef = { name: string; key: string; subjects: string[] };

export const GROUP_DEFS: GroupDef[] = [
  { name: "XII – Bio-Maths", key: "bio-maths", subjects: ["Tamil", "English", "Maths", "Physics", "Chemistry", "Biology"] },
  { name: "XII – CS-Maths", key: "cs-maths", subjects: ["Tamil", "English", "Maths", "Physics", "Chemistry", "Computer Science"] },
  { name: "XII – Pure Science", key: "pure-science", subjects: ["Tamil", "English", "Physics", "Chemistry", "Botany", "Zoology"] },
  { name: "XII – Bio-Computer", key: "bio-computer", subjects: ["Tamil", "English", "Physics", "Chemistry", "Biology", "Computer Science"] },
  { name: "XII – Arts-Computer", key: "arts-computer", subjects: ["Tamil", "English", "Accountancy", "Commerce", "Economics", "Computer Science"] },
  { name: "XII – Arts-History", key: "arts-history", subjects: ["Tamil", "English", "Accountancy", "Commerce", "Economics", "History"] },
  { name: "XII – Arts-Political Science", key: "arts-political-science", subjects: ["Tamil", "English", "Accountancy", "Commerce", "Economics", "Political Science"] },
];

/** Names shown in the registration dropdown and the admin preview. */
export const GROUPS = GROUP_DEFS.map(g => g.name);

/** Every +2 subject, for the admin Subject list. */
export const SUBJECTS = Array.from(new Set(GROUP_DEFS.flatMap(g => g.subjects)));

/** Lower-case, one space between words, a few spelling variants folded together. */
export function normSubject(s: string) {
  const v = (s || "").trim().toLowerCase().split(" ").filter(Boolean).join(" ");
  return ({ mathematics: "maths", math: "maths", cs: "computer science" } as Record<string, string>)[v] ?? v;
}
export const subjectTag = (s: string) => "subject:" + normSubject(s);
const KNOWN_SUBJECTS = new Set(SUBJECTS.map(normSubject));
export const isKnownSubject = (s: string) => KNOWN_SUBJECTS.has(normSubject(s));

/** Which group a sheet value like "XII – Bio-Maths" or "ARTS - COMPUTER" belongs to (null if unrecognised). */
export function groupKey(group: string): string | null {
  const g = (group || "").toLowerCase().replace(/[–—]/g, "-").split("-").map(x => x.trim()).filter(Boolean).join("-").replace(/ /g, "-");
  const order: [string, string[]][] = [
    ["bio-computer", ["bio-computer"]],
    ["bio-maths", ["bio-maths", "bio-math"]],
    ["cs-maths", ["cs-maths", "cs-math"]],
    ["arts-computer", ["arts-computer"]],
    ["arts-history", ["arts-history"]],
    ["arts-political-science", ["arts-political"]],
    ["pure-science", ["pure-science"]],
  ];
  for (const [key, needles] of order) if (needles.some(n => g.includes(n))) return key;
  return null;
}
