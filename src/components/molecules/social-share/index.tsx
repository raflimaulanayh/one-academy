'use client'

import { FacebookLogoIcon, WhatsappLogoIcon, XIcon } from '@phosphor-icons/react'
import { usePathname } from 'next/navigation'
import { FacebookShareButton, WhatsappShareButton, XShareButton } from 'react-share'

export const SocialShare = ({ title = '', label = '' }) => {
  const pathname = usePathname()
  const baseURL =
    typeof window !== 'undefined' ? `${title}${title !== '' ? '\n\n' : ''}${window.location.origin}${pathname}` : ''

  return (
    <div className="space-y-4">
      <h2 className="font-medium text-gray-900">{label}</h2>
      <div className="flex items-center space-x-2">
        <FacebookShareButton url={baseURL}>
          <div className="flex size-10 items-center justify-center rounded-full bg-primary">
            <FacebookLogoIcon weight="fill" size={20} className="text-white" />
          </div>
        </FacebookShareButton>
        <XShareButton url={baseURL}>
          <div className="flex size-10 items-center justify-center rounded-full bg-primary">
            <XIcon weight="fill" size={20} className="text-white" />
          </div>
        </XShareButton>
        <WhatsappShareButton url={baseURL}>
          <div className="flex size-10 items-center justify-center rounded-full bg-primary">
            <WhatsappLogoIcon weight="fill" size={20} className="text-white" />
          </div>
        </WhatsappShareButton>
      </div>
    </div>
  )
}
