import type { Milestone } from '../types/student'

export const MILESTONES: Milestone[] = [
  {
    id: 'interest-exploration',
    order: 1,
    title: 'Exploracion de intereses',
    description: 'Completa el formulario inicial para identificar intereses, fortalezas y posibles lineas de investigacion.',
    status: 'pending',
  },
  {
    id: 'topic-selection',
    order: 2,
    title: 'Eleccion de tema',
    description: 'Define un tema claro y viable para desarrollar durante el curso.',
    status: 'pending',
  },
  {
    id: 'work-plan',
    order: 3,
    title: 'Plan de trabajo',
    description: 'Organiza etapas, fuentes, entregables y tiempos para avanzar con orden.',
    status: 'pending',
  },
  {
    id: 'initial-draft',
    order: 4,
    title: 'Borrador inicial',
    description: 'Presenta una primera version de la investigacion con estructura, problema y enfoque matematico.',
    status: 'pending',
  },
  {
    id: 'complete-math-development',
    order: 5,
    title: 'Desarrollo matematico completo',
    description: 'Desarrolla el analisis matematico central con procedimientos, datos y justificacion.',
    status: 'pending',
  },
  {
    id: 'reflection-conclusions',
    order: 6,
    title: 'Reflexion y conclusiones',
    description: 'Formula conclusiones, limitaciones y reflexiones a partir del trabajo realizado.',
    status: 'pending',
  },
  {
    id: 'final-draft',
    order: 7,
    title: 'Borrador final',
    description: 'Entrega una version casi final para revision antes de la entrega definitiva.',
    status: 'pending',
  },
  {
    id: 'submission',
    order: 8,
    title: 'Entrega',
    description: 'Presenta la version final del trabajo para cierre del proceso.',
    status: 'pending',
  },
]
