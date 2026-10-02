"use client";
import { useEffect, useState } from "react";
import s from "./portal.module.css";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/** Android/Chrome: real install button. iPhone: short instruction. Hidden once installed. */
export default function InstallButton({ label, iosHint }: { label: string; iosHint: string }) {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    if (standalone) return;
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) setIos(true);
    const h = (e: Event) => { e.preventDefault(); setEvt(e as BIPEvent); };
    window.addEventListener("beforeinstallprompt", h);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);

  if (evt) {
    return (
      <button type="button" className={`${s.btn} ${s.btnGhost} ${s.installBtn}`}
        onClick={async () => { await evt.prompt(); await evt.userChoice; setEvt(null); }}>
        📲 {label}
      </button>
    );
  }
  if (ios) return <p className={s.iosHint}>📲 {iosHint}</p>;
  return null;
}
