"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { X, Radio } from "lucide-react"
import { dailyUpdates } from "@/data/daily-updates"

// ═══════════════════════════════════════════════════════════════════════════════
//  🔧 CONFIGURATION — Three ways to manage ticker headlines:
//
//  OPTION 1 (DEFAULT — no redeploy needed):
//    Edit /public/data/headlines.json → { "headlines": ["item1", "item2"] }
//    FETCH_FROM_JSON is already true. Just update the JSON and refresh.
//
//  OPTION 2 (structured data — single source of truth):
//    Edit /data/daily-updates.ts and set USE_DAILY_UPDATES_AS_FALLBACK = true.
//    The ticker auto-pulls titles from that file as static fallback.
//
//  OPTION 3 (YouTube latest videos in ticker):
//    a) Create /src/app/api/youtube-feed/route.ts  (already created for you)
//    b) Set FETCH_YOUTUBE = true
//    c) Replace YOUTUBE_CHANNEL_ID with your real channel ID
//       → Find it: YouTube Studio → Customisation → Basic Info
//
//  SPEED:  Increase SCROLL_SPEED_SECONDS to slow the ticker, decrease to speed up.
//  REFRESH: Set AUTO_REFRESH_MINUTES > 0 to live-reload headlines periodically.
// ═══════════════════════════════════════════════════════════════════════════════

const FETCH_FROM_JSON              = true    // Read from /public/data/headlines.json
const USE_DAILY_UPDATES_AS_FALLBACK = true   // Use /data/daily-updates.ts titles as fallback
const FETCH_YOUTUBE                = false   // Requires /src/app/api/youtube-feed/route.ts
const YOUTUBE_CHANNEL_ID           = "UCxxxxxxxxxxxxxxxxxxxxxxxx" // ← replace with yours
const AUTO_REFRESH_MINUTES         = 30      // Live-refresh interval (0 = off)
const SCROLL_SPEED_SECONDS         = 65      // Higher = slower scroll

// ─── BUILD STATIC FALLBACK FROM daily-updates.ts ────────────────────────────
// Automatically converts your structured DailyUpdate entries into ticker strings.
// Priority/new items are shown first, matching the same sort as exam-updates-section.
function buildFallbackFromDailyUpdates(): string[] {
  return [...dailyUpdates]
    .sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1
      if (!a.isPriority && b.isPriority) return 1
      if (a.isNew && !b.isNew) return -1
      if (!a.isNew && b.isNew) return 1
      return 0
    })
    .map((u) => {
      const prefix = u.isNew ? "🔴 " : categoryEmoji(u.category) + " "
      return `${prefix}${u.title}${u.link ? ` — ${u.date}` : ""}`
    })
}

function categoryEmoji(category: string): string {
  const map: Record<string, string> = {
    NEET: "🩺",
    CUET: "📋",
    MBBS: "🏥",
    ENGINEERING: "⚙️",
    LAW: "⚖️",
    MANAGEMENT: "📊",
    SCHOLARSHIP: "🎓",
    GENERAL: "📢",
  }
  return map[category] ?? "📢"
}

// ─── DATA FETCHERS ────────────────────────────────────────────────────────────

async function fetchJsonHeadlines(): Promise<string[]> {
  try {
    const res = await fetch(`/data/headlines.json?t=${Date.now()}`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error(`headlines.json: ${res.status}`)
    const data = await res.json()
    if (Array.isArray(data.headlines) && data.headlines.length > 0) {
      return data.headlines as string[]
    }
    return []
  } catch {
    return []
  }
}

async function fetchYouTubeHeadlines(channelId: string): Promise<string[]> {
  try {
    const res = await fetch(`/api/youtube-feed?channelId=${channelId}&t=${Date.now()}`)
    if (!res.ok) throw new Error(`YouTube feed: ${res.status}`)
    const data = await res.json()
    if (Array.isArray(data.titles) && data.titles.length > 0) {
      return data.titles.map((t: string) => `🎥 New Video: ${t}`)
    }
    return []
  } catch {
    return []
  }
}

// ─── HEADLINE TICKER COMPONENT ────────────────────────────────────────────────

export function HeadlineTicker() {
  const staticFallback = USE_DAILY_UPDATES_AS_FALLBACK
    ? buildFallbackFromDailyUpdates()
    : [
        "📢 NEET 2025 Counselling Round 2 — Register before the deadline!",
        "🎓 Free Admission Guidance Session every Sunday at 6:00 PM via Zoom",
        "📋 CUET 2025 Result announced — Check your score and apply now",
        "🏥 MBBS seats available in Uzbekistan — Limited spots for Tamil Nadu students",
        "📞 Call JK Sir: +91 98424 63437 for personal career guidance",
        "🇺🇿 Fergana Medical Institute — Watch student feedback on YouTube",
        "🆓 100% Free Consultation — No fees, no pressure, just honest guidance",
        "📅 TN Govt Quota Cutoff explained — Watch Indhumathi ma'am's video",
        "✅ Students from Ramnad placed in Uzbekistan — Success stories live!",
        "📲 Join our WhatsApp Channel for daily exam updates & notifications",
      ]

  const [visible, setVisible]     = useState(true)
  const [headlines, setHeadlines] = useState<string[]>(staticFallback)
  const [isLoading, setIsLoading] = useState(FETCH_FROM_JSON || FETCH_YOUTUBE)
  const trackRef                  = useRef<HTMLDivElement>(null)
  const intervalRef               = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadHeadlines = useCallback(async () => {
    const results: string[] = []

    if (FETCH_FROM_JSON) {
      const jsonHeadlines = await fetchJsonHeadlines()
      results.push(...jsonHeadlines)
    }

    if (FETCH_YOUTUBE && YOUTUBE_CHANNEL_ID !== "UCxxxxxxxxxxxxxxxxxxxxxxxx") {
      const ytHeadlines = await fetchYouTubeHeadlines(YOUTUBE_CHANNEL_ID)
      results.push(...ytHeadlines)
    }

    // Only override if remote data fetched successfully
    if (results.length > 0) setHeadlines(results)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadHeadlines()
    if (AUTO_REFRESH_MINUTES > 0) {
      intervalRef.current = setInterval(loadHeadlines, AUTO_REFRESH_MINUTES * 60 * 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [loadHeadlines])

  if (!visible) return null

  // Quadruple for seamless CSS infinite loop (works for any screen width)
  const repeated = [...headlines, ...headlines, ...headlines, ...headlines]

  return (
    <div
      className="headline-ticker-root"
      role="marquee"
      aria-label="Live education news ticker"
      style={{
        /* Rich dark background — replaces dim default */
        background: "linear-gradient(90deg, #0f0f1a 0%, #1a0a0a 40%, #120a0a 100%)",
        borderBottom: "1px solid rgba(220, 38, 38, 0.25)",
        boxShadow: "0 2px 20px rgba(220, 38, 38, 0.12)",
      }}
    >
      {/* Layered gradient background */}
      <div className="ticker-bg" aria-hidden="true" />

      {/* Moving shimmer beam across entire bar */}
      <div className="ticker-shimmer" aria-hidden="true" />

      {/* ── LIVE UPDATES badge — RED ─────────────────────────────────── */}
      <div
        className="ticker-badge"
        aria-hidden="true"
        style={{
          /* Override any yellow/gold default */
          background: "linear-gradient(135deg, #2626dc 0%, #2626dc 100%)",
          border: "1px solid rgba(0, 255, 247, 0.44)",
          boxShadow: "0 0 12px rgba(0, 255, 247, 0.44), 0 0 24px rgba(220, 38, 38, 0.2)",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "4px 10px",
          minWidth: "max-content",
          flexShrink: 0,
          position: "relative",
          zIndex: 2,
        }}
      >

        {/* Pulse dot — red */}
        <span
          className="ticker-pulse-dot"
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#ff0000",
            flexShrink: 0,
            boxShadow: "0 0 6px #ff0000",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
        <Radio size={11} className="ticker-badge-icon" style={{ color: "#e44444", flexShrink: 0 }} />
        <span
          className="ticker-badge-text"
          style={{
            color: "#fff",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Live Updates
        </span>
      </div>

      {/* Slim glowing vertical divider — red tint */}
      <div
        className="ticker-divider"
        aria-hidden="true"
        style={{
          background: "rgba(255, 163, 163, 0.4)",
          boxShadow: "0 0 6px rgba(220, 38, 38, 0.3)",
        }}
      />

      {/* ── Scroll area */}
      <div className="ticker-scroll-wrap">
        {isLoading ? (
          <div className="ticker-skeleton" />
        ) : (
          <div
            ref={trackRef}
            className="ticker-track"
            style={{ animationDuration: `${SCROLL_SPEED_SECONDS}s` }}
          >
            {repeated.map((headline, i) => (
              <span key={i} className="ticker-item">
                {headline}
                <span className="ticker-sep" aria-hidden="true" style={{ color: "rgba(220,38,38,0.6)" }}>◆</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        aria-label="Close news ticker"
        className="ticker-close"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        <X size={12} />
      </button>
    </div>
  )
}
