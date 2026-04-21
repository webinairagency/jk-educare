"use client"

import { useEffect, useRef, useState } from "react"
import { Megaphone, X } from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
//  HOW TO ADD / DELETE HEADLINES:
//
//  ADD a headline:
//    Push a new string into the HEADLINES array below.
//    Example: "📢 New: MBBS Admission Helpline Open — Call Now!"
//
//  DELETE a headline:
//    Remove the string from the HEADLINES array.
//
//  To update daily, just edit this array and redeploy (or refresh the page
//  if you're loading from a JSON/API in future).
// ─────────────────────────────────────────────────────────────────────────────

export const HEADLINES: string[] = [
  "📢 NEET 2025 Counselling Round 2 — Register before the deadline!",
  "🎓 Free Admission Guidance Session every Sunday at 6:00 PM via Zoom",
  "📋 CUET 2025 Result announced — Check your score and apply now",
  "🏥 MBBS seats available in Uzbekistan — Limited spots for Tamil Nadu students",
  "📞 Call JK Sir: +91 98424 63437 for personal career guidance",
  "🇺🇿 Fergana Medical Institute students share live feedback — Watch on YouTube",
  "🆓 100% Free Consultation — No fees, no pressure, just honest guidance",
  "📅 TN Government Quota Cutoff explained — Watch Indhumathi ma'am's video",
  "✅ Students from Ramnad placed in Uzbekistan colleges — Success stories live!",
  "📲 Join our WhatsApp Channel for daily exam updates & notifications",
]

export function HeadlineTicker() {
  const [visible, setVisible] = useState(true)
  const trackRef = useRef<HTMLDivElement>(null)

  // Duplicate headlines for seamless infinite scroll
  const doubled = [...HEADLINES, ...HEADLINES]

  if (!visible) return null

  return (
    <div
      className="relative z-[60] flex items-center overflow-hidden"
      style={{
        background: 'var(--gradient-primary)',
        height: '38px',
        boxShadow: '0 2px 12px var(--primary-glow)',
      }}
    >
      {/* LEFT label */}
      <div
        className="relative z-10 flex shrink-0 items-center gap-1.5 px-3 py-1"
        style={{
          background: 'rgba(0,0,0,0.25)',
          borderRight: '1px solid rgba(255,255,255,0.2)',
          height: '100%',
        }}
      >
        <Megaphone className="h-3.5 w-3.5 text-white" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-white whitespace-nowrap">
          Live Updates
        </span>
      </div>

      {/* SCROLLING TRACK */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={trackRef}
          className="ticker-track flex items-center gap-0 whitespace-nowrap"
          style={{ animation: 'ticker-scroll 55s linear infinite' }}
        >
          {doubled.map((headline, i) => (
            <span
              key={i}
              className="inline-flex items-center text-[12px] font-medium text-white"
              style={{ padding: '0 2.5rem' }}
            >
              {headline}
              <span
                className="mx-6 inline-block h-1 w-1 rounded-full bg-white/50 align-middle"
              />
            </span>
          ))}
        </div>
      </div>

      {/* CLOSE button */}
      <button
        onClick={() => setVisible(false)}
        aria-label="Close ticker"
        className="flex shrink-0 items-center justify-center px-3 transition-opacity hover:opacity-80"
        style={{ height: '100%' }}
      >
        <X className="h-3.5 w-3.5 text-white/80" />
      </button>

      {/* LEFT fade */}
      <div
        className="pointer-events-none absolute left-[110px] top-0 h-full w-12 z-10"
        style={{ background: 'linear-gradient(90deg, var(--primary), transparent)' }}
      />
      {/* RIGHT fade */}
      <div
        className="pointer-events-none absolute right-8 top-0 h-full w-12 z-10"
        style={{ background: 'linear-gradient(-90deg, var(--primary), transparent)' }}
      />
    </div>
  )
}
