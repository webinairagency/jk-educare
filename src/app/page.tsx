"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { HeadlineTicker } from "@/components/headline-ticker"
import { HeroSection } from "@/components/hero-section"
import { CursorGlow } from "@/components/cursor-glow"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"

// Lazy-load everything below the fold — reduces initial JS bundle
const AboutSection = dynamic(() => import("@/components/about-section").then(m => ({ default: m.AboutSection })))
const TrustSection = dynamic(() => import("@/components/trust-section").then(m => ({ default: m.TrustSection })))
const ServicesSection = dynamic(() => import("@/components/services-section").then(m => ({ default: m.ServicesSection })))
const HowItWorksSection = dynamic(() => import("@/components/how-it-works-section").then(m => ({ default: m.HowItWorksSection })))
const LiveSessionsSection = dynamic(() => import("@/components/live-sessions-section").then(m => ({ default: m.LiveSessionsSection })))
const ExamUpdatesSection = dynamic(() => import("@/components/exam-updates-section").then(m => ({ default: m.ExamUpdatesSection })))
const WhatsAppChannelSection = dynamic(() => import("@/components/whatsapp-channel-section").then(m => ({ default: m.WhatsAppChannelSection })))
const YouTubeSection = dynamic(() => import("@/components/youtube-section").then(m => ({ default: m.YouTubeSection })))
const HelplineSection = dynamic(() => import("@/components/helpline-section").then(m => ({ default: m.HelplineSection })))
const FAQSection = dynamic(() => import("@/components/faq-section").then(m => ({ default: m.FAQSection })))
const ContactSection = dynamic(() => import("@/components/contact-section").then(m => ({ default: m.ContactSection })))
const Footer = dynamic(() => import("@/components/footer").then(m => ({ default: m.Footer })))

export default function Home() {
  return (
    <motion.main
      className="min-h-screen bg-background overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <CursorGlow />
      <HeadlineTicker />
      <Header />
      <HeroSection />
      <AboutSection />
      <TrustSection />
      <ServicesSection />
      <HowItWorksSection />
      <LiveSessionsSection />
      <ExamUpdatesSection />
      <WhatsAppChannelSection />
      <YouTubeSection />
      <HelplineSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
    </motion.main>
  )
}
