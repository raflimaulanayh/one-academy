export type MenuItem = {
  label: string
  url: string
  children?: MenuItem[]
}

export const SERVICES_MENU: MenuItem[] = [
  {
    label: 'Product & Project Build',
    url: '/program/produk-project',
    children: [
      { label: 'Web & Mobile Apps', url: '/program/produk-project/apps' },
      { label: 'IoT & Hardware Build', url: '/program/produk-project/hardware' }
    ]
  },
  {
    label: 'Competition & Hackathon',
    url: '/program/kompetisi',
    children: [
      { label: 'Hackathon Prep Class', url: '/program/kompetisi/prep' },
      { label: 'Competitive Mentoring', url: '/program/kompetisi/mentoring' }
    ]
  },
  {
    label: 'Edukasi & Workshop',
    url: '/program/edukasi',
    children: [
      { label: 'Regular Sharing Session', url: '/program/edukasi/sharing' },
      { label: 'Hands-on Bootcamp', url: '/program/edukasi/bootcamp' }
    ]
  },
  {
    label: 'Kolaborasi Multidisiplin',
    url: '/program/kolaborasi',
    children: [{ label: 'Inovasi Lintas Jurusan', url: '/program/kolaborasi/lintas-jurusan' }]
  }
]

export const PUBLIC_MENU: {
  en: MenuItem[]
  id: MenuItem[]
} = {
  en: [
    { label: 'Home', url: '/' },
    { label: 'Our Projects', url: '/projects' },
    { label: 'Artikel', url: '/article' },
    { label: 'About Us', url: '/about' }
  ],
  id: [
    { label: 'Beranda', url: '/' },
    { label: 'Proyek Kami', url: '/projects' },
    { label: 'Artikel', url: '/article' },
    { label: 'Tentang Kami', url: '/about' }
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
