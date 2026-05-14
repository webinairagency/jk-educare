"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, HelpCircle, MessageCircle } from "lucide-react"

// ─── FAQ DATA — Edit questions and answers here ───────────────────────────────
const faqs = [
  {
    question: "How do I choose the right college?",
    answer:
      "Choosing the right college depends on multiple factors including your marks, interests, career goals, location preferences, and budget. Contact us on WhatsApp, and JK Sir will personally guide you through the decision-making process based on your specific situation.",
  },
  {
    question: "Can I get guidance after 12th?",
    answer:
      "Absolutely! We provide guidance for students at all stages — after 10th, 12th, or even graduation. Whether you are looking for undergraduate courses, professional programs, or career changes, we can help you find the right path.",
  },
  {
    question: "What if my marks are low?",
    answer:
      "Low marks do not mean limited options. There are many good colleges and career paths available for students with varying academic backgrounds. We help you discover opportunities that match your profile and aspirations. Do not lose hope — contact us for guidance.",
  },
  {
    question: "Do you help with affordable education options?",
    answer:
      "Yes, we are committed to helping students from all financial backgrounds. We can guide you towards affordable colleges, scholarship opportunities, and financial aid options. Education should be accessible to everyone.",
  },
  {
    question: "Is there any fee for consultation?",
    answer:
      "Our initial consultation and guidance sessions are completely free. We believe every student deserves access to quality guidance regardless of their financial situation. Contact us on WhatsApp to start your journey.",
  },
  {
    question: "How can I join the live sessions?",
    answer:
      "Our live guidance sessions happen on Zoom every Sunday at 6 PM. To join, simply message us on WhatsApp, and we will share the joining link with you. The sessions are free and open to all students.",
  },
]

// ─── SINGLE FAQ ITEM ─────────────────────────────────────────────────────────
function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: { question: string; answer: string }
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="faq-item"
        style={{
          background: isOpen ? "var(--card)" : "var(--card)",
          border: isOpen
            ? "1px solid rgba(var(--primary-rgb), 0.3)"
            : "1px solid var(--border)",
          borderRadius: "var(--radius)",
          marginBottom: "0.75rem",
          overflow: "hidden",
          boxShadow: isOpen ? "var(--shadow-md)" : "var(--shadow-sm)",
          transition: "border-color 0.25s ease, box-shadow 0.25s ease",
        }}
      >
        {/* ── Question row / trigger ── */}
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          className="faq-trigger"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1.25rem 1.5rem",
            cursor: "pointer",
            background: "transparent",
            border: "none",
            textAlign: "left",
          }}
        >
          {/* Number badge */}
          <span
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "2rem",
              height: "2rem",
              borderRadius: "50%",
              background: isOpen
                ? "var(--gradient-primary)"
                : "rgba(var(--primary-rgb), 0.08)",
              color: isOpen ? "#fff" : "var(--primary)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0em",
              transition: "background 0.25s ease, color 0.25s ease",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Question text — letterSpacing fixed here */}
          <span
            style={{
              flex: 1,
              fontSize: "clamp(0.9rem, 2vw, 1rem)",
              fontWeight: 600,
              letterSpacing: "0em",        /* ← FIX: was inheriting -0.04em from font-display */
              lineHeight: 1.5,
              color: isOpen ? "var(--primary)" : "var(--foreground)",
              fontFamily: "var(--font-sans, inherit)",
              transition: "color 0.25s ease",
            }}
          >
            {faq.question}
          </span>

          {/* Plus / Minus icon */}
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "50%",
              background: isOpen
                ? "rgba(var(--primary-rgb), 0.12)"
                : "rgba(var(--primary-rgb), 0.06)",
              color: "var(--primary)",
              transition: "background 0.25s ease",
            }}
          >
            {isOpen ? <Minus size={14} /> : <Plus size={14} />}
          </motion.span>
        </button>

        {/* ── Answer — AnimatePresence for smooth open/close ── */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  padding: "0 1.5rem 1.25rem 4rem",  /* left-aligned under question text */
                  fontSize: "0.9375rem",
                  fontWeight: 400,
                  letterSpacing: "0em",               /* clean normal letter spacing */
                  lineHeight: 1.75,
                  color: "var(--muted-foreground)",
                  fontFamily: "var(--font-sans, inherit)",
                }}
              >
                {faq.answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section
      id="faq"
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: "var(--muted)" }}
    >
      {/* Decorative radial glow top centre */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[640px] -translate-x-1/2 opacity-[0.06]"
        style={{
          background:
            "radial-gradient(ellipse, var(--primary), transparent 70%)",
        }}
      />

      {/* Decorative glow bottom right */}
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full opacity-[0.04]"
        style={{ background: "var(--gradient-primary)" }}
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          {/* Pill label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{
              background: "rgba(var(--primary-rgb), 0.08)",
              border: "1px solid rgba(var(--primary-rgb), 0.15)",
            }}
          >
            <HelpCircle
              size={14}
              style={{ color: "var(--primary)", flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                letterSpacing: "0.04em",   /* pill text — slightly open tracking */
                textTransform: "uppercase",
                color: "var(--primary)",
                fontFamily: "var(--font-sans, inherit)",
              }}
            >
              Common Questions
            </span>
          </motion.div>

          {/* Main heading — font-display with controlled letterSpacing */}
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.85rem, 4vw, 2.75rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",    /* heading: slight tight tracking is intentional */
              lineHeight: 1.15,
              color: "var(--foreground)",
              marginBottom: "1rem",
            }}
          >
            Frequently Asked{" "}
            <span className="text-gradient">Questions</span>
          </h2>

          {/* Subtext — normal tracking */}
          <p
            style={{
              fontSize: "1.0625rem",
              fontWeight: 400,
              letterSpacing: "0em",        /* body text: always 0 */
              lineHeight: 1.65,
              color: "var(--muted-foreground)",
              maxWidth: "32rem",
              margin: "0 auto",
              fontFamily: "var(--font-sans, inherit)",
            }}
          >
            Find answers to common questions about our guidance services
          </p>
        </motion.div>

        {/* ── FAQ list ── */}
        <div>
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center gap-3 text-center"
        >
          <p
            style={{
              fontSize: "0.9375rem",
              letterSpacing: "0em",
              color: "var(--muted-foreground)",
              fontFamily: "var(--font-sans, inherit)",
            }}
          >
            Still have questions?
          </p>
          <motion.a
            href="https://wa.me/919842463437"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3"
            style={{
              background: "var(--gradient-primary)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.9375rem",
              letterSpacing: "0em",
              fontFamily: "var(--font-sans, inherit)",
              boxShadow: "var(--shadow-md)",
              textDecoration: "none",
            }}
          >
            <MessageCircle size={16} />
            Chat with JK Sir on WhatsApp
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
