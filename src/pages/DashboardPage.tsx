import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MILESTONES } from '../config/milestones'
import { AVAILABLE_COURSES } from '../types/auth'
import {
  getProgress,
  getSequentialCompletedIds,
  loadStudentProgress,
  saveStudentProgress,
  type StudentProgress,
} from '../config/studentProgress'
import thinkmathLogo from '../assets/thinkmath_logo.jpeg'

const courseLabel = (id: string) =>
  AVAILABLE_COURSES.find((course) => course.id === id)?.label ?? id

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0L3.296 9.22a1 1 0 111.414-1.414l4.034 4.035 6.546-6.547a1 1 0 011.414-.003z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  )
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [students, setStudents] = useState<StudentProgress[]>(loadStudentProgress)

  useEffect(() => {
    saveStudentProgress(students)
  }, [students])

  const toggleMilestone = (studentId: string, milestoneId: string) => {
    setStudents((current) =>
      current.map((student) => {
        if (student.id !== studentId) return student

        const milestone = MILESTONES.find((item) => item.id === milestoneId)
        if (!milestone) return student

        const completedIds = getSequentialCompletedIds(student.completedMilestoneIds)
        const isCompleted = completedIds.includes(milestoneId)

        if (isCompleted) {
          return {
            ...student,
            completedMilestoneIds: completedIds.filter((id) => {
              const item = MILESTONES.find((candidate) => candidate.id === id)
              return item ? item.order < milestone.order : false
            }),
          }
        }

        const nextMilestone = MILESTONES[completedIds.length]
        const canApprove = milestone.order > 1 && nextMilestone?.id === milestoneId
        if (!canApprove) return student

        return {
          ...student,
          completedMilestoneIds: [...completedIds, milestoneId],
        }
      })
    )
  }

  const averageProgress = Math.round(
    students.reduce((total, student) => total + getProgress(student.completedMilestoneIds), 0) / students.length
  )
  const completedStudents = students.filter(
    (student) => student.completedMilestoneIds.length === MILESTONES.length
  ).length
  const totalCompletedMilestones = students.reduce(
    (total, student) => total + student.completedMilestoneIds.length,
    0
  )
  const totalMilestones = students.length * MILESTONES.length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src={thinkmathLogo}
              alt="ThinkMath"
              className="h-9 w-auto object-contain"
            />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
              {user?.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold leading-none text-gray-800">{user?.name}</p>
              <p className="mt-1 text-xs text-gray-400">Docente</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="rounded-lg px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-500">
              Dashboard docente
            </p>
            <h1 className="text-2xl font-semibold text-gray-800">Progreso del curso</h1>
            <p className="mt-1 text-sm text-gray-500">
              Vista general de avance, hitos y alumnos de {user?.courses.map(courseLabel).join(', ')}.
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-500">
            {students.length} alumnos activos
          </div>
        </div>

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Progreso total</p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">{averageProgress}%</p>
            <div className="mt-3 h-2 rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${averageProgress}%` }} />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Hitos completados</p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">
              {totalCompletedMilestones}/{totalMilestones}
            </p>
            <p className="mt-2 text-sm text-gray-500">Total acumulado del grupo</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Curso</p>
            <p className="mt-3 text-lg font-semibold text-gray-900">
              {user?.courses.map(courseLabel).join(', ')}
            </p>
            <p className="mt-2 text-sm text-gray-500">{MILESTONES.length} hitos configurados</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Finalizados</p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">{completedStudents}</p>
            <p className="mt-2 text-sm text-gray-500">Alumnos con todos los hitos</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <div className="grid gap-3 border-b border-gray-100 px-5 py-4 lg:grid-cols-[220px_220px_1fr]">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Alumno</h2>
            <p className="hidden text-sm font-semibold uppercase tracking-widest text-gray-500 lg:block">
              Progreso
            </p>
            <p className="hidden text-sm font-semibold uppercase tracking-widest text-gray-500 lg:block">
              Hitos
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {students.map((student) => {
              const completedIds = getSequentialCompletedIds(student.completedMilestoneIds)
              const progress = getProgress(completedIds)
              const nextMilestone = MILESTONES[completedIds.length]

              return (
                <article key={student.id} className="p-5">
                  <div className="grid gap-5 lg:grid-cols-[220px_220px_1fr] lg:items-center">
                    <div>
                      <Link
                        to={`/students/${student.id}`}
                        className="text-sm font-semibold text-gray-800 transition-colors hover:text-indigo-600"
                      >
                        {student.name}
                      </Link>
                      <p className="mt-1 text-xs text-gray-400">
                        {completedIds.length} de {MILESTONES.length} hitos completados
                      </p>
                      <Link
                        to={`/students/${student.id}`}
                        className="mt-2 inline-flex text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        Ver detalle
                      </Link>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-500">Avance</span>
                        <span className="font-semibold text-indigo-600">{progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between lg:hidden">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Hitos</p>
                        <p className="text-xs text-gray-400">Click en check para desmarcar</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {MILESTONES.map((milestone) => {
                          const isCompleted = completedIds.includes(milestone.id)
                          const isNext = nextMilestone?.id === milestone.id
                          const canMark = milestone.order > 1 && isNext
                          const canUnmark = milestone.order > 1 && isCompleted
                          const canToggle = canUnmark || canMark
                          const statusLabel = isCompleted
                            ? milestone.order === 1
                              ? 'Completado automaticamente por formulario.'
                              : 'Completado. Click para desmarcar.'
                            : canMark
                              ? 'Siguiente hito disponible. Click para aprobar.'
                              : milestone.order === 1
                                ? 'Se completa automaticamente con el formulario.'
                                : 'Pendiente. Completa los hitos anteriores primero.'

                          return (
                            <button
                              key={milestone.id}
                              type="button"
                              onClick={() => toggleMilestone(student.id, milestone.id)}
                              disabled={!canToggle}
                              className={`group flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                                isCompleted && canUnmark
                                  ? 'border-green-200 bg-green-50 text-green-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                                  : isCompleted
                                    ? 'cursor-not-allowed border-green-200 bg-green-50 text-green-700'
                                  : canMark
                                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                    : 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
                              }`}
                              title={`Hito ${milestone.order}: ${milestone.title}. ${statusLabel}`}
                              aria-label={`Hito ${milestone.order}: ${milestone.title}. ${statusLabel}`}
                            >
                              <span className="sr-only">Hito {milestone.order}</span>
                              {isCompleted ? (
                                <span className={canUnmark ? 'group-hover:hidden' : ''}>
                                  <CheckIcon />
                                </span>
                              ) : (
                                <span className={canMark ? 'text-sm' : ''}>
                                  {canMark ? milestone.order : <XIcon />}
                                </span>
                              )}
                              {canUnmark && (
                                <span className="hidden group-hover:block">
                                  <XIcon />
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                      <p className="mt-2 text-xs text-gray-400">
                        {nextMilestone ? nextMilestone.title : 'curso completado'}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
