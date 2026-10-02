"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ClassCard from "./ClassCard";
import { WATCHED_KEY } from "./VideoGate";
import { view, JOIN_EARLY_MIN, type ClassRow, type ClassView } from "../../lib/classes-shared";
import type { Lang, Strings } from "../../lib/i18n";
import ps from "./portal.module.css";
import d from "./dashboard.module.css";

type Tab = "upcoming" | "missed" | "recordings";
const TZ = "Asia/Kolkata";
const DAY = 86_400_000;

const dayKey = (ms: number) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(ms);

function readWatched() {
  try { return new Set<string>(JSON.parse(localStorage.getItem(WATCHED_KEY) || "[]")); }
  catch { return new Set<string>(); }
}

function shortWait(ms: number, t: Strings) {
  const mins = Math.max(0, Math.round(ms / 60_000));
  const dd = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), m = mins % 60;
  const parts = [dd ? `${dd}${t.cdD}` : "", h ? `${h}${t.cdH}` : "", !dd ? `${m}${t.cdM}` : ""].filter(Boolean);
  return `${t.inPrefix} ${parts.join(" ")}`;
}

export default function Dashboard({ rows, attendedIds, serverNow, t, lang }: {
  rows: ClassRow[]; attendedIds: string[]; serverNow: number; t: Strings; lang: Lang;
}) {
  const router = useRouter();
  const [now, setNow] = useState(serverNow);          // server time first, so the first render matches
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<Tab>("upcoming");
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    setNow(Date.now());
    setWatched(readWatched());
    try { localStorage.removeItem("jk_pending_link"); } catch { /* ignore */ }   // linked: forget saved code
    if (window.location.hash === "#missed") setTab("missed");   // link from My progress
    // Re-check class states every 30 s on the phone itself (no server calls).
    const tick = setInterval(() => setNow(Date.now()), 30_000);
    // Fetch fresh data (new classes, attendance) every 5 min while the tab is open.
    const refresh = setInterval(() => { if (document.visibilityState === "visible") router.refresh(); }, 5 * 60_000);
    const onShow = () => { if (document.visibilityState === "visible") { setNow(Date.now()); setWatched(readWatched()); } };
    document.addEventListener("visibilitychange", onShow);
    return () => { clearInterval(tick); clearInterval(refresh); document.removeEventListener("visibilitychange", onShow); };
  }, [router]);

  const attended = useMemo(() => new Set(attendedIds), [attendedIds]);
  const all = useMemo(() => rows.map(c => view(c, attended, now)).sort((a, b) => a.startMs - b.startMs), [rows, attended, now]);

  const live = all.filter(c => c.state === "live");
  const upcoming = all.filter(c => c.state === "upcoming");
  const ended = all.filter(c => c.state === "recorded" || c.state === "processing").reverse();
  const missed = ended.filter(c => c.missed);
  const toWatch = missed.filter(c => !watched.has(c.id));
  const joined = ended.filter(c => c.attended).length;
  const pct = ended.length ? Math.round((joined / ended.length) * 100) : 0;
  const next = live[0] ?? upcoming[0];
  const subjects = useMemo(() => Array.from(new Set(rows.map(r => r.subject))).sort(), [rows]);

  const days = Array.from({ length: 7 }, (_, i) => now + i * DAY);
  const classDays = new Set([...live, ...upcoming].map(c => dayKey(c.startMs)));

  const lists: Record<Tab, ClassView[]> = {
    upcoming: [...live, ...upcoming],
    missed: [...missed].sort((a, b) => Number(watched.has(a.id)) - Number(watched.has(b.id))),
    recordings: ended,
  };
  const needle = q.trim().toLowerCase();
  const shown = lists[tab].filter(c =>
    (!subject || c.subject === subject) &&
    (!day || dayKey(c.startMs) === day) &&
    (!needle || `${c.subject} ${c.topic} ${c.teacher} ${c.caption}`.toLowerCase().includes(needle)));
  const heroFirst = tab === "upcoming" && !subject && !day && !needle && shown.length > 0;

  const go = (k: Tab) => { setTab(k); setDay(""); setQ(""); };

  return (
    <div>
      {live[0] && (
        <Link href={`/portal/class/${encodeURIComponent(live[0].id)}`} className={d.liveBanner}>
          <span className={d.pulse} aria-hidden="true" />
          <span className={d.liveText}><b>{t.liveNow}</b> · {live[0].subject}: {live[0].topic}</span>
          <span className={d.liveCta}>{t.watchNow} →</span>
        </Link>
      )}

      <div className={d.stats}>
        <button type="button" className={d.stat} onClick={() => go("upcoming")}>
          <span className={d.statLabel}>{t.nextClass}</span>
          <b>{!next ? "—" : next.state === "live" ? t.liveNow : shortWait(next.startMs - JOIN_EARLY_MIN * 60_000 - now, t)}</b>
          {next && <span className={d.statSub}>{next.subject}</span>}
        </button>
        <button type="button" className={`${d.stat} ${toWatch.length ? d.statAlert : ""}`} onClick={() => go("missed")}>
          <span className={d.statLabel}>{t.toWatch}</span>
          <b>{toWatch.length || "✓"}</b>
          <span className={d.statSub}>{toWatch.length ? t.tabMissed : t.allCaught}</span>
        </button>
        <Link href="/portal/progress" className={d.stat}>
          <span className={d.statLabel}>{t.joinedOf}</span>
          <svg viewBox="0 0 36 36" className={d.ring} role="img" aria-label={`${pct}%`}>
            <circle cx="18" cy="18" r="15.5" className={d.ringBg} />
            <circle cx="18" cy="18" r="15.5" className={d.ringFg} strokeDasharray={`${pct * 0.974} 100`} />
            <text x="18" y="21.5" textAnchor="middle" className={d.ringText}>{joined}/{ended.length}</text>
          </svg>
        </Link>
      </div>

      <div className={d.week} role="group" aria-label="This week">
        {days.map((ms, i) => {
          const k = dayKey(ms);
          const on = day === k;
          return (
            <button key={k} type="button" aria-pressed={on} className={`${d.day} ${on ? d.dayOn : ""}`}
              onClick={() => { setTab("upcoming"); setDay(on ? "" : k); }}>
              <span>{i === 0 ? t.today : new Intl.DateTimeFormat(lang === "ta" ? "ta-IN" : "en-IN", { timeZone: TZ, weekday: "short" }).format(ms)}</span>
              <b>{new Intl.DateTimeFormat("en-IN", { timeZone: TZ, day: "numeric" }).format(ms)}</b>
              <i className={classDays.has(k) ? d.dot : d.noDot} aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <div className={d.tabs} role="tablist">
        {([["upcoming", t.tabUpcoming, lists.upcoming.length], ["missed", t.tabMissed, toWatch.length], ["recordings", t.tabRec, ended.length]] as const)
          .map(([k, label, n]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} className={`${d.tab} ${tab === k ? d.tabOn : ""}`} onClick={() => go(k)}>
              {label} <span className={d.count}>{n}</span>
            </button>
          ))}
      </div>

      {(subjects.length > 1 || tab !== "upcoming") && (
        <div className={d.tools}>
          {subjects.length > 1 && (
            <div className={ps.filters} role="group">
              {["", ...subjects].map(sv => (
                <button key={sv || "all"} type="button" aria-pressed={subject === sv}
                  className={`${ps.filter} ${subject === sv ? ps.filterOn : ""}`} onClick={() => setSubject(sv)}>
                  {sv || t.all}
                </button>
              ))}
            </div>
          )}
          {tab !== "upcoming" && (
            <input type="search" className={d.search} placeholder={t.search} value={q} onChange={e => setQ(e.target.value)} aria-label={t.search} />
          )}
        </div>
      )}

      {day && <button type="button" className={d.clear} onClick={() => setDay("")}>✕ {t.allDays}</button>}
      {tab === "missed" && toWatch.length > 0 && <p className={ps.missedNote}>{t.missedNote}</p>}

      {shown.length === 0 ? (
        <div className={ps.empty}>{tab === "upcoming" && !day && !subject ? t.noClasses : tab === "recordings" && !needle && !subject ? t.noRecordings : t.noneHere}</div>
      ) : (
        <>
          {heroFirst && <div className={d.hero}><ClassCard c={shown[0]} t={t} lang={lang} big watched={watched.has(shown[0].id)} /></div>}
          <div className={ps.grid}>
            {(heroFirst ? shown.slice(1) : shown).map(c => <ClassCard key={c.id} c={c} t={t} lang={lang} watched={watched.has(c.id)} />)}
          </div>
        </>
      )}
    </div>
  );
}
