"use client"

import { motion } from "framer-motion"
import { MessageCircle, Clock, HeadphonesIcon, Zap } from "lucide-react"

export function HelplineSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32" style={{ background: 'var(--background)' }}>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl p-10 sm:p-14 lg:p-16"
          style={{
            background: 'var(--gradient-primary)',
            boxShadow: '0 32px 80px var(--primary-glow)',
          }}
        >
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute right-1/4 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-white/5" />

          {/* Grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04] rounded-3xl overflow-hidden"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            {/* Left */}
            <div>
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <HeadphonesIcon className="h-7 w-7 text-white" />
              </div>
              <h2 className="font-display text-white" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Student Helpline
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-blue-100">
                Have a question or need guidance? Our WhatsApp helpline is always available for students.
                Whether you're confused about college choices, careers, or need any educational support — we're here.
              </p>

              <motion.a
                href="https://wa.me/919842463437?text=Hi%2C%20I%20need%20guidance"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2.5 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold transition-all"
                style={{ color: 'var(--primary)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                whileHover={{ scale: 1.05, y: -2, boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}
                whileTap={{ scale: 0.97 }}
              >
                <Zap className="h-4 w-4" />
                Get Instant Support
              </motion.a>
            </div>

            {/* Right: feature cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MessageCircle, title: "WhatsApp Support", desc: "Send questions anytime and get personalized responses" },
                { icon: Clock, title: "Quick Response", desc: "We respond to all queries as quickly as possible" },
                { icon: HeadphonesIcon, title: "Personal Attention", desc: "Every student gets individual care and guidance" },
                { icon: Zap, title: "Always Available", desc: "Our helpline is open 7 days a week for students" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm"
                >
                  <item.icon className="mb-3 h-6 w-6 text-white/80" />
                  <h4 className="mb-1 text-sm font-semibold text-white">{item.title}</h4>
                  <p className="text-xs leading-relaxed text-blue-200">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
