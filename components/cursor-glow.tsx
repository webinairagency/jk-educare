"use client"

import { useEffect, useRef } from "react"
import { motion, useSpring } from "framer-motion"

export function CursorGlow() {
  const containerRef = useRef<HTMLDivElement>(null)

  const springConfig = { damping: 22, stiffness: 180, mass: 0.4 }
  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)

  const slowConfig = { damping: 40, stiffness: 60, mass: 0.8 }
  const glowX = useSpring(0, slowConfig)
  const glowY = useSpring(0, slowConfig)

  const dotSize = useSpring(12, { damping: 20, stiffness: 200 })

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches
    if (isTouchDevice) return

    let pointerRafId = 0

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      glowX.set(e.clientX)
      glowY.set(e.clientY)

      if (containerRef.current) containerRef.current.style.opacity = "1"

      cancelAnimationFrame(pointerRafId)
      pointerRafId = requestAnimationFrame(() => {
        const el = document.elementFromPoint(e.clientX, e.clientY)
        if (!el) return
        const isPointer = window.getComputedStyle(el).cursor === "pointer"
        dotSize.set(isPointer ? 38 : 12)
      })
    }

    const handleLeave = () => {
      if (containerRef.current) containerRef.current.style.opacity = "0"
    }
    const handleEnter = () => {
      if (containerRef.current) containerRef.current.style.opacity = "1"
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseleave", handleLeave)
    document.addEventListener("mouseenter", handleEnter)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleLeave)
      document.removeEventListener("mouseenter", handleEnter)
      cancelAnimationFrame(pointerRafId)
    }
  }, [cursorX, cursorY, glowX, glowY, dotSize])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
      style={{ opacity: 0, transition: "opacity 0.3s" }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(var(--primary-rgb), 0.06), transparent 70%)",
          filter: "blur(20px)",
          willChange: "transform",
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          width: dotSize,
          height: dotSize,
          background: "rgba(var(--primary-rgb), 0.55)",
          willChange: "transform",
        }}
      />
    </div>
  )
}
