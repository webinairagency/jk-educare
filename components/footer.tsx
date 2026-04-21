"use client"

import { motion } from "framer-motion"
import { MessageCircle, Phone, Youtube, Heart } from "lucide-react"
import Image from "next/image"

const footerLinks = {
  navigation: [
    { label: "Services", href: "#services" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Live Sessions", href: "#sessions" },
    { label: "Exam Updates", href: "#exams" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],
  resources: [
    { label: "WhatsApp Channel", href: "https://whatsapp.com/channel/0029VaTOYogK5cDGKLRzxl23" },
    { label: "YouTube Channel", href: "https://youtube.com/@jkeducareservices" },
  ],
}

function FooterLogo() {
  return (
    <motion.a
      href="/"
      className="flex items-center gap-3"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.15 }}
    >
      {/* Light logo */}
      <div className="relative h-11 w-11 shrink-0">
        <Image
          src="/logo-light.png"
          alt="JK Edu-Care Services"
          fill
          className="rounded-xl object-contain dark:hidden"
        />
        <Image
          src="/logo-dark.png"
          alt="JK Edu-Care Services"
          fill
          className="hidden rounded-xl object-contain dark:block"
        />
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className="text-base font-bold"
          style={{
            fontFamily: "'Clash Display', system-ui",
            letterSpacing: "-0.02em",
            color: "var(--foreground)",
          }}
        >
          JK Edu-Care
        </span>
        <span
          className="text-[10px] font-medium tracking-wider"
          style={{ color: "var(--muted-foreground)" }}
        >
          Education Worldwide
        </span>
      </div>
    </motion.a>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Gradient separator */}
      <div className="h-px" style={{ background: "var(--gradient-primary)" }} />

      <div
        className="relative"
        style={{ background: "linear-gradient(180deg, var(--card) 0%, var(--background) 100%)" }}
      >
        {/* Decorative orb */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, var(--primary), transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <FooterLogo />
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                Guiding students towards the right future through personal support and trusted
                educators. Education is a right, not a privilege.
              </p>
              <div className="mt-5 flex gap-3">
                {[
                  { Icon: MessageCircle, href: "https://wa.me/919842463437", color: "#22c55e", label: "WhatsApp" },
                  { Icon: Phone, href: "tel:+919842463437", color: "var(--primary)", label: "Phone" },
                  { Icon: Youtube, href: "https://youtube.com/@jkeducareservices", color: "#ef4444", label: "YouTube" },
                ].map(({ Icon, href, color, label }) => (
                  <motion.a
                    key={href}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl transition-all"
                    style={{
                      background: "var(--muted)",
                      border: "1px solid var(--border)",
                      color: "var(--muted-foreground)",
                    }}
                    whileHover={{ scale: 1.12, color }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3
                className="mb-5 font-display text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--foreground)" }}
              >
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.navigation.map((link) => (
                  <li key={link.href}>
                    <motion.a
                      href={link.href}
                      className="animated-underline text-sm transition-colors"
                      style={{ color: "var(--muted-foreground)" }}
                      whileHover={{ color: "var(--foreground)", x: 3 }}
                      transition={{ duration: 0.15 }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3
                className="mb-5 font-display text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--foreground)" }}
              >
                Resources
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <motion.a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm transition-colors"
                      style={{ color: "var(--muted-foreground)" }}
                      whileHover={{ color: "var(--foreground)", x: 3 }}
                      transition={{ duration: 0.15 }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3
                className="mb-5 font-display text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--foreground)" }}
              >
                Contact
              </h3>
              <div className="space-y-3">
                {[
                  { href: "https://wa.me/919842463437", Icon: MessageCircle, label: "WhatsApp Chat" },
                  { href: "tel:+919842463437", Icon: Phone, label: "+91 98424 63437" },
                  { href: "https://youtube.com/@jkeducareservices", Icon: Youtube, label: "YouTube Channel" },
                ].map(({ href, Icon, label }) => (
                  <motion.a
                    key={href}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2 text-sm transition-colors"
                    style={{ color: "var(--muted-foreground)" }}
                    whileHover={{ color: "var(--primary)", x: 3 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="mt-14 flex flex-col items-center justify-between gap-3 border-t pt-8 text-center sm:flex-row sm:text-left"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              &copy; {new Date().getFullYear()} JK Edu-Care Services. All rights reserved.
            </p>
            <p
              className="flex items-center gap-1.5 text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              Made with{" "}
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />{" "}
              for students everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
