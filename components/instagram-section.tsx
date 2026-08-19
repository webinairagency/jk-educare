"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Instagram, ExternalLink, Play } from "lucide-react"

const INSTAGRAM_HANDLE = "jk.21051980"
const INSTAGRAM_PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`
const INSTAGRAM_REEL_URL = "https://www.instagram.com/reel/DaR_RR8FdNh/"

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void
      }
    }
  }
}

// Loads Instagram's official embed.js once and re-processes any
// .instagram-media blockquotes present on the page. No API keys/tokens —
// this is Instagram's public oEmbed embed, the same one used across the web.
function loadInstagramEmbedScript(onLoad: () => void) {
  const existing = document.getElementById("instagram-embed-script") as HTMLScriptElement | null

  if (existing) {
    if (window.instgrm?.Embeds) {
      onLoad()
    } else {
      existing.addEventListener("load", onLoad, { once: true })
    }
    return
  }

  const script = document.createElement("script")
  script.id = "instagram-embed-script"
  script.src = "https://www.instagram.com/embed.js"
  script.async = true
  script.addEventListener("load", onLoad, { once: true })
  document.body.appendChild(script)
}

function ReelEmbed() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [embedFailed, setEmbedFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    loadInstagramEmbedScript(() => {
      if (cancelled) return
      window.instgrm?.Embeds?.process()
    })

    // If Instagram's embed hasn't rendered an iframe within a few seconds
    // (blocked, rate-limited, or otherwise unreliable), fall back to a
    // clean link-out card instead of leaving a broken embed on the page.
    const timeout = window.setTimeout(() => {
      if (cancelled) return
      const hasIframe = containerRef.current?.querySelector("iframe")
      if (!hasIframe) {
        setEmbedFailed(true)
      }
    }, 6000)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [])

  if (embedFailed) {
    return (
      <a
        href={INSTAGRAM_REEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex aspect-[9/16] w-full max-w-[326px] flex-col items-center justify-center overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #833ab4, #fd1d1d 60%, #fcb045)",
        }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <Play className="h-7 w-7 translate-x-0.5 fill-white text-white" />
        </div>
        <p className="mt-4 px-6 text-center text-sm font-semibold text-white">
          Watch the Reel on Instagram
        </p>
        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-black/20 px-2.5 py-1 backdrop-blur-sm">
          <ExternalLink className="h-3 w-3 text-white" />
          <span className="text-[11px] font-medium text-white">instagram.com</span>
        </div>
      </a>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[326px] overflow-hidden rounded-2xl"
      style={{ background: "var(--muted)", minHeight: 400 }}
    >
      {/* Official Instagram oEmbed markup — embed.js hydrates this into an iframe.
          The link below also acts as a built-in fallback if the script never runs. */}
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={`${INSTAGRAM_REEL_URL}?utm_source=ig_embed&utm_campaign=loading`}
        data-instgrm-version="14"
        style={{ margin: 0, width: "100%" }}
      >
        <a href={INSTAGRAM_REEL_URL} target="_blank" rel="noopener noreferrer">
          View this reel on Instagram
        </a>
      </blockquote>
    </div>
  )
}

export function InstagramSection() {
  return (
    <section
      className="relative overflow-hidden py-12 sm:py-16"
      style={{ background: "var(--background)" }}
    >
      {/* BG orb */}
      <div
        className="pointer-events-none absolute -right-32 top-1/3 h-[400px] w-[400px] -translate-y-1/2 rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #fd1d1d, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          {/* Header + profile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-block rounded-full px-4 py-1.5 text-sm font-medium"
              style={{ background: "rgba(253, 29, 29, 0.1)", color: "#fd1d1d" }}
            >
              Instagram
            </span>
            <h2
              className="mt-3 font-display"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--foreground)",
              }}
            >
              Follow the{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #833ab4, #fd1d1d 60%, #fcb045)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Journey
              </span>
            </h2>
            <p className="mt-2 max-w-lg text-base" style={{ color: "var(--muted-foreground)" }}>
              Behind-the-scenes moments, student stories, and quick updates — follow us on Instagram.
            </p>

            <div
              className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl p-5"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #833ab4, #fd1d1d 60%, #fcb045)",
                  boxShadow: "0 8px 20px rgba(253, 29, 29, 0.35)",
                }}
              >
                <Instagram className="h-7 w-7 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                  Official Handle
                </p>
                <p className="mt-0.5 truncate font-display text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                  @{INSTAGRAM_HANDLE}
                </p>
              </div>

              <motion.a
                href={INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex shrink-0 items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #833ab4, #fd1d1d 60%, #fcb045)",
                  boxShadow: "0 8px 24px rgba(253, 29, 29, 0.35)",
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Instagram className="h-4 w-4" />
                Visit Profile
              </motion.a>
            </div>
          </motion.div>

          {/* Reel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <ReelEmbed />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
