"use client"

import { motion } from "framer-motion"

// Isolates the single framer-motion usage that page.tsx needs, so page.tsx
// itself can stay a Server Component (preserves its existing dynamic-import
// / lazy-loading architecture for everything below the fold).
export function AnimatedMain({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      className="min-h-screen bg-background overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.main>
  )
}
