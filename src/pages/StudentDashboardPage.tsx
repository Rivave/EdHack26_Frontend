import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import OnboardingForm from '../components/student/OnboardingForm'
import ChatView from '../components/student/ChatView'
import MilestoneCard from '../components/student/MilestoneCard'
import { MILESTONES } from '../config/milestones'
import { AVAILABLE_COURSES } from '../types/auth'
import type { InterestAnswers } from '../types/student'
import ianImage from '../assets/coach-think-ib-roshi.jpeg'
import thinkmathLogo from '../assets/thinkmath_logo.jpeg'

const storageKey = (userId: string) => `edhack_onboarding_${userId}`

const courseLabel = (id: string) =>
  AVAILABLE_COURSES.find((course) => course.id === id)?.label ?? id

export default function StudentDashboardPage() {
  const { user, logout } = useAuth()

  const [interests, setInterests] = useState<InterestAnswers | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  // Tracks whether onboarding was just completed in this session
  const [justOnboarded, setJustOnboarded] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!user) return
    const saved = localStorage.getItem(storageKey(user.id))
    if (saved) {
      try {
        setInterests(JSON.parse(saved) as InterestAnswers)
      } catch {
        // dato corrupto, mostrar formulario de nuevo
      }
    }
    setLoaded(true)
  }, [user])

  if (!user || !loaded) return null

  // Primera vez: mostrar formulario de onboarding
  if (!interests) {
    const handleOnboardingComplete = (answers: InterestAnswers) => {
      localStorage.setItem(storageKey(user.id), JSON.stringify(answers))
      setInterests(answers)
      setJustOnboarded(true)
      setChatOpen(true)
    }
    return <OnboardingForm studentName={user.name} onComplete={handleOnboardingComplete} />
  }

  // A partir de la segunda vez (o justo después del onboarding): mostrar dashboard
  const studentMilestones = MILESTONES.map((milestone) => ({
    ...milestone,
    status: milestone.order === 1 ? 'completed' as const : milestone.status,
  }))
  const completedCount = studentMilestones.filter((m) => m.status === 'completed').length
  const progressPct = Math.round((completedCount / MILESTONES.length) * 100)
  const courseName = user.courses.map(courseLabel).join(', ') || 'Curso'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={thinkmathLogo}
              alt="ThinkMath"
              className="h-8 w-auto object-contain"
            />
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-semibold text-indigo-600 select-none">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 leading-none">{user.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{courseName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            {justOnboarded ? `¡Bienvenido, ${user.name.split(' ')[0]}!` : `Hola, ${user.name.split(' ')[0]}`}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {justOnboarded
              ? 'Tu asistente ya está listo para ayudarte a elegir tu tema.'
              : `Aquí puedes ver tu avance en el curso de ${courseName}.`}
          </p>
          <Link
            to="/documents"
            className="mt-4 inline-flex rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
          >
            Ir a documentos
          </Link>
          <Link
            to="/feedback"
            className="ml-2 mt-4 inline-flex rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-600 ring-1 ring-gray-200 transition-colors hover:bg-gray-50"
          >
            Ver feedback
          </Link>
        </div>

        {/* Progress summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Progreso general</p>
            <p className="text-sm font-semibold text-indigo-600">{progressPct}%</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {completedCount} de {MILESTONES.length} {MILESTONES.length === 1 ? 'hito completado' : 'hitos completados'}
          </p>
        </div>

        {/* Milestones */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Hitos</h2>
          <div className="space-y-3">
            {studentMilestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                onOpenChat={() => setChatOpen(true)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Profesor IAN floating button */}
      {!chatOpen && (
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          aria-label="Abrir Profesor IAN"
          className="group fixed bottom-5 right-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full border border-white/80 bg-white py-2 pl-2 pr-4 text-left shadow-xl ring-1 ring-indigo-100 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 active:scale-95 sm:bottom-6 sm:right-6"
        >
          <span className="flex h-14 w-14 flex-shrink-0 items-start justify-center overflow-hidden rounded-full bg-indigo-50 ring-2 ring-indigo-100">
            <img
              src={ianImage}
              alt=""
              className="h-full w-full object-cover"
            />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-sm font-semibold leading-tight text-gray-900">
              Profesor IAN
            </span>
            <span className="text-xs font-medium leading-tight text-indigo-600">
              Abre tu guía
            </span>
          </span>
        </button>
      )}

      {/* Chat panel overlay */}
      {chatOpen && (
        <>
          {/* Backdrop (mobile) */}
          <div
            className="fixed inset-0 bg-black/30 z-30 sm:hidden"
            onClick={() => setChatOpen(false)}
          />

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] shadow-2xl flex flex-col">
            <ChatView
              studentName={user.name}
              courseName={courseName}
              interests={interests}
              onClose={() => setChatOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  )
}
