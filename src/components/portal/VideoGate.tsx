"use client";
import { useState, type ReactNode } from "react";
import s from "./portal.module.css";

/** Shows the thumbnail first; the video player (and its data use) loads only after a tap. */
export const WATCHED_KEY = "jk_watched";

/** Remember on this phone which recordings were played, so the dashboard can tick them. */
function markWatched(id: string) {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(WATCHED_KEY) || "[]");
    if (!list.includes(id)) localStorage.setItem(WATCHED_KEY, JSON.stringify([...list, id].slice(-300)));
  } catch { /* storage blocked: ignore */ }
}

export default function VideoGate({ src, title, play, note, classId, children }: { src: string; title: string; play: string; note: string; classId?: string; children: ReactNode }) {
  const [on, setOn] = useState(false);
  if (on) {
    return (
      <div className={s.player}>
        <iframe src={src} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
      </div>
    );
  }
  return (
    <div className={s.gateVideo}>
      {children}
      <button type="button" className={s.playBtn} onClick={() => { setOn(true); if (classId) markWatched(classId); }}>
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
        {play}
      </button>
      <span className={s.dataNote}>{note}</span>
    </div>
  );
}
