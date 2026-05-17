"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Carousel3D } from "../Carousel3D"

interface Step1Props {
  onSelect: (field: string) => void
}

export function Step1_VibeCheck({ onSelect }: Step1Props) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-16 py-20"
    >
      <div className="text-center space-y-6">
        <span className="inline-block text-xs font-mono text-white/30 tracking-[0.2em] uppercase">
          Step 01 of 04
        </span>
        <h2 className="text-6xl md:text-7xl font-display font-bold text-white tracking-tight leading-none">
          WHAT EXCITES<br />YOU?
        </h2>
        <p className="text-lg text-white/40 max-w-lg mx-auto leading-relaxed">
          Pick the field that sparks your curiosity
        </p>
      </div>

      <Carousel3D onSelect={onSelect} />
    </motion.div>
  )
}
