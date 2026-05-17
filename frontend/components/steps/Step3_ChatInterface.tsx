"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Send, Sparkles, ChevronRight } from "lucide-react"
import { ChatBubble } from "../ChatBubble"
import { TypingIndicator } from "../TypingIndicator"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { startChat, submitAnswer } from "@/lib/api"
import { useSession } from "@/context/SessionContext"

interface Step3Props {
  sessionId: string
  onComplete: () => void
}

interface DisplayEntry {
  id: string
  role: "user" | "assistant"
  content: string
}

const PHASE_LABELS: Record<string, string> = {
  foundation: "FOUNDATION",
  deep_dive: "DEEP DIVE",
}

const getQuickOptions = (qIndex: number, selectedField: string): string[] => {
  switch (qIndex) {
    case 0:
      const field = selectedField.toUpperCase()
      if (field.includes("TECH")) {
        return [
          "💻 I love coding, building websites, and playing with AI tools.",
          "🌍 I want to use technology to solve massive real-world problems.",
          "🛠️ I enjoy building & playing with hardware setups, PCs, and games."
        ]
      } else if (field.includes("MEDICINE")) {
        return [
          "🩺 I want to save lives, help patients, and study human biology.",
          "🔬 I'm drawn to diagnostic problem-solving and clinical research.",
          "🏥 I want to join healthcare to support communities and families."
        ]
      } else if (field.includes("COMMERCE")) {
        return [
          "🚀 I want to start my own business, lead teams, and be an entrepreneur.",
          "📊 I'm fascinated by stock markets, finance, trade, and corporate growth.",
          "🤝 I love business strategy, negotiation, and economic relations."
        ]
      } else if (field.includes("CREATIVE")) {
        return [
          "🎨 I love designing, painting, and visual digital arts.",
          "🎵 I'm deeply into music, creative writing, filmmaking, or storytelling.",
          "📐 I want to design products, spaces, or branding that inspires people."
        ]
      } else if (field.includes("LAW")) {
        return [
          "⚖️ I love debating, critical analysis, and standing up for justice.",
          "🏛️ I want to shape public policies, work in governance, and drive social impact.",
          "💼 I'm drawn to corporate law, logic structure, and contract negotiations."
        ]
      } else {
        return [
          "🔬 I have endless curiosity about space, physics, chemistry, and research.",
          "🧪 I want to work in laboratory discovery or solve scientific mysteries.",
          "📊 I love mathematical logic, experimental data, and discovery."
        ]
      }
    case 1:
      return [
        "📐 I excel in STEM subjects, but languages or history feel like a struggle.",
        "🎨 I love creative & humanity subjects, but struggle with strict math formulas.",
        "📚 I'm an all-rounder; I enjoy logical concepts but prefer practical labs."
      ]
    case 2:
      return [
        "💻 I spend my time on coding side-projects, gaming, and online tech groups.",
        "⚽ I love sports, fitness, outdoors, and team championships.",
        "🎸 I'm deeply into arts, music, reading, writing, or creative hobbies."
      ]
    case 3:
      return [
        "🏢 A corporate office with high-energy collaboration and fast pace.",
        "🏡 A quiet, comfortable desk setup focusing on deep solo focus.",
        "✈️ A highly active lifestyle—traveling, meeting clients, and outdoors."
      ]
    case 4:
      return [
        "🚀 A visionary startup founder or tech leader building new frontiers.",
        "🔬 A dedicated researcher, doctor, or scientist advancing human knowledge.",
        "🎨 A creative designer, artist, or author who lives by their own rules."
      ]
    case 5:
      return [
        "🔄 Waking up 10 years later feeling completely stuck in the wrong career.",
        "📈 Intense academic cutoffs, parental expectation, and peer pressure.",
        "💰 Not being financially stable or earning enough to secure my dreams."
      ]
    case 6:
      return [
        "🔥 That sounds extremely exciting! I would absolutely love to do that.",
        "🤔 I'm curious but skeptical; I want to know what the work looks like first.",
        "❌ Honestly, that doesn't appeal to me. I prefer a different angle."
      ]
    case 7:
      return [
        "🌆 A state-of-the-art office in a bustling city like Bangalore or Mumbai.",
        "🧪 A specialized research laboratory, medical clinic, or design studio.",
        "🌍 Fully remote; with the total freedom to live and work from anywhere."
      ]
    case 8:
      return [
        "💰 A high salary and rapid financial growth is my absolute #1 priority.",
        "❤️ Creative fulfillment, job satisfaction, and personal alignment.",
        "⚖️ A great work-life balance that leaves ample time for my family."
      ]
    case 9:
      return [
        "👑 Running a world-class startup or enterprise as the CEO/Founder.",
        "🎓 Working as a top specialist (surgeon, lead scientist, chief architect).",
        "🌟 Being a highly celebrated and recognized creative artist or director."
      ]
    default:
      return []
  }
}

export function Step3_ChatInterface({ sessionId, onComplete }: Step3Props) {
  const { state: sessionState } = useSession()
  const [entries, setEntries] = useState<DisplayEntry[]>([])
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [dynamicOptions, setDynamicOptions] = useState<string[]>([])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [currentPhase, setCurrentPhase] = useState("foundation")
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAnswering, setIsAnswering] = useState(false)
  const [acknowledgment, setAcknowledgment] = useState("")
  const [interviewDone, setInterviewDone] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => scrollToBottom(), [entries, acknowledgment, scrollToBottom])

  useEffect(() => {
    if (!sessionId) return
    const init = async () => {
      setIsLoading(true)
      try {
        const data = await startChat(sessionId)
        if (data.type === "question") {
          setEntries([{ id: `q-0-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, role: "assistant", content: data.question }])
          setCurrentQIndex(data.question_index)
          setCurrentPhase(data.phase)
          if (data.options && data.options.length > 0) {
            setDynamicOptions(data.options)
          }
        }
      } catch {
        // silent
      }
      setIsLoading(false)
    }
    init()
  }, [sessionId])

  const handleSendDirect = useCallback(async (textToSend: string) => {
    setInput("")
    setSelectedOptions([])
    setDynamicOptions([]) // Clean stale options instantly when sending starts!
    setIsAnswering(true)
    setAcknowledgment("")

    setEntries((prev) => [...prev, { id: `ans-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, role: "user", content: textToSend }])

    try {
      let ack = ""
      let nextQuestionText = ""
      let nextQIndex = currentQIndex
      let nextPhase = currentPhase
      let isComplete = false
      let fetchedOptions: string[] = []

      for await (const event of submitAnswer(sessionId, textToSend)) {
        if (event.type === "token") {
          ack += event.token
          setAcknowledgment(ack)
        }
        if (event.type === "question") {
          nextQuestionText = event.question
          nextQIndex = event.question_index
          nextPhase = event.phase
          if (event.options && event.options.length > 0) {
            fetchedOptions = event.options
          }
        }
        if (event.type === "interview_complete") {
          isComplete = true
        }
      }

      setEntries((prev) => {
        const nextEntries = [...prev]
        if (ack) {
          nextEntries.push({
            id: `ack-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            role: "assistant",
            content: ack
          })
        }
        return nextEntries
      })

      if (nextQuestionText) {
        setCurrentQIndex(nextQIndex)
        setCurrentPhase(nextPhase)
        setDynamicOptions(fetchedOptions) // Set dynamically generated choices!
      }

      if (isComplete) {
        setInterviewDone(true)
      }

      setAcknowledgment("")
    } catch {
      // silent
    }
    setIsAnswering(false)
  }, [sessionId, currentQIndex, currentPhase])

  const handleSend = useCallback(async () => {
    const cleanOptions = selectedOptions.map(opt => opt.replace(/^[\p{Emoji}\s]+\s*/u, "").trim())
    const combinedText = [
      ...cleanOptions,
      input.trim()
    ].filter(Boolean).join(". ")

    if (!combinedText || isAnswering || interviewDone) return
    await handleSendDirect(combinedText)
  }, [input, selectedOptions, isAnswering, interviewDone, handleSendDirect])

  const handleQuickSelect = useCallback((optionText: string) => {
    if (isAnswering || interviewDone) return
    setSelectedOptions((prev) => {
      if (prev.includes(optionText)) {
        return prev.filter((o) => o !== optionText)
      } else {
        return [...prev, optionText]
      }
    })
  }, [isAnswering, interviewDone])

  const progressPercent = Math.min(Math.round((currentQIndex / 10) * 100), 100)
  
  // Dynamic options take priority, fallbacks to predefined options if LLM fails
  const quickOptions = dynamicOptions.length > 0 
    ? dynamicOptions 
    : getQuickOptions(currentQIndex, sessionState.selectedField || "TECH & AI")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <TypingIndicator />
      </div>
    )
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-[calc(100vh-200px)] max-w-2xl mx-auto glass rounded-2xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-white/10 bg-surface/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-heading-3 font-display text-white">INTERVIEW</h2>
            <p className="text-meta font-mono text-white/30 tracking-wider">{PHASE_LABELS[currentPhase]}</p>
          </div>
          <span className="text-meta font-mono text-brand-300 bg-brand-500/10 px-3 py-1.5 rounded-full border border-brand-500/20 tabular-nums">
            {String(Math.min(currentQIndex + 1, 10)).padStart(2, "0")} / 10
          </span>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full origin-left"
            initial={{ scaleX: 0 }}
            animate={shouldReduceMotion ? { scaleX: progressPercent / 100 } : { scaleX: progressPercent / 100 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence>
          {entries.map((entry) => (
            <ChatBubble key={entry.id} role={entry.role} content={entry.content} />
          ))}
        </AnimatePresence>

        {isAnswering && acknowledgment && (
          <ChatBubble role="assistant" content={acknowledgment} isStreaming />
        )}

        {isAnswering && !acknowledgment && <TypingIndicator />}

        {interviewDone && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/20 mb-4">
              <Sparkles className="w-7 h-7 text-green-400" strokeWidth={1.5} />
            </div>
            <p className="text-heading-2 font-display text-white mb-1">ALL DONE!</p>
            <p className="text-body-sm text-white/50 mb-6">10 questions answered. I know you now.</p>
            <Button onClick={onComplete} size="lg" className="font-display tracking-wide">
              SHOW MY REPORT
              <ChevronRight className="w-4 h-4 ml-1" strokeWidth={1.5} />
            </Button>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Dynamic quick reply options area with multi-select support */}
      {!interviewDone && !isAnswering && quickOptions.length > 0 && (
        <div className="flex flex-wrap gap-2.5 px-5 py-3.5 border-t border-white/5 bg-surface/30 backdrop-blur-md max-h-48 overflow-y-auto shrink-0 justify-center">
          {quickOptions.map((opt, i) => {
            const isSelected = selectedOptions.includes(opt)
            return (
              <motion.button
                key={opt}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickSelect(opt)}
                className={`text-xs md:text-sm font-sans font-medium px-4.5 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm select-none shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? "bg-brand-500/20 border-brand-400 text-white shadow-lg shadow-brand-500/10"
                    : "glass border-white/10 text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {isSelected && (
                  <span className="text-brand-400 font-bold text-xs shrink-0 select-none">✓</span>
                )}
                <span>{opt}</span>
              </motion.button>
            )
          })}
        </div>
      )}

      {!interviewDone && (
        <div className="border-t border-white/10 p-4 bg-surface/50 shrink-0">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isAnswering && handleSend()}
              placeholder={
                isAnswering 
                  ? "Poppy is typing..." 
                  : selectedOptions.length > 0 
                    ? "Type to add custom details to selected options..." 
                    : "Type custom thoughts..."
              }
              disabled={isAnswering}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={isAnswering || (!input.trim() && selectedOptions.length === 0)} 
              size="icon"
            >
              <Send className="w-4 h-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
