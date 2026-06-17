'use client'

import { Link } from '@/i18n/routing'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  EnvelopeIcon,
  LockIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  UsersIcon,
  TrophyIcon,
  ArrowLeftIcon
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/atoms/ui/button'
import { Input } from '@/components/atoms/ui/input'
import { Label } from '@/components/atoms/ui/label'
import { ThemeToggle } from '@/components/atoms/ui/theme-toggle'
import { BilingualPopover } from '@/components/organisms/navbar/chunk/bilingual-popover'
import { AuthLayout } from '@/components/templates/auth-layout'

import { cn } from '@/utils'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const t = useTranslations('Auth.login')
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  })

  const stats = [
    { icon: UsersIcon, label: t('statsStudents'), value: '2.400+' },
    { icon: BookOpenIcon, label: t('statsModules'), value: '180+' },
    { icon: TrophyIcon, label: t('statsLevels'), value: '4 Level' }
  ]

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false
      })

      if (result?.error) {
        toast.error(t('errorCredentials'))
      } else {
        toast.success(t('success'))
        const mockUserCookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith('mock_user_data='))
          ?.split('=')[1]

        if (mockUserCookie) {
          try {
            const mockUser = JSON.parse(decodeURIComponent(mockUserCookie))
            if (mockUser.email === values.email && !mockUser.accountComplete) {
              router.push('/register/detail')

              return
            }
          } catch (e) {
            console.error(e)
          }
        }

        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      toast.error(t('errorGeneric'))
      console.error(error)
    }
  }

  const handleAutofill = () => {
    setValue('email', 'student@oneacademy.id')
    setValue('password', 'password123')
    toast.info(t('toastAutofill'))
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
              <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white">
                {t('brandTitle').split('.')[0]}.<br />
              </h1>
              <p className="max-w-sm text-sm leading-relaxed text-white/70">{t('brandSubtitle')}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {stats.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4.5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                >
                  <Icon size={24} weight="duotone" className="mb-2.5 text-secondary" />
                  <p className="text-xl font-bold tracking-tight text-white">{value}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-white/60">{label}</p>
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

          <div className="w-full max-w-sm space-y-8">
            {/* Mobile logo */}
            <div className="flex flex-col items-center space-y-1 lg:hidden">
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="login-email" className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  {t('email')}
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-text-muted">
                    <EnvelopeIcon size={17} />
                  </div>
                  <Input
                    id="login-email"
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                    {t('password')}
                  </Label>
                  <a href="#" className="text-xs font-medium text-primary hover:underline dark:text-secondary">
                    {t('forgotPassword')}
                  </a>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-text-muted">
                    <LockIcon size={17} />
                  </div>
                  <Input
                    id="login-password"
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold"
              >
                {isSubmitting ? t('submitting') : t('submit')}
                <ArrowRightIcon size={16} weight="bold" />
              </Button>
            </form>

            <button
              type="button"
              onClick={handleAutofill}
              className="flex w-full items-center gap-3 rounded-xl border border-dashed border-secondary/40 bg-secondary/5 p-4 text-left transition-colors duration-200 hover:bg-secondary/10"
            >
              <ShieldCheckIcon size={22} weight="duotone" className="shrink-0 text-secondary" />
              <div>
                <p className="text-xs font-bold text-text-dark">{t('demoTitle')}</p>
                <p className="text-[10px] text-text-muted">{t('demoDesc')}</p>
              </div>
            </button>

            <p className="text-center text-sm text-text-muted">
              {t('noAccount')}{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline dark:text-secondary">
                {t('registerLink')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  )
}
