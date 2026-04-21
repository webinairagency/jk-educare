"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do I choose the right college?",
    answer: "Choosing the right college depends on multiple factors including your marks, interests, career goals, location preferences, and budget. Contact us on WhatsApp, and JK Sir will personally guide you through the decision-making process based on your specific situation.",
  },
  {
    question: "Can I get guidance after 12th?",
    answer: "Absolutely! We provide guidance for students at all stages — after 10th, 12th, or even graduation. Whether you are looking for undergraduate courses, professional programs, or career changes, we can help you find the right path.",
  },
  {
    question: "What if my marks are low?",
    answer: "Low marks do not mean limited options. There are many good colleges and career paths available for students with varying academic backgrounds. We help you discover opportunities that match your profile and aspirations. Do not lose hope — contact us for guidance.",
  },
  {
    question: "Do you help with affordable education options?",
    answer: "Yes, we are committed to helping students from all financial backgrounds. We can guide you towards affordable colleges, scholarship opportunities, and financial aid options. Education should be accessible to everyone.",
  },
  {
    question: "Is there any fee for consultation?",
    answer: "Our initial consultation and guidance sessions are completely free. We believe every student deserves access to quality guidance regardless of their financial situation. Contact us on WhatsApp to start your journey.",
  },
  {
    question: "How can I join the live sessions?",
    answer: "Our live guidance sessions happen on Zoom every Sunday at 6 PM. To join, simply message us on WhatsApp, and we will share the joining link with you. The sessions are free and open to all students.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="relative overflow-hidden py-24 sm:py-32" style={{ background: 'var(--muted)' }}>
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 opacity-[0.05]"
        style={{ background: 'radial-gradient(ellipse, var(--primary), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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
            Common Questions
          </span>
          <h2
            className="mt-4 font-display"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
          >
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg" style={{ color: 'var(--muted-foreground)' }}>
            Find answers to common questions about our guidance services
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 overflow-hidden rounded-2xl"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
        >
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <AccordionItem
                  value={`item-${i}`}
                  className="border-b px-6 last:border-b-0"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <AccordionTrigger
                    className="py-5 text-left font-semibold transition-colors hover:no-underline"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent
                    className="pb-5 leading-relaxed"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Still have questions?{" "}
            <motion.a
              href="https://wa.me/919842463437"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold"
              style={{ color: 'var(--primary)' }}
              whileHover={{ scale: 1.03 }}
            >
              Chat with JK Sir on WhatsApp →
            </motion.a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
