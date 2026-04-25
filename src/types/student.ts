export interface InterestAnswers {
  [questionId: string]: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface OnboardingQuestion {
  id: string
  question: string
  placeholder: string
  type: 'textarea' | 'text'
}

export type MilestoneStatus = 'pending' | 'in-progress' | 'completed'

export interface Milestone {
  id: string
  order: number
  title: string
  description: string
  status: MilestoneStatus
}
