export interface ProfileData {
  class10Percentage: number
  stream12: "Science" | "Commerce" | "Arts"
  class12Percentage: number
  entranceExam: string
  entranceScore: number
  currentEducation: string
  college?: string
  location: string
  languages: string[]
  extracurricular: string[]
  favoriteSubjects: string[]
  hobbiesAndInterests: string[]
  workStylePreference: string
  careerValues: string[]
  biggestWorry: string
}

export interface SessionState {
  sessionId: string | null
  currentStep: 1 | 2 | 3 | 4
  direction: "left" | "right"
  selectedField: string | null
  profile: ProfileData | null
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

export interface ChatState {
  messages: Message[]
  isStreaming: boolean
  streamingContent: string
}

export interface CareerPath {
  rank: number
  title: string
  fit_score: number
  why: string
  roadmap: { phase: string; steps: string[] }[]
  indian_context: {
    exams: string[]
    target_companies: string[]
    avg_salary_range: string
  }
}

export interface Report {
  top_3_paths: CareerPath[]
  summary: string
  disclaimer: string
}
