interface ChatMessagePart {
  type: 'text'
  text: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content?: string
  parts?: ChatMessagePart[]
}

interface KnowledgeDocument {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  views: number
}
