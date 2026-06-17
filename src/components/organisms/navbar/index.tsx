'use client'

import { PUBLIC_MENU } from '@/constants/menu'
import { ListIcon, XIcon } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { useSplashStore } from '@/hooks/useSplashStore'

import { Button } from '@/components/atoms/ui/button'
import { ThemeToggle } from '@/components/atoms/ui/theme-toggle'
import { Container } from '@/components/templates/container'

import { cn } from '@/utils'

import { menuItemVar, menuVar } from './animation'
import { BilingualPopover, DesktopDropdown, MobileMenuItem } from './chunk'

export const Navbar = () => {
  const pathname = usePathname()
  const locale = useLocale() as 'en' | 'id'
  const t = useTranslations('Navbar')

  const [isOpen, setIsOpen] = React.useState(false)
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isHidden, setIsHidden] = React.useState(false)
  const lastScrollY = React.useRef(0)
  const reduce = useReducedMotion() ?? false
  const isSplashDone = useSplashStore((s) => s.isDone)
  const canPlay = reduce || isSplashDone

  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 20)

      if (currentScrollY > lastScrollY.current && currentScrollY > 150 && !isOpen) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }

      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isOpen])

  return (
    <motion.header
      className={cn(
        'fixed top-0 z-50 flex w-full flex-col items-center justify-center transition-all duration-500',
        isScrolled
          ? 'h-18 border-b border-slate-200 bg-white/80 backdrop-blur-sm lg:h-20'
          : 'h-20 border-transparent bg-white/40 hover:bg-white lg:h-24'
      )}
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : -16 }}
      animate={{
        opacity: canPlay ? 1 : reduce ? 1 : 0,
        y: isHidden ? '-100%' : canPlay ? 0 : reduce ? 0 : -16
      }}
      transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Container className="relative flex w-full shrink-0 items-center justify-between">
        <Link
          href="/"
          className="relative h-10 w-36 shrink-0"
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
        >
          <Image
            src="/logo.png"
            alt="Logo One Academy"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="pointer-events-none object-contain object-left"
            priority
          />
        </Link>

        <nav className="relative hidden shrink-0 items-center gap-6 lg:flex">
          {PUBLIC_MENU[locale].map((item) => {
            const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`)

            if (item.children) {
              return (
                <DesktopDropdown
                  key={item.url}
                  item={item}
                  pathname={pathname}
                  isOpen={openDropdown === item.url}
                  onOpenChange={(open) => setOpenDropdown(open ? item.url : null)}
                />
              )
            }

            return (
              <Link
                key={item.url}
                aria-label={item.label}
                href={item.url}
                className={cn(
                  'group relative text-sm font-medium transition-all',
                  isActive ? 'text-primary' : 'text-slate-900 hover:text-primary'
                )}
              >
                {item.label}
                <span
                  className={cn(
                    'absolute -bottom-1.5 left-0 h-0.5 w-full bg-primary transition-all',
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  )}
                />
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Button url="/register" className={cn('hidden lg:inline-flex')}>
            {t('cta')}
          </Button>

          <BilingualPopover />

          <ThemeToggle />

          <button
            className="flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-blue-50 lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <XIcon size={24} weight="bold" /> : <ListIcon size={24} weight="bold" />}
          </button>
        </div>
      </Container>

      <motion.div
        variants={menuVar(reduce)}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        aria-hidden={!isOpen}
        inert={!isOpen ? true : undefined}
        className={cn(
          'absolute top-full left-0 w-full overflow-hidden border-b border-slate-200 bg-white shadow-md lg:hidden',
          isOpen ? '' : 'pointer-events-none'
        )}
      >
        <Container className="flex flex-col gap-6 py-4">
          <nav className="flex flex-col gap-1">
            {PUBLIC_MENU[locale ?? 'en'].map((item) => (
              <motion.div key={`mobile-${item.url}`} variants={menuItemVar(reduce)}>
                <MobileMenuItem item={item} pathname={pathname} />
              </motion.div>
            ))}
          </nav>

          <motion.div variants={menuItemVar(reduce)} className="py-6">
            <Button url="/register" className="w-full">
              {t('cta')}
            </Button>
          </motion.div>
        </Container>
      </motion.div>
    </motion.header>
  )
}
