'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'

export interface ChatErrorBannerProps {
  errorMessage: string | null
  isLoading: boolean
}

const ChatErrorBannerComponent = ({ errorMessage, isLoading }: ChatErrorBannerProps) => {
  if (!errorMessage || isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-red-200 bg-red-50/80 p-4 text-center text-sm text-red-600 shadow-sm backdrop-blur-sm"
    >
      {errorMessage}
    </motion.div>
  )
}

export const ChatErrorBanner = memo(ChatErrorBannerComponent)
