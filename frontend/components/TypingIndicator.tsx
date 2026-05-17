"use client"

import { motion, useReducedMotion } from "framer-motion"

export function TypingIndicator() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2.5 h-2.5 bg-brand-400 rounded-full"
          animate={shouldReduceMotion ? { opacity: [0.4, 1, 0.4] } : { y: [0, -6, 0] }}
          transition={
            shouldReduceMotion 
              ? { duration: 1, repeat: Infinity, delay: i * 0.2 } 
              : {
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15
                }
          }
        />
      ))}
    </div>
  )
}
