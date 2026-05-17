"use client"

import { createContext, useContext, useReducer, ReactNode } from "react"
import { SessionState, ProfileData } from "@/types"

type SessionAction =
  | { type: "SET_SESSION_ID"; payload: string }
  | { type: "SET_STEP"; payload: { step: 1 | 2 | 3 | 4; direction: "left" | "right" } }
  | { type: "SELECT_FIELD"; payload: string }
  | { type: "SET_PROFILE"; payload: ProfileData }

const initialState: SessionState = {
  sessionId: null,
  currentStep: 1,
  direction: "right",
  selectedField: null,
  profile: null,
}

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "SET_SESSION_ID":
      return { ...state, sessionId: action.payload }
    case "SET_STEP":
      return { ...state, currentStep: action.payload.step, direction: action.payload.direction }
    case "SELECT_FIELD":
      return { ...state, selectedField: action.payload }
    case "SET_PROFILE":
      return { ...state, profile: action.payload }
    default:
      return state
  }
}

const SessionContext = createContext<{
  state: SessionState
  dispatch: React.Dispatch<SessionAction>
} | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState)
  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error("useSession must be used within SessionProvider")
  return ctx
}
