import Link from "next/link";
import { after } from "next/server";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "../../../../auth";
import Thumb from "../../../../components/portal/Thumb";
import Countdown from "../../../../components/portal/Countdown";
import VideoGate from "../../../../components/portal/VideoGate";
import { cdLabels } from "../../../../components/portal/ClassCard";
import {
  calendarLink, fmtDay, fmtTime, getAttendance, getClasses, isExternalLive, JOIN_EARLY_MIN, liveKind,
  tagsForGroup, videoSrc, view, visibleTo, youtubeWatchUrl,
} from "../../../../lib/classes";
import { callScript } from "../../../../lib/script";
import { getT } from "../../../../lib/i18n";
import s from "../../../../components/portal/portal.module.css";

export const dynamic = "force-dynamic";

export default async function ClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const st = session?.student;
  if (!st) redirect("/link");
  const { lang, t } = await getT();

  const row = (await getClasses()).find(c => c.id === decodeURIComponent(id));
  if (!row || !visibleTo(row, tagsForGroup(st.group))) notFound();
  const attended = await getAttendance(st.regNo);
  const c = view(row, attended);

  // Opening a class while it is live counts as attending it.
  if (c.state === "live" && !c.attended) {
    after(() => callScript("join", { regNo: st.regNo, classId: c.id }).catch(() => {}));
  }

  const h = await headers();
  const portalUrl = `https://${h.get("host")}/portal/class/${encodeURIComponent(c.id)}`;
  const kind = liveKind(row.live);
  const external = isExternalLive(row.live);   // Zoom / Meet: opens in its own app, no embedded player
  const liveSrc = c.state === "live" && !external ? videoSrc({ ...row, recording: "" }, true) : null;
  const joinLabel = kind === "zoom" ? t.joinZoom : kind === "meet" ? t.joinMeet : t.joinLink;
  const recSrc = c.state === "recorded" ? videoSrc(row, true) : null;
  const ytUrl = youtubeWatchUrl(row);
  const thumb = <Thumb subject={c.subject} topic={c.topic} startMs={c.startMs} />;

  return (
    <div className={s.detail} style={{ maxWidth: 760 }}>
      <Link href="/portal" className={s.back}>{t.back}</Link>

      {liveSrc ? (
        <div className={s.player}>
          <iframe src={liveSrc} title={`${c.subject}: ${c.topic} (live)`} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
        </div>
      ) : recSrc ? (
        <VideoGate classId={c.id} src={recSrc} title={`${c.subject}: ${c.topic}`} play={t.play} note={t.dataNote}>{thumb}</VideoGate>
      ) : (
        <div className={s.media}>{thumb}</div>
      )}

      <h1>{c.subject}: {c.topic}</h1>
      <p className={s.meta}>{fmtDay(c.startMs, lang)}, {fmtTime(c.startMs)}–{fmtTime(c.endMs)} · {c.teacher}</p>
      {c.caption && <p className={s.caption}>{c.caption}</p>}

      {c.state === "live" && liveSrc && Date.now() < c.startMs && <div className={s.notice}>{t.notStarted}</div>}
      {c.state === "live" && external && (
        <div className={s.actions}>
          <a className={`${s.btn} ${s.btnLive}`} href={row.live} target="_blank" rel="noopener noreferrer">▶ {joinLabel}</a>
          <p className={s.hint}>{t.joinHint}</p>
        </div>
      )}
      {c.state === "live" && !liveSrc && !external && <div className={s.notice}>{t.noLiveLink}</div>}
      {c.state === "ended" && <div className={s.notice}>{t.noRecording}</div>}
      {c.missed && c.state === "recorded" && <div className={s.notice}>{t.missedLive}</div>}
      {c.state === "processing" && <div className={s.notice}>{t.processing}</div>}

      <div className={s.actions}>
        {c.state === "live" && ytUrl && (
          <a className={`${s.btn} ${s.btnGhost}`} href={ytUrl} target="_blank" rel="noopener noreferrer">{t.openYT}</a>
        )}
        {c.state === "upcoming" && (
          <>
            <span className={`${s.btn} ${s.btnGhost}`} aria-live="polite"><Countdown openMs={c.startMs - JOIN_EARLY_MIN * 60_000} labels={cdLabels(t)} /></span>
            <a className={`${s.btn} ${s.btnPrimary}`} href={calendarLink(c, portalUrl)} target="_blank" rel="noopener noreferrer">{t.addCal}</a>
          </>
        )}
        {c.notes && <a className={`${s.btn} ${s.btnGhost}`} href={c.notes} target="_blank" rel="noopener noreferrer">{t.notesPdf}</a>}
      </div>
    </div>
  );
}
