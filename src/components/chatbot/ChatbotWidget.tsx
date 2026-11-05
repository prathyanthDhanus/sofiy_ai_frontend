import React, { useState, useRef, useEffect } from 'react'
import {
  Bot,
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import type { ChatMessage, ChatbotWidgetProps } from './types'

// Default suggested prompts matching the quick action pills seen in the reference
const DEFAULT_SUGGESTIONS = [
  'Generate interview questions for React Engineer',
  'Show active candidate pipeline summary',
  'Create new job requisition for Marketing Lead',
  'Check retention alerts & high-risk staff',
]

// Simulated intelligent responses based on keywords
function generateBotReply(prompt: string): { reply: string; suggestions?: string[] } {
  const lower = prompt.toLowerCase()

  if (lower.includes('interview') || lower.includes('question')) {
    return {
      reply:
        "Here are 3 tailored AI interview questions for evaluating candidate competencies:\n\n1. Architecture: How do you optimize React server components and client-side hydration for large dashboards?\n2. Behavioral: Describe a scenario where you negotiated technical debt tradeoffs with product managers.\n3. Problem Solving: Walk me through debugging an elusive memory leak in a long-lived SPA session.",
      suggestions: [
        'Save questions to Requisition Pipeline',
        'Schedule AI video interview screening',
      ],
    }
  }

  if (lower.includes('candidate') || lower.includes('pipeline') || lower.includes('summary')) {
    return {
      reply:
        "📊 Current AI Talent Pipeline Overview:\n• 18 Active candidates currently in video screening\n• 5 Shortlisted candidates pending hiring manager approval\n• 3 Offers extended this week\n• Highest match fit: Sofia Al-Mansoor (98% match for Principal Cloud Architect)",
      suggestions: ['View shortlisting candidates', 'Export pipeline to Excel'],
    }
  }

  if (lower.includes('job') || lower.includes('requisition') || lower.includes('create')) {
    return {
      reply:
        "Drafting a new job requisition...\n\nRole: Lead AI Growth Engineer\nDepartment: Engineering & Product\nSuggested Salary Band: $145k - $175k\nAI Match Criteria: PyTorch, FastAPI, React 19, Vector DBs.\n\nWould you like me to publish this to your open positions board?",
      suggestions: ['Confirm & publish job post', 'Edit competency requirements'],
    }
  }

  if (lower.includes('retention') || lower.includes('risk') || lower.includes('alert')) {
    return {
      reply:
        "⚠️ Retention Risk Alert:\n• 3 employees flagged with engagement decline patterns over the past 45 days.\n• Recommended Action: Schedule proactive 1-on-1 check-ins and review compensation calibration benchmarks.",
      suggestions: ['Review compensation benchmark', 'Schedule 1-on-1 check-in'],
    }
  }

  return {
    reply:
      "I understand! I've analyzed your request with Sofiy AI HR models. You can review the updated workforce metrics in the console or ask me to draft policies, candidate scorecards, or automated screening flows.",
    suggestions: [
      'Show candidate pipeline',
      'Generate interview questions',
      'Check retention alerts',
    ],
  }
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  title = 'Sofiy AI – Ihr KI-Assistent',
  subtitle = 'HR Copilot & Candidate Intelligence',
  welcomeMessage = '👋 Hallo! Ich bin Sofiy AI. Wie kann ich heute bei Ihren HR- und Rekrutierungsaufgaben helfen?',
  initialPrompts = DEFAULT_SUGGESTIONS,
  defaultOpen = false,
  onSendMessage,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen)
  const [inputValue, setInputValue] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [isListening, setIsListening] = useState<boolean>(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [hasUnread, setHasUnread] = useState<boolean>(false)

  // Speech recognition instance ref
  const recognitionRef = useRef<unknown>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: 'Just now',
      suggestions: initialPrompts,
    },
  ])

  // Scroll to bottom when messages change or typing
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setHasUnread(false)
    }
  }, [messages, isTyping, isOpen])

  // Setup Web Speech Recognition API if available
  useEffect(() => {
    interface SpeechRecognitionWindow extends Window {
      SpeechRecognition?: new () => {
        continuous: boolean
        interimResults: boolean
        lang: string
        start: () => void
        stop: () => void
        onresult: (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void
        onerror: () => void
        onend: () => void
      }
      webkitSpeechRecognition?: new () => {
        continuous: boolean
        interimResults: boolean
        lang: string
        start: () => void
        stop: () => void
        onresult: (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void
        onerror: () => void
        onend: () => void
      }
    }

    const win = window as unknown as SpeechRecognitionWindow
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition

    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputValue(transcript)
      }

      recognition.onerror = () => {
        setIsListening(false)
        toast.error('Voice input error', {
          description: 'Could not access microphone or recognize speech.',
        })
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [])

  // Audio Recording Toggle
  const toggleListening = () => {
    if (isListening) {
      if (
        recognitionRef.current &&
        typeof (recognitionRef.current as { stop: () => void }).stop === 'function'
      ) {
        ;(recognitionRef.current as { stop: () => void }).stop()
      }
      setIsListening(false)
      toast.info('Voice input stopped')
    } else {
      if (
        recognitionRef.current &&
        typeof (recognitionRef.current as { start: () => void }).start === 'function'
      ) {
        try {
          ;(recognitionRef.current as { start: () => void }).start()
          setIsListening(true)
          toast.success('Listening...', {
            description: 'Speak your prompt into the microphone.',
          })
        } catch {
          setIsListening(false)
        }
      } else {
        // Fallback simulation for unsupported browsers/environments
        setIsListening(true)
        toast.info('Voice input active (Simulation)', {
          description: 'Web Speech API is emulated. Transcribing voice query...',
        })
        const timer = setTimeout(() => {
          setInputValue('Show active candidate pipeline summary')
          setIsListening(false)
          toast.success('Voice captured!')
        }, 2200)
        return () => clearTimeout(timer)
      }
    }
  }

  // Handle Sending a Message
  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim()
    if (!text || isTyping) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      if (onSendMessage) {
        const customReply = await onSendMessage(text)
        if (customReply) {
          const botMessage: ChatMessage = {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            content: customReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
          setMessages((prev) => [...prev, botMessage])
          setIsTyping(false)
          return
        }
      }

      // Default smart response simulation with realistic delay
      setTimeout(() => {
        const { reply, suggestions } = generateBotReply(text)
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions,
        }
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
        if (!isOpen) {
          setHasUnread(true)
        }
      }, 750)
    } catch {
      setIsTyping(false)
      toast.error('Failed to get AI response')
    }
  }

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend()
  }

  // Reset Conversation
  const handleReset = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: welcomeMessage,
        timestamp: 'Just now',
        suggestions: initialPrompts,
      },
    ])
    toast.info('Chat history cleared')
  }

  // Copy Message
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <aside
      aria-label="Sofiy AI Chatbot Assistant"
      className={`fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none ${className}`}
    >
      {/* 1. Chat Window Container */}
      {isOpen && (
        <section
          aria-label="Chat Dialog Window"
          className="pointer-events-auto mb-3 w-[360px] sm:w-[410px] h-[580px] max-h-[82vh] bg-card text-card-foreground border border-border/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200 ring-1 ring-black/5 dark:ring-white/10"
        >
          {/* Header matching the reference styling blended with Sofiy AI Yellow Theme */}
          <div className="bg-gradient-to-r from-[#D8A721] via-[#E8B931] to-amber-500 p-3.5 text-zinc-950 flex items-center justify-between shrink-0 shadow-sm border-b border-[#E8B931]/30">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <Avatar className="w-9 h-9 rounded-full ring-2 ring-zinc-950/20 shadow-md">
                  <AvatarFallback className="bg-zinc-950 text-[#E8B931] font-bold">
                    <Bot className="w-5 h-5 text-[#E8B931]" />
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#E8B931]" />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-sm tracking-tight truncate leading-tight text-zinc-950">
                    {title}
                  </h2>
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1.5 py-0 h-4 border-zinc-950/30 text-zinc-950 bg-zinc-950/10 shrink-0 uppercase tracking-wider font-bold"
                  >
                    AI
                  </Badge>
                </div>
                <p className="text-[11px] text-zinc-900/80 truncate font-medium">
                  {subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="h-7 w-7 text-zinc-950/80 hover:text-zinc-950 hover:bg-zinc-950/15 rounded-lg cursor-pointer transition-colors"
                    aria-label="Clear conversation history"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Clear conversation
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-7 w-7 text-zinc-950/80 hover:text-zinc-950 hover:bg-zinc-950/15 rounded-lg cursor-pointer transition-colors"
                    aria-label="Close chat window"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Close chat
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* 2. Message History Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 scroll-smooth">
            {messages.map((msg) => {
              const isUser = msg.role === 'user'

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div
                    className={`flex items-end gap-2 max-w-[88%] ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {!isUser && (
                      <Avatar className="w-6 h-6 rounded-full shrink-0 mb-1 border border-border/60">
                        <AvatarFallback className="bg-gradient-to-tr from-[#E8B931] to-amber-600 text-zinc-950 font-bold text-[10px]">
                          <Sparkles className="w-3 h-3 text-zinc-950" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`relative group rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#E8B931] text-zinc-950 font-semibold rounded-br-xs shadow-sm'
                          : 'bg-card text-foreground border border-border/80 rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {!isUser && (
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/40 text-[10px] text-muted-foreground gap-3">
                          <span className="font-mono">{msg.timestamp}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer rounded"
                            aria-label="Copy response text"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Suggestion Pills (matching reference in Yellow Theme) */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-2 ml-8 w-full max-w-[85%]">
                      {msg.suggestions.map((suggestion, idx) => (
                        <Button
                          key={`${msg.id}-sug-${idx}`}
                          type="button"
                          variant="ghost"
                          onClick={() => handleSend(suggestion)}
                          className="h-auto py-1.5 px-3 rounded-full text-[11px] font-medium text-amber-950 dark:text-amber-300 bg-[#E8B931]/15 hover:bg-[#E8B931]/25 hover:text-zinc-950 dark:hover:text-amber-100 border border-[#E8B931]/30 justify-start text-left cursor-pointer transition-all shadow-2xs whitespace-normal"
                        >
                          <span className="truncate">{suggestion}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs pl-8">
                <div className="flex items-center gap-1 bg-card border border-border/80 px-3 py-1.5 rounded-full shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8B931] animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8B931] animate-pulse delay-150" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8B931] animate-pulse delay-300" />
                  <span className="text-[10px] ml-1.5 font-medium text-muted-foreground">
                    Sofiy AI is thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 3. Audio Recording Feedback Banner */}
          {isListening && (
            <div className="px-3 py-1.5 bg-rose-500/10 border-t border-rose-500/20 flex items-center justify-between text-xs text-rose-500 animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[11px] font-semibold">Recording audio... Speak now</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleListening}
                className="h-5 px-2 text-[10px] text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 rounded cursor-pointer"
              >
                Stop
              </Button>
            </div>
          )}

          {/* 4. Bottom Input Bar with Audio Support & Send Button */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-card border-t border-border flex items-center gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Fragen Sie Sofiy AI etwas... / Ask anything..."
                className="pr-10 h-10 text-xs rounded-full border-border/80 bg-background focus-visible:ring-[#E8B931] focus-visible:ring-1 transition-all"
              />

              {/* Audio Input Support Microphone Icon Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={toggleListening}
                    className={`absolute right-1.5 h-7 w-7 rounded-full cursor-pointer transition-colors ${
                      isListening
                        ? 'bg-rose-500 text-white hover:bg-rose-600 animate-pulse'
                        : 'text-muted-foreground hover:text-[#E8B931] hover:bg-[#E8B931]/15'
                    }`}
                    aria-label={isListening ? 'Stop voice recording' : 'Start audio voice input'}
                  >
                    {isListening ? (
                      <MicOff className="w-3.5 h-3.5" />
                    ) : (
                      <Mic className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {isListening ? 'Stop voice input' : 'Voice input (Microphone)'}
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Send Message Button (Circular yellow theme) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="h-10 w-10 rounded-full bg-[#E8B931] hover:bg-[#D8A721] text-zinc-950 shadow-md shadow-[#E8B931]/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 transition-transform active:scale-95 font-bold"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Send message
              </TooltipContent>
            </Tooltip>
          </form>
        </section>
      )}

      {/* 5. Floating Chat Launcher Button (Globally accessible at bottom right) */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="pointer-events-auto relative h-13 w-13 rounded-full bg-gradient-to-tr from-[#E8B931] to-amber-500 hover:from-[#D8A721] hover:to-amber-600 text-zinc-950 shadow-xl shadow-[#E8B931]/30 ring-2 ring-[#E8B931]/40 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center font-bold"
            aria-label={isOpen ? 'Collapse AI Chatbot' : 'Open Sofiy AI Chatbot'}
          >
            {isOpen ? (
              <ChevronDown className="w-6 h-6 text-zinc-950 transition-transform" />
            ) : (
              <div className="relative flex items-center justify-center">
                <Bot className="w-6 h-6 text-zinc-950" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
              </div>
            )}

            {/* Unread Message Pill Indicator */}
            {hasUnread && !isOpen && (
              <span className="absolute -top-1 -left-1 px-1.5 py-0.2 bg-zinc-950 text-[#E8B931] font-bold text-[9px] rounded-full shadow-md animate-bounce border border-[#E8B931]/50">
                New
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="text-xs">
          {isOpen ? 'Minimize assistant' : 'Chat with Sofiy AI Copilot'}
        </TooltipContent>
      </Tooltip>
    </aside>
  )
}

export default ChatbotWidget
