'use client'

import { PHONE_CONTACT } from '@/constants/general-data'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v3'

import { Input, Textarea } from '@/components/atoms/form'
import { Button } from '@/components/atoms/ui/button'
import { Form } from '@/components/atoms/ui/form'

import { contactSchema, defaultValues } from './schema'

export const ContactForm = () => {
  const [loading, startTransition] = useTransition()

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: defaultValues
  })

  function onSubmit(values: z.infer<typeof contactSchema>) {
    startTransition(() => {
      const rawPhone = PHONE_CONTACT.replace(/\D/g, '')
      const internationalPhone = rawPhone.startsWith('0') ? `62${rawPhone.slice(1)}` : rawPhone

      const message = [
        `Halo One Academy, saya ingin berkonsultasi.`,
        ``,
        `Nama: ${values.fullName}`,
        `Email: ${values.email}`,
        `No. WhatsApp: ${values.phoneNumber}`,
        ``,
        `Pesan:`,
        values.message
      ].join('\n')

      const waUrl = `https://wa.me/${internationalPhone}?text=${encodeURIComponent(message)}`
      window.open(waUrl, '_blank', 'noopener,noreferrer')

      form.reset()
      toast.success('Pesan berhasil dikirim! Tim kami akan segera menghubungi Anda via WhatsApp.')
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <Input name="fullName" label="Nama" placeholder="Nama lengkap" />
          <Input name="email" label="Email" placeholder="Masukkan email" />
          <Input name="phoneNumber" label="No. WhatsApp" placeholder="Contoh: 081234567890" />
          <Textarea name="message" label="Pesan" placeholder="Tinggalkan pesan untuk kami..." />
        </div>
        <Button variant="secondary" size="lg" loading={loading} disabled={loading} className="w-full" type="submit">
          Kirim pesan
        </Button>
      </form>
    </Form>
  )
}
