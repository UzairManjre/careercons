"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  tabs: { value: string; label: string }[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function Tabs({ tabs, value, onValueChange, className }: TabsProps) {
  return (
    <div className={cn("flex items-center gap-1 border-b border-white/10", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onValueChange(tab.value)}
          className={cn(
            "relative px-4 py-3 text-meta font-mono tracking-wider transition-all uppercase",
            value === tab.value
              ? "text-brand-400"
              : "text-white/40 hover:text-white/60"
          )}
        >
          {tab.label}
          {value === tab.value && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  )
}
