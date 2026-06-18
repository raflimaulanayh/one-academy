'use client'

import { Link, usePathname } from '@/i18n/routing'
import {
  HouseIcon,
  BookOpenIcon,
  FileTextIcon,
  CpuIcon,
  UserCircleIcon,
  GearIcon,
  CirclesThreeIcon,
  ChatCircleDotsIcon,
  TrophyIcon,
  CalendarBlankIcon
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import type { UserData } from './types'

type Tab = 'home' | 'lms' | 'assignments' | 'ai' | 'settings' | 'ai-graph' | 'chat' | 'leaderboard' | 'schedule' | 'payment'

type Props = {
  userData: UserData
  isSidebarOpen: boolean
  setIsSidebarOpen: (val: boolean) => void
}

export function DashboardSidebar({ userData, isSidebarOpen, setIsSidebarOpen: _setIsSidebarOpen }: Props) {
  const t = useTranslations('Dashboard')
  const pathname = usePathname()

  const getActiveTab = (): Tab => {
    if (pathname.endsWith('/lms')) return 'lms'
    if (pathname.endsWith('/assignments')) return 'assignments'
    if (pathname.endsWith('/schedule')) return 'schedule'
    if (pathname.endsWith('/payment')) return 'payment'
    if (pathname.endsWith('/ai')) return 'ai'
    if (pathname.endsWith('/ai-graph')) return 'ai-graph'
    if (pathname.endsWith('/chat')) return 'chat'
    if (pathname.endsWith('/leaderboard')) return 'leaderboard'
    if (pathname.endsWith('/settings')) return 'settings'

    return 'home'
  }

  const activeTab = getActiveTab()

  const navItems = [
    { key: 'home' as const, icon: HouseIcon, label: t('navHome'), href: '/dashboard' },
    { key: 'lms' as const, icon: BookOpenIcon, label: t('navLms'), href: '/dashboard/lms' },
    { key: 'assignments' as const, icon: FileTextIcon, label: t('navAssignments'), href: '/dashboard/assignments' },
    { key: 'schedule' as const, icon: CalendarBlankIcon, label: t('navSchedule'), href: '/dashboard/schedule' },
    { key: 'ai' as const, icon: CpuIcon, label: t('navAI'), href: '/dashboard/ai' },
    { key: 'ai-graph' as const, icon: CirclesThreeIcon, label: t('navAIGraph'), href: '/dashboard/ai-graph' },
    { key: 'chat' as const, icon: ChatCircleDotsIcon, label: t('navChat'), href: '/dashboard/chat' },
    { key: 'leaderboard' as const, icon: TrophyIcon, label: t('navLeaderboard'), href: '/dashboard/leaderboard' },
    { key: 'settings' as const, icon: GearIcon, label: t('navSettings'), href: '/dashboard/settings' }
  ]

  return (
    <>
      {/* ── Desktop Sidebar (md:flex) ── */}
      <aside
        className={cn(
          'hidden shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out md:flex dark:border-[#2e2e2e] dark:bg-[#1e1e1e]',
          isSidebarOpen ? 'w-66' : 'w-20'
        )}
      >
        <div className="flex flex-1 flex-col overflow-hidden p-4">
          {/* User Account / Role Badge */}
          {isSidebarOpen ? (
            <div className="mb-6 rounded-2xl border border-slate-100 bg-[#fafafa] p-4 shadow-sm dark:border-neutral-800/40 dark:bg-[#151515]">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-primary dark:text-secondary">
                  <UserCircleIcon size={16} weight="bold" />
                  <span className="tracking-wide uppercase">{t('role')}</span>
                </div>
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[8px] font-black tracking-wider text-green-500 uppercase">
                  {t('active')}
                </span>
              </div>
              <p className="text-sm font-black text-[#333] dark:text-white">{t('student')}</p>
              <p className="mt-0.5 truncate text-[10px] font-medium text-text-muted">{userData.school || 'One Academy'}</p>
            </div>
          ) : (
            <div className="mb-6 flex flex-col items-center justify-center">
              <div
                title={`${t('student')} - ${userData.school || 'One Academy'}`}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xs font-black text-primary shadow-sm dark:bg-secondary/10 dark:text-secondary"
              >
                {userData.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map(({ key, icon: Icon, label, href }) => {
              const isActive = activeTab === key

              return (
                <Link
                  key={key}
                  href={href}
                  title={label}
                  className={cn(
                    'group relative flex items-center overflow-hidden rounded-xl py-3 text-xs font-bold transition-all focus:outline-none',
                    isSidebarOpen ? 'w-full gap-3.5 px-4' : 'mx-auto h-12 w-12 justify-center',
                    isActive
                      ? 'text-white shadow-[0_4px_16px_rgba(0,138,227,0.15)] dark:shadow-none'
                      : 'text-text-muted hover:text-[#333] dark:hover:text-white'
                  )}
                >
                  {/* Sliding active background marker */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabSidebar"
                      className="absolute inset-0 z-0 rounded-xl bg-gradient-to-r from-navy-medium to-primary dark:from-navy-active dark:to-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Icon with hover rotation/scale micro-animation */}
                  <span className="relative z-10 flex items-center justify-center">
                    <Icon
                      size={18}
                      weight={isActive ? 'bold' : 'regular'}
                      className={cn(
                        'transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
                        isActive ? 'text-white' : 'text-text-muted group-hover:text-primary dark:group-hover:text-secondary'
                      )}
                    />
                  </span>

                  {isSidebarOpen && <span className="relative z-10 truncate tracking-wide">{label}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="shrink-0 border-t border-slate-100 p-4 text-center text-[10px] font-semibold text-text-muted dark:border-neutral-800/40">
          {isSidebarOpen ? `\u00A9 ${new Date().getFullYear()} One Academy` : 'OA'}
        </div>
      </aside>

      {/* ── Mobile Floating Bottom Dock (md:hidden) ── */}
      <div className="fixed right-4 bottom-4 left-4 z-40 flex h-16 items-center justify-between rounded-2xl border border-slate-200/50 bg-white/80 px-4 py-2 shadow-[0_8px_32px_rgba(0,48,87,0.08)] backdrop-blur-lg md:hidden dark:border-neutral-800/60 dark:bg-neutral-900/85">
        {navItems
          .filter((item) => ['home', 'lms', 'assignments', 'chat', 'settings'].includes(item.key))
          .map(({ key, icon: Icon, label, href }) => {
            const isActive = activeTab === key

            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  'flex items-center justify-center rounded-xl transition-all duration-300 ease-in-out focus:outline-none',
                  isActive
                    ? 'gap-1.5 bg-primary/10 px-3 py-2 text-primary dark:bg-secondary/15 dark:text-secondary'
                    : 'p-2.5 text-text-muted'
                )}
              >
                {/* Tap feedback micro-animation on icon */}
                <motion.div whileTap={{ scale: 0.9 }} className="flex items-center justify-center">
                  <Icon size={20} weight={isActive ? 'bold' : 'regular'} className="transition-transform duration-300" />
                </motion.div>

                {isActive && (
                  <motion.span
                    initial={{ width: 0, opacity: 0, scale: 0.8 }}
                    animate={{ width: 'auto', opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="text-[10px] font-black tracking-wider whitespace-nowrap uppercase"
                  >
                    {label.split(' ')[0]}
                  </motion.span>
                )}
              </Link>
            )
          })}
      </div>
    </>
  )
}
