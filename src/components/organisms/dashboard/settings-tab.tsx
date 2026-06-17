'use client'

import { usePathname, useRouter } from '@/i18n/routing'
import {
  SunIcon,
  MoonIcon,
  GlobeIcon,
  UserIcon,
  BellIcon,
  EnvelopeSimpleIcon,
  BrowserIcon,
  CalendarCheckIcon
} from '@phosphor-icons/react'
import { useTranslations, useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'

import { cn } from '@/utils'

import type { UserData } from './types'

type Props = {
  userData: UserData
}

export function SettingsTab({ userData }: Props) {
  const t = useTranslations('Dashboard')
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const currentLang = useLocale()
  const [mounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Notification Mock States
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(false)
  const [reminderNotif, setReminderNotif] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const handleLangSwitch = (newLocale: string) => {
    if (newLocale === currentLang) return

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app:locale-change', { detail: { locale: newLocale } }))
    }

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- routing parameters validation
        { pathname, params },
        { locale: newLocale }
      )
    })
  }

  const isDark = theme === 'dark'

  const tierLabels: Record<string, string> = {
    sd: t('tierSD'),
    smp: t('tierSMP'),
    sma: t('tierSMA'),
    univ: t('tierUniv')
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-xl font-extrabold text-text-dark">{t('settingTitle')}</h3>
        <p className="text-xs text-text-muted">{t('settingSubtitle')}</p>
      </div>

      <div className="space-y-5">
        {/* ── Section 1: Profil Akademik (Read Only) ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#2e2e2e] dark:bg-[#1e1e1e]">
          <div className="mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3 dark:border-neutral-800/60">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary">
              <UserIcon size={16} weight="bold" />
            </div>
            <h4 className="text-xs font-bold tracking-wider text-text-dark uppercase">{t('settingSectionAccount')}</h4>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">
                {t('settingAccountName')}
              </span>
              <p className="mt-0.5 text-xs font-black text-[#333] dark:text-white">{userData.name}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">
                {t('settingAccountEmail')}
              </span>
              <p className="mt-0.5 text-xs font-semibold text-[#333] dark:text-white">{userData.email}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">
                {t('settingAccountInstitution')}
              </span>
              <p className="mt-0.5 text-xs font-semibold text-[#333] dark:text-white">{userData.school || 'One Academy'}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">
                {t('settingAccountTier')}
              </span>
              <p className="mt-0.5 text-xs font-semibold text-[#333] dark:text-white">
                {tierLabels[userData.tier] || tierLabels['univ']}
              </p>
            </div>
          </div>
        </div>

        {/* ── Section 2: Preferensi Aplikasi (Compact Theme & Lang Switcher) ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#2e2e2e] dark:bg-[#1e1e1e]">
          <div className="mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3 dark:border-neutral-800/60">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary">
              <GlobeIcon size={16} weight="bold" />
            </div>
            <h4 className="text-xs font-bold tracking-wider text-text-dark uppercase">{t('settingSectionPreferences')}</h4>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-neutral-800/60">
            {/* Theme Selector Row */}
            <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h5 className="text-xs font-bold text-text-dark">{t('settingThemeTitle')}</h5>
                <p className="text-[10px] text-text-muted">{t('settingThemeDesc')}</p>
              </div>

              {/* Compact segmented toggle */}
              <div className="flex self-start rounded-lg bg-slate-100 p-0.5 sm:self-auto dark:bg-neutral-800">
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all focus:outline-none',
                    !isDark
                      ? 'bg-white text-primary shadow-sm dark:bg-[#1a1a1a]'
                      : 'text-text-muted hover:text-[#333] dark:hover:text-white'
                  )}
                >
                  <SunIcon size={14} weight={!isDark ? 'bold' : 'regular'} className="text-amber-500" />
                  {t('settingLight')}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all focus:outline-none',
                    isDark
                      ? 'bg-white text-secondary shadow-sm dark:bg-[#2a2a2a]'
                      : 'text-text-muted hover:text-[#333] dark:hover:text-white'
                  )}
                >
                  <MoonIcon size={14} weight={isDark ? 'bold' : 'regular'} className="text-indigo-400" />
                  {t('settingDark')}
                </button>
              </div>
            </div>

            {/* Language Selector Row */}
            <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h5 className="text-xs font-bold text-text-dark">{t('settingLangTitle')}</h5>
                <p className="text-[10px] text-text-muted">{t('settingLangDesc')}</p>
              </div>

              {/* Compact segmented switcher */}
              <div
                className={cn(
                  'flex self-start rounded-lg bg-slate-100 p-0.5 sm:self-auto dark:bg-neutral-800',
                  isPending && 'cursor-wait opacity-60'
                )}
              >
                <button
                  disabled={isPending}
                  onClick={() => handleLangSwitch('id')}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all focus:outline-none',
                    currentLang === 'id'
                      ? 'bg-white text-primary shadow-sm dark:bg-[#1a1a1a]'
                      : 'text-text-muted hover:text-[#333] dark:hover:text-white'
                  )}
                >
                  <div className="relative h-3 w-4.5 overflow-hidden rounded shadow-sm">
                    <Image src="/static/icons/flag/id.svg" alt="ID flag" fill className="object-cover" />
                  </div>
                  Indo
                </button>
                <button
                  disabled={isPending}
                  onClick={() => handleLangSwitch('en')}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all focus:outline-none',
                    currentLang === 'en'
                      ? 'bg-white text-primary shadow-sm dark:bg-[#1a1a1a] dark:text-secondary'
                      : 'text-text-muted hover:text-[#333] dark:hover:text-white'
                  )}
                >
                  <div className="relative h-3 w-4.5 overflow-hidden rounded shadow-sm">
                    <Image src="/static/icons/flag/en.svg" alt="EN flag" fill className="object-cover" />
                  </div>
                  Eng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 3: Pengaturan Notifikasi (Interactive Toggles) ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#2e2e2e] dark:bg-[#1e1e1e]">
          <div className="mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3 dark:border-neutral-800/60">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary">
              <BellIcon size={16} weight="bold" />
            </div>
            <h4 className="text-xs font-bold tracking-wider text-text-dark uppercase">{t('settingSectionNotifications')}</h4>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-neutral-800/60">
            {/* Email Notification Row */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-text-muted">
                  <EnvelopeSimpleIcon size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-text-dark">{t('settingNotifEmail')}</h5>
                  <p className="text-[10px] text-text-muted">{t('settingNotifEmailDesc')}</p>
                </div>
              </div>

              {/* Checkbox Switch */}
              <button
                onClick={() => {
                  const val = !emailNotif
                  setEmailNotif(val)
                  toast.success(val ? 'Notifikasi email diaktifkan' : 'Notifikasi email dinonaktifkan')
                }}
                className={cn(
                  'relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                  emailNotif ? 'bg-primary' : 'bg-slate-200 dark:bg-neutral-800'
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    emailNotif ? 'translate-x-4.5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>

            {/* Push Notification Row */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-text-muted">
                  <BrowserIcon size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-text-dark">{t('settingNotifPush')}</h5>
                  <p className="text-[10px] text-text-muted">{t('settingNotifPushDesc')}</p>
                </div>
              </div>

              {/* Checkbox Switch */}
              <button
                onClick={() => {
                  const val = !pushNotif
                  setPushNotif(val)
                  toast.success(val ? 'Notifikasi browser diaktifkan' : 'Notifikasi browser dinonaktifkan')
                }}
                className={cn(
                  'relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                  pushNotif ? 'bg-primary' : 'bg-slate-200 dark:bg-neutral-800'
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    pushNotif ? 'translate-x-4.5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>

            {/* Task Reminder Row */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-text-muted">
                  <CalendarCheckIcon size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-text-dark">{t('settingNotifReminder')}</h5>
                  <p className="text-[10px] text-text-muted">{t('settingNotifReminderDesc')}</p>
                </div>
              </div>

              {/* Checkbox Switch */}
              <button
                onClick={() => {
                  const val = !reminderNotif
                  setReminderNotif(val)
                  toast.success(val ? 'Pengingat batas tugas diaktifkan' : 'Pengingat batas tugas dinonaktifkan')
                }}
                className={cn(
                  'relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                  reminderNotif ? 'bg-primary' : 'bg-slate-200 dark:bg-neutral-800'
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    reminderNotif ? 'translate-x-4.5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
