import { siteMetadata } from '@/constants/site-metadata'
import { CaretRightIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { Fragment } from 'react'

import { cn } from '@/utils/cn'

interface BreadcrumbProps {
  items: string[] | (string | [string, string] | undefined)[]
  className?: string
}

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  const schemaList = items
    .map((item, index) => {
      if (!item) return null

      let name = ''
      let itemUrl = ''

      if (Array.isArray(item)) {
        name = item[0]
        itemUrl = item[1].startsWith('http') ? item[1] : `${siteMetadata.url}${item[1]}`
      } else if (typeof item === 'string') {
        name = item

        itemUrl = index === 0 ? siteMetadata.url : ''
      }

      if (!itemUrl) return null

      return {
        '@type': 'ListItem',
        position: index + 1,
        name,
        item: itemUrl
      }
    })
    .filter(Boolean)

  return (
    <Fragment>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: schemaList
          })
        }}
      />
      <ul className={cn('flex items-center gap-x-6 text-sm font-medium', className)}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1

          return (
            <li key={i} className={cn('relative flex items-center', isLast ? 'min-w-0 shrink' : 'shrink-0')}>
              {item && (
                <Fragment>
                  {Array.isArray(item) && (
                    <Link href={item[1]} className={cn('transition-colors hover:text-primary', isLast && 'truncate')}>
                      {item[0]}
                    </Link>
                  )}
                  {typeof item === 'string' && <p className={cn(isLast && 'truncate')}>{item}</p>}
                  {!isLast && (
                    <span className="absolute top-1/2 -right-4 -translate-y-1/2 transform">
                      <CaretRightIcon className="size-3.5" weight="bold" />
                    </span>
                  )}
                </Fragment>
              )}
            </li>
          )
        })}
      </ul>
    </Fragment>
  )
}
