"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, useScroll, useInView, useReducedMotion } from "framer-motion"
import { 
  Compass, 
  Rocket, 
  TrendingUp, 
  Award, 
  ArrowRight, 
  MapPin, 
  GraduationCap,
  Briefcase,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Star,
  Zap,
  Globe,
  Building2,
  Lightbulb,
  History
} from "lucide-react"
import { Report, CareerPath } from "@/types"

interface JourneyReportProps {
  report: Report
}

const spring = { type: "spring" as const, stiffness: 300, damping: 24 }
const springBouncy = { type: "spring" as const, stiffness: 400, damping: 15 }
const smooth = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const shouldReduceMotion = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={smooth}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerChildren({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      transition={spring}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function RoadmapNode({ phase, steps, index, pathIndex = 0 }: { phase: string; steps: string[]; index: number; pathIndex?: number }) {
  const icons = [GraduationCap, Briefcase, Rocket]
  const Icon = icons[index] || MapPin

  const nodeGradients = [
    "from-indigo-500/20 to-purple-500/20 border-indigo-500/40",
    "from-cyan-500/20 to-blue-500/20 border-cyan-500/40",
    "from-amber-500/20 to-orange-500/20 border-amber-500/40"
  ]
  const lineGradients = [
    "from-indigo-500 via-purple-500 to-transparent",
    "from-cyan-500 via-blue-500 to-transparent",
    "from-amber-500 via-orange-500 to-transparent"
  ]
  const iconColors = ["text-indigo-400", "text-cyan-400", "text-amber-400"]
  const glowShadows = [
    ["0 0 12px rgba(99, 102, 241, 0.15)", "0 0 24px rgba(99, 102, 241, 0.4)", "0 0 12px rgba(99, 102, 241, 0.15)"],
    ["0 0 12px rgba(6, 182, 212, 0.15)", "0 0 24px rgba(6, 182, 212, 0.4)", "0 0 12px rgba(6, 182, 212, 0.15)"],
    ["0 0 12px rgba(245, 158, 11, 0.15)", "0 0 24px rgba(245, 158, 11, 0.4)", "0 0 12px rgba(245, 158, 11, 0.15)"]
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative flex gap-6"
    >
      {index < 2 && (
        <div className="absolute left-[22px] top-12 bottom-[-28px] w-[3px] bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div
            className={`w-full h-1/2 bg-gradient-to-b ${lineGradients[pathIndex]}`}
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      <motion.div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border backdrop-blur-xl bg-gradient-to-br ${nodeGradients[pathIndex]}`}
        whileHover={{ scale: 1.12, rotate: 5 }}
        animate={{ boxShadow: glowShadows[pathIndex] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon className={`w-5 h-5 ${iconColors[pathIndex]}`} strokeWidth={2} />
      </motion.div>

      <div className="flex-1 pb-8">
        <h4 className="text-lg font-semibold text-white mb-3 tracking-tight">{phase}</h4>
        <ul className="space-y-3">
          {steps.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + i * 0.05, duration: 0.4 }}
              className="text-sm text-white/60 flex items-start gap-2.5 leading-relaxed"
            >
              <motion.div whileHover={{ scale: 1.3, rotate: 10 }}>
                <CheckCircle2 className="w-4 h-4 text-green-400/80 mt-0.5 shrink-0" strokeWidth={2.5} />
              </motion.div>
              <span>{step}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

function CareerPathCard({ path, isActive, index, onClick }: { path: CareerPath; isActive: boolean; index: number; onClick: () => void }) {
  const colors = [
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-blue-500 via-cyan-500 to-teal-500",
    "from-amber-500 via-orange-500 to-red-500"
  ]
  const glows = [
    "shadow-[0_0_50px_rgba(139,92,246,0.25)] border-indigo-500/30",
    "shadow-[0_0_50px_rgba(6,182,212,0.25)] border-cyan-500/30",
    "shadow-[0_0_50px_rgba(245,158,11,0.25)] border-amber-500/30"
  ]

  return (
    <motion.button
      onClick={onClick}
      className={`w-full text-left p-6 rounded-[28px] border transition-all duration-500 relative overflow-hidden ${
        isActive
          ? "bg-white/[0.07] backdrop-blur-xl " + glows[index]
          : "bg-white/[0.02] border-white/8 hover:bg-white/[0.05] hover:border-white/15"
      }`}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
    >
      {isActive && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          className={`absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r ${colors[index]}`}
        />
      )}

      <div className="flex items-center gap-4 mb-4">
        <motion.div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[index]} flex items-center justify-center shadow-lg`}
          animate={isActive ? { rotate: [0, 4, -4, 0], scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-white font-bold text-lg">#{path.rank}</span>
        </motion.div>

        <div className="flex-1">
          <h3 className={`text-xl font-bold tracking-tight ${isActive ? "text-white" : "text-white/70"}`}>
            {path.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {[...Array(5)].map((_, i) => (
              <motion.div key={i} whileHover={{ scale: 1.3 }}>
                <Star
                  className={`w-3.5 h-3.5 ${i < Math.ceil(path.fit_score / 20) ? "text-amber-400 fill-amber-400" : "text-white/10"}`}
                  strokeWidth={2}
                />
              </motion.div>
            ))}
            <span className="text-xs text-white/40 font-mono tracking-wider">{path.fit_score}% match</span>
          </div>
        </div>
        {isActive && (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={springBouncy}
            className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0"
          >
            <Zap className="w-4 h-4 text-indigo-400" strokeWidth={2} />
          </motion.div>
        )}
      </div>

      <p className={`text-sm leading-relaxed ${isActive ? "text-white/70" : "text-white/40"} transition-colors duration-300`}>
        {path.why.slice(0, isActive ? 350 : 120)}...
      </p>

      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-6 pt-6 border-t border-white/5"
        >
          <div className="space-y-4">
            <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-2">Roadmap Preview:</p>
            {path.roadmap.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-3 items-center"
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${colors[index]} opacity-30 flex items-center justify-center shrink-0`}>
                  {i === 0 ? <GraduationCap className="w-4 h-4 text-white" /> : i === 1 ? <Briefcase className="w-4 h-4 text-white" /> : <Rocket className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider">{phase.phase}</p>
                  <p className="text-xs text-white/60 truncate leading-relaxed">{phase.steps[0]}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.button>
  )
}

function HeroSection({ totalPaths }: { totalPaths: number }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-black to-purple-950/20 z-0" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none z-0"
        animate={{ scale: [1.2, 1, 1.2], opacity: [1, 0.5, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <AnimatedSection className="text-center z-10 px-4 max-w-3xl">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={springBouncy}
          className="w-24 h-24 mx-auto mb-8 rounded-[28px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 backdrop-blur-xl flex items-center justify-center shadow-2xl"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Compass className="w-12 h-12 text-indigo-400" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        <StaggerChildren>
          <StaggerItem>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Your Career
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-2 font-display">
                Journey
              </span>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="text-xl md:text-2xl text-white/50 mt-6 max-w-2xl mx-auto leading-relaxed">
              Based on your academic profile and personal aspirations, we have synthesized {totalPaths} unique pathways that align with your core strengths and long-term potential.
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="flex flex-col items-center gap-2 text-white/20 mt-16">
              <span className="text-xs font-mono uppercase tracking-[0.2em]">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="w-5 h-5 text-indigo-400/50" />
              </motion.div>
            </div>
          </StaggerItem>
        </StaggerChildren>
      </AnimatedSection>
    </div>
  )
}

function PathsOverviewSection({ paths, activePath, onPathSelect }: { paths: CareerPath[]; activePath: number; onPathSelect: (i: number) => void }) {
  return (
    <div className="min-h-screen py-20 px-8 md:px-16 relative">
      <AnimatedSection className="max-w-6xl mx-auto">
        <StaggerChildren className="text-center mb-20">
          <StaggerItem>
            <span className="inline-block text-sm font-mono text-indigo-400 tracking-[0.25em] uppercase font-bold">
              Tailored Path recommendations
            </span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="text-5xl md:text-6xl font-bold text-white mt-4 tracking-tight">Your Career Pathways</h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-white/40 mt-3 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
              Click on each option below to expand the career matching analysis and view details.
            </p>
          </StaggerItem>
        </StaggerChildren>

        <StaggerChildren className="space-y-4">
          {paths.map((path, i) => (
            <StaggerItem key={path.rank}>
              <CareerPathCard
                path={path}
                isActive={activePath === i}
                index={i}
                onClick={() => onPathSelect(i)}
              />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </AnimatedSection>
    </div>
  )
}

function PathDetailSection({ path, index }: { path: CareerPath; index: number }) {
  const colors = [
    "from-indigo-500 to-purple-500 border-indigo-500/25",
    "from-blue-500 to-cyan-500 border-cyan-500/25",
    "from-amber-500 to-orange-500 border-amber-500/25"
  ]
  const textColors = ["text-indigo-400", "text-cyan-400", "text-amber-400"]
  const highlights = [
    "bg-indigo-500/5 border-indigo-500/20",
    "bg-cyan-500/5 border-cyan-500/20",
    "bg-amber-500/5 border-amber-500/20"
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="min-h-screen py-24 px-8 md:px-16 relative border-t border-white/[0.02]"
    >
      <motion.div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full filter blur-[200px] opacity-15 pointer-events-none z-0 bg-gradient-to-r ${colors[index]}`}
        animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.2, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className={`absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full filter blur-[120px] opacity-10 pointer-events-none z-0 bg-gradient-to-r ${colors[index]}`}
        animate={{ y: [0, -50, 0], x: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <AnimatedSection className="max-w-6xl mx-auto z-10 relative space-y-16">
        <StaggerChildren className="text-center">
          <StaggerItem>
            <motion.div
              className={`inline-flex items-center gap-3 px-8 py-3 rounded-full border bg-black/40 backdrop-blur-xl ${colors[index]} mb-8 shadow-xl`}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <Star className="w-6 h-6 text-white fill-white" strokeWidth={0} />
              </motion.div>
              <span className="text-white text-base font-semibold tracking-wide font-mono uppercase">Path Option #{path.rank}</span>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">{path.title}</h2>
          </StaggerItem>
          <StaggerItem>
            <div className="flex items-center justify-center gap-3 mt-6">
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.3 }}>
                  <Star className={`w-6 h-6 ${i < Math.ceil(path.fit_score / 20) ? "text-amber-400 fill-amber-400" : "text-white/20"}`} strokeWidth={2.5} />
                </motion.div>
              ))}
              <span className="text-base text-white/50 font-mono">|</span>
              <span className={`text-xl font-bold font-mono tracking-wider ${textColors[index]}`}>
                {path.fit_score}% Fit Match
              </span>
            </div>
          </StaggerItem>
        </StaggerChildren>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            className="bg-white/[0.02] border border-white/8 backdrop-blur-xl rounded-[32px] p-10 relative overflow-hidden group hover:border-white/15 transition-all duration-300 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
          >
            <motion.div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center gap-4 mb-6 relative">
              <motion.div
                className={`w-14 h-14 rounded-xl ${highlights[index]} flex items-center justify-center border shrink-0`}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Lightbulb className={`w-7 h-7 ${textColors[index]}`} strokeWidth={2} />
              </motion.div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Why This Path?</h3>
            </div>
            <p className="text-lg text-white/70 leading-relaxed font-sans relative">{path.why}</p>
          </motion.div>

          <motion.div
            className="bg-white/[0.02] border border-white/8 backdrop-blur-xl rounded-[32px] p-10 relative overflow-hidden group hover:border-white/15 transition-all duration-300 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -3 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                className={`w-14 h-14 rounded-xl ${highlights[index]} flex items-center justify-center border shrink-0`}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <MapPin className={`w-7 h-7 ${textColors[index]}`} strokeWidth={2} />
              </motion.div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Strategic Roadmap</h3>
            </div>
            <StaggerChildren className="space-y-2">
              {path.roadmap.map((phase, i) => (
                <StaggerItem key={i}>
                  <RoadmapNode phase={phase.phase} steps={phase.steps} index={i} pathIndex={index} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </motion.div>
        </div>

        <motion.div
          className="bg-white/[0.02] border border-white/8 backdrop-blur-xl rounded-[32px] p-10 relative overflow-hidden group hover:border-white/15 transition-all duration-300 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -3 }}
        >
          <div className="flex items-center gap-4 mb-10">
            <motion.div
              className={`w-14 h-14 rounded-xl ${highlights[index]} flex items-center justify-center border shrink-0`}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Globe className={`w-7 h-7 ${textColors[index]}`} strokeWidth={2} />
            </motion.div>
            <h3 className="text-2xl font-bold text-white tracking-tight">In Indian Context</h3>
          </div>

          <StaggerChildren className="grid md:grid-cols-3 gap-8">
            <StaggerItem>
              <motion.div whileHover={{ y: -6, scale: 1.02 }} className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-indigo-500/20 hover:bg-white/[0.03] transition-all duration-300 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 text-base font-semibold">
                  <GraduationCap className="w-5 h-5" />
                  <span>Key Exams</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {path.indian_context.exams.map((exam, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(99, 102, 241, 0.2)" }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 text-sm border border-indigo-500/15 font-mono cursor-default"
                    >
                      {exam}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div whileHover={{ y: -6, scale: 1.02 }} className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-cyan-500/20 hover:bg-white/[0.03] transition-all duration-300 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 text-base font-semibold">
                  <Building2 className="w-5 h-5" />
                  <span>Target Recruiters</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {path.indian_context.target_companies.slice(0, 4).map((company, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(6, 182, 212, 0.2)" }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 text-sm border border-cyan-500/15 font-mono cursor-default"
                    >
                      {company}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div whileHover={{ y: -6, scale: 1.02 }} className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-green-500/20 hover:bg-white/[0.03] transition-all duration-300 space-y-4">
                <div className="flex items-center gap-2 text-green-400 text-base font-semibold">
                  <TrendingUp className="w-5 h-5" />
                  <span>Average Compensation</span>
                </div>
                <motion.div
                  className="px-5 py-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
                  whileHover={{ boxShadow: "0 0 40px rgba(16, 185, 129, 0.2)" }}
                >
                  <span className="text-green-400 font-bold text-base leading-relaxed block tracking-wide">{path.indian_context.avg_salary_range}</span>
                </motion.div>
              </motion.div>
            </StaggerItem>
          </StaggerChildren>
        </motion.div>
      </AnimatedSection>
    </motion.div>
  )
}

function SummarySection({ summary, disclaimer }: { summary: string; disclaimer: string }) {
  return (
    <div className="min-h-screen py-24 px-4 flex items-center justify-center relative">
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <AnimatedSection className="max-w-2xl mx-auto text-center z-10">
        <StaggerChildren className="space-y-8">
          <StaggerItem>
            <motion.div
              className="w-20 h-20 mx-auto mb-4 rounded-[24px] bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)]"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Award className="w-10 h-10 text-green-400" strokeWidth={1.5} />
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <h2 className="text-3.5xl font-bold text-white tracking-tight">Synthesis Summary</h2>
          </StaggerItem>

          <StaggerItem>
            <motion.p
              className="text-lg text-white/70 leading-relaxed font-sans"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {summary}
            </motion.p>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-5"
              whileHover={{ borderColor: "rgba(16, 185, 129, 0.3)" }}
            >
              <p className="text-xs text-white/40 leading-relaxed max-w-lg mx-auto font-sans">{disclaimer}</p>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.button
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg mx-auto flex items-center gap-2"
              whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)" }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Lock in Strategy</span>
              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight className="w-5 h-5 shrink-0" strokeWidth={2.5} />
              </motion.div>
            </motion.button>
          </StaggerItem>
        </StaggerChildren>
      </AnimatedSection>
    </div>
  )
}

export function JourneyReport({ report }: JourneyReportProps) {
  const [activePath, setActivePath] = useState(0)
  const [viewedPaths, setViewedPaths] = useState<Set<number>>(new Set())
  const [particles, setParticles] = useState<any[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pts = [...Array(35)].map((_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 2.5 + 1.2, duration: Math.random() * 5 + 4,
      delay: Math.random() * 3,
      color: [
        "bg-indigo-400/35 shadow-[0_0_8px_rgba(129,140,248,0.25)]",
        "bg-purple-400/35 shadow-[0_0_8px_rgba(192,132,252,0.25)]",
        "bg-cyan-400/35 shadow-[0_0_8px_rgba(94,234,250,0.25)]",
        "bg-pink-400/35 shadow-[0_0_8px_rgba(244,114,182,0.25)]"
      ][Math.floor(Math.random() * 4)]
    }))
    setParticles(pts)
  }, [])

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })

  const handlePathView = useCallback((index: number) => {
    setActivePath(index)
    setViewedPaths(prev => new Set([...prev, index]))
  }, [])

  return (
    <div ref={containerRef} className="relative overflow-hidden min-h-screen bg-black">
      <div className="absolute top-0 left-0 right-0 h-20 px-6 md:px-12 flex items-center justify-between z-40 bg-gradient-to-b from-black/50 to-transparent">
        <motion.div className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={smooth}
        >
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <Compass className="w-6 h-6 text-indigo-400" />
          </motion.div>
          <span className="text-lg font-bold text-white tracking-tight font-display">POPPY</span>
        </motion.div>

        <motion.div className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={smooth}
        >
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
          >
            New Assessment
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { const ev = new CustomEvent("open-history-modal"); window.dispatchEvent(ev) }}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all shadow-lg"
          >
            <History className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>
        </motion.div>
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute top-1/6 -left-24 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[120px]"
          animate={{ x: [0, 60, 0], y: [0, 40, -20, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[120px]"
          animate={{ x: [0, -50, 0], y: [0, -60, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-2/3 left-1/2 w-[350px] h-[350px] bg-pink-500/5 rounded-full blur-[100px]"
          animate={{ x: [0, 80, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {particles.map((pt) => (
          <motion.div
            key={pt.id}
            className={`absolute rounded-full filter blur-[0.5px] ${pt.color}`}
            style={{ left: `${pt.x}%`, top: `${pt.y}%`, width: pt.size, height: pt.size }}
            animate={{ y: [0, -300], x: [0, Math.sin(pt.id) * 35], opacity: [0, 0.7, 0], scale: [0.8, 1.4, 0.8] }}
            transition={{ duration: pt.duration, repeat: Infinity, delay: pt.delay, ease: "easeInOut" }}
          />
        ))}

        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        {[
          { icon: "⚡", left: "3%", top: "15%", delay: 0 },
          { icon: "💻", left: "2%", top: "45%", delay: 2 },
          { icon: "🔬", left: "4%", top: "75%", delay: 4 },
          { icon: "📊", right: "3%", top: "25%", delay: 1 },
          { icon: "🚀", right: "2%", top: "55%", delay: 3 },
          { icon: "🎯", right: "4%", top: "85%", delay: 5 },
        ].map((item, i) => (
          <motion.div
            key={`icon-${i}`}
            className="absolute text-3xl opacity-15"
            style={{ left: item.left, right: item.right, top: item.top }}
            animate={{ y: [0, -30, 0], rotate: [0, 8, -8, 0], opacity: [0.08, 0.2, 0.08] }}
            transition={{ duration: 7 + i, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50 shadow-md shadow-indigo-500/10"
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
      />

      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
        {["Overview", ...report.top_3_paths.map(p => p.title.split(" ")[0]), "Summary"].map((label, i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-white/20 border border-white/5 cursor-help"
            whileHover={{ scale: 1.5, backgroundColor: "rgba(255,255,255,0.5)" }}
            title={label}
          />
        ))}
      </div>

      <div className="relative z-10"><HeroSection totalPaths={report.top_3_paths.length} /></div>
      <div className="relative z-10">
        <PathsOverviewSection paths={report.top_3_paths} activePath={activePath} onPathSelect={handlePathView} />
      </div>
      <div className="relative z-10 space-y-10">
        {report.top_3_paths.map((path, i) => (
          <PathDetailSection key={path.rank} path={path} index={i} />
        ))}
      </div>
      <div className="relative z-10">
        <SummarySection summary={report.summary} disclaimer={report.disclaimer} />
      </div>
    </div>
  )
}