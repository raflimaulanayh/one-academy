'use client'

import { Link } from '@/i18n/routing'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  GraduationCapIcon,
  EnvelopeIcon,
  LockIcon,
  UserIcon,
  ArrowRightIcon,
  SparkleIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/atoms/ui/button'
import { Input } from '@/components/atoms/ui/input'
import { Label } from '@/components/atoms/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/ui/select'
import { ThemeToggle } from '@/components/atoms/ui/theme-toggle'
import { BilingualPopover } from '@/components/organisms/navbar/chunk/bilingual-popover'
import { AuthLayout } from '@/components/templates/auth-layout'

import { cn } from '@/utils'

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  tier: z.enum(['sd', 'smp', 'sma', 'univ'])
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const t = useTranslations('Auth.register')
  const searchParams = useSearchParams()
  const router = useRouter()
  const defaultTier = (searchParams.get('tier') || 'univ') as RegisterFormValues['tier']

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { tier: defaultTier }
  })

  const selectedTier = watch('tier')

  const benefits = [t('benefit1'), t('benefit2'), t('benefit3')]

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const mockUser = {
        name: values.name,
        email: values.email,
        password: values.password,
        tier: values.tier,
        accountComplete: false
      }
      Cookies.set('mock_user_data', JSON.stringify(mockUser), { expires: 7 })

      toast.success(t('success'))

      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false
      })

      if (result?.error) {
        toast.error(t('errorAuth'))
        router.push('/auth/login')
      } else {
        router.push('/register/detail')
      }
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
                <SparkleIcon
                  size={20}
                  weight="duotone"
                  className="animate-spin text-secondary"
                  style={{ animationDuration: '6s' }}
                />
                <span className="text-xs font-bold tracking-widest text-secondary uppercase">{t('brandBadge')}</span>
              </div>
              <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white">
                {t('brandTitle').split('.')[0]}.<br />
                <span className="text-secondary">{t('brandTitle').split('.')[1]?.trim()}</span>
              </h1>
              <p className="max-w-sm text-sm leading-relaxed text-white/70">{t('brandSubtitle')}</p>
            </div>
            <div className="space-y-3 pt-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                >
                  <CheckCircleIcon size={20} weight="fill" className="shrink-0 text-secondary" />
                  <p className="text-sm text-white/80">{benefit}</p>
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
              <h2 className="text-2xl font-extrabold text-text-dark">{t('title')}</h2>
              <p className="text-sm text-text-muted">{t('subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Nama Lengkap */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reg-name" className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  {t('name')}
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-text-muted">
                    <UserIcon size={17} />
                  </div>
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder={t('namePlaceholder')}
                    className={cn(
                      'h-12 rounded-xl border border-slate-300 bg-slate-50/50 pl-11 text-sm focus:border-primary focus:bg-canvas dark:border-white/20 dark:bg-navy-medium/20 dark:focus:border-primary',
                      errors.name && 'border-red-400 bg-red-50 dark:bg-red-950/20'
                    )}
                    {...register('name')}
                  />
                </div>
                {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reg-email" className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  {t('email')}
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-text-muted">
                    <EnvelopeIcon size={17} />
                  </div>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="nama@email.com"
                    className={cn(
                      'h-12 rounded-xl border border-slate-300 bg-slate-50/50 pl-11 text-sm focus:border-primary focus:bg-canvas dark:border-white/20 dark:bg-navy-medium/20 dark:focus:border-primary',
                      errors.email && 'border-red-400 bg-red-50 dark:bg-red-950/20'
                    )}
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reg-password" className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  {t('password')}
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-text-muted">
                    <LockIcon size={17} />
                  </div>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    className={cn(
                      'h-12 rounded-xl border border-slate-300 bg-slate-50/50 pl-11 text-sm focus:border-primary focus:bg-canvas dark:border-white/20 dark:bg-navy-medium/20 dark:focus:border-primary',
                      errors.password && 'border-red-400 bg-red-50 dark:bg-red-950/20'
                    )}
                    {...register('password')}
                  />
                </div>
                {errors.password && <p className="text-xs font-medium text-red-500">{errors.password.message}</p>}
              </div>

              {/* Jenjang Pendidikan */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reg-tier" className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  {t('tier')}
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-text-muted">
                    <GraduationCapIcon size={17} />
                  </div>
                  <Select
                    value={selectedTier}
                    onValueChange={(value) => setValue('tier', value as RegisterFormValues['tier'])}
                  >
                    <SelectTrigger
                      id="reg-tier"
                      className="h-12 rounded-xl border border-slate-300 bg-slate-50/50 pl-11 text-sm focus:border-primary dark:border-white/20 dark:bg-navy-medium/20 dark:focus:border-primary"
                    >
                      <SelectValue placeholder={t('tierPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white dark:bg-navy-dark">
                      <SelectItem value="sd">{t('tierSD')}</SelectItem>
                      <SelectItem value="smp">{t('tierSMP')}</SelectItem>
                      <SelectItem value="sma">{t('tierSMA')}</SelectItem>
                      <SelectItem value="univ">{t('tierUniv')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.tier && <p className="text-xs font-medium text-red-500">{errors.tier.message}</p>}
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

            <p className="text-center text-sm text-text-muted">
              {t('hasAccount')}{' '}
              <Link href="/auth/login" className="font-semibold text-primary hover:underline dark:text-secondary">
                {t('loginLink')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  )
}
