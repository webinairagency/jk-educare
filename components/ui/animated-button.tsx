"use client"

import { motion } from "framer-motion"
import { Button, type buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"

interface AnimatedButtonProps extends 
  React.ComponentProps<"button">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function AnimatedButton({ children, ...props }: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      <Button {...props}>{children}</Button>
    </motion.div>
  )
}
