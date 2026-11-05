import { mockHRCandidates, type HRCandidate } from './mockHRCandidates'

// Re-export HR types and data with backward-compatible aliases if referenced
export type TutoringSession = HRCandidate & {
  studentName?: string
  subject?: string
  topic?: string
  mentorModel?: string
}

export const mockTutoringSessions = mockHRCandidates.map((c) => ({
  ...c,
  studentName: c.candidateName,
  subject: c.department,
  topic: c.role,
  mentorModel: c.aiInterviewer,
}))
