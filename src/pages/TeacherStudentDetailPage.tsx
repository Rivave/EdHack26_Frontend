import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MILESTONES } from '../config/milestones'
import {
  getProgress,
  getSequentialCompletedIds,
  loadStudentProgress,
} from '../config/studentProgress'
import { loadStudentDocuments } from '../types/documents'
import {
  loadTeacherFeedback,
  saveTeacherFeedback,
  type TeacherFeedback,
} from '../types/feedback'
import thinkmathLogo from '../assets/thinkmath_logo.jpeg'

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  )
}

export default function TeacherStudentDetailPage() {
  const { studentId } = useParams()
  const { user, logout } = useAuth()
  const [feedbackText, setFeedbackText] = useState('')
  const [feedback, setFeedback] = useState<TeacherFeedback[]>(() =>
    studentId ? loadTeacherFeedback(studentId) : []
  )

  useEffect(() => {
    if (!studentId) return
    saveTeacherFeedback(studentId, feedback)
  }, [feedback, studentId])

  if (!user || !studentId) return null
  if (user.role !== 'docente') return <Navigate to="/dashboard" replace />

  const student = loadStudentProgress().find((item) => item.id === studentId)
  if (!student) return <Navigate to="/dashboard" replace />

  const completedIds = getSequentialCompletedIds(student.completedMilestoneIds)
  const progress = getProgress(completedIds)
  const documents = loadStudentDocuments(student.id)
  const documentCount =
    (documents.workPlan ? 1 : 0) +
    documents.drafts.length +
    (documents.finalSubmission ? 1 : 0) +
    documents.annexes.length

  const sendFeedback = () => {
    const message = feedbackText.trim()
    if (!message) return

    setFeedback((current) => [
      {
        id: crypto.randomUUID(),
        message,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ])
    setFeedbackText('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src={thinkmathLogo}
              alt="ThinkMath"
              className="h-9 w-auto object-contain"
            />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold leading-none text-gray-800">{user.name}</p>
              <p className="mt-1 text-xs text-gray-400">Detalle del alumno</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
            >
              Volver
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

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-500">
            Alumno
          </p>
          <h1 className="text-2xl font-semibold text-gray-800">{student.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{student.email}</p>
        </div>

        <section className="mb-6 grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Datos</p>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Nombre</p>
                <p className="font-semibold text-gray-800">{student.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Correo</p>
                <p className="font-semibold text-gray-800">{student.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Documentos registrados</p>
                <p className="font-semibold text-gray-800">{documentCount}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Progreso</p>
              <span className="text-sm font-semibold text-indigo-600">{progress}%</span>
            </div>
            <div className="mb-4 h-2 rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {MILESTONES.map((milestone) => {
                const isCompleted = completedIds.includes(milestone.id)

                return (
                  <div
                    key={milestone.id}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${
                      isCompleted
                        ? 'border-green-100 bg-green-50 text-green-700'
                        : 'border-gray-100 bg-gray-50 text-gray-500'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                        isCompleted ? 'bg-green-500 text-white' : 'bg-white text-gray-400'
                      }`}
                    >
                      {isCompleted ? <CheckIcon /> : <XIcon />}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        {milestone.order}. {milestone.title}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {isCompleted ? 'Completado' : 'Pendiente'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Archivos y enlaces</h2>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {documentCount} recurso{documentCount === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {documents.workPlan && (
              <a href={documents.workPlan.url} target="_blank" rel="noreferrer" className="rounded-xl bg-gray-50 p-3 text-sm hover:bg-indigo-50">
                <p className="font-semibold text-gray-800">Plan de trabajo</p>
                <p className="truncate text-xs text-gray-400">{documents.workPlan.url}</p>
              </a>
            )}
            {documents.drafts.map((draft, index) => (
              <a key={draft.id} href={draft.url} target="_blank" rel="noreferrer" className="rounded-xl bg-gray-50 p-3 text-sm hover:bg-indigo-50">
                <p className="font-semibold text-gray-800">Borrador #{index + 1}</p>
                <p className="truncate text-xs text-gray-400">{draft.url}</p>
              </a>
            ))}
            {documents.finalSubmission && (
              <div className="rounded-xl bg-gray-50 p-3 text-sm">
                <p className="font-semibold text-gray-800">Entrega final</p>
                <p className="truncate text-xs text-gray-400">
                  {documents.finalSubmission.name} · {formatFileSize(documents.finalSubmission.size)}
                </p>
              </div>
            )}
            {documents.annexes.map((annex, index) => (
              <a key={annex.id} href={annex.url} target="_blank" rel="noreferrer" className="rounded-xl bg-gray-50 p-3 text-sm hover:bg-indigo-50">
                <p className="font-semibold text-gray-800">Anexo #{index + 1}</p>
                <p className="truncate text-xs text-gray-400">{annex.url}</p>
              </a>
            ))}
          </div>

          {documentCount === 0 && (
            <p className="rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-400">
              Este alumno aun no tiene documentos registrados.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Feedback</h2>
          <div className="mt-4">
            <textarea
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value)}
              rows={4}
              placeholder="Escribe una observacion clara para que el alumno pueda corregir o avanzar..."
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="button"
              onClick={sendFeedback}
              disabled={!feedbackText.trim()}
              className={`mt-3 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                feedbackText.trim()
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'cursor-not-allowed bg-gray-100 text-gray-300'
              }`}
            >
              Enviar feedback
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {feedback.map((item) => (
              <article key={item.id} className="rounded-xl bg-gray-50 p-4">
                <p className="whitespace-pre-wrap text-sm text-gray-700">{item.message}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </article>
            ))}
            {feedback.length === 0 && (
              <p className="rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-400">
                Todavia no has enviado feedback a este alumno.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
