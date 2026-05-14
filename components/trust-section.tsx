"use client"

import { motion } from "framer-motion"
import { Users, Award, Heart, Shield } from "lucide-react"

const trustPoints = [
  {
    icon: Users,
    title: "Led by JK Sir",
    description: "Personal guidance from an experienced educator who deeply understands student needs.",
  },
  {
    icon: Award,
    title: "Expert Network",
    description: "Connected with teachers, principals, and professors across institutions in Tamil Nadu.",
  },
  {
    icon: Heart,
    title: "Supporting All Students",
    description: "Dedicated to helping students from all backgrounds, including financially weaker families.",
  },
  {
    icon: Shield,
    title: "Trusted Guidance",
    description: "Honest, transparent advice focused on your best interests — not sales.",
  },
]

export function TrustSection() {
  return (
    <section
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: 'var(--background-secondary, var(--muted))' }}
    >
      {/* Background orb */}
      <div
        className="pointer-events-none absolute -left-64 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, var(--primary), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <span
            className="inline-block rounded-full px-4 py-1.5 text-sm font-medium"
            style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)' }}
          >
            Why Choose Us
          </span>
          <h2
            className="mt-4 font-display"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
          >
            Why Students <span className="text-gradient">Trust Us</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg" style={{ color: 'var(--muted-foreground)' }}>
            We are not a business selling courses. We are educators committed to guiding students towards success.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative cursor-default rounded-2xl p-7 transition-all duration-300"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
              onHoverStart={(e) => {
                const el = e.target as HTMLElement
                const card = el.closest('[data-card]') as HTMLElement
                if (card) card.style.boxShadow = 'var(--shadow-glow)'
              }}
              data-card
            >
              {/* Icon with gradient background */}
              <motion.div
                className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'rgba(var(--primary-rgb), 0.1)',
                  color: 'var(--primary)',
                }}
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.4 }}
              >
                <point.icon className="h-7 w-7" />
              </motion.div>

              {/* Hover gradient accent line */}
              <motion.div
                className="absolute left-7 top-0 h-1 w-0 rounded-b-full transition-all duration-300 group-hover:w-12"
                style={{ background: 'var(--gradient-primary)' }}
              />

              <h3 className="mb-2.5 font-display text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                {point.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
