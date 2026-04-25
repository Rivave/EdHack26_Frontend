import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loadTeacherFeedback } from '../types/feedback'

export default function StudentFeedbackPage() {
  const { user, logout } = useAuth()

  if (!user) return null
  if (user.role !== 'alumno') return <Navigate to="/dashboard" replace />

  const feedback = loadTeacherFeedback(user.id)

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
              <p className="mt-0.5 text-xs text-gray-400">Feedback</p>
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
            Revision docente
          </p>
          <h1 className="text-2xl font-semibold text-gray-800">Feedback recibido</h1>
          <p className="mt-1 text-sm text-gray-500">
            Revisa las observaciones del profesor y usalas para corregir tus avances.
          </p>
        </div>

        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="space-y-3">
            {feedback.map((item) => (
              <article key={item.id} className="rounded-xl bg-gray-50 p-4">
                <p className="whitespace-pre-wrap text-sm text-gray-700">{item.message}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </article>
            ))}

            {feedback.length === 0 && (
              <p className="rounded-xl bg-gray-50 px-3 py-4 text-sm text-gray-400">
                Aun no tienes feedback del profesor.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
