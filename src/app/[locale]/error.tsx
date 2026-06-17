'use client'

import { EMAIL_CONTACT } from '@/constants/general-data'
import enMessages from '@/shared/jsons/messages/en.json'
import { NextIntlClientProvider } from 'next-intl'
import { TbFaceIdError } from 'react-icons/tb'

import { useErrorHandler } from '@/hooks/useErrorHandler'

import { Button } from '@/components/atoms/ui/button'
import { Container } from '@/components/templates/container'
import { GeneralLayout } from '@/components/templates/general-layout'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  const { isOnline, loading, isMaxRetryReached, handleRetry } = useErrorHandler(reset)

  return (
    <NextIntlClientProvider messages={enMessages}>
      <GeneralLayout>
        <Container className="flex min-h-[70vh] max-w-3xl! flex-col items-center gap-8 py-16 text-center lg:py-28">
          <div className="flex flex-col items-center space-y-4">
            <TbFaceIdError size={200} className="h-28 w-64 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight text-balance text-gray-900 sm:text-4xl">
              Something Went Wrong
            </h1>
            {!isOnline ? (
              <p className="text-sm font-medium text-pretty text-gray-600 sm:text-base">
                It looks like you are not connected to the internet. Please check your connection and try again, or contact
                support if you need further assistance.
              </p>
            ) : (
              <p className="text-sm text-pretty text-gray-600 sm:text-base">
                We apologize for the unexpected system error. Please try again in a few moments or contact support if the
                issue persists.
              </p>
            )}

            {process.env.NODE_ENV !== 'production' && (
              <details>
                <summary className="cursor-pointer text-sm text-gray-600 transition-colors hover:text-foreground">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-gray-100 p-3 text-xs text-wrap text-gray-600 hover:bg-gray-200 hover:text-gray-800">
                  {error.message}
                </pre>
              </details>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button onClick={handleRetry} size="lg" loading={loading} disabled={loading}>
              {isMaxRetryReached ? 'Go Back' : 'Try Again'}
            </Button>
            <Button size="lg" url={`mailto:${EMAIL_CONTACT}`} variant="outline-primary">
              Contact Support
            </Button>
          </div>
        </Container>
      </GeneralLayout>
    </NextIntlClientProvider>
  )
}
