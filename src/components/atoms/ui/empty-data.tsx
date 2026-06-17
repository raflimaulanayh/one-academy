import Image from 'next/image'

import { cn } from '@/utils'

interface Props {
  className?: string
  title?: string
  description?: string
}
export const EmptyData = ({ className, title, description }: Props) => {
  return (
    <figure className={cn('flex flex-col items-center space-y-4 pb-3', className)}>
      <Image src="/static/icons/empty-data/empty-1.svg" alt="empty-point" width={644} height={325} />
      <figcaption className="space-y-2 text-center">
        <h2 className="text-center font-medium text-gray-900 md:text-2xl">{title ?? 'Oops, belum ada data nih!'}</h2>
        <p className="text-xs font-normal text-gray-600 md:text-base">
          {description ?? 'Tenang, data yang kamu cari bakal muncul di sini kalau sudah tersedia. Yuk cek lagi nanti!'}
        </p>
      </figcaption>
    </figure>
  )
}
