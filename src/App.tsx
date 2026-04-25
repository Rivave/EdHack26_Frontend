import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { ReactElement } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import StudentDashboardPage from './pages/StudentDashboardPage'
import StudentDocumentsPage from './pages/StudentDocumentsPage'
import StudentFeedbackPage from './pages/StudentFeedbackPage'
import TeacherStudentDetailPage from './pages/TeacherStudentDetailPage'

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: ReactElement }) {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleRouter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <StudentDocumentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <ProtectedRoute>
            <StudentFeedbackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students/:studentId"
        element={
          <ProtectedRoute>
            <TeacherStudentDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function RoleRouter() {
  const { user } = useAuth()
  if (user?.role === 'alumno') return <StudentDashboardPage />
  return <DashboardPage />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
