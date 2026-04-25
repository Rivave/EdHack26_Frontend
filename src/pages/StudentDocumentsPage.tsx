import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DocumentUploadSection from '../components/student/DocumentUploadSection'

export default function StudentDocumentsPage() {
  const { user, logout } = useAuth()

  if (!user) return null
  if (user.role !== 'alumno') return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium leading-none text-gray-800">{user.name}</p>
              <p className="mt-0.5 text-xs text-gray-400">Documentos</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
            >
              Volver al dashboard
            </Link>
            <button
              onClick={logout}
              className="rounded-lg px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-500">
            Entregables
          </p>
          <h1 className="text-2xl font-semibold text-gray-800">Documentos del proyecto</h1>
          <p className="mt-1 text-sm text-gray-500">
            Registra enlaces de tus avances y anexos. Solo la entrega final se sube como archivo.
          </p>
        </div>

        <DocumentUploadSection userId={user.id} />
      </main>
    </div>
  )
}
