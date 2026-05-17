"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-lg mx-4">
        {children}
      </div>
    </div>
  )
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
  onClose?: () => void
}

export function DialogContent({ children, className, onClose }: DialogContentProps) {
  return (
    <div className={cn("rounded-2xl glass p-6 shadow-glow-lg", className)}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>
      )}
      {children}
    </div>
  )
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-1.5 mb-4", className)}>{children}</div>
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-heading-2 font-display text-white", className)}>{children}</h2>
}

export function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-body-sm text-white/50", className)}>{children}</p>
}
