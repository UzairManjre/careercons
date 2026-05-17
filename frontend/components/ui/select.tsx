"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ options, placeholder, className, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 pr-10 text-body-sm text-white appearance-none cursor-pointer font-sans",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          "transition-all",
          !props.value && "text-white/20",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" className="bg-surface text-white/50">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface text-white">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" strokeWidth={1.5} />
    </div>
  )
}
