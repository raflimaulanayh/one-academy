'use client'

import { PaperPlaneRightIcon, SparkleIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { memo, useMemo, useState } from 'react'

import { Button } from '@/components/atoms/ui/button'
import { Loader } from '@/components/atoms/ui/loader'
import { Container } from '@/components/templates/container'

import { cn } from '@/utils/cn'

export interface ChatInputFormProps {
  isLoading: boolean
  messageCount: number
  onSubmit: (message: string) => void
  onSuggestedClick: (question: string) => void
}

const ChatInputFormComponent = ({ isLoading, messageCount, onSubmit, onSuggestedClick }: ChatInputFormProps) => {
  const t = useTranslations('Chatbot')
  const [inputValue, setInputValue] = useState('')

  const suggestedQuestions = useMemo(
    () => [
      { icon: SparkleIcon, text: t('question1') },
      { icon: SparkleIcon, text: t('question2') },
      { icon: SparkleIcon, text: t('question3') }
    ],
    [t]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return
    onSubmit(inputValue)
    setInputValue('')
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-10 border-t border-white/50 bg-white/50 shadow-lg backdrop-blur-sm"
    >
      <Container className="max-w-5xl! py-4 md:py-6">
        <AnimatePresence>
          {messageCount === 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 flex flex-wrap gap-2"
            >
              {suggestedQuestions.map((q, idx) => (
                <motion.button
                  key={q.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSuggestedClick(q.text)}
                  className="group flex h-10 items-center gap-2 rounded-full border border-primary/20 bg-blue-50 px-5 py-2 text-sm text-primary shadow has-[>svg]:px-3"
                >
                  <q.icon className="h-3.5 w-3.5" />
                  {q.text}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('placeholder')}
                disabled={isLoading}
                className="block w-full rounded-lg border border-slate-200 bg-white py-3.5 pr-14 pl-5 text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-primary focus:ring-4 focus:ring-blue-50 focus:outline-none disabled:opacity-50 max-sm:text-sm md:py-4 md:pl-6"
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <Button
                  type="submit"
                  variant="default"
                  disabled={isLoading || !inputValue.trim()}
                  rounded="full"
                  size="icon"
                  className={cn(
                    'size-9 shadow',
                    inputValue.trim() ? 'bg-primary text-white hover:scale-105' : 'bg-gray-200 text-gray-400'
                  )}
                >
                  {isLoading ? <Loader className="size-4" /> : <PaperPlaneRightIcon className="size-4" />}
                </Button>
              </div>
            </div>
          </div>
        </form>

        <p className="mt-3 text-center text-xs text-gray-500">{t('warning')}</p>
      </Container>
    </motion.div>
  )
}

export const ChatInputForm = memo(ChatInputFormComponent)
