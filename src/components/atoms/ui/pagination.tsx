'use client'

import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { useEffect } from 'react'
import ReactPaginate from 'react-paginate'

import { useIsDesktop } from '@/hooks/useIsDesktop'

import { cn } from '@/utils/cn'

interface PaginationProps {
  initiatePage?: number
  onPageChange: (page: number) => void
  pageCount?: number
  className?: string
  toTop?: boolean
  pageRangeDisplayed?: number
  marginPagesDisplayed?: number
}

export const Pagination: React.FC<PaginationProps> = ({
  initiatePage,
  onPageChange,
  pageCount,
  className,
  toTop = false,
  pageRangeDisplayed = 2,
  marginPagesDisplayed = 2
}) => {
  const isDesktop = useIsDesktop()
  useEffect(() => {
    if (toTop) {
      window.scrollTo(0, 0)
    }
  }, [onPageChange, toTop])

  if (!pageCount || pageCount <= 1) {
    return null
  }

  return (
    <ReactPaginate
      breakLabel="..."
      forcePage={initiatePage}
      className={cn('flex items-center justify-center gap-2 py-5', className)}
      pageLinkClassName="size-8 cursor-pointer hover:bg-primary hover:text-white rounded-full flex items-center justify-center text-gray-600"
      activeLinkClassName="!text-white"
      activeClassName="size-8 cursor-pointer flex items-center justify-center bg-primary rounded-full"
      nextClassName="size-8 cursor-pointer flex items-center justify-center pl-2"
      previousClassName="size-8 cursor-pointer flex items-center justify-center pr-2"
      breakClassName="size-8 cursor-pointer flex items-center justify-center"
      nextLabel={
        <div className="flex size-8 cursor-pointer items-center justify-center rounded-full ring-1 ring-primary disabled:ring-gray-600">
          <CaretRightIcon className="size-5 text-primary disabled:text-gray-600" />
        </div>
      }
      onPageChange={({ selected }) => {
        onPageChange(selected + 1)
      }}
      pageRangeDisplayed={isDesktop ? pageRangeDisplayed : 2}
      marginPagesDisplayed={isDesktop ? marginPagesDisplayed : 1}
      pageCount={pageCount || 0}
      previousLabel={
        <div className="flex size-8 cursor-pointer items-center justify-center rounded-full ring-1 ring-primary disabled:ring-gray-600">
          <CaretLeftIcon className="size-5 text-primary disabled:text-gray-600" />
        </div>
      }
      disableInitialCallback
    />
  )
}
