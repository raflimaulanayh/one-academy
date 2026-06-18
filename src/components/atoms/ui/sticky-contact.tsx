'use client'

import { WHATSAPP_LINK } from '@/constants/general-data'
import { Link } from '@/i18n/routing'
import { HeadsetIcon } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { MdArrowRight } from 'react-icons/md'

import { cn } from '@/utils/cn'

export const StickyContact = () => {
  const [show, setShow] = useState(false)
  const locale = useLocale()

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      const footerElement = document.querySelector('footer')
      const windowHeight = window.innerHeight
      const documentHeight = document.body.scrollHeight

      if (footerElement) {
        const footerOffset = footerElement.offsetTop
        const scrollPosition = offset + windowHeight

        setShow(scrollPosition < documentHeight - 10 && offset > 1 && scrollPosition < footerOffset)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Link
      tabIndex={0}
      aria-label={locale === 'en' ? 'Contact us via AI Chatbot' : 'Hubungi kami melalui AI Chatbot'}
      href={WHATSAPP_LINK}
      target="_blank"
      className={cn(
        show ? 'right-4 lg:right-9' : '-right-full',
        'gtm-contact-wa fixed bottom-4 z-40 flex items-center gap-2 transition-all duration-700 lg:bottom-7'
      )}
    >
      <div className="relative hidden rounded-full bg-[#BBF7D0] px-2.5 py-1 text-sm font-medium text-[#14532D] lg:block">
        <span>Live Chat</span>
        <MdArrowRight size={35} className="absolute -top-[3px] -right-4 text-[#BBF7D0]" />
      </div>

      <div className="relative rounded-full bg-[#0ACF83]/20 p-4">
        <div className="absolute inline-flex size-13 animate-ping rounded-full bg-green-500" />
        <div className="relative z-10 rounded-full bg-green-600 p-2 text-white">
          <HeadsetIcon size={37} className="h-9 w-9" />
        </div>
      </div>
    </Link>
  )
}
