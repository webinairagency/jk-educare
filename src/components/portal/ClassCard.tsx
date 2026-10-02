import Link from "next/link";
import Thumb from "./Thumb";
import Countdown from "./Countdown";
import { fmtDay, fmtTime, JOIN_EARLY_MIN, type ClassView } from "../../lib/classes-shared";
import type { Lang, Strings } from "../../lib/i18n";
import s from "./portal.module.css";

export function cdLabels(t: Strings) {
  return { prefix: t.cdPrefix, d: t.cdD, h: t.cdH, m: t.cdM, opening: t.cdOpening };
}

export default function ClassCard({ c, t, lang, big = false, watched = false }: { c: ClassView; t: Strings; lang: Lang; big?: boolean; watched?: boolean }) {
  const label = { upcoming: t.stUpcoming, live: t.stLive, processing: t.stProcessing, recorded: t.stRecorded }[c.state];
  const chip = c.state === "live" ? s.chipLive : c.missed ? s.chipMissed : c.state === "recorded" ? s.chipRec : s.chipUp;
  const href = `/portal/class/${encodeURIComponent(c.id)}`;
  return (
    <article className={`${s.card} ${big ? s.cardBig : ""}`}>
      <Link href={href} className={s.thumbLink}>
        <Thumb subject={c.subject} topic={c.topic} startMs={c.startMs} />
        <span className={`${s.chip} ${watched ? s.chipRec : chip}`}>
          {watched ? `✓ ${t.watched}` : c.missed && c.state !== "live" ? `${t.stMissed} · ${label}` : label}
        </span>
      </Link>
      <div className={s.cardBody}>
        <h3><Link href={href}>{c.subject}: {c.topic}</Link></h3>
        <p className={s.meta}>{fmtDay(c.startMs, lang)}, {fmtTime(c.startMs)}–{fmtTime(c.endMs)} · {c.teacher}</p>
        {c.caption && <p className={s.caption}>{c.caption}</p>}
        {c.state === "live" && <Link className={`${s.btn} ${s.btnLive}`} href={href}>▶ {t.join}</Link>}
        {c.state === "upcoming" && (
          <p className={s.countdown}><Countdown openMs={c.startMs - JOIN_EARLY_MIN * 60_000} labels={cdLabels(t)} /></p>
        )}
        {c.state === "recorded" && big && <Link className={`${s.btn} ${s.btnPrimary}`} href={href}>{t.watch}</Link>}
      </div>
    </article>
  );
}
