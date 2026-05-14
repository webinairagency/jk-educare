"use client"

import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X } from "lucide-react"
import { useState } from "react"

export function FloatingWhatsApp() {
  const [dismissed, setDismissed] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)

  if (dismissed) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip bubble */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium shadow-xl"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              boxShadow: 'var(--shadow-lg)',
              maxWidth: 220,
            }}
          >
            <span className="h-2 w-2 rounded-full bg-green-500 shrink-0 animate-pulse" />
            <span>Get free guidance from JK Sir!</span>
            <button
              type="button"
              onClick={() => setShowTooltip(false)}
              className="ml-1 shrink-0 rounded-full p-0.5 transition-colors hover:bg-muted"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" style={{ color: 'var(--muted-foreground)' }} />
            </button>
            {/* Arrow */}
            <div
              className="absolute -bottom-1.5 right-8 h-3 w-3 rotate-45"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', borderTop: 'none', borderLeft: 'none' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.a
        href="https://wa.me/919842463437"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-16 w-16 items-center justify-center rounded-full text-white"
        style={{
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          boxShadow: '0 8px 32px rgba(34, 197, 94, 0.45)',
        }}
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
      >
        <MessageCircle className="h-8 w-8" />

        {/* Pulse rings */}
        {[1, 1.4, 1.7].map((scale, i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full"
            style={{ background: '#22c55e' }}
            animate={{ scale: [1, scale, scale], opacity: [0.4 - i * 0.1, 0, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
          />
        ))}

        {/* Notification dot */}
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75" />
          <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-400 text-[8px] font-bold text-white">1</span>
        </span>
      </motion.a>
    </div>
  )
}
