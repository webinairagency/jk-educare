"use client";
import { useState, type ReactNode } from "react";
import s from "./portal.module.css";

/** Shows the thumbnail first; the video player (and its data use) loads only after a tap. */
export default function VideoGate({ src, title, play, note, children }: { src: string; title: string; play: string; note: string; children: ReactNode }) {
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
      <button type="button" className={s.playBtn} onClick={() => setOn(true)}>
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
        {play}
      </button>
      <span className={s.dataNote}>{note}</span>
    </div>
  );
}
