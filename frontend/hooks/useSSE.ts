"use client"

import { useState, useRef, useCallback } from "react"

export function useSSE() {
  const [data, setData] = useState<string>("")
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const stream = useCallback(async (url: string, body: object) => {
    setIsStreaming(true)
    setData("")
    abortRef.current = new AbortController()

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: abortRef.current.signal,
      })
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const parsed = JSON.parse(line.slice(6))
            if (parsed.done) { setIsStreaming(false); return }
            setData(prev => prev + parsed.token)
          }
        }
      }
    } catch {
      // aborted or error
    }
    setIsStreaming(false)
  }, [])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    setIsStreaming(false)
  }, [])

  return { data, isStreaming, stream, cancel }
}
