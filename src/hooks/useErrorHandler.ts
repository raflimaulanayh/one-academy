import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useNetworkState } from 'react-use'

const MAX_RETRY = 3

interface UseErrorHandlerReturn {
  isOnline: boolean
  loading: boolean
  retryCount: number
  isMaxRetryReached: boolean
  handleRetry: () => void
}

export const useErrorHandler = (reset: () => void): UseErrorHandlerReturn => {
  const network = useNetworkState()
  const router = useRouter()
  const session = useSession()
  const [loading, startTransition] = useTransition()

  const getRetryCount = (): number => {
    if (typeof window === 'undefined') return 0
    const stored = sessionStorage.getItem('error-retry-count')

    return stored ? Number(stored) : 0
  }

  const retryCount = getRetryCount()
  const isMaxRetryReached = retryCount + 1 >= MAX_RETRY

  const handleRetry = () => {
    const currentCount = getRetryCount()

    if (isMaxRetryReached) {
      sessionStorage.removeItem('error-retry-count')
      const redirectPath = session?.status === 'authenticated' ? '/dashboard' : '/'
      router.push(redirectPath)
    } else {
      sessionStorage.setItem('error-retry-count', (currentCount + 1).toString())
      router.refresh()
    }

    startTransition(() => {
      reset()
    })
  }

  return {
    isOnline: network.online ?? true,
    loading,
    retryCount,
    isMaxRetryReached,
    handleRetry
  }
}
