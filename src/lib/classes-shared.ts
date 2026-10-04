// Pure helpers: safe to use in both server and client components.
import { GROUP_DEFS, groupKey, isKnownSubject, normSubject, subjectTag } from "./groups";

export type ClassRow = {
  id: string; subject: string; topic: string; teacher: string; for: string;
  start: string; duration: number; live: string; recording: string; notes: string; caption: string;
};
// "ended" = a Zoom / Google Meet class that is over and has no recording to watch.
export type ClassState = "upcoming" | "live" | "processing" | "recorded" | "ended";
export type ClassView = ClassRow & { state: ClassState; attended: boolean; missed: boolean; startMs: number; endMs: number };

export const JOIN_EARLY_MIN = 10;
const TZ = "Asia/Kolkata";

/**
 * What a student's group unlocks: the group itself plus one tag per subject the group studies.
 * Admin preview ("All groups") unlocks everything. A group we don't recognise (an old sheet value)
 * also unlocks everything, so nobody is ever locked out by a spelling difference.
 */
export function tagsForGroup(group: string) {
  const tags = new Set<string>(["all"]);
  const everything = () => { GROUP_DEFS.forEach(d => { tags.add(d.key); d.subjects.forEach(s => tags.add(subjectTag(s))); }); return tags; };
  if ((group || "").toLowerCase().includes("admin preview")) return everything();
  const key = groupKey(group);
  const def = GROUP_DEFS.find(d => d.key === key);
  if (!def) return everything();
  tags.add(def.key);
  def.subjects.forEach(s => tags.add(subjectTag(s)));
  return tags;
}

/**
 * A class / material / notice is visible when:
 *  - its subject belongs to the student's group (NEET, JEE, General and unknown subjects are open to all), and
 *  - its "For" column is empty, "All", or names the student's group (e.g. bio-maths). Old values
 *    like Maths / Bio / CS are ignored; the subject now decides.
 */
export function visibleTo(c: { for: string; subject?: string }, tags: Set<string>) {
  const f = (c.for || "All").toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
  const limits = f.filter(x => GROUP_DEFS.some(d => d.key === x));
  if (limits.length > 0 && !limits.some(x => tags.has(x))) return false;
  const sub = c.subject;
  if (!sub || isExam(sub) || normSubject(sub) === "general" || !isKnownSubject(sub)) return true;
  return tags.has(subjectTag(sub));
}

export function view(c: ClassRow, attended: Set<string>, now = Date.now()): ClassView {
  const startMs = new Date(c.start).getTime();
  const endMs = startMs + c.duration * 60_000;
  let state: ClassState;
  if (now < startMs - JOIN_EARLY_MIN * 60_000) state = "upcoming";
  else if (now <= endMs) state = "live";
  // YouTube: the live video becomes the recording automatically. Recording column only overrides it.
  // Zoom / Meet have no recording unless one is pasted in the Recording column.
  else state = videoId(c) ? "recorded" : isExternalLive(c.live) ? "ended" : "processing";
  const wasThere = attended.has(c.id);
  return { ...c, state, attended: wasThere, missed: now > endMs && !wasThere && state !== "ended", startMs, endMs };
}

export function fmtDay(ms: number, lang: "en" | "ta" = "en") {
  return new Intl.DateTimeFormat(lang === "ta" ? "ta-IN" : "en-IN", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" }).format(ms);
}
export function fmtTime(ms: number, _lang: "en" | "ta" = "en") {
  return new Intl.DateTimeFormat("en-IN", { timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true }).format(ms).toUpperCase();
}

/** Google Drive share link -> file id (for the embedded player). */
export function driveId(link: string) {
  const m = link.match(/\/d\/([\w-]{10,})/) || link.match(/[?&]id=([\w-]{10,})/);
  return m ? m[1] : null;
}

export function calendarLink(c: ClassRow, portalUrl: string) {
  const s = new Date(c.start);
  const e = new Date(s.getTime() + c.duration * 60_000);
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `${c.subject}: ${c.topic} (JK Edu-Care)`,
    dates: `${f(s)}/${f(e)}`,
    details: `Join from the class portal: ${portalUrl}`,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

/** YouTube link -> video id (if a recording is later moved to YouTube). */
export function youtubeId(link: string) {
  const m = link.match(/(?:youtu\.be\/|v=|\/live\/|\/embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export function firstName(full: string) {
  const rest = full.replace(/^([A-Z]\.\s?)+/i, "").trim() || full;
  return rest.split(" ")[0].charAt(0).toUpperCase() + rest.split(" ")[0].slice(1).toLowerCase();
}

/** The video to play: optional Recording override first, else the live YouTube link. */
export function videoSrc(c: ClassRow, autoplay = false) {
  const link = c.recording || c.live;
  if (!link) return null;
  const d = driveId(link);
  if (d) return `https://drive.google.com/file/d/${d}/preview`;
  const y = youtubeId(link);
  return y ? `https://www.youtube-nocookie.com/embed/${y}?rel=0&modestbranding=1&playsinline=1${autoplay ? "&autoplay=1" : ""}` : null;
}
export function videoId(c: ClassRow) {
  const link = c.recording || c.live;
  return link ? driveId(link) || youtubeId(link) : null;
}
export function youtubeWatchUrl(c: ClassRow) {
  const y = youtubeId(c.live);
  return y ? `https://www.youtube.com/watch?v=${y}` : null;
}

/** What the live link is: YouTube (plays inside the portal) or Zoom / Google Meet (opens in its own app). */
export type LiveKind = "youtube" | "zoom" | "meet" | "other" | "";
export function liveKind(link: string): LiveKind {
  const l = (link || "").trim();
  if (!l) return "";
  if (youtubeId(l)) return "youtube";
  try {
    const host = new URL(l).hostname.toLowerCase();
    if (host === "zoom.us" || host.endsWith(".zoom.us")) return "zoom";
    if (host === "meet.google.com") return "meet";
    if (l.toLowerCase().startsWith("https://") && !driveId(l)) return "other";
  } catch { /* not a URL */ }
  return "";
}
export const isExternalLive = (link: string) => ["zoom", "meet", "other"].includes(liveKind(link));

/** NEET / JEE preparation classes and material live in their own section of the portal. */
export const isExam = (subject: string) => {
  const s = (subject || "").trim().toLowerCase();
  return ["neet", "jee"].some(x => s === x || s.startsWith(x + " ") || s.startsWith(x + "-") || s.startsWith(x + ":"));
};
