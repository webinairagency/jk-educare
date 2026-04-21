"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GraduationCap, Compass, Users, HandHeart } from "lucide-react"

const services = [
  {
    icon: GraduationCap,
    title: "College Admission Guidance",
    description: "Personalized advice on choosing the right college based on your marks, interests, and career goals. We help you navigate the admission process smoothly.",
    color: "from-blue-500 to-indigo-600",
    lightBg: "rgba(59, 130, 246, 0.08)",
    accentColor: "#3b82f6",
  },
  {
    icon: Compass,
    title: "Career Counseling",
    description: "Confused about your career path? We help you understand various options available after 10th, 12th, or graduation and guide you towards the right choice.",
    color: "from-violet-500 to-purple-600",
    lightBg: "rgba(139, 92, 246, 0.08)",
    accentColor: "#8b5cf6",
  },
  {
    icon: Users,
    title: "Connection with Educators",
    description: "Get connected with experienced teachers, professors, and principals who can provide valuable insights and mentorship for your academic journey.",
    color: "from-cyan-500 to-blue-500",
    lightBg: "rgba(6, 182, 212, 0.08)",
    accentColor: "#06b6d4",
  },
  {
    icon: HandHeart,
    title: "Support for All Students",
    description: "We are committed to helping students from financially weaker backgrounds find affordable education options and scholarship opportunities.",
    color: "from-pink-500 to-rose-500",
    lightBg: "rgba(236, 72, 153, 0.08)",
    accentColor: "#ec4899",
  },
]

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 12
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -12
    setTilt({ x, y })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.12s ease',
      }}
    >
      <motion.div
        className="group relative h-full cursor-default overflow-hidden rounded-2xl p-7"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
        whileHover={{ boxShadow: 'var(--shadow-lg)' }}
        transition={{ duration: 0.3 }}
      >
        {/* Hover radial glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(400px at 50% 0%, ${service.lightBg}, transparent 80%)` }}
        />

        {/* Top accent bar */}
        <div
          className="absolute left-0 top-0 h-1 w-0 rounded-tr-full rounded-tl-2xl transition-all duration-500 group-hover:w-full"
          style={{ background: `linear-gradient(90deg, ${service.accentColor}, transparent)` }}
        />

        {/* Icon */}
        <motion.div
          className={`relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} text-white`}
          style={{ boxShadow: `0 8px 24px ${service.lightBg.replace('0.08', '0.4')}` }}
          whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
          transition={{ duration: 0.4 }}
        >
          <service.icon className="h-7 w-7" />
        </motion.div>

        <h3 className="mb-3 font-display text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
          {service.title}
        </h3>
        <p className="leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          {service.description}
        </p>

        {/* Learn more arrow */}
        <div className="mt-5 flex items-center gap-1 text-sm font-medium opacity-0 transition-all duration-300 group-hover:opacity-100" style={{ color: service.accentColor }}>
          Learn more
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >→</motion.span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden py-24 sm:py-32" style={{ background: 'var(--background)' }}>
      <div
        className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, var(--primary), transparent 70%)' }}
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
            What We Offer
          </span>
          <h2
            className="mt-4 font-display"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
          >
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg" style={{ color: 'var(--muted-foreground)' }}>
            Comprehensive support for every step of your educational journey
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
