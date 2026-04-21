"use client"

import { motion } from "framer-motion"
import { MessageCircle, UserCheck, Building2, HeartHandshake } from "lucide-react"

const steps = [
  {
    step: 1,
    icon: MessageCircle,
    title: "Contact JK Sir",
    description: "Reach out via WhatsApp or call. Share your current situation, marks, and what guidance you need.",
    color: "#1a3fdb",
  },
  {
    step: 2,
    icon: UserCheck,
    title: "Personal Guidance",
    description: "Receive one-on-one guidance tailored to your specific needs, goals, and circumstances.",
    color: "#2952f5",
  },
  {
    step: 3,
    icon: Building2,
    title: "Right Institution",
    description: "Get connected with the right college, educator, or institution that matches your requirements.",
    color: "#4f71ff",
  },
  {
    step: 4,
    icon: HeartHandshake,
    title: "Continuous Support",
    description: "We stay with you throughout the process until your admission is complete and you are settled.",
    color: "#6384ff",
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: 'var(--muted)' }}
    >
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(var(--primary) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

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
            style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)' }}
          >
            The Process
          </span>
          <h2
            className="mt-4 font-display"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
          >
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg" style={{ color: 'var(--muted-foreground)' }}>
            A simple, transparent process to get the guidance you need
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line (desktop) */}
          <motion.div
            className="absolute left-[12.5%] right-[12.5%] top-16 hidden h-px lg:block"
            style={{ background: 'linear-gradient(90deg, var(--primary), #6384ff)' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          />

          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step circle */}
              <motion.div
                className="relative z-10 mb-6"
                whileHover={{ scale: 1.1, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {/* Outer ring */}
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-full"
                  style={{
                    border: `2px solid ${item.color}30`,
                    background: 'var(--card)',
                    boxShadow: `0 8px 32px ${item.color}20`,
                  }}
                >
                  {/* Inner circle */}
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full"
                    style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)` }}
                  >
                    <item.icon className="h-9 w-9 text-white" />
                  </div>
                </div>

                {/* Step number badge */}
                <motion.div
                  className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: 'var(--gradient-primary)', boxShadow: '0 4px 12px var(--primary-glow)' }}
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, delay: i * 0.15 + 0.3 }}
                >
                  {item.step}
                </motion.div>
              </motion.div>

              <h3 className="mb-2 font-display text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
