export type ChatRole = 'assistant' | 'user' | 'system'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  timestamp: string
  suggestions?: string[]
}

export interface ChatbotWidgetProps {
  title?: string
  subtitle?: string
  welcomeMessage?: string
  initialPrompts?: string[]
  defaultOpen?: boolean
  onSendMessage?: (message: string) => Promise<string | void> | string | void
  className?: string
}
