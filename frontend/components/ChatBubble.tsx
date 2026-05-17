"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { springStiff } from "@/lib/animations"

interface ChatBubbleProps {
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

export function ChatBubble({ role, content, isStreaming }: ChatBubbleProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={springStiff}
      className={cn("flex", role === "user" ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          role === "user"
            ? "rounded-tr-sm bg-brand-500 text-white"
            : "rounded-tl-sm glass text-white/90"
        )}
      >
        <p className="text-body-sm leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && <span className="inline-block w-1.5 h-4 bg-brand-400 ml-0.5 animate-pulse" />}
        </p>
      </div>
    </motion.div>
  )
}
