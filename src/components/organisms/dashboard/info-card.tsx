'use client'

import { InfoIcon, QrCodeIcon, ArrowRightIcon } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function InfoCard() {
  const t = useTranslations('Dashboard')

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(0,48,87,0.04)] sm:p-5 dark:border-[#2e2e2e] dark:bg-[#1e1e1e]">
      <h2 className="mb-4 flex items-center gap-2 border-b border-border pb-4 text-sm font-bold text-[#333] sm:text-base dark:border-[#2e2e2e] dark:text-white">
        <InfoIcon size={20} className="text-primary" /> {t('infoTitle')}
      </h2>

      {/* MFA Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-navy-medium via-navy-active to-primary p-5 text-white sm:p-6">
        <div className="pointer-events-none absolute top-0 right-0 -mt-12 -mr-12 h-40 w-40 rounded-full bg-white/5 blur-3xl"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 -mb-10 -ml-10 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex flex-col gap-5 md:flex-row md:gap-6">
            <div className="min-w-0 flex-1">
              <span className="inline-block rounded bg-primary px-2.5 py-1 text-[9px] font-extrabold tracking-widest text-white uppercase shadow-sm">
                One Academy
              </span>
              <h3 className="mt-2.5 text-base leading-tight font-bold tracking-tight uppercase sm:text-lg">
                {t('mfaTitle')}
              </h3>
              <p className="mt-2 max-w-lg text-[11px] leading-relaxed text-blue-100/90 sm:text-xs">{t('mfaDesc')}</p>

              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.07] p-3 transition-colors hover:bg-white/[0.12]">
                  <span className="block text-[10px] font-bold tracking-wider text-blue-200 uppercase">{t('mfaWhat')}</span>
                  <p className="mt-1 text-[11px] leading-relaxed text-blue-50/80">{t('mfaWhatDesc')}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.07] p-3 transition-colors hover:bg-white/[0.12]">
                  <span className="block text-[10px] font-bold tracking-wider text-blue-200 uppercase">{t('mfaWhy')}</span>
                  <p className="mt-1 text-[11px] leading-relaxed text-blue-50/80">{t('mfaWhyDesc')}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-start justify-center md:justify-end">
              <div className="flex w-full flex-row items-center gap-4 rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:w-auto md:w-44 md:flex-col md:gap-3">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-white p-2 shadow-md md:h-24 md:w-24">
                  <QrCodeIcon size={48} className="text-[#333]" />
                </div>
                <div className="text-left md:text-center">
                  <p className="text-[11px] font-bold tracking-wider text-white uppercase">{t('mfaSetup')}</p>
                  <p className="mt-1 text-[10px] leading-snug text-blue-100/80">{t('mfaScan')}</p>
                  <button
                    onClick={() => toast.success(t('mfaToast'))}
                    className="hover:bg-primary-hover mt-2.5 inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-[10px] font-bold text-white shadow-sm transition-colors"
                  >
                    {t('mfaBtn')} <ArrowRightIcon size={12} weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
