'use client'

import { Link } from '@/i18n/routing'
import { zodResolver } from '@hookform/resolvers/zod'
import { EnvelopeIcon, LockIcon, ArrowRightIcon, ShieldCheckIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/atoms/ui/button'
import { Input } from '@/components/atoms/ui/input'
import { Label } from '@/components/atoms/ui/label'
import { Container } from '@/components/templates/container'

const loginSchema = z.object({
  email: z.string().email({ message: 'Alamat email tidak valid' }),
  password: z.string().min(6, { message: 'Kata sandi minimal 6 karakter' })
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
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

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false
      })

      if (result?.error) {
        toast.error('Email atau password salah.')
      } else {
        toast.success('Login berhasil!')
        // Skenario mockup redirect:
        // Cek apakah accountComplete di cookie bernilai false
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
      toast.error('Terjadi kesalahan saat masuk.')
      console.error(error)
    }
  }

  // Helper autofill untuk kemudahan presentasi klien
  const handleAutofill = () => {
    setValue('email', 'student@oneacademy.id')
    setValue('password', 'password123')
    toast.info('Akun mock siswa otomatis terisi!')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-bg-light to-canvas px-4 py-12 sm:px-6 lg:px-8 dark:from-navy-dark dark:to-canvas">
      <Container className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 rounded-3xl border border-border bg-canvas p-8 shadow-2xl backdrop-blur-sm dark:bg-navy-medium/20"
        >
          {/* Logo & Header */}
          <div className="space-y-2 text-center">
            <Link href="/" className="inline-block text-2xl font-black tracking-tight text-primary dark:text-secondary">
              ONE ACADEMY
            </Link>
            <h2 className="text-2xl font-extrabold text-text-dark">Masuk Portal Siswa</h2>
            <p className="text-sm text-text-muted">Gunakan email & kata sandi terdaftar untuk mengakses dashboard Anda.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                  <EnvelopeIcon size={18} />
                </div>
                <Input id="email" type="email" placeholder="nama@email.com" className="pl-10" {...register('email')} />
              </div>
              {errors.email && <p className="text-xs font-semibold text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Kata Sandi</Label>
                <a href="#" className="text-xs font-medium text-primary hover:underline dark:text-secondary">
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                  <LockIcon size={18} />
                </div>
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" {...register('password')} />
              </div>
              {errors.password && <p className="text-xs font-semibold text-red-500">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 font-bold"
            >
              {isSubmitting ? 'Masuk...' : 'Masuk Akun'}
              <ArrowRightIcon size={16} weight="bold" />
            </Button>
          </form>

          {/* Demo account helper */}
          <button
            type="button"
            onClick={handleAutofill}
            className="flex w-full items-center gap-3 rounded-xl border border-dashed border-secondary/40 bg-secondary/5 p-4 text-left transition-colors duration-200 hover:bg-secondary/10"
          >
            <ShieldCheckIcon size={24} weight="duotone" className="shrink-0 text-secondary" />
            <div>
              <p className="text-xs font-bold text-text-dark">Akun Demo Presentasi Klien</p>
              <p className="text-[10px] text-text-muted">Klik untuk mengisi akun default siswa secara instan.</p>
            </div>
          </button>

          {/* Register link */}
          <div className="text-center text-sm text-text-muted">
            Belum memiliki akun?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline dark:text-secondary">
              Daftar di sini
            </Link>
          </div>
        </motion.div>
      </Container>
    </div>
  )
}
