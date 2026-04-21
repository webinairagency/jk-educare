"use client"

import { motion } from "framer-motion"
import { Video, Calendar, MessageSquare, Users, Clock, Zap } from "lucide-react"

const sessionFeatures = [
  {
    icon: Video,
    title: "Zoom-Based Sessions",
    description: "Join from anywhere using Zoom — no commute required",
  },
  {
    icon: MessageSquare,
    title: "Ask Your Doubts",
    description: "Get direct answers to all your questions from JK Sir",
  },
  {
    icon: Users,
    title: "Interactive Format",
    description: "Engage personally — not just watch, but participate",
  },
]

const topicsData = [
  "College selection guidance",
  "Career path discussions",
  "Exam preparation tips",
  "Q&A with JK Sir",
]

export function LiveSessionsSection() {
  return (
    <section id="sessions" className="relative overflow-hidden py-24 sm:py-32" style={{ background: 'var(--background)' }}>
      <div
        className="pointer-events-none absolute -right-48 bottom-0 h-[400px] w-[400px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, var(--primary), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="inline-block rounded-full px-4 py-1.5 text-sm font-medium"
              style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)' }}
            >
              Live Sessions
            </span>
            <h2
              className="mt-4 font-display"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
            >
              Live <span className="text-gradient">Guidance Sessions</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              Join our weekly Zoom sessions where you can ask doubts about colleges, careers, and
              exams — and get direct guidance from JK Sir in real time.
            </p>

            <div className="mt-8 space-y-4">
              {sessionFeatures.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="group flex items-start gap-4 rounded-xl p-4 transition-colors"
                  style={{ border: '1px solid var(--border)', background: 'var(--card)' }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)' }}
                  >
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{feature.title}</h3>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="https://wa.me/919842463437?text=I%20want%20to%20join%20the%20live%20guidance%20session"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Zap className="h-4 w-4" />
              Join via WhatsApp
            </motion.a>
          </motion.div>

          {/* Right: Session card */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative overflow-hidden rounded-3xl p-8"
              style={{
                background: 'var(--gradient-primary)',
                boxShadow: '0 24px 64px var(--primary-glow)',
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />

              {/* Next session badge */}
              <div className="relative mb-6 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-200">Next Session</p>
                  <p className="font-display text-2xl font-bold text-white">Sunday, 6:00 PM</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                  <span className="text-xs font-medium text-green-300">Free</span>
                </div>
              </div>

              {/* Topics */}
              <div className="relative rounded-2xl bg-white/10 p-5">
                <h4 className="mb-4 flex items-center gap-2 font-semibold text-white">
                  <Clock className="h-4 w-4" />
                  Topics Covered This Week
                </h4>
                <div className="space-y-3">
                  {topicsData.map((topic, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      className="flex items-center gap-2.5 text-sm text-blue-100"
                    >
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
                      {topic}
                    </motion.div>
                  ))}
                </div>
              </div>

              <p className="relative mt-4 text-center text-sm text-blue-200">
                ✨ Free to join for all students — no registration needed
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
