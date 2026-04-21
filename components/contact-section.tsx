"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Phone, Send, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

export function ContactSection() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" })
  const [sending, setSending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    const msg = `Hi, my name is ${formData.name}.\n\nPhone: ${formData.phone}\n\nMessage: ${formData.message}`
    window.open(`https://wa.me/919842463437?text=${encodeURIComponent(msg)}`, "_blank")
    setTimeout(() => setSending(false), 2000)
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32" style={{ background: 'var(--background)' }}>
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 opacity-[0.05]"
        style={{ background: 'radial-gradient(ellipse, var(--primary), transparent 70%)' }}
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
            Reach Out
          </span>
          <h2
            className="mt-4 font-display"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
          >
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg" style={{ color: 'var(--muted-foreground)' }}>
            Ready to take the next step? Contact us today and let us guide you towards the right path.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">

          {/* Contact methods */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            <motion.a
              href="https://wa.me/919842463437"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 overflow-hidden rounded-2xl p-6 transition-all duration-300"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
              whileHover={{ scale: 1.02, boxShadow: 'var(--shadow-md)' }}
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 8px 20px rgba(34,197,94,0.35)' }}
              >
                <MessageCircle className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>WhatsApp</p>
                <p className="mt-0.5 font-display text-lg font-semibold" style={{ color: 'var(--foreground)' }}>+91 98424 63437</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Message us anytime — we respond quickly</p>
              </div>
              <div className="ml-auto opacity-0 transition-opacity group-hover:opacity-100" style={{ color: '#22c55e' }}>→</div>
            </motion.a>

            <motion.a
              href="tel:+919842463437"
              className="group flex items-center gap-5 overflow-hidden rounded-2xl p-6 transition-all duration-300"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
              whileHover={{ scale: 1.02, boxShadow: 'var(--shadow-md)' }}
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'var(--gradient-primary)', boxShadow: '0 8px 20px var(--primary-glow)' }}
              >
                <Phone className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Call Us</p>
                <p className="mt-0.5 font-display text-lg font-semibold" style={{ color: 'var(--foreground)' }}>+91 98424 63437</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Available for calls on weekdays</p>
              </div>
              <div className="ml-auto opacity-0 transition-opacity group-hover:opacity-100" style={{ color: 'var(--primary)' }}>→</div>
            </motion.a>

            {/* Promise card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden rounded-2xl p-6"
              style={{ background: 'rgba(var(--primary-rgb), 0.06)', border: '1px solid rgba(var(--primary-rgb), 0.15)' }}
            >
              <Sparkles className="h-5 w-5 mb-2" style={{ color: 'var(--primary)' }} />
              <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Our Promise to You</p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Every student deserves honest guidance. Our initial consultation is completely free —
                because your future matters more than a fee.
              </p>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl p-7 sm:p-9"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
          >
            <h3 className="mb-1 font-display text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>Send a Message</h3>
            <p className="mb-7 text-sm" style={{ color: 'var(--muted-foreground)' }}>We'll open WhatsApp so you can send it directly.</p>

            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Your Name</FieldLabel>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1"
                    style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Phone Number</FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="mt-1"
                    style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="message" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Your Message</FieldLabel>
                  <Textarea
                    id="message"
                    placeholder="How can we help you today?"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="mt-1"
                    style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                  />
                </Field>
              </FieldGroup>

              <motion.button
                type="submit"
                className="btn-glow mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {sending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                  />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send via WhatsApp
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
