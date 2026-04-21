"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Stethoscope, BookOpen, Clock, ArrowUpRight, X,
  Bell, ExternalLink, Sparkles, Tag,
} from "lucide-react"
import { dailyUpdates, type UpdateCategory } from "@/data/daily-updates"

// Category config for the cards
const examCards = [
  {
    icon: Stethoscope,
    title: "NEET & MBBS",
    badge: "Medical",
    description:
      "Stay updated with NEET exam dates, application deadlines, MBBS seat allotment, and counseling schedules.",
    gradient: "from-rose-500 to-pink-600",
    lightBg: "rgba(244, 63, 94, 0.08)",
    badgeColor: "rgba(244, 63, 94, 0.12)",
    badgeText: "#f43f5e",
    filterCategories: ["NEET", "MBBS"] as UpdateCategory[],
  },
  {
    icon: BookOpen,
    title: "CUET & Engineering",
    badge: "University",
    description:
      "Get latest info on CUET, TNEA, university admission processes, rank lists, and important dates.",
    gradient: "from-blue-500 to-indigo-600",
    lightBg: "rgba(59, 130, 246, 0.08)",
    badgeColor: "rgba(59, 130, 246, 0.12)",
    badgeText: "#3b82f6",
    filterCategories: ["CUET", "ENGINEERING"] as UpdateCategory[],
  },
  {
    icon: Clock,
    title: "All Updates & Deadlines",
    badge: "All Exams",
    description:
      "Never miss a deadline — JK Sir posts updates for all exams: Law, Management, Scholarships, MBBS, and more.",
    gradient: "from-amber-500 to-orange-500",
    lightBg: "rgba(245, 158, 11, 0.08)",
    badgeColor: "rgba(245, 158, 11, 0.12)",
    badgeText: "#f59e0b",
    filterCategories: [] as UpdateCategory[], // empty = show all
  },
]

const categoryColors: Record<UpdateCategory, { bg: string; text: string }> = {
  NEET: { bg: "rgba(244,63,94,0.12)", text: "#f43f5e" },
  CUET: { bg: "rgba(59,130,246,0.12)", text: "#3b82f6" },
  MBBS: { bg: "rgba(168,85,247,0.12)", text: "#a855f7" },
  ENGINEERING: { bg: "rgba(14,165,233,0.12)", text: "#0ea5e9" },
  LAW: { bg: "rgba(249,115,22,0.12)", text: "#f97316" },
  MANAGEMENT: { bg: "rgba(234,179,8,0.12)", text: "#eab308" },
  SCHOLARSHIP: { bg: "rgba(34,197,94,0.12)", text: "#22c55e" },
  GENERAL: { bg: "rgba(107,114,128,0.12)", text: "#6b7280" },
}

interface UpdatesDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  filterCategories: UpdateCategory[]
  accentColor: string
}

function UpdatesDrawer({ isOpen, onClose, title, filterCategories, accentColor }: UpdatesDrawerProps) {
  const filtered =
    filterCategories.length === 0
      ? dailyUpdates
      : dailyUpdates.filter((u) => filterCategories.includes(u.category))

  const sorted = [...filtered].sort((a, b) => {
    if (a.isPriority && !b.isPriority) return -1
    if (!a.isPriority && b.isPriority) return 1
    return 0
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col overflow-hidden rounded-t-3xl sm:right-0 sm:top-0 sm:bottom-0 sm:left-auto sm:w-[480px] sm:rounded-none sm:rounded-l-3xl"
            style={{
              background: "var(--card)",
              boxShadow: "-8px 0 48px rgba(0,0,0,0.12)",
              maxHeight: "92dvh",
            }}
            initial={{ y: "100%", x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="h-1 w-12 rounded-full" style={{ background: "var(--border)" }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between border-b px-6 py-4"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" style={{ color: accentColor }} />
                  <h3
                    className="font-display text-lg font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {title}
                  </h3>
                </div>
                <p className="mt-0.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {sorted.length} update{sorted.length !== 1 ? "s" : ""} available
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Updates list */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Sparkles className="mb-3 h-10 w-10 opacity-20" style={{ color: accentColor }} />
                  <p className="font-medium" style={{ color: "var(--foreground)" }}>
                    No updates yet
                  </p>
                  <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    Check back soon — JK Sir posts updates daily.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sorted.map((update, i) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="relative rounded-xl p-4"
                      style={{
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {/* Priority stripe */}
                      {update.isPriority && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                          style={{ background: accentColor }}
                        />
                      )}

                      <div className={`flex items-start gap-3 ${update.isPriority ? "pl-2" : ""}`}>
                        <div className="flex-1 min-w-0">
                          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                            {update.isNew && (
                              <span
                                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                                style={{ background: "#ef444420", color: "#ef4444" }}
                              >
                                NEW
                              </span>
                            )}
                            <span
                              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                              style={{
                                background: categoryColors[update.category]?.bg,
                                color: categoryColors[update.category]?.text,
                              }}
                            >
                              <Tag className="h-2.5 w-2.5" />
                              {update.category}
                            </span>
                            <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                              {update.date}
                            </span>
                          </div>

                          <p
                            className="font-semibold leading-snug"
                            style={{ fontSize: "0.875rem", color: "var(--foreground)" }}
                          >
                            {update.title}
                          </p>
                          <p
                            className="mt-1.5 text-xs leading-relaxed"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            {update.description}
                          </p>

                          {update.link && (
                            <a
                              href={update.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
                              style={{ color: accentColor }}
                            >
                              <ExternalLink className="h-3 w-3" />
                              Official Link
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="border-t px-6 py-4 text-center text-xs"
              style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
            >
              Updates posted daily by JK Sir ·{" "}
              <a
                href="https://whatsapp.com/channel/0029VaTOYogK5cDGKLRzxl23"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
                style={{ color: accentColor }}
              >
                Join WhatsApp Channel
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function ExamUpdatesSection() {
  const [activeDrawer, setActiveDrawer] = useState<number | null>(null)

  return (
    <section id="exams" className="relative overflow-hidden py-24 sm:py-32" style={{ background: "var(--muted)" }}>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span
            className="inline-block rounded-full px-4 py-1.5 text-sm font-medium"
            style={{ background: "rgba(var(--primary-rgb), 0.1)", color: "var(--primary)" }}
          >
            Stay Informed
          </span>
          <h2
            className="mt-4 font-display"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--foreground)",
            }}
          >
            Exam <span className="text-gradient">Updates</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg" style={{ color: "var(--muted-foreground)" }}>
            JK Sir posts daily updates — NEET, CUET, MBBS, Engineering, Law, Scholarships &amp; more.
            Tap any card to see the latest.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {examCards.map((exam, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl p-7"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
              onClick={() => setActiveDrawer(i)}
            >
              {/* Hover bg tint */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `radial-gradient(400px at 50% 0%, ${exam.lightBg}, transparent 80%)` }}
              />

              {/* Top stripe */}
              <div
                className="absolute left-0 top-0 h-1 w-0 rounded-tr-full transition-all duration-500 group-hover:w-full"
                style={{ background: `linear-gradient(90deg, ${exam.badgeText}, transparent)` }}
              />

              <div className="relative mb-5 flex items-center justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${exam.gradient} text-white`}
                  style={{ boxShadow: `0 8px 20px ${exam.lightBg.replace("0.08", "0.4")}` }}
                >
                  <exam.icon className="h-7 w-7" />
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: exam.badgeColor, color: exam.badgeText }}
                >
                  {exam.badge}
                </span>
              </div>

              <h3
                className="relative mb-3 font-display text-xl font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                {exam.title}
              </h3>
              <p className="relative text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                {exam.description}
              </p>

              <motion.div
                className="relative mt-5 flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: exam.badgeText }}
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bell className="h-4 w-4" />
                Get Updates
                <ArrowUpRight className="h-4 w-4" />
              </motion.div>

              {/* Update count badge */}
              {(() => {
                const count =
                  exam.filterCategories.length === 0
                    ? dailyUpdates.length
                    : dailyUpdates.filter((u) => exam.filterCategories.includes(u.category)).length
                return count > 0 ? (
                  <span
                    className="absolute right-5 top-5 flex h-6 min-w-[24px] items-center justify-center rounded-full px-1.5 text-xs font-bold text-white"
                    style={{ background: exam.badgeText }}
                  >
                    {count}
                  </span>
                ) : null
              })()}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Drawers */}
      {examCards.map((exam, i) => (
        <UpdatesDrawer
          key={i}
          isOpen={activeDrawer === i}
          onClose={() => setActiveDrawer(null)}
          title={exam.title}
          filterCategories={exam.filterCategories}
          accentColor={exam.badgeText}
        />
      ))}
    </section>
  )
}
