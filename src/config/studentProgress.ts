import { MILESTONES } from './milestones'

export interface StudentProgress {
  id: string
  name: string
  email: string
  completedMilestoneIds: string[]
}

export const progressStorageKey = 'edhack_teacher_student_progress_v3'

export const initialStudents: StudentProgress[] = [
  {
    id: 'st-1',
    name: 'Camila Torres',
    email: 'camila.torres@edhack.local',
    completedMilestoneIds: ['interest-exploration', 'topic-selection', 'work-plan'],
  },
  {
    id: 'st-2',
    name: 'Mateo Ramirez',
    email: 'mateo.ramirez@edhack.local',
    completedMilestoneIds: ['interest-exploration', 'topic-selection'],
  },
  {
    id: 'st-3',
    name: 'Lucia Mendoza',
    email: 'lucia.mendoza@edhack.local',
    completedMilestoneIds: ['interest-exploration'],
  },
  {
    id: 'st-4',
    name: 'Diego Salazar',
    email: 'diego.salazar@edhack.local',
    completedMilestoneIds: [
      'interest-exploration',
      'topic-selection',
      'work-plan',
      'initial-draft',
      'complete-math-development',
    ],
  },
  {
    id: 'st-5',
    name: 'Valeria Chen',
    email: 'valeria.chen@edhack.local',
    completedMilestoneIds: [],
  },
]

export const getProgress = (completedMilestoneIds: string[]) =>
  Math.round((completedMilestoneIds.length / MILESTONES.length) * 100)

export const getSequentialCompletedIds = (completedMilestoneIds: string[]) => {
  const completedSet = new Set(completedMilestoneIds)
  const sequentialIds: string[] = []

  for (const milestone of MILESTONES) {
    if (!completedSet.has(milestone.id)) break
    sequentialIds.push(milestone.id)
  }

  return sequentialIds
}

export const normalizeStudentProgress = (student: StudentProgress): StudentProgress => ({
  ...student,
  completedMilestoneIds: getSequentialCompletedIds(student.completedMilestoneIds),
})

export const loadStudentProgress = () => {
  const saved = localStorage.getItem(progressStorageKey)
  if (!saved) return initialStudents

  try {
    return (JSON.parse(saved) as StudentProgress[]).map(normalizeStudentProgress)
  } catch {
    return initialStudents
  }
}

export const saveStudentProgress = (students: StudentProgress[]) => {
  localStorage.setItem(progressStorageKey, JSON.stringify(students))
}
