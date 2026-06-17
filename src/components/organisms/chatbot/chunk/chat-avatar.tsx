'use client'

import { RobotIcon, UserIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { memo } from 'react'

import { cn } from '@/utils/cn'

export interface ChatAvatarProps {
  role: 'user' | 'assistant'
}

const ChatAvatarComponent = ({ role }: ChatAvatarProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-full border transition-shadow hover:shadow-sm md:size-10',
        role === 'user' ? 'bg-primary text-white!' : 'bg-white text-primary'
      )}
    >
      {role === 'user' ? <UserIcon size={18} /> : <RobotIcon size={18} />}
    </motion.div>
  )
}

export const ChatAvatar = memo(ChatAvatarComponent)
