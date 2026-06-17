import { EMAIL_CONTACT } from '@/constants/general-data'
import enMessages from '@/shared/jsons/messages/en.json'
import { NextIntlClientProvider } from 'next-intl'
import { TbError404 } from 'react-icons/tb'

import { Button } from '@/components/atoms/ui/button'
import { Container } from '@/components/templates/container'
import { GeneralLayout } from '@/components/templates/general-layout'

export const metadata = {
  title: 'Page Not Found',
  description: 'Sorry, the page you are looking for does not exist or has been moved.'
}

export default function NotFound() {
  return (
    <NextIntlClientProvider messages={enMessages}>
      <GeneralLayout>
        <Container className="flex min-h-[70vh] max-w-3xl! flex-col items-center gap-8 py-16 text-center lg:py-28">
          <div className="flex flex-col items-center space-y-2 lg:space-y-4">
            <TbError404 size={200} className="h-28 w-64 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight text-balance text-gray-900 sm:text-4xl">
              Oops! Page Not Found
            </h1>
            <p className="text-sm text-pretty text-gray-600 sm:text-base">
              The page you are looking for is not available or has been moved. Please return to the homepage or contact
              support if you need assistance.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button variant="secondary" size="lg" url="/">
              Back to Home
            </Button>
            <Button size="lg" url={`mailto:${EMAIL_CONTACT}`} external variant="outline-primary">
              Contact Support
            </Button>
          </div>
        </Container>
      </GeneralLayout>
    </NextIntlClientProvider>
  )
}
