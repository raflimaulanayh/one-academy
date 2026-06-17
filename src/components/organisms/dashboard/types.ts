export type CourseModule = {
  id: number
  code: string
  title: string
  lessons: string[]
  pdfUrl: string
  credits: number
  schedule: string
}

export type Assignment = {
  id: number
  title: string
  deadline: string
  status: 'pending' | 'submitted'
  score?: number
}

export type TodoItem = {
  type: 'document' | 'shield' | 'video'
  title: string
  course: string
  date: string
  isUrgent: boolean
}

export type UserData = {
  name: string
  email: string
  tier: 'sd' | 'smp' | 'sma' | 'univ'
  school?: string
}
