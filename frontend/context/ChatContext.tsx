"use client"

import { createContext, useContext, useReducer, ReactNode } from "react"
import { ChatState, Message } from "@/types"

type ChatAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_STREAMING"; payload: boolean }
  | { type: "SET_STREAMING_CONTENT"; payload: string }
  | { type: "APPEND_STREAM_TOKEN"; payload: string }
  | { type: "CLEAR" }

const initialChatState: ChatState = {
  messages: [],
  isStreaming: false,
  streamingContent: "",
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] }
    case "SET_STREAMING":
      return { ...state, isStreaming: action.payload }
    case "SET_STREAMING_CONTENT":
      return { ...state, streamingContent: action.payload }
    case "APPEND_STREAM_TOKEN":
      return { ...state, streamingContent: state.streamingContent + action.payload }
    case "CLEAR":
      return initialChatState
    default:
      return state
  }
}

const ChatContext = createContext<{
  state: ChatState
  dispatch: React.Dispatch<ChatAction>
} | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialChatState)
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChat must be used within ChatProvider")
  return ctx
}
