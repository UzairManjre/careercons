"use client"

import { motion, useReducedMotion } from "framer-motion"

const steps = [
  { num: 1, label: "Vibe" },
  { num: 2, label: "Profile" },
  { num: 3, label: "Chat" },
  { num: 4, label: "Report" },
]

export function AnimatedProgressBar({ currentStep }: { currentStep: number }) {
  const shouldReduceMotion = useReducedMotion()
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className="w-full max-w-xl mx-auto px-6">
      <div className="flex items-center justify-between mb-3">
        {steps.map((s) => (
          <span
            key={s.num}
            className={`text-xs font-mono tracking-wider transition-all duration-300 ${
              s.num <= currentStep ? "text-brand-400 font-semibold" : "text-white/20"
            }`}
          >
            {s.label}
          </span>
        ))}
      </div>
      <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-500 to-accent-purple rounded-full origin-left"
          initial={{ scaleX: 0 }}
          animate={shouldReduceMotion ? { scaleX: progress / 100 } : { scaleX: progress / 100 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  )
}
