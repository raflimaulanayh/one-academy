'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'

import { cn } from '@/utils/cn'

import { ChatAvatar } from './chat-avatar'
import { ChatMessageBubble } from './chat-message-bubble'
import type { MessagePart } from './types'

export interface ChatMessageProps {
  id: string
  role: 'user' | 'assistant'
  parts?: MessagePart[]
  index: number
}

const ChatMessageComponent = ({ role, parts, index }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn('flex w-full gap-3 md:gap-4', role === 'user' ? 'flex-row-reverse' : 'flex-row')}
    >
      <ChatAvatar role={role} />
      <ChatMessageBubble role={role} parts={parts} />
    </motion.div>
  )
}

export const ChatMessage = memo(ChatMessageComponent)
