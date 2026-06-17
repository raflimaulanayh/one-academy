'use client'

import { BellIcon, FileArrowUpIcon, MegaphoneIcon, SignOutIcon, DotsNineIcon } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { RefObject } from 'react'
import { toast } from 'sonner'

import type { CourseModule, UserData } from './types'

type Props = {
  userData: UserData
  userInitials: string
  tierLabel: string
  activeModules: CourseModule[]
  isSidebarOpen: boolean
  setIsSidebarOpen: (val: boolean) => void
  isNotifOpen: boolean
  setIsNotifOpen: (val: boolean) => void
  isProfileOpen: boolean
  setIsProfileOpen: (val: boolean) => void
  notifRef: RefObject<HTMLDivElement | null>
  profileRef: RefObject<HTMLDivElement | null>
}

export function DashboardHeader({
  userData,
  userInitials,
  tierLabel,
  activeModules,
  isSidebarOpen,
  setIsSidebarOpen,
  isNotifOpen,
  setIsNotifOpen,
  isProfileOpen,
  setIsProfileOpen,
  notifRef,
  profileRef
}: Props) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header className="z-30 h-16 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-[#2e2e2e] dark:bg-[#1e1e1e]/95">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left: Dots Icon (Desktop Only) + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden rounded-lg p-1.5 text-text-muted transition-colors hover:bg-neutral-100 hover:text-primary md:block dark:hover:bg-neutral-800"
            aria-label="Toggle Menu"
          >
            <DotsNineIcon size={20} weight="bold" />
          </button>
          <div className="hidden h-5 w-px bg-border sm:block dark:bg-neutral-700"></div>
          <Link href="/" className="relative flex h-8 w-32 items-center">
            <Image
              src="/logo.png"
              alt="Logo One Academy"
              fill
              sizes="128px"
              className="object-contain object-left dark:brightness-0 dark:invert"
              priority
            />
          </Link>
          <div className="hidden h-5 w-px bg-border md:block dark:bg-neutral-700"></div>
          <span className="hidden text-[10px] font-bold tracking-wider text-text-muted uppercase md:inline">
            Learning Management System
          </span>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative rounded-full p-2 transition-colors hover:bg-neutral-100 focus:outline-none dark:hover:bg-neutral-800"
              aria-label="Notifikasi"
            >
              <BellIcon size={20} className="text-text-muted" />
              <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[8px] leading-none font-bold text-white">
                3
              </span>
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-white shadow-xl ring-1 ring-black/5 sm:w-96 dark:border-[#2e2e2e] dark:bg-[#1e1e1e]"
                >
                  <div className="flex items-center justify-between border-b border-border px-4 py-3 dark:border-[#2e2e2e]">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-[#333] dark:text-white">
                      <BellIcon size={16} className="text-primary" /> Notifikasi
                    </h3>
                    <button
                      onClick={() => toast.success('Semua notifikasi ditandai dibaca')}
                      className="cursor-pointer text-[10px] font-semibold text-primary hover:underline"
                    >
                      Tandai semua dibaca
                    </button>
                  </div>
                  <div className="max-h-80 divide-y divide-border/40 overflow-y-auto dark:divide-neutral-800/40">
                    <div className="flex cursor-pointer gap-3 border-l-4 border-primary bg-blue-50/60 px-4 py-3 transition-colors hover:bg-blue-50 dark:bg-blue-950/10 dark:hover:bg-blue-950/20">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <FileArrowUpIcon size={16} className="text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs leading-snug font-bold text-[#333] dark:text-white">Tugas baru dirilis</p>
                        <p className="mt-0.5 truncate text-[10px] text-text-muted">{activeModules[0]?.title}</p>
                      </div>
                      <span className="mt-0.5 flex-shrink-0 text-[9px] text-text-muted">2m</span>
                    </div>
                    <div className="flex cursor-pointer gap-3 border-l-4 border-primary bg-blue-50/60 px-4 py-3 transition-colors hover:bg-blue-50 dark:bg-blue-950/10 dark:hover:bg-blue-950/20">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                        <MegaphoneIcon size={16} className="text-amber-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs leading-snug font-bold text-[#333] dark:text-white">
                          Pengumuman: Live mentoring hari ini
                        </p>
                        <p className="mt-0.5 truncate text-[10px] text-text-muted">Akademik — One Academy</p>
                      </div>
                      <span className="mt-0.5 flex-shrink-0 text-[9px] text-text-muted">15m</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 rounded-full p-0.5 transition-all focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary text-sm font-bold text-white shadow-sm dark:border-neutral-700">
                {userInitials}
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-border bg-white p-4 shadow-xl dark:border-[#2e2e2e] dark:bg-[#1e1e1e]"
                >
                  <div className="mb-3 border-b border-border pb-3 dark:border-[#2e2e2e]">
                    <p className="text-sm font-bold text-[#333] dark:text-white">{userData.name}</p>
                    <p className="truncate text-xs text-text-muted">{userData.email}</p>
                    <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {tierLabel}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-red-600 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <SignOutIcon size={16} /> Keluar Sesi
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
