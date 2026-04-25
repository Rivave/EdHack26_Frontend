export interface LinkDocument {
  id: string
  title: string
  url: string
  submittedAt: string
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  uploadedAt: string
}

export interface StudentDocuments {
  workPlan: LinkDocument | null
  drafts: LinkDocument[]
  finalSubmission: UploadedFile | null
  annexes: LinkDocument[]
}

export const emptyDocuments: StudentDocuments = {
  workPlan: null,
  drafts: [],
  finalSubmission: null,
  annexes: [],
}

export const studentDocumentsStorageKey = (userId: string) => `edhack_student_document_links_${userId}`

export const loadStudentDocuments = (userId: string): StudentDocuments => {
  const saved = localStorage.getItem(studentDocumentsStorageKey(userId))
  if (!saved) return emptyDocuments

  try {
    return { ...emptyDocuments, ...JSON.parse(saved) as StudentDocuments }
  } catch {
    return emptyDocuments
  }
}

export const saveStudentDocuments = (userId: string, documents: StudentDocuments) => {
  localStorage.setItem(studentDocumentsStorageKey(userId), JSON.stringify(documents))
}
