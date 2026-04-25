import { useEffect, useState } from 'react'
import {
  loadStudentDocuments,
  saveStudentDocuments,
  type LinkDocument,
  type UploadedFile,
} from '../../types/documents'

interface Props {
  userId: string
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const toUploadedFile = (file: File): UploadedFile => ({
  id: crypto.randomUUID(),
  name: file.name,
  size: file.size,
  uploadedAt: new Date().toISOString(),
})

const toLinkDocument = (url: string, fallbackTitle: string): LinkDocument => ({
  id: crypto.randomUUID(),
  title: fallbackTitle,
  url,
  submittedAt: new Date().toISOString(),
})

function LinkIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H15a3 3 0 010 6h-2m-3 0H8.5a3 3 0 010-6h2M9 12h6" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16.5V19a1 1 0 001 1h14a1 1 0 001-1v-2.5" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
    </svg>
  )
}

function LinkSummary({ document }: { document: LinkDocument }) {
  return (
    <a
      href={document.url}
      target="_blank"
      rel="noreferrer"
      className="flex min-w-0 items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 transition-colors hover:bg-indigo-50"
    >
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-indigo-500">
        <LinkIcon />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-gray-700">{document.title}</p>
        <p className="truncate text-[11px] text-gray-400">{document.url}</p>
      </div>
    </a>
  )
}

function FileSummary({ file }: { file: UploadedFile }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-gray-400">
        <FileIcon />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-gray-700">{file.name}</p>
        <p className="text-[11px] text-gray-400">
          {formatFileSize(file.size)} · {new Date(file.uploadedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

function LinkInput({
  label,
  placeholder,
  onSubmit,
  compact = false,
}: {
  label: string
  placeholder: string
  onSubmit: (url: string) => void
  compact?: boolean
}) {
  const [url, setUrl] = useState('')

  const submit = () => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) return
    onSubmit(trimmedUrl)
    setUrl('')
  }

  return (
    <div className={compact ? 'space-y-2' : 'flex flex-col gap-2 sm:flex-row'}>
      <input
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            submit()
          }
        }}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <button
        type="button"
        onClick={submit}
        disabled={!url.trim()}
        className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors ${
          compact ? 'w-full px-3 py-2 text-xs' : 'px-3 py-2 text-sm'
        } ${
          url.trim()
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'cursor-not-allowed bg-gray-100 text-gray-300'
        }`}
      >
        <LinkIcon />
        {label}
      </button>
    </div>
  )
}

function FinalUploadButton({ file, onUpload }: { file: UploadedFile | null; onUpload: (file: File) => void }) {
  return (
    <label
      htmlFor="final-submission-upload"
      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
    >
      <UploadIcon />
      {file ? 'Reemplazar entrega final' : 'Subir entrega final'}
      <input
        id="final-submission-upload"
        type="file"
        className="sr-only"
        onChange={(event) => {
          const uploadedFile = event.target.files?.[0]
          if (!uploadedFile) return
          onUpload(uploadedFile)
          event.target.value = ''
        }}
      />
    </label>
  )
}

export default function DocumentUploadSection({ userId }: Props) {
  const [documents, setDocuments] = useState(() => loadStudentDocuments(userId))

  useEffect(() => {
    saveStudentDocuments(userId, documents)
  }, [documents, userId])

  const upsertWorkPlan = (url: string) => {
    setDocuments((current) => ({
      ...current,
      workPlan: toLinkDocument(url, 'Plan de trabajo'),
    }))
  }

  const upsertDraft = (index: number, url: string) => {
    setDocuments((current) => {
      const drafts = [...current.drafts]
      drafts[index] = toLinkDocument(url, `Borrador #${index + 1}`)

      return {
        ...current,
        drafts,
      }
    })
  }

  const upsertFinalSubmission = (file: File) => {
    setDocuments((current) => ({
      ...current,
      finalSubmission: toUploadedFile(file),
    }))
  }

  const addAnnex = (url: string) => {
    setDocuments((current) => ({
      ...current,
      annexes: [...current.annexes, toLinkDocument(url, `Anexo #${current.annexes.length + 1}`)],
    }))
  }

  const draftSlots = [...documents.drafts, null]
  const submittedCount =
    (documents.workPlan ? 1 : 0) +
    documents.drafts.length +
    (documents.finalSubmission ? 1 : 0) +
    documents.annexes.length

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Documentos</h2>
          <p className="mt-1 text-sm text-gray-500">
            Registra enlaces compartidos para tus avances. Solo la entrega final se sube como archivo.
          </p>
        </div>
        <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
          {submittedCount} recurso{submittedCount === 1 ? '' : 's'} registrado{submittedCount === 1 ? '' : 's'}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 p-4">
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-800">Plan de trabajo</p>
            <p className="mt-1 text-xs text-gray-400">Pega el enlace compartido del documento.</p>
          </div>
          {documents.workPlan && <LinkSummary document={documents.workPlan} />}
          <div className={documents.workPlan ? 'mt-3' : ''}>
            <LinkInput
              label={documents.workPlan ? 'Reemplazar enlace' : 'Guardar enlace'}
              placeholder="https://docs.google.com/..."
              onSubmit={upsertWorkPlan}
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 p-4">
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-800">Entrega final</p>
            <p className="mt-1 text-xs text-gray-400">Esta es la unica seccion que recibe archivo.</p>
          </div>
          {documents.finalSubmission && <FileSummary file={documents.finalSubmission} />}
          <div className={documents.finalSubmission ? 'mt-3' : ''}>
            <FinalUploadButton file={documents.finalSubmission} onUpload={upsertFinalSubmission} />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-gray-100 p-4">
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-800">Borradores</p>
          <p className="mt-1 text-xs text-gray-400">
            Al registrar un borrador, se habilita el siguiente.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {draftSlots.map((draft, index) => {
            const draftNumber = index + 1

            return (
              <div key={draft?.id ?? `draft-slot-${draftNumber}`} className="rounded-lg border border-gray-100 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-gray-700">Borrador #{draftNumber}</p>
                </div>

                {draft && <LinkSummary document={draft} />}
                <div className={draft ? 'mt-3' : ''}>
                  <LinkInput
                    label={draft ? 'Reemplazar' : `Guardar borrador #${draftNumber}`}
                    placeholder="https://docs.google.com/..."
                    compact
                    onSubmit={(url) => upsertDraft(index, url)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-gray-100 p-4">
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-800">Anexos</p>
          <p className="mt-1 text-xs text-gray-400">
            Enlaces a datos recolectados, hojas de calculo, evidencias u otros recursos.
          </p>
        </div>

        <LinkInput
          label="Agregar anexo"
          placeholder="https://drive.google.com/..."
          onSubmit={addAnnex}
        />

        {documents.annexes.length > 0 ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {documents.annexes.map((annex) => (
              <LinkSummary key={annex.id} document={annex} />
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-400">
            Aun no has agregado anexos. Esta parte es opcional.
          </p>
        )}
      </div>
    </section>
  )
}
