'use client'

import { ChecksIcon, CheckCircleIcon, PlayCircleIcon, FileTextIcon } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import type { TodoItem } from './types'

type Tab = 'upcoming' | 'outdated'

type Props = {
  todos: { upcoming: TodoItem[]; outdated: TodoItem[] }
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

export function TodoListCard({ todos, activeTab, setActiveTab }: Props) {
  const t = useTranslations('Dashboard')
  const items = todos[activeTab]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(0,48,87,0.04)] sm:p-5 dark:border-[#2e2e2e] dark:bg-[#1e1e1e]">
      <div className="mb-3 flex items-center justify-between border-b border-border pb-3 dark:border-[#2e2e2e]">
        <h2 className="flex items-center gap-2 text-sm font-bold text-[#333] sm:text-base dark:text-white">
          <ChecksIcon size={20} className="text-primary" /> {t('todoTitle')}
        </h2>
      </div>

      {/* Tabs */}
      <div className="mb-3 flex border-b border-border text-xs font-semibold dark:border-[#2e2e2e]">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-center gap-1.5 border-b-2 pb-2 text-center transition-all focus:outline-none',
            activeTab === 'upcoming'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-[#333] dark:hover:text-white'
          )}
        >
          <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[9px] leading-none font-bold text-white">
            {todos.upcoming.length}
          </span>
          {t('todoUpcoming')}
        </button>
        <button
          onClick={() => setActiveTab('outdated')}
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-center gap-1.5 border-b-2 pb-2 text-center transition-all focus:outline-none',
            activeTab === 'outdated'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-[#333] dark:hover:text-white'
          )}
        >
          <span className="rounded-full bg-neutral-300 px-1.5 py-0.5 text-[9px] leading-none font-bold text-[#333] dark:bg-neutral-700 dark:text-neutral-300">
            {todos.outdated.length}
          </span>
          {t('todoOutdated')}
        </button>
      </div>

      {/* Items */}
      <div className="flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <div className="py-4 text-center text-xs text-text-muted">{t('todoEmpty')}</div>
        ) : (
          items.map((todo, idx) => (
            <div
              key={idx}
              className={cn(
                'flex gap-3 text-xs',
                idx < items.length - 1 && 'border-b border-border/40 pb-3 dark:border-neutral-800/40'
              )}
            >
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary dark:bg-blue-950/30">
                {todo.type === 'shield' ? (
                  <CheckCircleIcon size={14} />
                ) : todo.type === 'video' ? (
                  <PlayCircleIcon size={14} />
                ) : (
                  <FileTextIcon size={14} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="leading-snug font-bold text-[#333] dark:text-white">{todo.title}</p>
                <p className="mt-0.5 truncate text-[10px] text-text-muted">
                  {t('todoCourse')} <span className="font-semibold">{todo.course}</span>
                </p>
                <p className={cn('mt-0.5 text-[10px]', todo.isUrgent ? 'font-bold text-red-500' : 'text-text-muted')}>
                  {todo.date}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
