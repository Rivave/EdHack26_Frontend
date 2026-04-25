export type UserRole = 'docente' | 'alumno'

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
  courses: string[]
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  courses: string[]
}

export const AVAILABLE_COURSES = [
  { id: 'matematica', label: 'Matemática' },
]
