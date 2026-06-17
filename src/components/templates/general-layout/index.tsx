import { StickyContact } from '@/components/atoms/ui/sticky-contact'
import { Footer } from '@/components/organisms/footer'
import { Navbar } from '@/components/organisms/navbar'
import { SplashGate } from '@/components/organisms/splash-screen/gate'

import { cn } from '@/utils/cn'

interface GeneralLayoutProps {
  children: React.ReactNode
  className?: string
}

export const GeneralLayout = ({ children, className }: GeneralLayoutProps) => {
  return (
    <main className={cn(className)}>
      <SplashGate />
      <Navbar />
      <StickyContact />
      {children}
      <Footer />
    </main>
  )
}
