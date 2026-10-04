import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import Dashboard from "../../../components/portal/Dashboard";
import { getAttendance, getClasses, isExam, tagsForGroup, visibleTo, type ClassRow } from "../../../lib/classes";
import { getMaterials, type Material } from "../../../lib/content";
import { getT } from "../../../lib/i18n";
import s from "../../../components/portal/portal.module.css";

export const dynamic = "force-dynamic";

// NEET / JEE preparation: its own space, kept apart from the +2 school-subject classes.
export default async function ExamPage() {
  const session = await auth();
  const st = session?.student;
  if (!st) redirect("/link");
  const { lang, t } = await getT();

  const tags = tagsForGroup(st.group);
  let failed = false;
  const [rows, attended, allMaterials] = await Promise.all([
    getClasses().catch(() => { failed = true; return [] as ClassRow[]; }),
    getAttendance(st.regNo),
    getMaterials().catch(() => [] as Material[]),
  ]);
  const mine = rows.filter(c => isExam(c.subject) && visibleTo(c, tags));
  const materialCounts: Record<string, number> = {};
  for (const m of allMaterials.filter(m => isExam(m.subject) && visibleTo(m, tags))) {
    const k = m.type.trim().toLowerCase();
    materialCounts[k] = (materialCounts[k] ?? 0) + 1;
  }

  return (
    <>
      <h1 className={s.hello}>{t.neetJee}</h1>
      <p className={s.sub}>{t.neetJeeSub}</p>
      {failed && <div className={s.err}>{t.loadErr}</div>}
      <Dashboard rows={mine} attendedIds={[...attended]} serverNow={Date.now()} t={t} lang={lang} materialCounts={materialCounts} track="exam" />
    </>
  );
}
