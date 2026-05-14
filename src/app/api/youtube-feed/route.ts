// ─────────────────────────────────────────────────────────────────────────────
//  /app/api/youtube-feed/route.ts
//
//  Server-side YouTube RSS fetcher — bypasses browser CORS restriction.
//
//  HOW TO USE:
//  1. Set FETCH_YOUTUBE = true in headline-ticker.tsx
//  2. Set YOUTUBE_CHANNEL_ID in headline-ticker.tsx
//     → Find it: YouTube Studio → Customization → Basic Info → Channel URL
//       OR View Page Source on your channel page and search "channelId"
//  3. This route is auto-called. No extra setup needed.
//
//  CACHING: Revalidates every 30 minutes (configurable via REVALIDATE_SECONDS).
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"

const REVALIDATE_SECONDS = 1800  // 30 minutes — change as needed

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const channelId = searchParams.get("channelId") ?? ""

  if (!channelId || channelId === "UCxxxxxxxxxxxxxxxxxxxxxxxx") {
    return NextResponse.json(
      { titles: [], error: "No valid channelId provided" },
      { status: 200 }
    )
  }

  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    const res = await fetch(rssUrl, {
      next: { revalidate: REVALIDATE_SECONDS },
    })

    if (!res.ok) throw new Error(`RSS fetch returned ${res.status}`)

    const xml = await res.text()

    // Extract <media:title> tags (YouTube RSS uses this for video titles)
    const titleMatches = [...xml.matchAll(/<media:title>(.+?)<\/media:title>/g)]

    // Also try plain <title> as fallback (skip first = channel title)
    const fallbackMatches = [...xml.matchAll(/<title><!\[CDATA\[(.+?)\]\]><\/title>/g)]
      .slice(1)

    const rawTitles =
      titleMatches.length > 0
        ? titleMatches.map(m => m[1])
        : fallbackMatches.map(m => m[1])

    const titles = rawTitles
      .slice(0, 5) // Show max 5 latest videos in the ticker
      .map(t =>
        t
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&#39;/g, "'")
          .trim()
      )
      .filter(Boolean)

    return NextResponse.json({ titles })
  } catch (err) {
    console.error("[youtube-feed] Error:", err)
    return NextResponse.json({ titles: [] }, { status: 200 })
  }
}
