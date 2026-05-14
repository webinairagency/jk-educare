"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Youtube, Play, ExternalLink } from "lucide-react"

const videos = [
  {
    id: "dPKF6pRuFP4",
    title: "Who is JK Sir?",
    description: "Get to know JK Sir — his mission to guide students across Tamil Nadu and worldwide.",
    isShort: true,
    tag: "About Us",
    tagColor: "#1a3fdb",
  },
  {
    id: "KM2lSUPjCoE",
    title: "From Ramnad to Uzbekistan 🎉",
    description: "Success story of a student from Ramnad district who got placed in a college in Uzbekistan.",
    isShort: true,
    tag: "Success Story",
    tagColor: "#16a34a",
  },
  {
    id: "EKxTHdDFxr4",
    title: "Live Feedback from Fergana, Uzbekistan",
    description: "Live feedback from students of Fergana Medical Institute of Public Health, Uzbekistan.",
    isShort: true,
    tag: "Student Feedback",
    tagColor: "#9333ea",
  },
  {
    id: "7nu4CI2Aagg",
    title: "TN Govt Quota — How Cut-off Ranking Works",
    description:
      "Indhumathi, medical career consultant & educationist, explains Tamil Nadu Government Quota seat ranking based on cut-off marks.",
    isShort: false,
    tag: "Expert Talk",
    tagColor: "#ea580c",
  },
]

function VideoCard({
  video,
  index,
}: {
  video: (typeof videos)[0]
  index: number
}) {
  const [loaded, setLoaded] = useState(false)
  const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`
  const thumbUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Video Player */}
      <div
        className={`relative w-full overflow-hidden bg-black ${video.isShort ? "aspect-[9/16]" : "aspect-video"}`}
        style={{ maxHeight: video.isShort ? 340 : "none" }}
      >
        {loaded ? (
          <iframe
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="group/play relative flex h-full w-full items-center justify-center"
            aria-label={`Play ${video.title}`}
          >
            {/* Thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbUrl}
              alt={video.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/play:scale-105"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 transition-opacity group-hover/play:bg-black/40" />
            {/* Play button */}
            <motion.div
              className="relative flex h-16 w-16 items-center justify-center rounded-full text-white"
              style={{
                background: "rgba(255,0,0,0.9)",
                boxShadow: "0 8px 32px rgba(255,0,0,0.5)",
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="h-7 w-7 translate-x-0.5 fill-white" />
            </motion.div>
            {/* YouTube logo */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-sm">
              <Youtube className="h-3.5 w-3.5 text-red-500" />
              <span className="text-[11px] font-semibold text-white">YouTube</span>
            </div>
          </button>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
            style={{
              background: `${video.tagColor}18`,
              color: video.tagColor,
              border: `1px solid ${video.tagColor}30`,
            }}
          >
            {video.tag}
          </span>
          <a
            href={`https://youtu.be/${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] opacity-50 transition-opacity hover:opacity-100"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ExternalLink className="h-3 w-3" /> YouTube
          </a>
        </div>

        <h3
          className="font-display text-base font-semibold leading-snug"
          style={{ color: "var(--foreground)" }}
        >
          {video.title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {video.description}
        </p>
      </div>
    </motion.div>
  )
}

export function YouTubeSection() {
  return (
    <section
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: "var(--background)" }}
    >
      {/* BG orb */}
      <div
        className="pointer-events-none absolute -left-32 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #ef4444, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span
              className="inline-block rounded-full px-4 py-1.5 text-sm font-medium"
              style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}
            >
              YouTube Channel
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
              Watch &amp;{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Learn Free
              </span>
            </h2>
            <p className="mt-2 max-w-lg text-base" style={{ color: "var(--muted-foreground)" }}>
              Real stories, expert advice, and live guidance — all on our YouTube channel.
            </p>
          </div>

          <motion.a
            href="https://youtube.com/@jkeducareservices"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2.5 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              boxShadow: "0 8px 24px rgba(239, 68, 68, 0.35)",
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Youtube className="h-4 w-4" />
            Visit Channel
          </motion.a>
        </motion.div>

        {/* Video grid — 2 shorts + 1 short + 1 landscape */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
