import { unstable_cache } from "next/cache";
import { callScript } from "./script";

export type ClassRow = {
  id: string; subject: string; topic: string; teacher: string; for: string;
  start: string; duration: number; live: string; recording: string; notes: string; caption: string;
};
export type ClassState = "upcoming" | "live" | "processing" | "recorded";
export type ClassView = ClassRow & { state: ClassState; attended: boolean; missed: boolean; startMs: number; endMs: number };

export const JOIN_EARLY_MIN = 10;
const TZ = "Asia/Kolkata";

// Classes are shared by everyone, so cache them for 60s to keep the portal fast.
export const getClasses = unstable_cache(
  async () => (await callScript<{ classes: ClassRow[] }>("classes")).classes ?? [],
  ["portal-classes"],
  { revalidate: 60 }
);

export async function getAttendance(regNo: string) {
  try {
    return new Set((await callScript<{ ids: string[] }>("attendance", { regNo })).ids ?? []);
  } catch {
    return new Set<string>();
  }
}

/** Which subject tags a student's group gets. Class "For" column uses: All, Maths, Bio, CS (comma-separated). */
export function tagsForGroup(group: string) {
  const g = group.toLowerCase();
  const tags = new Set<string>(["all"]);
  if (g.includes("math")) tags.add("maths");
  if (g.includes("bio") || g.includes("pure science")) tags.add("bio");
  if (g.includes("cs") || g.includes("computer")) tags.add("cs");
  return tags;
}

export function visibleTo(c: { for: string }, tags: Set<string>) {
  const f = (c.for || "All").toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
  return f.length === 0 || f.some(t => tags.has(t));
}

export function view(c: ClassRow, attended: Set<string>, now = Date.now()): ClassView {
  const startMs = new Date(c.start).getTime();
  const endMs = startMs + c.duration * 60_000;
  let state: ClassState;
  if (now < startMs - JOIN_EARLY_MIN * 60_000) state = "upcoming";
  else if (now <= endMs) state = "live";
  // YouTube: the live video becomes the recording automatically. Recording column only overrides it.
  else state = videoId(c) ? "recorded" : "processing";
  const wasThere = attended.has(c.id);
  return { ...c, state, attended: wasThere, missed: now > endMs && !wasThere, startMs, endMs };
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
