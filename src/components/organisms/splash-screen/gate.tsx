'use client'

import { useEffect, useState } from 'react'

import { useSplashStore } from '@/hooks/useSplashStore'

import { SplashScreen } from '@/components/organisms/splash-screen'

const SPLASH_KEY = 'one-tech:splash-seen'

export const SplashGate = () => {
  const isDone = useSplashStore((s) => s.isDone)
  const finish = useSplashStore((s) => s.finish)
  const [isMounted, setIsMounted] = useState(false)
  const [isSeen, setIsSeen] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    try {
      if (window.sessionStorage.getItem(SPLASH_KEY) === '1') {
        setIsSeen(true)
        finish()
      }
    } catch {
      // no-op when storage is unavailable
    }
  }, [finish])

  useEffect(() => {
    if (!isDone) return

    try {
      window.sessionStorage.setItem(SPLASH_KEY, '1')
    } catch {
      // no-op when storage is unavailable
    }
  }, [isDone])

  if (!isMounted || isSeen || isDone) return null

  return <SplashScreen />
}
