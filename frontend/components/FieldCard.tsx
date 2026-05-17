"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface FieldCardProps {
  icon: string | ReactNode
  title: string
  subtitle: string
  color: string
  isActive: boolean
  onClick: (e: React.MouseEvent) => void
  style?: React.CSSProperties
  "data-index"?: number
  isUploadCard?: boolean
}

export function FieldCard({ icon, title, subtitle, color, isActive, onClick, style, isUploadCard, ...rest }: FieldCardProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      onClick={onClick}
      {...rest}
      className={cn(
        "absolute w-full cursor-pointer select-none rounded-[24px] p-8 border backdrop-blur-xl transition-all duration-300 overflow-hidden",
        isActive 
          ? "bg-white/[0.08] border-white/25 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)] z-10" 
          : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] z-0"
      )}
      style={{
        ...style,
        borderColor: isActive ? `${color}40` : undefined,
        boxShadow: isActive ? `0 20px 40px -15px ${color}20, inset 0 1px 1px rgba(255,255,255,0.15)` : undefined
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileHover={shouldReduceMotion ? {} : { scale: isActive ? 1.01 : 1.02 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
    >
      {/* Active glow gradient overlay */}
      {isActive && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none"
        />
      )}

      <div className="relative flex items-center gap-6">
        {/* Icon container with high-fidelity glow */}
        <motion.div 
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0",
          )}
          style={{ 
            backgroundColor: color + "18",
            border: `1px solid ${color}30`,
            boxShadow: isActive ? `0 0 30px ${color}25` : "none"
          }}
          animate={isActive ? { scale: [1, 1.04, 1] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {typeof icon === 'string' ? (
            <span className="text-3xl filter drop-shadow-sm">{icon}</span>
          ) : (
            <div style={{ color: color }} className="w-7 h-7 flex items-center justify-center">{icon}</div>
          )}
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-display font-semibold text-white tracking-tight leading-tight",
            isUploadCard ? "text-xl" : "text-[22px]"
          )}>
            {title}
          </h3>
          <p className={cn(
            "mt-2 leading-relaxed text-white/55 font-normal",
            isUploadCard ? "text-[14px]" : "text-[14.5px]"
          )}>
            {subtitle}
          </p>
        </div>

        {/* Dynamic micro-animating arrow indicator */}
        <motion.div 
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0",
            isActive ? "bg-white/10 text-white" : "bg-white/5 text-white/30"
          )}
          animate={isActive ? { x: [0, 4, 0] } : {}}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </motion.div>
      </div>
      
      {/* Premium accent indicator bar at the bottom */}
      {isActive && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-[24px]"
          style={{ 
            background: `linear-gradient(90deg, ${color}, ${color}88, ${color})` 
          }}
        />
      )}
    </motion.div>
  )
}