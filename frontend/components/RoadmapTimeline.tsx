"use client"

import { motion, useReducedMotion } from "framer-motion"

interface RoadmapPhase {
  phase: string
  steps: string[]
}

interface RoadmapTimelineProps {
  roadmap: RoadmapPhase[]
}

export function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="space-y-3">
      {roadmap.map((phase, i) => (
        <motion.div
          key={phase.phase}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="relative pl-5 border-l border-white/10"
        >
          <div className="absolute left-[-3.5px] top-1 w-[7px] h-[7px] rounded-full bg-brand-500" />
          <p className="text-meta font-mono text-brand-400 tracking-wider mb-1.5 uppercase">{phase.phase}</p>
          <ul className="space-y-1">
            {phase.steps.map((step) => (
              <li key={step} className="text-meta text-white/50 flex items-start gap-2">
                <span className="text-white/15 mt-1">●</span>
                {step}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}
