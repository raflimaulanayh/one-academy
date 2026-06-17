import { StickyContact } from '@/components/atoms/ui/sticky-contact'
import { SplashGate } from '@/components/organisms/splash-screen/gate'

import { cn } from '@/utils/cn'

interface AuthLayoutProps {
  children: React.ReactNode
  className?: string
}

export const AuthLayout = ({ children, className }: AuthLayoutProps) => {
  return (
    <main className={cn('min-h-screen', className)}>
      <SplashGate />
      <StickyContact />
      {children}
    </main>
  )
}
