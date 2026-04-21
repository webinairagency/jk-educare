"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion"
import { ArrowRight, MessageCircle, Star, Play } from "lucide-react"

const stats = [
  { value: "2000+", label: "Students Guided" },
  { value: "3+", label: "Years of Service" },
  { value: "100%", label: "Free Consultation" },
]

function AnimatedCounter({ target }: { target: string }) {
  const [display, setDisplay] = useState("0")
  const ref = useRef<HTMLSpanElement>(null)
  const num = parseInt(target.replace(/\D/g, ""))
  const suffix = target.replace(/[0-9]/g, "")

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      let start = 0
      const duration = 1400
      const step = (timestamp: number) => {
        if (!start) start = timestamp
        const progress = Math.min((timestamp - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(eased * num) + suffix)
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [num, suffix])

  return <span ref={ref}>{display}</span>
}

export function HeroSection() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], ["0%", "20%"])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 80 })
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 80 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({ x: e.clientX, y: e.clientY - rect.top })
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 30)
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 30)
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92vh] overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}
      onMouseMove={handleMouseMove}
    >
      {/* Mouse-follow gradient */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(700px at ${mouse.x}px ${mouse.y}px, rgba(var(--primary-rgb), 0.08), transparent 70%)`,
        }}
      />

      {/* Parallax orbs */}
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', x: smoothX, y: smoothY }}
        />
        <motion.div
          className="absolute -bottom-48 -left-48 h-[700px] w-[700px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4f71ff 0%, transparent 70%)', x: smoothX, y: smoothY }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)', x: smoothX, y: smoothY }}
        />
      </motion.div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        style={{ opacity }}
        className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border px-5 py-2 text-sm font-medium"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            borderColor: 'var(--glass-border)',
            color: 'var(--muted-foreground)',
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span>Trusted by thousands of students across Tamil Nadu</span>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl text-balance font-display"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}
        >
          Guiding Students Towards{" "}
          <span className="text-gradient">the Right Future</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed sm:text-xl"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Expert guidance for college admissions, career decisions, and exam preparation.
          Personal support from <strong style={{ color: 'var(--foreground)' }}>JK Sir</strong> — every step of the way.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <motion.a
            href="https://wa.me/919842463437"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow inline-flex items-center gap-2.5 rounded-2xl px-8 py-4 text-base font-semibold text-white"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            <MessageCircle className="h-5 w-5" />
            Get Guidance on WhatsApp
          </motion.a>
          <motion.a
            href="#sessions"
            className="inline-flex items-center gap-2 rounded-2xl border px-8 py-4 text-base font-semibold transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)', background: 'var(--glass-bg)', backdropFilter: 'blur(8px)' }}
            whileHover={{ scale: 1.04, borderColor: 'var(--primary)', y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Play className="h-4 w-4" style={{ color: 'var(--primary)' }} />
            Join Live Session
            <ArrowRight className="h-4 w-4" />
          </motion.a>
        </motion.div>

        {/* Trust pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm"
        >
          {["Free Consultation", "Personal Guidance", "Trusted Educators", "All Backgrounds Welcome"].map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{ background: 'rgba(var(--primary-rgb), 0.08)', color: 'var(--primary)', border: '1px solid rgba(var(--primary-rgb), 0.15)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              {item}
            </motion.span>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 grid grid-cols-3 gap-6 sm:gap-12"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-number">
                <AnimatedCounter target={stat.value} />
              </div>
              <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="flex h-10 w-6 items-start justify-center rounded-full border-2 py-1.5"
            style={{ borderColor: 'var(--border)' }}
          >
            <motion.div
              className="h-2 w-1 rounded-full"
              style={{ background: 'var(--primary)' }}
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
