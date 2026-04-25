import { useState } from 'react'
import { ONBOARDING_QUESTIONS } from '../../config/onboardingQuestions'
import type { InterestAnswers } from '../../types/student'

interface Props {
  studentName: string
  onComplete: (answers: InterestAnswers) => void
}

export default function OnboardingForm({ studentName, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<InterestAnswers>({})
  const [animating, setAnimating] = useState(false)

  const total = ONBOARDING_QUESTIONS.length
  const current = ONBOARDING_QUESTIONS[step]
  const currentAnswer = answers[current.id] ?? ''
  const isLast = step === total - 1

  const goNext = () => {
    if (!currentAnswer.trim()) return
    if (isLast) {
      onComplete(answers)
      return
    }
    setAnimating(true)
    setTimeout(() => {
      setStep((s) => s + 1)
      setAnimating(false)
    }, 180)
  }

  const goBack = () => {
    if (step === 0) return
    setAnimating(true)
    setTimeout(() => {
      setStep((s) => s - 1)
      setAnimating(false)
    }, 180)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      goNext()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-2xl mb-4">
            <span className="text-2xl">👋</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Hola, {studentName.split(' ')[0]}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Antes de empezar, quiero conocerte un poco mejor
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-6">
          {ONBOARDING_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-indigo-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div
          className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-7 transition-opacity duration-180 ${
            animating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            Pregunta {step + 1} de {total}
          </p>
          <h2 className="text-lg font-medium text-gray-800 mb-4 leading-snug">
            {current.question}
          </h2>
          <textarea
            key={current.id}
            value={currentAnswer}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [current.id]: e.target.value }))
            }
            onKeyDown={handleKeyDown}
            placeholder={current.placeholder}
            rows={4}
            autoFocus
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition"
          />
          <p className="text-xs text-gray-300 mt-1.5">
            Enter para continuar · Shift+Enter para nueva línea
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-4">
          {step > 0 && (
            <button
              onClick={goBack}
              className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm font-medium hover:border-gray-300 transition-colors"
            >
              ← Anterior
            </button>
          )}
          <button
            onClick={goNext}
            disabled={!currentAnswer.trim()}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentAnswer.trim()
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {isLast ? '¡Listo, empecemos! →' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  )
}
