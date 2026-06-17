'use client'

import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-8 w-8 rounded-full border border-slate-200 bg-transparent sm:h-10 sm:w-10" />
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-primary text-primary transition-all hover:bg-blue-50/50 sm:h-10 sm:w-10 dark:hover:bg-slate-800"
      aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -10, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 10, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isDark ? <SunIcon size={18} weight="bold" className="text-secondary" /> : <MoonIcon size={18} weight="bold" />}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
