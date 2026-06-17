export type MenuItem = {
  label: string
  url: string
  children?: MenuItem[]
}

export const SERVICES_MENU: MenuItem[] = [
  { label: 'Sekolah Dasar (SD)', url: '/#pricing' },
  { label: 'Sekolah Menengah Pertama (SMP)', url: '/#pricing' },
  { label: 'Sekolah Menengah Atas (SMA)', url: '/#pricing' },
  { label: 'Perguruan Tinggi (Universitas)', url: '/#pricing' }
]

export const PUBLIC_MENU: {
  en: MenuItem[]
  id: MenuItem[]
} = {
  en: [
    { label: 'Home', url: '/' },
    { label: 'About Us', url: '/#about' },
    { label: 'Features', url: '/#projects' },
    { label: 'Live Sessions', url: '/#events' },
    { label: 'Pricing', url: '/#pricing' },
    { label: 'FAQ', url: '/#faq' }
  ],
  id: [
    { label: 'Beranda', url: '/' },
    { label: 'Tentang Kami', url: '/#about' },
    { label: 'Fitur', url: '/#projects' },
    { label: 'Sesi Live', url: '/#events' },
    { label: 'Paket Belajar', url: '/#pricing' },
    { label: 'FAQ', url: '/#faq' }
  ]
}

export const FOOTER_LINKS: {
  en: MenuItem[]
  id: MenuItem[]
} = {
  en: [
    { label: 'Privacy Policy', url: '/privacy-policy' },
    { label: 'Terms & Conditions', url: '/terms-conditions' }
  ],
  id: [
    { label: 'Kebijakan Privasi', url: '/privacy-policy' },
    { label: 'Syarat & Ketentuan', url: '/terms-conditions' }
  ]
}
