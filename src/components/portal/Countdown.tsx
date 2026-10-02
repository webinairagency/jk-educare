"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Labels = { prefix: string; d: string; h: string; m: string; opening: string };

/** "Join opens in 2h 14m"; refreshes the page when the join window opens. */
export default function Countdown({ openMs, labels }: { openMs: number; labels: Labels }) {
  const router = useRouter();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => {
      const n = Date.now();
      setNow(n);
      if (n >= openMs) { clearInterval(t); router.refresh(); }
    }, 20_000);
    return () => clearInterval(t);
  }, [openMs, router]);
  if (now === null) return null;
  const mins = Math.max(0, Math.round((openMs - now) / 60_000));
  if (mins <= 0) return <>{labels.opening}</>;
  const d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), m = mins % 60;
  const parts = [d ? `${d}${labels.d}` : "", h ? `${h}${labels.h}` : "", !d ? `${m}${labels.m}` : ""].filter(Boolean);
  return <>{labels.prefix} {parts.join(" ")}</>;
}
