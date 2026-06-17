'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import { useNetworkState, useUpdateEffect } from 'react-use'
import { toast } from 'sonner'
import { SWRConfig } from 'swr'

import api from '@/services/api'
import { fetcher } from '@/services/fetcher'

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const orig = console.error
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) return
    orig.apply(console, args)
  }
}

interface ClientProviderProps {
  children: React.ReactNode
}

function SWRWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.jwt) {
      api.defaults.headers.Authorization = `Bearer ${session.jwt}`
    } else {
      delete api.defaults.headers.Authorization
    }
  }, [session])

  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: true,
        dedupingInterval: 5000
      }}
    >
      {children}
    </SWRConfig>
  )
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const network = useNetworkState()
  const pathname = usePathname()

  useUpdateEffect(() => {
    if (network.previous && !network.online) {
      toast.warning('Your internet connection is lost')
    }
    if (!network.previous && network.online) {
      toast.success('Your internet connection is back')
    }
  }, [network])

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (reg) => console.info('ServiceWorker registered with scope:', reg.scope),
          (err) => console.error('ServiceWorker registration failed:', err)
        )
      })
    }
  }, [])

  useEffect(() => {
    NProgress.done()
  }, [pathname])

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <SWRWrapper>{children}</SWRWrapper>
      </ThemeProvider>
    </SessionProvider>
  )
}
