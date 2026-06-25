'use client'

import { useEffect, useState } from 'react'

import { useSplashStore } from '@/hooks/useSplashStore'

import { SplashScreen } from '@/components/organisms/splash-screen'

export const SplashGate = () => {
  const isDone = useSplashStore((s) => s.isDone)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || isDone) return null

  return <SplashScreen />
}
