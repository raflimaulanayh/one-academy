'use client'

import { MenuItem } from '@/constants/menu'
import { Link } from '@/i18n/routing'
import { CaretRightIcon } from '@phosphor-icons/react'
import * as React from 'react'

import { cn } from '@/utils'

interface MobileMenuItemProps {
  item: MenuItem
  pathname: string
  isActive?: boolean
  depth?: number
  onClose?: () => void
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export const MobileMenuItem = ({ item, pathname, isActive = false, depth = 0, onClose, onClick }: MobileMenuItemProps) => {
  const [isExpanded, setIsExpanded] = React.useState(isActive)

  React.useEffect(() => {
    if (isActive) {
      setIsExpanded(true)
    }
  }, [isActive])

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-md p-2 transition-all hover:scale-100',
            depth === 0 ? 'font-semibold' : 'text-sm font-medium',
            isActive ? 'bg-primary/10 text-primary' : 'text-text-dark hover:bg-primary/10 hover:text-primary'
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
          <ul className="mt-1 ml-4 flex flex-col gap-1 border-l-2 border-border pl-3">
            {item.children.map((child) => (
              <li key={child.url}>
                <MobileMenuItem
                  item={child}
                  pathname={pathname}
                  isActive={pathname === child.url}
                  depth={depth + 1}
                  onClose={onClose}
                  onClick={onClick}
                />
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
      onClick={(e) => {
        onClick?.(e)
        onClose?.()
      }}
      className={cn(
        'flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 transition-all hover:scale-100',
        depth === 0 ? 'p-2 font-semibold' : 'text-sm font-medium',
        isActive ? 'bg-primary/10 text-primary' : 'text-text-dark hover:bg-primary/10 hover:text-primary'
      )}
    >
      {item.label}
      <CaretRightIcon size={depth === 0 ? 20 : 14} weight="bold" className="shrink-0" />
    </Link>
  )
}
