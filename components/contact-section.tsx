"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Phone, Send, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"

const WHATSAPP_NUMBER = "919842463437"

const VISITOR_TYPES = ["Student", "Parent", "Teacher", "Other"] as const
type VisitorType = (typeof VISITOR_TYPES)[number]

interface FormState {
  name: string
  phone: string
  email: string
  visitorType: VisitorType | ""
  otherType: string
  subject: string
  message: string
}

const initialFormState: FormState = {
  name: "",
  phone: "",
  email: "",
  visitorType: "",
  otherType: "",
  subject: "",
  message: "",
}

type FormErrors = Partial<Record<keyof FormState, string>>

// Shared styling so the native <select> matches the <Input> fields exactly.
const selectClassName =
  "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function ContactSection() {
  const [formData, setFormData] = useState<FormState>(initialFormState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function validate(): FormErrors {
    const next: FormErrors = {}

    if (!formData.name.trim()) next.name = "Please enter your name."
    if (!formData.phone.trim()) next.phone = "Please enter your phone number."
    if (!formData.visitorType) next.visitorType = "Please select who you are."
    if (formData.visitorType === "Other" && !formData.otherType.trim()) {
      next.otherType = "Please specify."
    }
    if (!formData.subject.trim()) next.subject = "Please enter a subject."
    if (!formData.message.trim()) next.message = "Please enter your message."
    if (formData.email.trim() && !isValidEmail(formData.email.trim())) {
      next.email = "Please enter a valid email."
    }

    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (sending) return // duplicate-submission guard

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSending(true)
    setStatus("idle")
    setStatusMessage("")

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const json = await res.json().catch(() => ({ success: false }))

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Something went wrong. Please try again.")
      }

      setStatus("success")
      setStatusMessage("Your enquiry has been recorded. WhatsApp is opening so you can send your message.")

      const lines = [
        "Hello JK EduCare,",
        "",
        `Name: ${formData.name}`,
        `Category: ${formData.visitorType === "Other" ? formData.otherType : formData.visitorType}`,
        `Phone: ${formData.phone}`,
      ]
      if (formData.email.trim()) lines.push(`Email: ${formData.email}`)
      lines.push(`Subject: ${formData.subject}`, "", "Message:", formData.message)

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`,
        "_blank",
      )

      setFormData(initialFormState)
    } catch (err) {
      setStatus("error")
      setStatusMessage(
        err instanceof Error ? err.message : "We couldn't save your details. Please try again.",
      )
    } finally {
      setSending(false)
    }
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
            <p className="mb-7 text-sm" style={{ color: 'var(--muted-foreground)' }}>We'll save your details and open WhatsApp so you can send it directly.</p>

            <form onSubmit={handleSubmit} noValidate>
              <FieldGroup>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="name" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Your Name</FieldLabel>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      aria-invalid={!!errors.name}
                      className="mt-1"
                      style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                    />
                    <FieldError>{errors.name}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="phone" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Phone Number</FieldLabel>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      aria-invalid={!!errors.phone}
                      className="mt-1"
                      style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                    />
                    <FieldError>{errors.phone}</FieldError>
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="email" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Email <span className="font-normal" style={{ color: 'var(--muted-foreground)' }}>(optional)</span></FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      aria-invalid={!!errors.email}
                      className="mt-1"
                      style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                    />
                    <FieldError>{errors.email}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="visitorType" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>I am a</FieldLabel>
                    <select
                      id="visitorType"
                      value={formData.visitorType}
                      onChange={(e) => updateField("visitorType", e.target.value as VisitorType)}
                      aria-invalid={!!errors.visitorType}
                      className={`${selectClassName} mt-1`}
                      style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                    >
                      <option value="" disabled>
                        Select one
                      </option>
                      {VISITOR_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <FieldError>{errors.visitorType}</FieldError>
                  </Field>
                </div>

                {formData.visitorType === "Other" && (
                  <Field>
                    <FieldLabel htmlFor="otherType" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Please specify</FieldLabel>
                    <Input
                      id="otherType"
                      placeholder="Tell us who you are"
                      value={formData.otherType}
                      onChange={(e) => updateField("otherType", e.target.value)}
                      aria-invalid={!!errors.otherType}
                      className="mt-1"
                      style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                    />
                    <FieldError>{errors.otherType}</FieldError>
                  </Field>
                )}

                <Field>
                  <FieldLabel htmlFor="subject" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Subject / Topic</FieldLabel>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => updateField("subject", e.target.value)}
                    aria-invalid={!!errors.subject}
                    className="mt-1"
                    style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                  />
                  <FieldError>{errors.subject}</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="message" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Your Message</FieldLabel>
                  <Textarea
                    id="message"
                    placeholder="How can we help you today?"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    aria-invalid={!!errors.message}
                    className="mt-1"
                    style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                  />
                  <FieldError>{errors.message}</FieldError>
                </Field>
              </FieldGroup>

              {status !== "idle" && (
                <p
                  role="status"
                  className="mt-4 text-sm font-medium"
                  style={{ color: status === "success" ? "#16a34a" : "var(--destructive)" }}
                >
                  {statusMessage}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={sending}
                className="btn-glow mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold text-white disabled:opacity-70"
                whileHover={{ scale: sending ? 1 : 1.02 }}
                whileTap={{ scale: sending ? 1 : 0.97 }}
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
                    Save & Send via WhatsApp
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
