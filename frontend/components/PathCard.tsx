"use client"

import { useRef, useCallback } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { CareerPath } from "@/types"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { RoadmapTimeline } from "./RoadmapTimeline"

const medals = ["🥇", "🥈", "🥉"]

const springGentle = { type: "spring" as const, stiffness: 100, damping: 15 }

interface PathCardProps {
  path: CareerPath
  index: number
}

export function PathCard({ path, index }: PathCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rotateRef = useRef({ x: 0, y: 0 })
  const shouldReduceMotion = useReducedMotion()

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    const rotateX = y * -10
    const rotateY = x * 10
    rotateRef.current = { x: rotateX, y: rotateY }
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return
    rotateRef.current = { x: 0, y: 0 }
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)"
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, ...springGentle }}
      onMouseMove={shouldReduceMotion ? undefined : handleMouseMove}
      onMouseLeave={shouldReduceMotion ? undefined : handleMouseLeave}
      style={{ transition: "transform 0.1s" }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{medals[index]}</span>
              <div>
                <h3 className="text-heading-3 font-display text-white leading-tight">
                  #{path.rank} {path.title}
                </h3>
              </div>
            </div>
            <Badge variant="success" className="text-meta font-mono whitespace-nowrap tabular-nums">
              {path.fit_score}% FIT
            </Badge>
          </div>

          <p className="text-body-sm text-white/50 leading-relaxed">{path.why}</p>

          <RoadmapTimeline roadmap={path.roadmap} />

          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <p className="text-meta font-mono text-brand-300 tracking-wider uppercase">Indian Context</p>
            <div className="flex flex-wrap gap-1.5">
              {path.indian_context.exams.map((exam) => (
                <Badge key={exam} variant="outline" className="text-meta font-mono">{exam}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {path.indian_context.target_companies.map((c) => (
                <Badge key={c} variant="secondary" className="text-meta font-mono">{c}</Badge>
              ))}
            </div>
            <p className="text-body-sm font-display font-semibold text-brand-300">{path.indian_context.avg_salary_range}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
