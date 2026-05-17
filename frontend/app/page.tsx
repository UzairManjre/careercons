"use client"

import { useEffect, useCallback, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SessionProvider, useSession } from "@/context/SessionContext"
import { ChatProvider } from "@/context/ChatContext"
import { AnimatedProgressBar } from "@/components/AnimatedProgressBar"
import { Step1_VibeCheck } from "@/components/steps/Step1_VibeCheck"
import { Step2_AcademicProfile } from "@/components/steps/Step2_AcademicProfile"
import { Step3_ChatInterface } from "@/components/steps/Step3_ChatInterface"
import { Step4_ReportReveal } from "@/components/steps/Step4_ReportReveal"
import { createSession, selectVibe, submitProfile, getReportHistory, injectDummyReport } from "@/lib/api"
import type { ProfileData, Report } from "@/types"
import { History, X, FileText, Calendar, ArrowRight } from "lucide-react"

interface ReportHistoryModalProps {
  onClose: () => void
  onSelectReport: (sessionId: string) => void
}

function ReportHistoryModal({ onClose, onSelectReport }: ReportHistoryModalProps) {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [injecting, setInjecting] = useState(false)

  const fetchHistory = useCallback(() => {
    setLoading(true)
    getReportHistory().then(data => {
      setReports((data.reports as any[]) || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleInjectDummy = async () => {
    setInjecting(true)
    try {
      const res = await injectDummyReport()
      if (res.status === "success") {
        onSelectReport(res.session_id)
      }
    } catch (err) {
      console.error("Failed to inject sandbox report:", err)
    } finally {
      setInjecting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl max-h-[80vh] overflow-hidden bg-[#0a0a0f] border border-white/10 rounded-3xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">Report History</h2>
            <p className="text-xs text-white/30 font-mono mt-0.5">View your career discovery results</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleInjectDummy}
              disabled={injecting}
              className="text-xs px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-indigo-300 hover:from-indigo-500/30 hover:to-violet-500/30 transition-all font-mono uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 font-semibold"
            >
              {injecting ? "Injecting..." : "✨ Dev Sandbox"}
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white/60">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center text-white/40 py-8 font-mono text-xs uppercase tracking-wider">Loading history...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-10 space-y-6">
              <p className="text-white/40 text-sm">No reports completed yet. Run a session to see your history.</p>
              <div className="flex justify-center">
                <button
                  onClick={handleInjectDummy}
                  disabled={injecting}
                  className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all text-sm font-semibold flex items-center gap-2.5 disabled:opacity-50"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Generate Sandbox Report for UI Testing
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-white/40 font-mono uppercase tracking-wider">Click a report to load it on screen:</p>
              {reports.map((r) => (
                <div 
                  key={r.session_id} 
                  onClick={() => onSelectReport(r.session_id)}
                  className="p-5 rounded-[20px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.07] hover:border-indigo-500/30 transition-all cursor-pointer group flex items-start justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {r.selected_field}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/40 font-mono">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
                      {r.report?.summary || "No summary available"}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {r.report?.top_3_paths?.slice(0, 3).map((p: any, i: number) => (
                        <span key={i} className="text-xs px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/15">
                          {p.title}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all shrink-0 self-center">
                    <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function PoppyApp() {
  const { state, dispatch } = useSession()
  const [showHistory, setShowHistory] = useState(false)
  const [particles, setParticles] = useState<any[]>([])

  useEffect(() => {
    if (!state.sessionId) {
      createSession().then((sid) => dispatch({ type: "SET_SESSION_ID", payload: sid }))
    }
  }, [state.sessionId, dispatch])

  // Client-only floating background stars coordinates to prevent hydration mismatches
  useEffect(() => {
    const pts = [...Array(35)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.2 + 1.2,
      duration: Math.random() * 6 + 5,
      delay: Math.random() * 3,
      color: [
        "bg-indigo-500/25 shadow-[0_0_8px_rgba(99,102,241,0.15)]", 
        "bg-purple-500/25 shadow-[0_0_8px_rgba(168,85,247,0.15)]", 
        "bg-cyan-500/25 shadow-[0_0_8px_rgba(6,182,212,0.15)]", 
        "bg-pink-500/25 shadow-[0_0_8px_rgba(236,72,153,0.15)]"
      ][Math.floor(Math.random() * 4)]
    }))
    setParticles(pts)
  }, [])

  // Custom global event listener to open history from Step 4
  useEffect(() => {
    const handleOpenHistory = () => setShowHistory(true)
    window.addEventListener("open-history-modal", handleOpenHistory)
    return () => window.removeEventListener("open-history-modal", handleOpenHistory)
  }, [])

  const handleFieldSelect = useCallback(async (field: string) => {
    dispatch({ type: "SELECT_FIELD", payload: field })
    if (state.sessionId) {
      await selectVibe(state.sessionId, field)
    }
    dispatch({ type: "SET_STEP", payload: { step: 2, direction: "right" } })
  }, [state.sessionId, dispatch])

  const handleProfileSubmit = useCallback(async (profile: ProfileData) => {
    dispatch({ type: "SET_PROFILE", payload: profile })
    if (state.sessionId) {
      const payload = {
        session_id: state.sessionId,
        class_10_percentage: profile.class10Percentage,
        class_12_stream: profile.stream12,
        class_12_percentage: profile.class12Percentage,
        entrance_exam: profile.entranceExam,
        entrance_score: profile.entranceScore,
        current_education: profile.currentEducation,
        location: profile.location,
        languages: profile.languages,
        extracurricular: profile.extracurricular,
        favorite_subjects: profile.favoriteSubjects,
        hobbies_and_interests: profile.hobbiesAndInterests,
        work_style_preference: profile.workStylePreference,
        career_values: profile.careerValues,
        biggest_worry: profile.biggestWorry,
      }
      await submitProfile(state.sessionId, payload)
    }
    dispatch({ type: "SET_STEP", payload: { step: 3, direction: "right" } })
  }, [state.sessionId, dispatch])

  const handleChatComplete = useCallback(() => {
    dispatch({ type: "SET_STEP", payload: { step: 4, direction: "right" } })
  }, [dispatch])

  const handleSelectReport = useCallback((sessionId: string) => {
    dispatch({ type: "SET_SESSION_ID", payload: sessionId })
    dispatch({ type: "SET_STEP", payload: { step: 4, direction: "right" } })
    setShowHistory(false)
  }, [dispatch])

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden flex flex-col justify-start">
      {/* Global Background Starry Drift */}
      {state.currentStep !== 4 && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Soft, deep ambient blur backdrops */}
          <div className="absolute top-1/4 left-10 w-[350px] h-[350px] bg-indigo-500/[0.03] rounded-full filter blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: "12s" }} />
          <div className="absolute bottom-1/4 right-10 w-[380px] h-[380px] bg-purple-500/[0.03] rounded-full filter blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: "16s" }} />
          
          {particles.map((pt) => (
            <motion.div
              key={pt.id}
              className={`absolute rounded-full filter blur-[0.5px] ${pt.color}`}
              style={{
                left: `${pt.x}%`,
                top: `${pt.y}%`,
                width: pt.size,
                height: pt.size,
              }}
              animate={{
                y: [0, -320],
                x: [0, Math.sin(pt.id) * 35],
                opacity: [0, 0.7, 0],
                scale: [0.8, 1.4, 0.8]
              }}
              transition={{
                duration: pt.duration,
                repeat: Infinity,
                delay: pt.delay,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 w-full flex-1 flex flex-col justify-start">
        {state.currentStep !== 4 && (
          <header className="pt-8 pb-4">
          <div className="text-center mb-6 relative">
            <h1 className="text-2xl font-display font-bold gradient-text tracking-tight">
              POPPY
            </h1>
            <p className="text-xs font-mono text-white/30 tracking-[0.15em] uppercase mt-1">
              Career Counselor
            </p>
            <button
              onClick={() => setShowHistory(true)}
              className="absolute right-4 top-0 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <History className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
          <AnimatedProgressBar currentStep={state.currentStep} />
        </header>
      )}

      <AnimatePresence>
        {showHistory && (
          <ReportHistoryModal 
            onClose={() => setShowHistory(false)} 
            onSelectReport={handleSelectReport}
          />
        )}
      </AnimatePresence>

      <main className={state.currentStep === 4 ? "w-full" : "max-w-7xl mx-auto px-4 w-full"}>
        <AnimatePresence mode="wait">
          {state.currentStep === 1 && (
            <Step1_VibeCheck
              key="step1"
              onSelect={handleFieldSelect}
            />
          )}
          {state.currentStep === 2 && (
            <Step2_AcademicProfile
              key="step2"
              onSubmit={handleProfileSubmit}
            />
          )}
          {state.currentStep === 3 && state.sessionId && (
            <Step3_ChatInterface
              key="step3"
              sessionId={state.sessionId}
              onComplete={handleChatComplete}
            />
          )}
          {state.currentStep === 4 && state.sessionId && (
            <Step4_ReportReveal
              key="step4"
              sessionId={state.sessionId}
            />
          )}
        </AnimatePresence>
      </main>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <SessionProvider>
      <ChatProvider>
        <PoppyApp />
      </ChatProvider>
    </SessionProvider>
  )
}
