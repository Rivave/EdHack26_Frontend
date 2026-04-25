import { useState, useRef, useEffect } from 'react'
import type { ChatMessage, InterestAnswers } from '../../types/student'
import { ONBOARDING_QUESTIONS } from '../../config/onboardingQuestions'
import { MILESTONES } from '../../config/milestones'

interface Props {
  studentName: string
  courseName: string
  interests: InterestAnswers
  onClose: () => void
}

interface LLMRequest {
  mode: 'initial' | 'message'
  studentName: string
  courseName: string
  systemContext: string
  onboardingAnswers: InterestAnswers
  onboardingContext: {
    questionId: string
    question: string
    answer: string
  }[]
  milestones: {
    id: string
    order: number
    title: string
    description: string
  }[]
  messages: {
    role: ChatMessage['role']
    content: string
    timestamp: string
  }[]
}

interface LLMResponse {
  reply: string
}

const chatEndpoint = import.meta.env.VITE_LLM_CHAT_URL ?? 'http://localhost:8000/api/chat'

function buildOnboardingContext(interests: InterestAnswers): LLMRequest['onboardingContext'] {
  return ONBOARDING_QUESTIONS.map((question) => ({
    questionId: question.id,
    question: question.question,
    answer: interests[question.id] ?? '',
  }))
}

function buildMilestoneContext(): LLMRequest['milestones'] {
  return MILESTONES.map((milestone) => ({
    id: milestone.id,
    order: milestone.order,
    title: milestone.title,
    description: milestone.description,
  }))
}

function buildSystemContext(interests: InterestAnswers, courseName: string): string {
  const parts = buildOnboardingContext(interests)
    .map((item) => `- ${item.question}\n  Respuesta: ${item.answer || '(sin respuesta)'}`)
    .join('\n')
  const milestones = buildMilestoneContext()
    .map((milestone) => `${milestone.order}. ${milestone.title}: ${milestone.description}`)
    .join('\n')

  return `Eres Coach Think IB, un tutor educativo para el curso ${courseName}. Debes dar feedback util en todo momento durante todo el proceso del proyecto, no solo durante la eleccion del tema. Al inicio ayudas al alumno a explorar intereses y elegir un tema; despues lo acompanas con plan de trabajo, borradores, desarrollo matematico, reflexion, conclusiones, entrega final y anexos. Relaciona tus sugerencias con conceptos matematicos reales, pide aclaraciones cuando falte informacion y da pasos concretos para avanzar al siguiente hito. Responde en espanol de Peru, de manera conversacional y cercana.\n\nHitos del curso:\n${milestones}\n\nIntereses iniciales del alumno:\n${parts}`
}

function serializeMessages(messages: ChatMessage[]): LLMRequest['messages'] {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
    timestamp: message.timestamp.toISOString(),
  }))
}

async function requestLLMReply(
  mode: LLMRequest['mode'],
  studentName: string,
  courseName: string,
  interests: InterestAnswers,
  systemContext: string,
  messages: ChatMessage[]
): Promise<string> {
  const payload: LLMRequest = {
    mode,
    studentName,
    courseName,
    systemContext,
    onboardingAnswers: interests,
    onboardingContext: buildOnboardingContext(interests),
    milestones: buildMilestoneContext(),
    messages: serializeMessages(messages),
  }

  const response = await fetch(chatEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`LLM backend responded with ${response.status}`)
  }

  const data = await response.json() as LLMResponse
  if (!data.reply) {
    throw new Error('LLM backend response is missing reply')
  }

  return data.reply
}

export default function ChatView({ studentName, courseName, interests, onClose }: Props) {
  const systemContext = buildSystemContext(interests, courseName)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    requestLLMReply('initial', studentName, courseName, interests, systemContext, [])
      .then((greeting) => {
        setMessages([{ id: 'init', role: 'assistant', content: greeting, timestamp: new Date() }])
      })
      .catch(() => {
        setMessages([
          {
            id: 'init-error',
            role: 'assistant',
            content: 'No pude conectar con el asistente del backend. Intenta nuevamente en unos segundos.',
            timestamp: new Date(),
          },
        ])
      })
      .finally(() => {
        setLoading(false)
        setTimeout(() => textareaRef.current?.focus(), 50)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    const nextMessages = [...messages, userMsg]

    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const reply = await requestLLMReply('message', studentName, courseName, interests, systemContext, nextMessages)
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'No pude enviar tu mensaje al asistente del backend. Revisa la conexion e intenta otra vez.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`
  }

  const formatContent = (text: string) => {
    return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  }

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <header className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
            IA
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Asistente</p>
            <p className="text-xs text-gray-400">{courseName}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Cerrar chat"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="flex-shrink-0 border-b border-indigo-100 bg-indigo-50 px-4 py-2">
        <p className="text-center text-xs text-indigo-600">
          El asistente recibe tus respuestas e hitos como contexto para darte feedback durante todo el proyecto.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="mr-2 mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
                IA
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-tr-sm bg-indigo-600 text-white'
                  : 'rounded-tl-sm border border-gray-100 bg-white text-gray-700 shadow-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{formatContent(msg.content)}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="mr-2 mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
              IA
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-4 items-center gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={loading ? 'El asistente esta escribiendo...' : 'Escribe tu mensaje... (Enter para enviar)'}
            rows={1}
            disabled={loading}
            className="flex-1 resize-none overflow-hidden rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className={`flex-shrink-0 rounded-xl p-2.5 transition-colors ${
              input.trim() && !loading
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'cursor-not-allowed bg-gray-100 text-gray-300'
            }`}
            aria-label="Enviar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <p className="mt-1.5 text-center text-xs text-gray-300">
          Shift+Enter para nueva linea
        </p>
      </div>
    </div>
  )
}
