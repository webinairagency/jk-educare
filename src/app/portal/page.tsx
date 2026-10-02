import { redirect } from "next/navigation";
import { auth } from "../../auth";
import ClassCard from "../../components/portal/ClassCard";
import InstallButton from "../../components/portal/InstallButton";
import { firstName, fmtDay, getAttendance, getClasses, tagsForGroup, view, visibleTo, type ClassRow } from "../../lib/classes";
import { getNotices, type Notice } from "../../lib/content";
import { getT } from "../../lib/i18n";
import s from "../../components/portal/portal.module.css";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await auth();
  const st = session?.student;
  if (!st) redirect("/link");
  const { lang, t } = await getT();

  const tags = tagsForGroup(st.group);
  let rows: ClassRow[] = [];
  let notices: Notice[] = [];
  let failed = false;
  const [cr, nr, attended] = await Promise.all([
    getClasses().catch(() => { failed = true; return [] as ClassRow[]; }),
    getNotices().catch(() => [] as Notice[]),
    getAttendance(st.regNo),
  ]);
  rows = cr;
  notices = nr.filter(n => visibleTo(n, tags))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date))
    .slice(0, 3);

  const now = Date.now();
  const mine = rows.filter(c => visibleTo(c, tags)).map(c => view(c, attended, now)).sort((a, b) => a.startMs - b.startMs);
  const live = mine.filter(c => c.state === "live");
  const upcoming = mine.filter(c => c.state === "upcoming");
  const ended = mine.filter(c => c.state === "recorded" || c.state === "processing").reverse();
  const missed = ended.filter(c => c.missed);
  const hero = live[0] ?? upcoming[0];

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

      <section>
        <div className={s.sectionHead}><h2>{hero?.state === "live" ? t.liveNow : t.nextClass}</h2></div>
        {hero ? <div style={{ maxWidth: 560 }}><ClassCard c={hero} t={t} lang={lang} big /></div>
              : <div className={s.empty}>{t.noClasses}</div>}
        {live.length > 1 && <div className={s.grid} style={{ marginTop: 16 }}>{live.slice(1).map(c => <ClassCard key={c.id} c={c} t={t} lang={lang} />)}</div>}
      </section>

      {missed.length > 0 && (
        <section className={s.section} id="missed">
          <div className={s.sectionHead}><h2>{t.missed}</h2><span>{missed.length}</span></div>
          <p className={s.missedNote}>{t.missedNote}</p>
          <div className={s.rail}>{missed.map(c => <ClassCard key={c.id} c={c} t={t} lang={lang} />)}</div>
        </section>
      )}

      {upcoming.filter(c => c !== hero).length > 0 && (
        <section className={s.section}>
          <div className={s.sectionHead}><h2>{t.upcoming}</h2><span>{upcoming.filter(c => c !== hero).length}</span></div>
          <div className={s.grid}>{upcoming.filter(c => c !== hero).map(c => <ClassCard key={c.id} c={c} t={t} lang={lang} />)}</div>
        </section>
      )}

      <section className={s.section}>
        <div className={s.sectionHead}><h2>{t.recordings}</h2><span>{ended.filter(c => c.state === "recorded").length}</span></div>
        {ended.length ? <div className={s.grid}>{ended.map(c => <ClassCard key={c.id} c={c} t={t} lang={lang} />)}</div>
                      : <div className={s.empty}>{t.noRecordings}</div>}
      </section>
    </>
  );
}
