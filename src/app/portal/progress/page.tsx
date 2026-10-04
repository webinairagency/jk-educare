import Link from "next/link";
import { redirect } from "next/navigation";
import { portalStudent } from "../../../lib/portal-student";
import { getAttendance, getClasses, isExam, tagsForGroup, view, visibleTo, type ClassRow } from "../../../lib/classes";
import { getT } from "../../../lib/i18n";
import s from "../../../components/portal/portal.module.css";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const { st, preview } = await portalStudent();
  if (!st) redirect("/link");
  const { t } = await getT();

  const tags = tagsForGroup(st.group);
  const [rows, attended] = await Promise.all([getClasses().catch(() => [] as ClassRow[]), preview ? Promise.resolve(new Set<string>()) : getAttendance(st.regNo)]);
  const ended = rows.filter(c => !isExam(c.subject) && visibleTo(c, tags)).map(c => view(c, attended)).filter(c => c.state === "recorded" || c.state === "processing" || c.state === "ended");
  const joined = ended.filter(c => c.attended).length;
  const missed = ended.filter(c => c.missed).length;   // Zoom / Meet classes can't be caught up, so they aren't "missed"
  const pct = ended.length ? Math.round((joined / ended.length) * 100) : 0;

  return (
    <>
      <h1 className={s.hello}>{t.progress}</h1>
      <div className={s.stats}>
        <div className={s.stat}><b>{joined}</b><span>{t.attended}</span></div>
        <div className={s.stat}><b>{ended.length}</b><span>{t.finished}</span></div>
        <div className={`${s.stat} ${s.statMiss}`}><b>{missed}</b><span>{t.missedCount}</span></div>
      </div>
      <div className={s.bar2} role="img" aria-label={`${pct}%`}><i style={{ width: `${pct}%` }} /></div>
      <p className={s.hint}>{t.progressNote}</p>
      {missed > 0 && <Link className={`${s.btn} ${s.btnPrimary}`} href="/portal#missed">{t.watchMissed}</Link>}

      <dl className={s.facts}>
        <div><dt>{t.rollNo}</dt><dd>{st.regNo}</dd></div>
        <div><dt>{t.group}</dt><dd>{st.group}</dd></div>
        <div><dt>{t.board}</dt><dd>{st.board}</dd></div>
      </dl>
    </>
  );
}
