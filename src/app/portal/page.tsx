import { redirect } from "next/navigation";
import { portalStudent } from "../../lib/portal-student";
import Dashboard from "../../components/portal/Dashboard";
import InstallButton from "../../components/portal/InstallButton";
import { firstName, fmtDay, getAttendance, getClasses, isExam, tagsForGroup, visibleTo, type ClassRow } from "../../lib/classes";
import { getMaterials, getNotices, type Material, type Notice } from "../../lib/content";
import { getT } from "../../lib/i18n";
import s from "../../components/portal/portal.module.css";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { st, preview } = await portalStudent();
  if (!st) redirect("/link");
  const { lang, t } = await getT();

  const tags = tagsForGroup(st.group, st.languages);
  let failed = false;
  const [rows, allNotices, attended, allMaterials] = await Promise.all([
    getClasses().catch(() => { failed = true; return [] as ClassRow[]; }),
    getNotices().catch(() => [] as Notice[]),
    preview ? Promise.resolve(new Set<string>()) : getAttendance(st.regNo),
    getMaterials().catch(() => [] as Material[]),
  ]);
  const materialCounts: Record<string, number> = {};
  for (const m of allMaterials.filter(m => !isExam(m.subject) && visibleTo(m, tags))) {
    const k = m.type.trim().toLowerCase();
    materialCounts[k] = (materialCounts[k] ?? 0) + 1;
  }
  const visible = rows.filter(c => visibleTo(c, tags));
  const mine = visible.filter(c => !isExam(c.subject));
  const examCount = visible.length - mine.length;
  const notices = allNotices.filter(n => visibleTo(n, tags))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <>
      <h1 className={s.hello}>{t.greet}, {firstName(st.name)}</h1>
      <p className={s.sub}>{st.group} · {st.board}</p>
      <InstallButton label={t.install} iosHint={t.iosHint} />

      {notices.length > 0 && (
        <div className={s.notices} aria-label="Notices">
          {notices.map((n, i) => (
            <div key={i} className={`${s.noticeItem} ${n.pinned ? s.pinned : ""}`}>
              {n.pinned && "📌 "}{lang === "ta" ? n.ta : n.en}
              {n.date && <time dateTime={n.date}>{fmtDay(new Date(n.date).getTime(), lang)}</time>}
            </div>
          ))}
        </div>
      )}

      {failed && <div className={s.err}>{t.loadErr}</div>}

      <Dashboard rows={mine} attendedIds={[...attended]} serverNow={Date.now()} t={t} lang={lang} materialCounts={materialCounts} examCount={examCount} />
    </>
  );
}
