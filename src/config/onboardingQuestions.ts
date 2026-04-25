import type { OnboardingQuestion } from '../types/student'

// Reemplazar estas preguntas con las definitivas cuando estén listas
export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'passions',
    question: 'Escribe 3 intereses que te apasionen\nEjemplo: Fútbol , pintura en oleo, inversiones.',
    placeholder: 'Escribe tus 3 intereses separados por comas.',
    type: 'textarea',
  },
]
