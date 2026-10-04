import { SUBJECTS, EXAM_PREP } from "../../lib/subjects";
import { GROUP_DEFS } from "../../lib/groups";

const KNOWN_FOR = ["All", ...GROUP_DEFS.map(g => g.key)];

/** Subject choices. `current` keeps an old free-typed subject selectable when editing. */
export function SubjectOptions({ current }: { current?: string }) {
  const known = [...SUBJECTS, ...EXAM_PREP, "General"] as string[];
  return (
    <>
      {current && !known.includes(current) && <option value={current}>{current}</option>}
      <optgroup label="+2 subjects">{SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}</optgroup>
      <optgroup label="Exam preparation">{EXAM_PREP.map(s => <option key={s} value={s}>{s}</option>)}</optgroup>
    </>
  );
}

/** Who sees an item. Values match the "For" column of the sheet. */
export function ForSelect({ current = "All" }: { current?: string }) {
  return (
    <label>Show to
      <select name="for" defaultValue={current || "All"}>
        {current && !KNOWN_FOR.includes(current) && <option value={current}>{current}</option>}
        <option value="All">Every group that studies this subject</option>
        {GROUP_DEFS.map(g => <option key={g.key} value={g.key}>Only {g.name.replace("XII – ", "")}</option>)}
      </select>
    </label>
  );
}
