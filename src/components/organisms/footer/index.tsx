'use client'

import { ADDRESS_LOCATION, EMAIL_CONTACT, PHONE_CONTACT, WHATSAPP_LINK } from '@/constants/general-data'
import { FOOTER_LINKS, PUBLIC_MENU, SERVICES_MENU } from '@/constants/menu'
import { Link } from '@/i18n/routing'
import { InstagramLogoIcon, LinkedinLogoIcon, XIcon } from '@phosphor-icons/react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import * as React from 'react'

import { Container } from '@/components/templates/container'

const SOCIAL_MEDIA = [
  { icon: InstagramLogoIcon, href: 'https://www.instagram.com/oneacademy.id', label: 'Instagram' },
  { icon: XIcon, href: 'https://www.x.com/oneacademy_id', label: 'Twitter' },
  { icon: LinkedinLogoIcon, href: 'https://www.linkedin.com/company/one-academy/', label: 'LinkedIn' }
]

export const Footer = () => {
  const locale = useLocale() as 'en' | 'id'
  const t = useTranslations('Footer')

  const contactInfo = React.useMemo(
    () => [
      {
        label: t('addressLabel'),
        value: ADDRESS_LOCATION
      },
      {
        label: t('emailLabel'),
        value: EMAIL_CONTACT,
        href: `mailto:${EMAIL_CONTACT}`
      },
      {
        label: t('waLabel'),
        value: PHONE_CONTACT,
        href: WHATSAPP_LINK,
        isExternal: true
      }
    ],
    [t]
  )

  const navMenu = PUBLIC_MENU[locale]
  const footerLinks = FOOTER_LINKS[locale]

  return (
    <footer className="w-full">
      <h2 className="sr-only">Footer</h2>

      <nav className="bg-primary py-10 lg:py-14">
        <Container className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Link href="/" className="relative h-14 w-50 shrink-0">
              <Image
                src="/logo.png"
                alt="Logo One Academy"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="pointer-events-none object-contain object-left brightness-0 invert"
                priority
              />
            </Link>
            <p className="mb-5 text-sm leading-relaxed text-slate-300">{t('description')}</p>
            <div className="flex items-center gap-4">
              {SOCIAL_MEDIA.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full bg-white text-primary transition-all hover:bg-white/90"
                  aria-label={social.label}
                >
                  <social.icon size={20} weight="fill" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-white">{t('navLinks')}</h3>
            <ul className="flex flex-col gap-3">
              {navMenu.map((item) => (
                <li key={item.url}>
                  <Link href={item.url} className="text-sm text-slate-300 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/chatbot" className="text-sm text-slate-300 transition-colors hover:text-white">
                  {t('faq')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-white">{t('programs')}</h3>
            <ul className="flex flex-col gap-3">
              {SERVICES_MENU.map((service) => (
                <li key={service.url}>
                  <Link href={service.url} className="text-sm text-slate-300 transition-colors hover:text-white">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-white">{t('contact')}</h3>
            <ul className="flex flex-col gap-4">
              {contactInfo.map((contact) => (
                <li key={contact.label} className="flex flex-col gap-1 text-sm text-slate-300">
                  <span className="font-semibold text-white">{contact.label}</span>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      target={contact.isExternal ? '_blank' : undefined}
                      rel={contact.isExternal ? 'noopener noreferrer' : undefined}
                      className="transition-colors hover:text-white"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <span>{contact.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </nav>

      <div className="bg-gray-900 py-6">
        <Container className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-xs text-slate-300 sm:text-sm md:text-left">
            &copy; {new Date().getFullYear()} One Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className="text-xs text-slate-300 transition-colors hover:text-white sm:text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  )
}
