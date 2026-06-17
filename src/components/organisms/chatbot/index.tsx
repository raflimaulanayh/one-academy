'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useTranslations } from 'next-intl'
import * as React from 'react'

import { Container } from '@/components/templates/container'

import { ChatErrorBanner, ChatInputForm, ChatMessage, ChatTypingIndicator } from './chunk'
import type { ChatMessageType } from './chunk/types'

const CHAT_TRANSPORT = new DefaultChatTransport({
  api: '/api/chat',
  credentials: 'include',
  body: () => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname
      const isEn = pathname === '/en' || pathname.startsWith('/en/')

      return { lang: isEn ? 'en' : 'id' }
    }

    return { lang: 'id' }
  }
})

export const ChabotSection = () => {
  const t = useTranslations('Chatbot')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const { messages, status, sendMessage } = useChat({
    transport: CHAT_TRANSPORT,
    onError: (error) => {
      console.error('Chat error:', error)
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        setErrorMessage(t('errorBusy'))
      } else {
        setErrorMessage(t('errorGeneric'))
      }
    }
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  React.useEffect(() => {
    if (!messagesEndRef.current) return
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [messages])

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const prompt = searchParams.get('prompt')
      if (prompt && messages.length === 0 && !isLoading) {
        // Clear query parameter from URL so it doesn't trigger again on refresh
        const newUrl = window.location.pathname
        window.history.replaceState({}, '', newUrl)

        // Wait a brief moment to let the chat initialize
        setTimeout(() => {
          sendMessage({ text: prompt })
        }, 500)
      }
    }
  }, [messages.length, isLoading, sendMessage])

  const handleSubmit = React.useCallback(
    (message: string) => {
      setErrorMessage(null)
      sendMessage({ text: message })
    },
    [sendMessage]
  )

  const handleSuggestedClick = React.useCallback(
    (question: string) => {
      sendMessage({ text: question })
    },
    [sendMessage]
  )

  const welcomeMessage = React.useMemo<ChatMessageType>(
    () => ({
      id: 'welcome',
      role: 'assistant',
      content: t('welcome'),
      parts: [
        {
          type: 'text',
          text: t('welcome')
        }
      ]
    }),
    [t]
  )

  const displayMessages: ChatMessageType[] = [welcomeMessage, ...(messages as ChatMessageType[])]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div
        data-lenis-prevent
        className="flex-1 overflow-y-auto py-4 md:py-8"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(203 213 225) transparent'
        }}
      >
        <Container className="max-w-5xl! space-y-4 md:space-y-6">
          {displayMessages.map((message, idx) => (
            <ChatMessage key={message.id} id={message.id} role={message.role} parts={message.parts} index={idx} />
          ))}

          <ChatTypingIndicator isLoading={isLoading} />

          <ChatErrorBanner errorMessage={errorMessage} isLoading={isLoading} />

          <div ref={messagesEndRef} />
        </Container>
      </div>

      <ChatInputForm
        isLoading={isLoading}
        messageCount={messages.length}
        onSubmit={handleSubmit}
        onSuggestedClick={handleSuggestedClick}
      />
    </div>
  )
}
