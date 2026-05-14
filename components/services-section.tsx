"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  GraduationCap, Compass, Users, HandHeart,
  X, CheckCircle, Sparkles, MessageCircle, Phone,
} from "lucide-react"

// ─── SERVICE DATA — add/edit features, whatsapp text, full description here ──
const services = [
  {
    icon: GraduationCap,
    title: "College Admission Guidance",
    tagline: "Right College, Right Future",
    description:
      "Personalized advice on choosing the right college based on your marks, interests, and career goals. We help you navigate the admission process smoothly.",
    fullDesc:
      "JK Sir personally reviews your marks, stream, and goals to shortlist the best-fit colleges — government and private — so you never waste a seat or miss a deadline.",
    features: [
      "Marks-based college shortlisting across all streams",
      "Government & private college comparison",
      "Fee structure and scholarship guidance",
      "Application and document checklist support",
      "Deadline tracking for every round",
      "100% free — no hidden charges",
    ],
    color: "from-blue-500 to-indigo-600",
    gradientFrom: "#3b82f6",
    gradientTo: "#4f46e5",
    lightBg: "rgba(59, 130, 246, 0.08)",
    borderColor: "rgba(59, 130, 246, 0.2)",
    accentColor: "#3b82f6",
    whatsappText: "I%20need%20college%20admission%20guidance%20from%20JK%20Sir",
    callCTA: "Call for Admission Help",
  },
  {
    icon: Compass,
    title: "Career Counseling",
    tagline: "Find Your True Direction",
    description:
      "Confused about your career path? We help you understand various options available after 10th, 12th, or graduation and guide you towards the right choice.",
    fullDesc:
      "Many students feel lost choosing between streams or careers. JK Sir offers one-on-one sessions that align your strengths, interests, and opportunities into a clear, actionable roadmap.",
    features: [
      "Stream selection after 10th and 12th",
      "Course vs career alignment sessions",
      "Engineering vs Medical vs Law comparisons",
      "Passion-to-profession roadmap guidance",
      "Parent and student joint sessions available",
      "Follow-up support after initial consultation",
    ],
    color: "from-violet-500 to-purple-600",
    gradientFrom: "#8b5cf6",
    gradientTo: "#7c3aed",
    lightBg: "rgba(139, 92, 246, 0.08)",
    borderColor: "rgba(139, 92, 246, 0.2)",
    accentColor: "#8b5cf6",
    whatsappText: "I%20need%20career%20counselling%20from%20JK%20Sir",
    callCTA: "Call for Career Guidance",
  },
  {
    icon: Users,
    title: "Connection with Educators",
    tagline: "Learn from the Best",
    description:
      "Get connected with experienced teachers, professors, and principals who can provide valuable insights and mentorship for your academic journey.",
    fullDesc:
      "JK Educare bridges the gap between students and trusted educators. Whether you need subject experts, college mentors, or principals who can guide your application — we make the right introductions.",
    features: [
      "Direct connection to verified educators",
      "Subject-specific mentor matching",
      "College principal introductions",
      "Live Q&A sessions every Sunday on Zoom",
      "YouTube explainer series by JK Sir",
      "WhatsApp group with active educator community",
    ],
    color: "from-cyan-500 to-blue-500",
    gradientFrom: "#06b6d4",
    gradientTo: "#3b82f6",
    lightBg: "rgba(6, 182, 212, 0.08)",
    borderColor: "rgba(6, 182, 212, 0.2)",
    accentColor: "#06b6d4",
    whatsappText: "I%20want%20to%20connect%20with%20educators%20via%20JK%20Educare",
    callCTA: "Call to Get Connected",
  },
  {
    icon: HandHeart,
    title: "Support for All Students",
    tagline: "Education for Everyone",
    description:
      "We are committed to helping students from financially weaker backgrounds find affordable education options and scholarship opportunities.",
    fullDesc:
      "JK Sir believes no student should be left behind due to finances. We actively guide families through scholarship applications, government quota seats, fee waivers, and affordable college options.",
    features: [
      "Scholarship discovery and application support",
      "Government quota seat guidance",
      "Fee waiver and financial aid assistance",
      "Affordable private college shortlisting",
      "Special focus on rural and first-gen students",
      "Zero consultation fee — always free",
    ],
    color: "from-pink-500 to-rose-500",
    gradientFrom: "#ec4899",
    gradientTo: "#f43f5e",
    lightBg: "rgba(236, 72, 153, 0.08)",
    borderColor: "rgba(236, 72, 153, 0.2)",
    accentColor: "#ec4899",
    whatsappText: "I%20need%20guidance%20for%20affordable%20education%20options",
    callCTA: "Call JK Sir",
  },
]

type Service = typeof services[0]

// ─── MODAL ────────────────────────────────────────────────────────────────────
function ServiceModal({ service, onClose }: { service: Service; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(10px)" }}
        />

        {/* Modal panel */}
        <motion.div
          className="relative w-full max-w-lg overflow-hidden rounded-3xl"
          style={{
            background: "var(--card)",
            border: `1px solid ${service.borderColor}`,
            boxShadow: `0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px ${service.borderColor}`,
          }}
          initial={{ scale: 0.88, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient header */}
          <div
            className="relative overflow-hidden px-8 py-7"
            style={{
              background: `linear-gradient(135deg, ${service.gradientFrom}, ${service.gradientTo})`,
            }}
          >
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/5" />

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <service.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium text-white/90">
                    {service.tagline}
                  </span>
                  <h2
                    className="mt-1.5 font-display text-2xl font-bold text-white"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {service.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-xl p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="relative mt-4 text-sm leading-relaxed text-white/85">
              {service.fullDesc}
            </p>
          </div>

          {/* Features list */}
          <div className="px-8 py-6">
            <h3
              className="mb-4 flex items-center gap-2 text-sm font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              <Sparkles className="h-4 w-4" style={{ color: service.accentColor }} />
              What&apos;s Included
            </h3>
            <div className="space-y-2.5">
              {service.features.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.3 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: service.accentColor }}
                  />
                  <span
                    className="text-sm leading-snug"
                    style={{
                      color: "var(--muted-foreground)",
                      letterSpacing: "0em",
                      fontFamily: "var(--font-sans, inherit)",
                    }}
                  >
                    {feat}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <motion.a
                href={`https://wa.me/919842463437?text=${service.whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white"
                style={{
                  background: `linear-gradient(135deg, ${service.gradientFrom}, ${service.gradientTo})`,
                  letterSpacing: "0em",
                }}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp JK Sir
              </motion.a>
              <motion.a
                href="tel:+919842463437"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold"
                style={{
                  border: `1.5px solid ${service.borderColor}`,
                  color: service.accentColor,
                  background: service.lightBg,
                  letterSpacing: "0em",
                }}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone className="h-4 w-4" />
                {service.callCTA}
              </motion.a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function ServiceCard({
  service,
  index,
  onLearnMore,
}: {
  service: Service
  index: number
  onLearnMore: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -7, scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      onClick={onLearnMore}
      className="group relative h-full cursor-pointer overflow-hidden rounded-2xl p-7"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Hover radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px at 50% 0%, ${service.lightBg}, transparent 80%)`,
        }}
      />

      {/* Top accent bar — 0 → full width on hover */}
      <div
        className="absolute left-0 top-0 h-1 w-0 rounded-tl-2xl rounded-tr-full transition-all duration-500 group-hover:w-full"
        style={{ background: `linear-gradient(90deg, ${service.accentColor}, transparent)` }}
      />

      {/* Icon with wobble */}
      <motion.div
        className={`relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} text-white`}
        style={{ boxShadow: `0 8px 24px ${service.lightBg.replace("0.08", "0.4")}` }}
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
        transition={{ duration: 0.4 }}
      >
        <service.icon className="h-7 w-7" />
      </motion.div>

      <h3
        className="mb-3 font-display text-xl font-semibold"
        style={{ color: "var(--foreground)", letterSpacing: "-0.02em" }}
      >
        {service.title}
      </h3>
      <p
        className="leading-relaxed"
        style={{
          color: "var(--muted-foreground)",
          letterSpacing: "0em",
          fontFamily: "var(--font-sans, inherit)",
        }}
      >
        {service.description}
      </p>

      {/* Learn more — fades in on hover, now a real button trigger */}
      <div
        className="mt-5 flex items-center gap-1 text-sm font-semibold opacity-0 transition-all duration-300 group-hover:opacity-100"
        style={{ color: service.accentColor, letterSpacing: "0em" }}
      >
        Learn more
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          →
        </motion.span>
      </div>
    </motion.div>
  )
}

// ─── SECTION ──────────────────────────────────────────────────────────────────
export function ServicesSection() {
  const [activeService, setActiveService] = useState<Service | null>(null)

  return (
    <section
      id="services"
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: "var(--background)" }}
    >
      <div
        className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] opacity-[0.06]"
        style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
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
            What We Offer
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
            Our <span className="text-gradient">Services</span>
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-lg"
            style={{
              color: "var(--muted-foreground)",
              letterSpacing: "0em",
              fontFamily: "var(--font-sans, inherit)",
            }}
          >
            Comprehensive support for every step of your educational journey
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {services.map((service, i) => (
            <ServiceCard
              key={i}
              service={service}
              index={i}
              onLearnMore={() => setActiveService(service)}
            />
          ))}
        </div>
      </div>

      {/* Modal — renders outside grid, above everything */}
      {activeService && (
        <ServiceModal
          service={activeService}
          onClose={() => setActiveService(null)}
        />
      )}
    </section>
  )
}
