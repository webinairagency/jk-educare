// The +2 groups and what each one studies. A student who picks a group (and their languages when
// registering) automatically gets the classes, study material and updates for those subjects, plus
// NEET / JEE / General for everyone. Pure data and helpers, safe for server and client components.

export type GroupDef = { name: string; key: string; subjects: string[] };

/** Language subjects. Each student chooses theirs when registering. */
export const LANGUAGES = ["Tamil", "English", "French", "Hindi"];
export const DEFAULT_LANGUAGES = ["Tamil", "English"];

// `subjects` are the non-language subjects. The last four groups have no subject list yet, so they see
// languages, NEET / JEE / General and anything an admin sends to their group with "Show to".
export const GROUP_DEFS: GroupDef[] = [
  { name: "XII – Bio-Maths", key: "bio-maths", subjects: ["Maths", "Physics", "Chemistry", "Biology"] },
  { name: "XII – CS-Maths", key: "cs-maths", subjects: ["Maths", "Physics", "Chemistry", "Computer Science"] },
  { name: "XII – Pure Science", key: "pure-science", subjects: ["Physics", "Chemistry", "Botany", "Zoology"] },
  { name: "XII – Bio-Computer", key: "bio-computer", subjects: ["Physics", "Chemistry", "Biology", "Computer Science"] },
  { name: "XII – Arts-Computer", key: "arts-computer", subjects: ["Accountancy", "Commerce", "Economics", "Computer Science"] },
  { name: "XII – Arts-History", key: "arts-history", subjects: ["Accountancy", "Commerce", "Economics", "History"] },
  { name: "XII – Arts-Political Science", key: "arts-political-science", subjects: ["Accountancy", "Commerce", "Economics", "Political Science"] },
  { name: "XII – Nursing Group", key: "nursing", subjects: [] },
  { name: "XII – Agri Group", key: "agri", subjects: [] },
  { name: "XII – Vocational Group", key: "vocational", subjects: [] },
  { name: "XII – Others", key: "others", subjects: [] },
];

/** Names shown in the registration dropdown and the admin preview. */
export const GROUPS = GROUP_DEFS.map(g => g.name);

/** Every +2 subject, for the admin Subject list (languages first). */
export const SUBJECTS = Array.from(new Set([...LANGUAGES, ...GROUP_DEFS.flatMap(g => g.subjects)]));

/** Lower-case, one space between words, a few spelling variants folded together. */
export function normSubject(s: string) {
  const v = (s || "").trim().toLowerCase().split(" ").filter(Boolean).join(" ");
  return ({ mathematics: "maths", math: "maths", cs: "computer science" } as Record<string, string>)[v] ?? v;
}
export const subjectTag = (s: string) => "subject:" + normSubject(s);
const KNOWN_SUBJECTS = new Set(SUBJECTS.map(normSubject));
export const isKnownSubject = (s: string) => KNOWN_SUBJECTS.has(normSubject(s));

/** "Tamil, french" -> ["Tamil", "French"]. null when nothing valid was recorded (older students). */
export function parseLanguages(raw?: string | string[] | null): string[] | null {
  const list = (Array.isArray(raw) ? raw : String(raw ?? "").split(",")).map(x => x.trim().toLowerCase());
  const out = LANGUAGES.filter(l => list.includes(l.toLowerCase()));
  return out.length ? out : null;
}

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
    ["nursing", ["nursing"]],
    ["agri", ["agri"]],
    ["vocational", ["vocational"]],
    ["others", ["others"]],
  ];
  for (const [key, needles] of order) if (needles.some(n => g.includes(n))) return key;
  return null;
}

/**
 * The subject folders on a student's Study material page, in display order: the group's own subjects first,
 * then the languages the student chose. Admin preview ("All groups") and unrecognised groups see every subject.
 */
export function materialFolders(group: string, languages?: string): string[] {
  const def = GROUP_DEFS.find(d => d.key === groupKey(group));
  if ((group || "").toLowerCase().includes("admin preview") || !def) return SUBJECTS;
  return [...def.subjects, ...(parseLanguages(languages) ?? LANGUAGES)];
}
