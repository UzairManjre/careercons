"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export function Slider({ value, onChange, min = 0, max = 100, step = 1, className }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn("relative w-full flex items-center h-6", className)}>
      {/* Background Track (Inactive) */}
      <div className="absolute left-0 right-0 h-1 bg-white/10 rounded-full" />
      
      {/* Active Track Progress Bar */}
      <div
        className="absolute left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full pointer-events-none"
        style={{ width: `${percentage}%` }}
      />

      {/* Native Range Input for drag controls, styled to match our branding */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute w-full h-full appearance-none bg-transparent cursor-pointer outline-none z-10
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:w-4 
          [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-indigo-500 
          [&::-webkit-slider-thumb]:border-2 
          [&::-webkit-slider-thumb]:border-white
          [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(99,102,241,0.8)]
          [&::-webkit-slider-thumb]:transition-all 
          [&::-webkit-slider-thumb]:hover:scale-125
          [&::-moz-range-thumb]:w-4 
          [&::-moz-range-thumb]:h-4 
          [&::-moz-range-thumb]:rounded-full 
          [&::-moz-range-thumb]:bg-indigo-500 
          [&::-moz-range-thumb]:border-2 
          [&::-moz-range-thumb]:border-white
          [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(99,102,241,0.8)]
          [&::-moz-range-thumb]:cursor-pointer 
          [&::-moz-range-thumb]:border-0"
      />
    </div>
  )
}
