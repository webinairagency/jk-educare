"use client"

import { motion } from "framer-motion"
import { MessageCircle, Bell, Users, TrendingUp } from "lucide-react"

const channelFeatures = [
  { icon: Bell, text: "Instant exam deadline alerts" },
  { icon: Users, text: "Community of guided students" },
  { icon: TrendingUp, text: "Daily career tips & insights" },
]

export function WhatsAppChannelSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32" style={{ background: 'var(--background-secondary, var(--muted))' }}>
      <div
        className="pointer-events-none absolute -right-32 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #22c55e, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="inline-block rounded-full px-4 py-1.5 text-sm font-medium"
              style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a' }}
            >
              WhatsApp Channel
            </span>
            <h2
              className="mt-4 font-display"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
            >
              Join Our{" "}
              <span style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                WhatsApp Channel
              </span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              Stay ahead with real-time updates on exams, admission news, and career guidance tips.
              Join thousands of students already following our channel.
            </p>

            <div className="mt-8 space-y-3">
              {channelFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(34,197,94,0.1)' }}>
                    <f.icon className="h-4 w-4" style={{ color: '#16a34a' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{f.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="https://whatsapp.com/channel/0029VaTOYogK5cDGKLRzxl23"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-semibold text-white"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)',
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle className="h-4 w-4" />
              Join the Channel
            </motion.a>
          </motion.div>

          {/* Visual card */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative overflow-hidden rounded-3xl p-8"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                boxShadow: '0 24px 64px rgba(34, 197, 94, 0.35)',
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />

              <div className="relative flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-white">JK Edu-Care</p>
                  <p className="text-sm text-green-200">Official WhatsApp Channel</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  <span className="text-xs font-medium text-white">Live</span>
                </div>
              </div>

              {[
                "🎓 NEET 2025 application deadline this Friday!",
                "📢 New college admission list released",
                "💡 Top 5 career options after B.Sc this week",
              ].map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="mb-3 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm last:mb-0"
                >
                  {msg}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
