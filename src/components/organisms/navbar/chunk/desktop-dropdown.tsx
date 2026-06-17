'use client'

import { MenuItem } from '@/constants/menu'
import { CaretDownIcon, CaretRightIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import * as React from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/ui/popover'

import { cn } from '@/utils'

interface DesktopDropdownProps {
  item: MenuItem
  pathname: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const DesktopDropdown = ({ item, pathname, isOpen, onOpenChange }: DesktopDropdownProps) => {
  const [flyoutItems, setFlyoutItems] = React.useState<MenuItem[]>([])
  const [flyoutKey, setFlyoutKey] = React.useState<string | null>(null)
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`)

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => {
      onOpenChange(false)
      setFlyoutItems([])
      setFlyoutKey(null)
    }, 100)
  }

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const handleOpen = () => {
    cancelClose()
    onOpenChange(true)
  }

  const hasFlyout = flyoutItems.length > 0

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger
        onMouseEnter={handleOpen}
        onMouseLeave={scheduleClose}
        className={cn(
          'group relative flex items-center gap-1 text-sm font-medium transition-all outline-none',
          isActive ? 'text-primary' : 'text-slate-900 hover:text-primary'
        )}
      >
        {item.label}
        <CaretDownIcon size={14} weight="bold" className={cn('transition-transform duration-200', isOpen && 'rotate-180')} />
        <span
          className={cn(
            'absolute -bottom-1.5 left-0 h-0.5 bg-primary transition-all duration-300',
            isActive ? 'w-full' : 'w-0 group-hover:w-full'
          )}
        />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        onMouseEnter={handleOpen}
        onMouseLeave={scheduleClose}
        className="w-auto min-w-[280px] p-2"
      >
        <div className="flex">
          <ul className="w-70 shrink-0 space-y-1 overflow-hidden">
            {item.children?.map((child) => {
              const isChildActive = pathname === child.url
              const hasGrandchildren = !!child.children?.length
              const isThisFlyoutActive = flyoutKey === child.url

              return (
                <li key={child.url}>
                  <Link
                    href={child.url}
                    onMouseEnter={() => {
                      if (hasGrandchildren) {
                        setFlyoutItems(child.children ?? [])
                        setFlyoutKey(child.url)
                      } else {
                        setFlyoutItems([])
                        setFlyoutKey(null)
                      }
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                      isChildActive || isThisFlyoutActive
                        ? 'bg-blue-50 text-primary'
                        : 'text-slate-700 hover:bg-blue-50 hover:text-primary'
                    )}
                  >
                    <span className="flex-1 truncate">{child.label}</span>
                    {hasGrandchildren && <CaretRightIcon size={13} weight="bold" className="shrink-0" />}
                  </Link>
                </li>
              )
            })}
          </ul>

          {hasFlyout && (
            <React.Fragment>
              <div className="mx-2 w-px shrink-0 self-stretch bg-slate-200" />
              <ul className="w-70 shrink-0 space-y-1 overflow-hidden">
                {flyoutItems.map((grandchild) => {
                  const isGrandchildActive = pathname === grandchild.url

                  return (
                    <li key={grandchild.url}>
                      <Link
                        href={grandchild.url}
                        className={cn(
                          'flex w-full items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                          isGrandchildActive
                            ? 'bg-blue-50 text-primary'
                            : 'text-slate-700 hover:bg-blue-50 hover:text-primary'
                        )}
                      >
                        {grandchild.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </React.Fragment>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
