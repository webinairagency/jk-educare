"use client"

import { motion } from "framer-motion"
import { CheckCircle2, GraduationCap, Users, Heart } from "lucide-react"
import Image from "next/image"

const highlights = [
  { icon: GraduationCap, text: "Expert in college admission guidance" },
  { icon: Users, text: "Connected with educators across Tamil Nadu" },
  { icon: Heart, text: "Dedicated to students from all backgrounds" },
  { icon: CheckCircle2, text: "3+ years of trusted student support" },
]

export function AboutSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32" style={{ background: 'var(--background)' }}>
      {/* Decorative blob */}
      <div
        className="pointer-events-none absolute -right-64 -top-64 h-[600px] w-[600px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, var(--primary), transparent 70%)' }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              {/* Decorative frame */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-30"
                style={{ background: 'var(--gradient-primary)' }}
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden rounded-2xl"
                style={{ boxShadow: 'var(--shadow-lg)' }}
              >
                <Image
                  src="/images/jk-sir.jpg.png"
                  alt="JK Sir — Educational Counselor"
                  width={500}
                  height={420}
                  className="w-full object-cover"
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="glass absolute -bottom-6 -right-4 flex items-center gap-3 rounded-2xl px-5 py-4"
                style={{ boxShadow: 'var(--shadow-md)' }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Trusted by</p>
                  <p className="font-display text-sm font-semibold" style={{ color: 'var(--foreground)' }}>2000+ Students</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block rounded-full px-4 py-1.5 text-sm font-medium"
              style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)' }}
            >
              About JK Sir
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="mt-4 font-display"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
            >
              A Mentor Who <span className="text-gradient">Truly Cares</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-5 text-lg leading-relaxed"
              style={{ color: 'var(--muted-foreground)' }}
            >
              JK Sir is dedicated to guiding students towards the right educational path.
              With strong connections to experienced teachers, principals, and professors
              across institutions, he helps students make informed decisions about their future.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="mt-4 text-lg leading-relaxed"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Through personal guidance, live sessions, and continuous support, JK Sir assists
              students in choosing the right colleges, courses, and career directions — with
              special dedication to students from all financial backgrounds.
            </motion.p>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: 'rgba(var(--primary-rgb), 0.05)', border: '1px solid rgba(var(--primary-rgb), 0.1)' }}
                >
                  <item.icon className="h-4 w-4 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
