"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const statusMessages = [
  "ANALYZING YOUR PROFILE",
  "MATCHING CAREER VECTORS",
  "EVALUATING ACADEMIC DATA",
  "SCANNING INDIAN EXAMS",
  "CALCULATING FIT SCORES",
  "GENERATING REPORT",
]

interface AnalyzeOverlayProps {
  isVisible: boolean
  progress: number
  onComplete: () => void
}

export function AnalyzeOverlay({ isVisible, progress, onComplete }: AnalyzeOverlayProps) {
  const [statusIndex, setStatusIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isVisible) return
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % statusMessages.length)
    }, 600)
    return () => clearInterval(interval)
  }, [isVisible])

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(onComplete, 500)
      return () => clearTimeout(t)
    }
  }, [progress, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.1) 0%, transparent 50%), #0a0a0f"
          }}
        >
          <div className="relative w-16 h-16 mb-8">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-brand-400/30 border-t-brand-400"
              animate={shouldReduceMotion ? {} : { rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <p className="text-heading-3 font-display text-white/80 mb-6 min-h-[28px] tracking-wide">
            {statusMessages[statusIndex]}
          </p>

          <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-400 to-accent-purple rounded-full origin-left"
              initial={{ scaleX: 0 }}
              animate={shouldReduceMotion ? { scaleX: 1 } : { scaleX: progress / 100 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>

          <p className="text-meta font-mono text-white/30 mt-3 tabular-nums">
            {Math.round(progress)}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
