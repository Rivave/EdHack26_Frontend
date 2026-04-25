export interface TeacherFeedback {
  id: string
  message: string
  createdAt: string
}

export const feedbackStorageKey = (studentId: string) => `edhack_teacher_feedback_${studentId}`

export const loadTeacherFeedback = (studentId: string): TeacherFeedback[] => {
  const saved = localStorage.getItem(feedbackStorageKey(studentId))
  if (!saved) return []

  try {
    return JSON.parse(saved) as TeacherFeedback[]
  } catch {
    return []
  }
}

export const saveTeacherFeedback = (studentId: string, feedback: TeacherFeedback[]) => {
  localStorage.setItem(feedbackStorageKey(studentId), JSON.stringify(feedback))
}
