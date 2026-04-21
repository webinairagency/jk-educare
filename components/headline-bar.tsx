"use client"

import { dailyUpdates } from "@/data/daily-updates"

// Pull the most recent 6 updates for the ticker
const tickerItems = [...dailyUpdates]
  .sort((a, b) => (b.isPriority ? 1 : 0) - (a.isPriority ? 1 : 0))
  .slice(0, 8)

export function HeadlineBar() {
  const text = tickerItems
    .map((u) => `${u.isNew ? "🔴 NEW — " : ""}${u.title}`)
    .join("   ·   ")

  return (
    <div
      className="relative z-50 w-full overflow-hidden"
      style={{
        background: "var(--gradient-primary)",
        height: "36px",
      }}
    >
      {/* Left fade */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20"
        style={{
          background:
            "linear-gradient(to right, var(--primary) 20%, transparent 100%)",
        }}
      />

      {/* Label */}
      <div
        className="absolute left-0 top-0 z-20 flex h-full items-center px-4 text-xs font-bold uppercase tracking-widest text-white"
        style={{
          background: "rgba(0,0,0,0.2)",
          borderRight: "1px solid rgba(255,255,255,0.2)",
          whiteSpace: "nowrap",
          minWidth: "fit-content",
        }}
      >
        📢 UPDATES
      </div>

      {/* Scrolling track */}
      <div
        className="flex h-full items-center"
        style={{ paddingLeft: "140px" }}
      >
        <div className="ticker-track flex items-center gap-0 whitespace-nowrap text-xs font-medium text-white/90">
          <span>{text}</span>
          <span className="mx-10">·</span>
          <span aria-hidden="true">{text}</span>
          <span className="mx-10">·</span>
        </div>
      </div>

      {/* Right fade */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20"
        style={{
          background:
            "linear-gradient(to left, #2952f5 20%, transparent 100%)",
        }}
      />

      <style>{`
        .ticker-track {
          animation: ticker-scroll 40s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
