import { SUBJECTS, EXAM_PREP } from "../../lib/subjects";

const KNOWN_FOR = ["All", "Maths", "Bio", "CS", "Commerce", "CA", "Maths,CS", "Bio,CS"];

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
    <label>For
      <select name="for" defaultValue={current || "All"}>
        {current && !KNOWN_FOR.includes(current) && <option value={current}>{current}</option>}
        <option value="All">All groups</option>
        <option value="Maths">Maths groups</option>
        <option value="Bio">Biology groups</option>
        <option value="CS">Computer Science (CS-Maths)</option>
        <option value="Commerce">Commerce &amp; Accountancy</option>
        <option value="CA">Computer Application</option>
        <option value="Maths,CS">Maths + CS</option>
        <option value="Bio,CS">Biology + CS</option>
      </select>
    </label>
  );
}
