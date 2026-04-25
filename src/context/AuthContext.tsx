import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, LoginFormData, RegisterFormData } from '../types/auth'

interface AuthContextType {
  user: User | null
  login: (data: LoginFormData) => Promise<void>
  register: (data: RegisterFormData) => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

// Simulación local hasta conectar con FastAPI
const mockUsers: (User & { password: string })[] = []

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  const login = async (data: LoginFormData) => {
    setError(null)
    const found = mockUsers.find(
      (u) => u.email === data.email && u.password === data.password
    )
    if (!found) {
      setError('Correo o contraseña incorrectos.')
      return
    }
    const { password: _pw, ...userWithoutPassword } = found
    setUser(userWithoutPassword)
  }

  const register = async (data: RegisterFormData) => {
    setError(null)
    if (mockUsers.find((u) => u.email === data.email)) {
      setError('Ya existe una cuenta con ese correo.')
      return
    }
    if (data.password !== data.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (data.courses.length === 0) {
      setError('Debes seleccionar al menos un curso.')
      return
    }
    const newUser = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      courses: data.courses,
    }
    mockUsers.push(newUser)
    const { password: _pw, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
