import { z } from 'zod/v3'

export const contactSchema = z.object({
  fullName: z.string().nonempty({
    message: 'Nama Lengkap harus diisi'
  }),
  email: z
    .string()
    .nonempty({
      message: 'Email harus diisi'
    })
    .email({
      message: 'Email yang dimasukan tidak valid'
    }),
  phoneNumber: z
    .string()
    .nonempty('No. WhatsApp tidak boleh kosong')
    .refine((value) => value.startsWith('0'), {
      message: 'No. WhatsApp harus diawali dengan 0'
    })
    .refine((value) => /^[0-9]{10,15}$/.test(value), {
      message: 'No. WhatsApp harus berupa angka 10-15 digit'
    }),
  message: z.string().nonempty({ message: 'Pesan harus diisi' })
})

export const defaultValues = {
  fullName: '',
  email: '',
  phoneNumber: '',
  message: ''
}
