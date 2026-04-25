import type { Milestone } from '../../types/student'

interface Props {
  milestone: Milestone
  onOpenChat: () => void
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    dot: 'bg-gray-300',
    badge: 'bg-gray-100 text-gray-500',
    ring: 'border-gray-200',
    numberBg: 'bg-gray-100 text-gray-400',
  },
  'in-progress': {
    label: 'En curso',
    dot: 'bg-indigo-500 animate-pulse',
    badge: 'bg-indigo-50 text-indigo-600',
    ring: 'border-indigo-200',
    numberBg: 'bg-indigo-600 text-white',
  },
  completed: {
    label: 'Completado',
    dot: 'bg-green-500',
    badge: 'bg-green-50 text-green-600',
    ring: 'border-green-200',
    numberBg: 'bg-green-500 text-white',
  },
}

export default function MilestoneCard({ milestone, onOpenChat }: Props) {
  const cfg = statusConfig[milestone.status]

  return (
    <div className={`bg-white rounded-2xl border ${cfg.ring} p-5 flex gap-4 transition-shadow hover:shadow-sm`}>
      {/* Number */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${cfg.numberBg}`}>
        {milestone.status === 'completed' ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          milestone.order
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-800">{milestone.title}</h3>
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">{milestone.description}</p>

        {milestone.status === 'in-progress' && (
          <button
            onClick={onOpenChat}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            Continuar con el asistente
          </button>
        )}

        {milestone.status === 'completed' && (
          <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ¡Hito completado!
          </span>
        )}

        {milestone.status === 'pending' && (
          <span className="text-xs text-gray-400">Disponible próximamente</span>
        )}
      </div>
    </div>
  )
}
