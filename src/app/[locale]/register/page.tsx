'use client'

import { Link } from '@/i18n/routing'
import { zodResolver } from '@hookform/resolvers/zod'
import { GraduationCapIcon, EnvelopeIcon, LockIcon, UserIcon, ArrowRightIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'
import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/atoms/ui/button'
import { Input } from '@/components/atoms/ui/input'
import { Label } from '@/components/atoms/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/ui/select'
import { Container } from '@/components/templates/container'

const registerSchema = z.object({
  name: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter' }),
  email: z.string().email({ message: 'Alamat email tidak valid' }),
  password: z.string().min(6, { message: 'Kata sandi minimal 6 karakter' }),
  tier: z.enum(['sd', 'smp', 'sma', 'univ'])
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const defaultTier = (searchParams.get('tier') || 'univ') as 'sd' | 'smp' | 'sma' | 'univ'

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tier: defaultTier
    }
  })

  const selectedTier = watch('tier')

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      // Simpan ke cookie agar mock API login bisa membaca datanya
      const mockUser = {
        name: values.name,
        email: values.email,
        password: values.password,
        tier: values.tier,
        accountComplete: false
      }
      Cookies.set('mock_user_data', JSON.stringify(mockUser), { expires: 7 })

      toast.success('Pendaftaran akun berhasil!')

      // Login otomatis memakai kredensial yang baru dibuat
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false
      })

      if (result?.error) {
        toast.error('Autentikasi gagal setelah registrasi.')
        router.push('/auth/login')
      } else {
        router.push('/register/detail')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat pendaftaran.')
      console.error(error)
    }
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
            <h2 className="text-2xl font-extrabold text-text-dark">Daftar Akun Baru</h2>
            <p className="text-sm text-text-muted">Lengkapi formulir untuk memulai portal belajar modular Anda.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                  <UserIcon size={18} />
                </div>
                <Input id="name" type="text" placeholder="Masukkan nama lengkap" className="pl-10" {...register('name')} />
              </div>
              {errors.name && <p className="text-xs font-semibold text-red-500">{errors.name.message}</p>}
            </div>

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
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                  <LockIcon size={18} />
                </div>
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" {...register('password')} />
              </div>
              {errors.password && <p className="text-xs font-semibold text-red-500">{errors.password.message}</p>}
            </div>

            {/* Jenjang Pendidikan */}
            <div className="space-y-2">
              <Label htmlFor="tier">Jenjang Pendidikan</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-text-muted">
                  <GraduationCapIcon size={18} />
                </div>
                <Select value={selectedTier} onValueChange={(value) => setValue('tier', value as any)}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Pilih tingkat sekolah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sd">Sekolah Dasar (SD)</SelectItem>
                    <SelectItem value="smp">Sekolah Menengah Pertama (SMP)</SelectItem>
                    <SelectItem value="sma">Sekolah Menengah Atas (SMA)</SelectItem>
                    <SelectItem value="univ">Perguruan Tinggi (Universitas)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.tier && <p className="text-xs font-semibold text-red-500">{errors.tier.message}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 font-bold"
            >
              {isSubmitting ? 'Mendaftar...' : 'Daftar Akun'}
              <ArrowRightIcon size={16} weight="bold" />
            </Button>
          </form>

          {/* Login link */}
          <div className="text-center text-sm text-text-muted">
            Sudah memiliki akun?{' '}
            <Link href="/auth/login" className="font-semibold text-primary hover:underline dark:text-secondary">
              Masuk di sini
            </Link>
          </div>
        </motion.div>
      </Container>
    </div>
  )
}
