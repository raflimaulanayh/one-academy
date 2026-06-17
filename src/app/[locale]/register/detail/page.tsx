'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { PhoneIcon, HouseIcon, BuildingsIcon, ArrowRightIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/atoms/ui/button'
import { Input } from '@/components/atoms/ui/input'
import { Label } from '@/components/atoms/ui/label'
import { Textarea } from '@/components/atoms/ui/textarea'
import { Container } from '@/components/templates/container'

const detailSchema = z.object({
  phone: z.string().min(10, { message: 'Nomor WhatsApp minimal 10 digit' }),
  school: z.string().min(3, { message: 'Nama instansi/sekolah minimal 3 karakter' }),
  address: z.string().min(5, { message: 'Alamat lengkap minimal 5 karakter' })
})

type DetailFormValues = z.infer<typeof detailSchema>

export default function RegisterDetailPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<DetailFormValues>({
    resolver: zodResolver(detailSchema)
  })

  const onSubmit = async (values: DetailFormValues) => {
    try {
      // Baca data register dari cookie
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

      // Update data mockup dengan profil lengkap
      const updatedUser = {
        ...mockUser,
        phone: values.phone,
        school: values.school,
        address: values.address,
        accountComplete: true
      }

      // Simpan kembali ke cookie
      Cookies.set('mock_user_data', JSON.stringify(updatedUser), { expires: 7 })

      toast.success('Profil berhasil dilengkapi!')

      // Redirect ke dashboard portal belajar
      router.push('/dashboard')
    } catch (error) {
      toast.error('Gagal melengkapi profil.')
      console.error(error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-bg-light to-canvas px-4 py-12 sm:px-6 lg:px-8 dark:from-navy-dark dark:to-canvas">
      <Container className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 rounded-3xl border border-border bg-canvas p-8 shadow-2xl backdrop-blur-sm dark:bg-navy-medium/20"
        >
          {/* Header */}
          <div className="space-y-2 text-center">
            <span className="text-xs font-bold tracking-wider text-secondary uppercase">Langkah Terakhir</span>
            <h2 className="text-2xl font-extrabold text-text-dark">Lengkapi Profil Anda</h2>
            <p className="text-sm text-text-muted">
              Informasi ini diperlukan untuk penyesuaian kelas & sertifikat akademik Anda.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nomor WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor WhatsApp</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                  <PhoneIcon size={18} />
                </div>
                <Input id="phone" type="tel" placeholder="Contoh: 081234567890" className="pl-10" {...register('phone')} />
              </div>
              {errors.phone && <p className="text-xs font-semibold text-red-500">{errors.phone.message}</p>}
            </div>

            {/* Nama Instansi / Sekolah */}
            <div className="space-y-2">
              <Label htmlFor="school">Asal Sekolah / Universitas</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                  <BuildingsIcon size={18} />
                </div>
                <Input
                  id="school"
                  type="text"
                  placeholder="Masukkan nama sekolah/kampus"
                  className="pl-10"
                  {...register('school')}
                />
              </div>
              {errors.school && <p className="text-xs font-semibold text-red-500">{errors.school.message}</p>}
            </div>

            {/* Alamat Lengkap */}
            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <div className="relative">
                <div className="pointer-events-none absolute top-3 left-3 text-text-muted">
                  <HouseIcon size={18} />
                </div>
                <Textarea
                  id="address"
                  placeholder="Masukkan alamat tinggal saat ini"
                  className="min-h-[80px] pl-10"
                  {...register('address')}
                />
              </div>
              {errors.address && <p className="text-xs font-semibold text-red-500">{errors.address.message}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 font-bold"
            >
              {isSubmitting ? 'Menyimpan...' : 'Selesaikan Pendaftaran'}
              <ArrowRightIcon size={16} weight="bold" />
            </Button>
          </form>
        </motion.div>
      </Container>
    </div>
  )
}
