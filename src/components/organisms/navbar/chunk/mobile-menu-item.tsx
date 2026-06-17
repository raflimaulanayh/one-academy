'use client'

import { MenuItem } from '@/constants/menu'
import { CaretRightIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import * as React from 'react'

import { cn } from '@/utils'

interface MobileMenuItemProps {
  item: MenuItem
  pathname: string
  depth?: number
}

export const MobileMenuItem = ({ item, pathname, depth = 0 }: MobileMenuItemProps) => {
  const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`)
  const [isExpanded, setIsExpanded] = React.useState(isActive)

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-md p-2 transition-all hover:scale-100',
            depth === 0 ? 'font-semibold' : 'text-sm font-medium',
            isActive ? 'bg-blue-50 text-primary' : 'text-slate-700 hover:bg-blue-50 hover:text-primary'
          )}
        >
          {item.label}
          <CaretRightIcon
            size={depth === 0 ? 18 : 14}
            weight="bold"
            className={cn('shrink-0 transition-transform duration-200', isExpanded && 'rotate-90')}
          />
        </button>

        {isExpanded && (
          <ul className="mt-1 ml-4 flex flex-col gap-1 border-l-2 border-slate-100 pl-3">
            {item.children.map((child) => (
              <li key={child.url}>
                <MobileMenuItem item={child} pathname={pathname} depth={depth + 1} />
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.url}
      className={cn(
        'flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 transition-all hover:scale-100',
        depth === 0 ? 'p-2 font-semibold' : 'text-sm font-medium',
        pathname === item.url ? 'bg-blue-50 text-primary' : 'text-slate-700 hover:bg-blue-50 hover:text-primary'
      )}
    >
      {item.label}
      <CaretRightIcon size={depth === 0 ? 20 : 14} weight="bold" className="shrink-0" />
    </Link>
  )
}
