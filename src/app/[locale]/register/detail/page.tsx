'use client'

import { Link } from '@/i18n/routing'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  PhoneIcon,
  HouseIcon,
  BuildingsIcon,
  ArrowRightIcon,
  ListChecksIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/atoms/ui/button'
import { Input } from '@/components/atoms/ui/input'
import { Label } from '@/components/atoms/ui/label'
import { Textarea } from '@/components/atoms/ui/textarea'
import { ThemeToggle } from '@/components/atoms/ui/theme-toggle'
import { BilingualPopover } from '@/components/organisms/navbar/chunk/bilingual-popover'
import { AuthLayout } from '@/components/templates/auth-layout'

import { cn } from '@/utils'

const detailSchema = z.object({
  phone: z.string().min(10),
  school: z.string().min(3),
  address: z.string().min(5)
})

type DetailFormValues = z.infer<typeof detailSchema>

export default function RegisterDetailPage() {
  const t = useTranslations('Auth.detail')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<DetailFormValues>({
    resolver: zodResolver(detailSchema)
  })

  const steps = [
    { label: t('step1'), done: true },
    { label: t('step2'), done: false },
    { label: t('step3'), done: false }
  ]

  const onSubmit = async (values: DetailFormValues) => {
    try {
      const mockUserCookie = Cookies.get('mock_user_data')
      let mockUser = {
        name: 'Siswa Baru',
        email: 'siswa@oneacademy.id',
        password: '',
        tier: 'univ',
        accountComplete: false
      }

      if (mockUserCookie) {
        try {
          mockUser = JSON.parse(mockUserCookie)
        } catch (e) {
          console.error(e)
        }
      }

      const updatedUser = {
        ...mockUser,
        phone: values.phone,
        school: values.school,
        address: values.address,
        accountComplete: true
      }

      Cookies.set('mock_user_data', JSON.stringify(updatedUser), { expires: 7 })

      toast.success(t('success'))
      router.push('/dashboard')
    } catch (error) {
      toast.error(t('errorGeneric'))
      console.error(error)
    }
  }

  return (
    <AuthLayout>
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left — Brand Panel */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative hidden flex-col justify-between overflow-hidden bg-navy-dark p-12 lg:flex lg:w-[42%]"
        >
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-20 -left-20 h-96 w-96 animate-pulse rounded-full bg-primary/25 blur-3xl"
              style={{ animationDuration: '8s' }}
            />
            <div
              className="absolute -right-10 bottom-20 h-80 w-80 animate-pulse rounded-full bg-secondary/20 blur-3xl"
              style={{ animationDuration: '12s' }}
            />
            <div
              className="absolute top-1/2 left-1/3 h-52 w-52 animate-pulse rounded-full bg-accent-cyan/15 blur-2xl"
              style={{ animationDuration: '10s' }}
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,255,255,0.4) 1.5px, transparent 1.5px)`,
              backgroundSize: '30px 30px'
            }}
          />

          <div className="relative">
            <Link href="/" className="relative inline-block h-10 w-40">
              <Image
                src="/logo.png"
                alt="One Academy"
                fill
                sizes="160px"
                className="pointer-events-none object-contain object-left brightness-0 invert"
                priority
              />
            </Link>
          </div>

          <div className="relative space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ListChecksIcon size={20} weight="duotone" className="text-secondary" />
                <span className="text-xs font-bold tracking-widest text-secondary uppercase">{t('stepBadge')}</span>
              </div>
              <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white">
                {t('brandTitle').split('.')[0]}.<br />
                <span className="text-secondary">{t('brandTitle').split('.')[1]?.trim()}</span>
              </h1>
              <p className="max-w-sm text-sm leading-relaxed text-white/70">{t('brandSubtitle')}</p>
            </div>

            <div className="space-y-3.5 pt-4">
              {steps.map((step, i) => (
                <div
                  key={step.label}
                  className={cn(
                    'flex items-center gap-4.5 rounded-xl border p-3.5 backdrop-blur-sm transition-all duration-300',
                    step.done
                      ? 'border-secondary/20 bg-secondary/5'
                      : i === 1
                        ? 'border-white/10 bg-white/5'
                        : 'border-white/5 bg-white/[0.02] opacity-50'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                      step.done
                        ? 'bg-secondary text-navy-dark'
                        : i === 1
                          ? 'border-2 border-secondary text-secondary shadow-[0_0_10px_rgba(0,176,255,0.3)]'
                          : 'border-2 border-white/20 text-white/30'
                    )}
                  >
                    {step.done ? <CheckCircleIcon size={18} weight="fill" /> : i + 1}
                  </div>
                  <div className="flex flex-col">
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        step.done ? 'text-white/90' : i === 1 ? 'text-white' : 'text-white/30'
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="mt-0.5 text-[10px] text-white/40">
                      {step.done ? 'Selesai' : i === 1 ? 'Sedang diisi...' : 'Belum dimulai'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs text-white/30">
            &copy; {new Date().getFullYear()} One Academy. All rights reserved.
          </p>
        </motion.div>

        {/* Right — Form Panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative flex flex-1 flex-col items-center justify-center bg-canvas px-6 py-16 dark:bg-navy-dark"
        >
          {/* Top-Left Back Button */}
          <div className="absolute top-4 left-4 z-20">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-text-muted transition-all duration-200 hover:bg-slate-50 hover:text-text-dark dark:border-navy-medium dark:bg-navy-dark/80 dark:text-slate-300 dark:hover:bg-navy-medium/30 dark:hover:text-white"
            >
              <ArrowLeftIcon size={14} weight="bold" />
              <span>{t('backToHome')}</span>
            </Link>
          </div>

          {/* Top Toggles */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <BilingualPopover />
            <ThemeToggle />
          </div>

          <div className="w-full max-w-sm space-y-7">
            {/* Mobile logo */}
            <div className="flex flex-col items-center lg:hidden">
              <Link href="/" className="relative h-9 w-36">
                <Image
                  src="/logo.png"
                  alt="One Academy"
                  fill
                  sizes="144px"
                  className="pointer-events-none object-contain dark:brightness-0 dark:invert"
                  priority
                />
              </Link>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold tracking-widest text-secondary uppercase">{t('stepBadge')}</span>
              <h2 className="text-2xl font-extrabold text-text-dark">{t('title')}</h2>
              <p className="text-sm text-text-muted">{t('subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Nomor WhatsApp */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="detail-phone" className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  {t('phone')}
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-text-muted">
                    <PhoneIcon size={17} />
                  </div>
                  <Input
                    id="detail-phone"
                    type="tel"
                    placeholder={t('phonePlaceholder')}
                    className={cn(
                      'h-12 rounded-xl border border-slate-300 bg-slate-50/50 pl-11 text-sm focus:border-primary focus:bg-canvas dark:border-white/20 dark:bg-navy-medium/20 dark:focus:border-primary',
                      errors.phone && 'border-red-400 bg-red-50 dark:bg-red-950/20'
                    )}
                    {...register('phone')}
                  />
                </div>
                {errors.phone && <p className="text-xs font-medium text-red-500">{errors.phone.message}</p>}
              </div>

              {/* Asal Sekolah */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="detail-school" className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  {t('school')}
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-text-muted">
                    <BuildingsIcon size={17} />
                  </div>
                  <Input
                    id="detail-school"
                    type="text"
                    placeholder={t('schoolPlaceholder')}
                    className={cn(
                      'h-12 rounded-xl border border-slate-300 bg-slate-50/50 pl-11 text-sm focus:border-primary focus:bg-canvas dark:border-white/20 dark:bg-navy-medium/20 dark:focus:border-primary',
                      errors.school && 'border-red-400 bg-red-50 dark:bg-red-950/20'
                    )}
                    {...register('school')}
                  />
                </div>
                {errors.school && <p className="text-xs font-medium text-red-500">{errors.school.message}</p>}
              </div>

              {/* Alamat */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="detail-address" className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  {t('address')}
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute top-3.5 left-0 z-10 flex items-start pl-4 text-text-muted">
                    <HouseIcon size={17} />
                  </div>
                  <Textarea
                    id="detail-address"
                    placeholder={t('addressPlaceholder')}
                    className={cn(
                      'min-h-[90px] resize-none rounded-xl border border-slate-300 bg-slate-50/50 pl-11 text-sm focus:border-primary focus:bg-canvas dark:border-white/20 dark:bg-navy-medium/20 dark:focus:border-primary',
                      errors.address && 'border-red-400 bg-red-50 dark:bg-red-950/20'
                    )}
                    {...register('address')}
                  />
                </div>
                {errors.address && <p className="text-xs font-medium text-red-500">{errors.address.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold"
              >
                {isSubmitting ? t('submitting') : t('submit')}
                <ArrowRightIcon size={16} weight="bold" />
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  )
}
