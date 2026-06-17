'use client'

import { ChatsIcon, ChatsTeardropIcon } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'

export function ForumCard() {
  const t = useTranslations('Dashboard')

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(0,48,87,0.04)] sm:p-5 dark:border-[#2e2e2e] dark:bg-[#1e1e1e]">
      <h2 className="mb-3 flex items-center gap-2 border-b border-border pb-3 text-sm font-bold text-[#333] sm:text-base dark:border-[#2e2e2e] dark:text-white">
        <ChatsIcon size={20} className="text-primary" /> {t('forumTitle')}
      </h2>
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-center dark:border-neutral-800 dark:bg-[#1a1a1a]">
        <ChatsTeardropIcon size={32} className="mx-auto mb-2 block text-text-muted" />
        <p className="text-xs font-bold text-[#333] dark:text-white">{t('forumEmptyTitle')}</p>
        <p className="mt-1 text-[10px] text-text-muted">{t('forumEmptyDesc')}</p>
      </div>
    </div>
  )
}
