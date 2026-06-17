'use client'

import { usePathname, useRouter } from '@/i18n/routing'
import { CaretDownIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useState, useTransition } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/ui/popover'

import { cn } from '@/utils/cn'

const LANGUAGE_OPTIONS = [
  {
    code: 'en',
    label: 'English',
    icon: '/static/icons/flag/en.svg'
  },
  {
    code: 'id',
    label: 'Indonesia',
    icon: '/static/icons/flag/id.svg'
  }
]

export const BilingualPopover = () => {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const currentLang = useLocale()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSwitch = (newLocale: string) => {
    setOpen(false)

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app:locale-change', { detail: { locale: newLocale } }))
    }

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        { pathname, params },
        { locale: newLocale }
      )
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          'flex h-8 cursor-pointer items-center gap-1 rounded-full border border-primary px-2 font-medium text-primary transition-all hover:bg-blue-50 sm:h-10',
          open && 'bg-blue-50',
          isPending && 'cursor-wait opacity-50'
        )}
        disabled={isPending}
      >
        <Image
          src={LANGUAGE_OPTIONS.find((l) => l.code === currentLang)?.icon || LANGUAGE_OPTIONS[0].icon}
          alt="Lang Icon"
          width={14}
          height={14}
          className="mr-1"
          style={{ height: 'auto' }}
        />
        <span>{currentLang.toUpperCase()}</span> <CaretDownIcon />
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="max-w-48 gap-y-1 p-1" sideOffset={8}>
        {LANGUAGE_OPTIONS.map((lang) => (
          <button
            onClick={() => handleSwitch(lang.code)}
            key={lang.code}
            disabled={isPending || lang.code === currentLang}
            className={cn(
              'flex w-full cursor-pointer items-center gap-2 rounded p-2 font-medium text-primary transition-all hover:bg-blue-50',
              lang.code === currentLang && 'cursor-default bg-blue-50',
              isPending && 'cursor-wait opacity-50'
            )}
          >
            <Image src={lang.icon} alt={`Lang ${lang.label} Icon`} width={14} height={14} style={{ height: 'auto' }} />
            {lang.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
