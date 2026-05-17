const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function createSession(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/session/create`, { method: "POST" })
  const data = await res.json()
  return data.session_id
}

export async function selectVibe(sessionId: string, field: string) {
  const res = await fetch(`${API_BASE}/api/vibe/select`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, selected_field: field }),
  })
  return res.json()
}

export async function submitProfile(sessionId: string, profile: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/profile/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, ...profile }),
  })
  return res.json()
}

export type ChatEvent =
  | { type: "question"; question: string; question_index: number; phase: string; options?: string[] }
  | { type: "token"; token: string }
  | { type: "history"; role: "user" | "assistant"; content: string }
  | { type: "interview_complete"; done: boolean }
  | { type: "done"; done: boolean }

async function* streamSSE(url: string, body: object): AsyncGenerator<ChatEvent> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
        const data = JSON.parse(line.slice(6))
        if (data.type === "question") {
          yield { 
            type: "question", 
            question: data.question, 
            question_index: data.question_index, 
            phase: data.phase,
            options: data.options 
          }
        } else if (data.type === "token") {
          yield { type: "token", token: data.token }
        } else if (data.type === "history") {
          yield { type: "history", role: data.role, content: data.content }
        } else if (data.type === "interview_complete") {
          yield { type: "interview_complete", done: true }
        } else if (data.done) {
          yield { type: "done", done: true }
        }
      }
    }
  }
}

export async function startChat(sessionId: string): Promise<ChatEvent> {
  const res = await fetch(`${API_BASE}/api/chat/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message: "" }),
  })
  return res.json()
}

export function submitAnswer(sessionId: string, message: string): AsyncGenerator<ChatEvent> {
  return streamSSE(`${API_BASE}/api/chat/answer`, { session_id: sessionId, message })
}

export function streamReport(sessionId: string): AsyncGenerator<ChatEvent> {
  return streamSSE(`${API_BASE}/api/report/generate`, { session_id: sessionId })
}

export async function saveReport(sessionId: string, report: unknown): Promise<void> {
  await fetch(`${API_BASE}/api/report/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, report }),
  })
}

export async function getReportHistory(): Promise<{ reports: unknown[] }> {
  const res = await fetch(`${API_BASE}/api/report/history`)
  return res.json()
}

export async function injectDummyReport(): Promise<{ status: string; session_id: string }> {
  const res = await fetch(`${API_BASE}/api/report/inject_dummy`, {
    method: "POST",
  })
  return res.json()
}
