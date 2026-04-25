import type { OnboardingQuestion } from '../types/student'

// Reemplazar estas preguntas con las definitivas cuando estén listas
export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'passions',
    question: '¿Qué cosas o actividades te apasionan en tu vida cotidiana?',
    placeholder: 'Por ejemplo: música, deportes, tecnología, cocina...',
    type: 'textarea',
  },
  {
    id: 'curiosity',
    question: '¿Hay algún problema o fenómeno del mundo real que te genere curiosidad y quieras entender mejor?',
    placeholder: 'Por ejemplo: cómo funcionan los algoritmos, por qué los precios suben, cómo se predice el clima...',
    type: 'textarea',
  },
  {
    id: 'math_vision',
    question: '¿Cómo te imaginas usando la matemática fuera del aula?',
    placeholder: 'Cuéntame con tus palabras, no hay respuestas correctas o incorrectas.',
    type: 'textarea',
  },
]
