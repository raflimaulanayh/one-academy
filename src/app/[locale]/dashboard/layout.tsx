'use client'

import { DashboardProvider, useDashboard } from '@/context/dashboard-context'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { ReactNode, useEffect, useRef, useState } from 'react'

import { DashboardHeader, DashboardSidebar } from '@/components/organisms/dashboard'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  )
}

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const t = useTranslations('Dashboard')
  const { userData, userInitials, tierLabels, activeModules } = useDashboard()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-light dark:bg-[#121212]">
        <p className="animate-pulse font-medium text-text-muted">{t('loading')}</p>
      </div>
    )
  }

  // Dynamic theme colors mapping
  const tierThemes = {
    sd: {
      light: {
        primary: '#d92727',
        secondary: '#ef4444',
        navyDark: '#7f1d1d',
        navyMedium: '#991b1b',
        navyActive: '#b91c1c',
        ring: '#d92727'
      },
      dark: {
        primary: '#f87171',
        secondary: '#fca5a5',
        navyDark: '#450a0a',
        navyMedium: '#7f1d1d',
        navyActive: '#991b1b',
        ring: '#f87171'
      }
    },
    smp: {
      light: {
        primary: '#0284c7',
        secondary: '#0ea5e9',
        navyDark: '#0c4a6e',
        navyMedium: '#0369a1',
        navyActive: '#0284c7',
        ring: '#0284c7'
      },
      dark: {
        primary: '#38bdf8',
        secondary: '#7dd3fc',
        navyDark: '#031e2f',
        navyMedium: '#0c4a6e',
        navyActive: '#0369a1',
        ring: '#38bdf8'
      }
    },
    sma: {
      light: {
        primary: '#0d9488',
        secondary: '#14b8a6',
        navyDark: '#115e59',
        navyMedium: '#0f766e',
        navyActive: '#0d9488',
        ring: '#0d9488'
      },
      dark: {
        primary: '#2dd4bf',
        secondary: '#5eead4',
        navyDark: '#042f2e',
        navyMedium: '#115e59',
        navyActive: '#0f766e',
        ring: '#2dd4bf'
      }
    },
    univ: {
      light: {
        primary: '#0f2854',
        secondary: '#ff9d00',
        navyDark: '#003057',
        navyMedium: '#0f2854',
        navyActive: '#1e3a8a',
        ring: '#0f2854'
      },
      dark: {
        primary: '#ff9d00',
        secondary: '#4988c4',
        navyDark: '#071731',
        navyMedium: '#0b192e',
        navyActive: '#0f2854',
        ring: '#ff9d00'
      }
    }
  }

  const activeTheme = tierThemes[userData.tier as 'sd' | 'smp' | 'sma' | 'univ'] || tierThemes.univ
  const colors = isDark ? activeTheme.dark : activeTheme.light

  const themeStyle = {
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-navy-dark': colors.navyDark,
    '--color-navy-medium': colors.navyMedium,
    '--color-navy-active': colors.navyActive,
    '--color-ring': colors.ring
  } as React.CSSProperties

  return (
    <div
      style={themeStyle}
      className="flex h-screen flex-col overflow-hidden bg-bg-light text-text-dark transition-colors duration-300 dark:bg-[#121212] dark:text-[#e0e0e0]"
    >
      {/* Header */}
      <DashboardHeader
        userData={userData}
        userInitials={userInitials}
        tierLabel={tierLabels[userData.tier] || tierLabels['univ']}
        activeModules={activeModules}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isNotifOpen={isNotifOpen}
        setIsNotifOpen={setIsNotifOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        notifRef={notifRef}
        profileRef={profileRef}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar userData={userData} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Main content wrapper */}
        <main className="flex-1 overflow-y-auto bg-bg-light focus:outline-none dark:bg-[#121212]">
          <div className="mx-auto max-w-[1400px] p-4 pb-24 sm:p-6 md:pb-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
