'use client'

import Cookies from 'js-cookie'
import { useTranslations, useLocale } from 'next-intl'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { toast } from 'sonner'

import type { Assignment, CourseModule, TodoItem, UserData } from '@/components/organisms/dashboard'

// ─── Shared Static Data ──────────────────────────────────────────────────────

const COURSE_MODULES: Record<string, Record<'en' | 'id', CourseModule[]>> = {
  sd: {
    en: [
      {
        id: 1,
        code: 'SD101',
        title: 'Chapter 1: Knowing Numbers & Fun Counting',
        lessons: ['Knowing Numbers 1-10', 'Image Addition', 'Basic Math Game'],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Monday, 08:00 - 09:30'
      },
      {
        id: 2,
        code: 'SD102',
        title: 'Chapter 2: Knowing Flora & Fauna Around Us',
        lessons: ['Tame & Wild Animals', 'Plant Body Parts', 'Keeping Environment Clean'],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Wednesday, 08:00 - 09:30'
      },
      {
        id: 3,
        code: 'SD103',
        title: 'Chapter 3: Language & Storytelling Skills',
        lessons: ['Spelling Syllables', 'Reading Children Stories', 'Writing Cursive Letters'],
        pdfUrl: '#',
        credits: 3,
        schedule: 'Thursday, 09:40 - 11:10'
      }
    ],
    id: [
      {
        id: 1,
        code: 'SD101',
        title: 'Bab 1: Mengenal Angka & Berhitung Ceria',
        lessons: ['Mengenal Angka 1-10', 'Penjumlahan Gambar', 'Game Matematika Dasar'],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Senin, 08:00 - 09:30'
      },
      {
        id: 2,
        code: 'SD102',
        title: 'Bab 2: Mengenal Flora & Fauna Sekitar Kita',
        lessons: ['Hewan Jinak & Liar', 'Bagian Tubuh Tumbuhan', 'Menjaga Kebersihan Lingkungan'],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Rabu, 08:00 - 09:30'
      },
      {
        id: 3,
        code: 'SD103',
        title: 'Bab 3: Keterampilan Bahasa & Bercerita',
        lessons: ['Mengeja Suku Kata', 'Membaca Dongeng Anak', 'Menulis Huruf Tegak Bersambung'],
        pdfUrl: '#',
        credits: 3,
        schedule: 'Kamis, 09:40 - 11:10'
      }
    ]
  },
  smp: {
    en: [
      {
        id: 1,
        code: 'SMP201',
        title: 'Basic Algebra & Math Sets',
        lessons: ['Knowing Variables & Constants', 'One Variable Algebra Operations', 'Venn Diagrams & Sets'],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Monday, 08:00 - 09:30'
      },
      {
        id: 2,
        code: 'SMP202',
        title: 'Cell Organism Structure & Ecosystems',
        lessons: ['Animal vs Plant Cells', 'Food Chains & Symbiosis', 'Classification of Living Things'],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Tuesday, 10:00 - 11:30'
      },
      {
        id: 3,
        code: 'SMP203',
        title: 'Basic Grammar & English Tenses',
        lessons: ['Simple Present Tense', 'Vocabulary in Daily Activities', 'Basic Conversation Practice'],
        pdfUrl: '#',
        credits: 3,
        schedule: 'Thursday, 08:00 - 09:30'
      }
    ],
    id: [
      {
        id: 1,
        code: 'SMP201',
        title: 'Aljabar Dasar & Himpunan Matematika',
        lessons: ['Mengenal Variabel & Konstanta', 'Operasi Aljabar Satu Variabel', 'Diagram Venn & Himpunan'],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Senin, 08:00 - 09:30'
      },
      {
        id: 2,
        code: 'SMP202',
        title: 'Struktur Organisme Sel & Ekosistem',
        lessons: ['Sel Hewan vs Sel Tumbuhan', 'Rantai Makanan & Simbiosis', 'Klasifikasi Makhluk Hidup'],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Selasa, 10:00 - 11:30'
      },
      {
        id: 3,
        code: 'SMP203',
        title: 'Grammar Dasar & Tenses Bahasa Inggris',
        lessons: ['Simple Present Tense', 'Vocabulary in Daily Activities', 'Basic Conversation Practice'],
        pdfUrl: '#',
        credits: 3,
        schedule: 'Kamis, 08:00 - 09:30'
      }
    ]
  },
  sma: {
    en: [
      {
        id: 1,
        code: 'SMA301',
        title: 'Basic Calculus: Limit Theory & Derivatives',
        lessons: ['Algebraic Function Limit Concept', 'Function Derivative Formulas', 'Derivative Applications in Physics'],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Monday, 08:00 - 09:30'
      },
      {
        id: 2,
        code: 'SMA302',
        title: 'Optical Physics, Waves & Light',
        lessons: [
          'Mechanical & Electromagnetic Waves',
          'Geometrical Optics: Mirrors & Lenses',
          'Light Interference & Diffraction'
        ],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Wednesday, 10:00 - 11:30'
      },
      {
        id: 3,
        code: 'SMA303',
        title: 'UTBK Tryout & Scholastic Prep',
        lessons: ['General Reasoning Exercises', 'Reading Comprehension & Writing', 'Quantitative Knowledge Success'],
        pdfUrl: '#',
        credits: 3,
        schedule: 'Friday, 08:00 - 09:30'
      }
    ],
    id: [
      {
        id: 1,
        code: 'SMA301',
        title: 'Kalkulus Dasar: Teori Limit & Turunan',
        lessons: ['Konsep Limit Fungsi Aljabar', 'Rumus Turunan Fungsi', 'Penerapan Turunan dalam Fisika'],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Senin, 08:00 - 09:30'
      },
      {
        id: 2,
        code: 'SMA302',
        title: 'Fisika Optik, Gelombang, & Cahaya',
        lessons: [
          'Gelombang Mekanik & Elektromagnetik',
          'Optik Geometris: Cermin & Lensa',
          'Interferensi & Difraksi Cahaya'
        ],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Rabu, 10:00 - 11:30'
      },
      {
        id: 3,
        code: 'SMA303',
        title: 'Persiapan Tryout UTBK & Skolastik',
        lessons: ['Latihan Soal Penalaran Umum', 'Pemahaman Bacaan & Menulis', 'Pengetahuan Kuantitatif Sukses'],
        pdfUrl: '#',
        credits: 3,
        schedule: 'Jumat, 08:00 - 09:30'
      }
    ]
  },
  univ: {
    en: [
      {
        id: 1,
        code: 'CHAR6002003',
        title: 'Character Building: Kewarganegaraan',
        lessons: ['National Identity & Integration', 'Citizen Rights & Obligations', 'Constitution & 1945 UUD'],
        pdfUrl: '#',
        credits: 2,
        schedule: 'Monday, 08:00 - 09:40'
      },
      {
        id: 2,
        code: 'ISYS6013005',
        title: 'Data and Information Management',
        lessons: [
          'Entity Relationship Diagram (ERD)',
          'Relational Database Normalization',
          'Structured Query Language (SQL)',
          'Indexing & Query Optimization'
        ],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Tuesday, 08:00 - 11:40'
      },
      {
        id: 3,
        code: 'ISYS6014005',
        title: 'Office Automation Industri Kreatif',
        lessons: ['Word Processing & Spreadsheets', 'Creative Multimedia Presentation', 'Office Data Integration'],
        pdfUrl: '#',
        credits: 2,
        schedule: 'Wednesday, 08:00 - 09:40'
      },
      {
        id: 4,
        code: 'ISYS6016005',
        title: 'Pemrograman Front-End Web',
        lessons: [
          'HTML5 & Semantic Elements',
          'Modern CSS Layouts (Flexbox/Grid)',
          'JavaScript DOM Manipulation',
          'React Components & Hooks'
        ],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Thursday, 08:00 - 11:40'
      },
      {
        id: 5,
        code: 'ISYS6015005',
        title: 'Social Media Marketing & Analytics',
        lessons: ['Content Strategy & Planning', 'Marketing Metrics & ROI', 'SEO & Search Engine Marketing'],
        pdfUrl: '#',
        credits: 3,
        schedule: 'Friday, 08:00 - 10:40'
      }
    ],
    id: [
      {
        id: 1,
        code: 'CHAR6002003',
        title: 'Character Building: Kewarganegaraan',
        lessons: ['Identitas Nasional & Integrasi', 'Hak & Kewajiban Warga Negara', 'Konstitusi & UUD 1945'],
        pdfUrl: '#',
        credits: 2,
        schedule: 'Senin, 08:00 - 09:40'
      },
      {
        id: 2,
        code: 'ISYS6013005',
        title: 'Data and Information Management',
        lessons: [
          'Entity Relationship Diagram (ERD)',
          'Normalisasi Database Relasional',
          'Structured Query Language (SQL)',
          'Optimasi Query & Indexing'
        ],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Selasa, 08:00 - 11:40'
      },
      {
        id: 3,
        code: 'ISYS6014005',
        title: 'Office Automation Industri Kreatif',
        lessons: ['Pengolah Kata & Spreadsheets', 'Presentasi Multimedia Kreatif', 'Integrasi Data Office'],
        pdfUrl: '#',
        credits: 2,
        schedule: 'Rabu, 08:00 - 09:40'
      },
      {
        id: 4,
        code: 'ISYS6016005',
        title: 'Pemrograman Front-End Web',
        lessons: [
          'HTML5 & Elemen Semantik',
          'Layout CSS Modern (Flexbox/Grid)',
          'Manipulasi DOM JavaScript',
          'Komponen & Hooks React'
        ],
        pdfUrl: '#',
        credits: 4,
        schedule: 'Kamis, 08:00 - 11:40'
      },
      {
        id: 5,
        code: 'ISYS6015005',
        title: 'Social Media Marketing & Analytics',
        lessons: ['Content Strategy & Planning', 'Metrik Pemasaran & ROI', 'SEO & Search Engine Marketing'],
        pdfUrl: '#',
        credits: 3,
        schedule: 'Jumat, 08:00 - 10:40'
      }
    ]
  }
}

const MOCK_TODOS: Record<string, Record<'en' | 'id', { upcoming: TodoItem[]; outdated: TodoItem[] }>> = {
  sd: {
    en: {
      upcoming: [
        {
          type: 'document',
          title: 'Read the Story of Kancil & Crocodile',
          course: 'Language & Storytelling Skills',
          date: 'Before June 22, 2026, 15:00',
          isUrgent: true
        },
        {
          type: 'video',
          title: 'Watch Counting 1-10 Video',
          course: 'Knowing Numbers & Counting',
          date: 'Before June 24, 2026, 17:00',
          isUrgent: false
        }
      ],
      outdated: [
        {
          type: 'shield',
          title: 'Late Attendance Chapter 1',
          course: 'Flora & Fauna Around Us',
          date: 'Before June 10, 2026, 23:59',
          isUrgent: true
        }
      ]
    },
    id: {
      upcoming: [
        {
          type: 'document',
          title: 'Membaca Dongeng Kancil & Buaya',
          course: 'Keterampilan Bahasa & Bercerita',
          date: 'Sebelum 22 Juni 2026, 15:00',
          isUrgent: true
        },
        {
          type: 'video',
          title: 'Menonton video Berhitung 1-10',
          course: 'Mengenal Angka & Berhitung',
          date: 'Sebelum 24 Juni 2026, 17:00',
          isUrgent: false
        }
      ],
      outdated: [
        {
          type: 'shield',
          title: 'Absensi Terlambat Bab 1',
          course: 'Flora & Fauna Sekitar Kita',
          date: 'Sebelum 10 Juni 2026, 23:59',
          isUrgent: true
        }
      ]
    }
  },
  smp: {
    en: {
      upcoming: [
        {
          type: 'document',
          title: 'Complete Basic Algebra Exercises',
          course: 'Algebra & Sets',
          date: 'Before June 22, 2026, 15:00',
          isUrgent: true
        },
        {
          type: 'video',
          title: 'Watch Plant Cell Video',
          course: 'Cell Structure & Ecosystems',
          date: 'Before June 23, 2026, 17:00',
          isUrgent: false
        }
      ],
      outdated: [
        {
          type: 'shield',
          title: 'Diagram Venn Sets Assignment',
          course: 'Algebra & Sets',
          date: 'Before June 14, 2026, 12:00',
          isUrgent: true
        }
      ]
    },
    id: {
      upcoming: [
        {
          type: 'document',
          title: 'Menyelesaikan Latihan Aljabar Dasar',
          course: 'Aljabar & Himpunan',
          date: 'Sebelum 22 Juni 2026, 15:00',
          isUrgent: true
        },
        {
          type: 'video',
          title: 'Tonton Video Sel Tumbuhan',
          course: 'Struktur Sel & Ekosistem',
          date: 'Sebelum 23 Juni 2026, 17:00',
          isUrgent: false
        }
      ],
      outdated: [
        {
          type: 'shield',
          title: 'Tugas Himpunan Diagram Venn',
          course: 'Aljabar & Himpunan',
          date: 'Sebelum 14 Juni 2026, 12:00',
          isUrgent: true
        }
      ]
    }
  },
  sma: {
    en: {
      upcoming: [
        {
          type: 'document',
          title: 'Limit of Algebraic Functions Exercises',
          course: 'Basic Calculus & Derivatives',
          date: 'Before June 22, 2026, 15:00',
          isUrgent: true
        },
        {
          type: 'video',
          title: 'Geometrical Optics Virtual Lab',
          course: 'Optical Physics & Waves',
          date: 'Before June 23, 2026, 17:00',
          isUrgent: false
        }
      ],
      outdated: [
        {
          type: 'shield',
          title: 'UTBK Quantitative Knowledge Practice',
          course: 'UTBK Tryout Preparation',
          date: 'Before June 12, 2026, 12:00',
          isUrgent: true
        }
      ]
    },
    id: {
      upcoming: [
        {
          type: 'document',
          title: 'Latihan Soal Limit Fungsi Aljabar',
          course: 'Kalkulus Dasar & Turunan',
          date: 'Sebelum 22 Juni 2026, 15:00',
          isUrgent: true
        },
        {
          type: 'video',
          title: 'Praktikum Virtual Optik Geometris',
          course: 'Fisika Optik & Gelombang',
          date: 'Sebelum 23 Juni 2026, 17:00',
          isUrgent: false
        }
      ],
      outdated: [
        {
          type: 'shield',
          title: 'Latihan Soal UTBK Pengetahuan Kuantitatif',
          course: 'Persiapan Tryout UTBK',
          date: 'Sebelum 12 Juni 2026, 12:00',
          isUrgent: true
        }
      ]
    }
  },
  univ: {
    en: {
      upcoming: [
        {
          type: 'document',
          title: 'Completing 1 Article resource',
          course: 'Pemrograman Front-End Web',
          date: 'Before June 22, 2026, 15:00 GMT+7',
          isUrgent: true
        },
        {
          type: 'shield',
          title: 'Completing 1 Attendance resource',
          course: 'Office Automation Industri Kreatif',
          date: 'Before June 23, 2026, 15:00 GMT+7',
          isUrgent: true
        },
        {
          type: 'video',
          title: 'Attend the Virtual Class',
          course: 'Pemrograman Front-End Web',
          date: 'On June 25, 2026, 13:20 GMT+7',
          isUrgent: false
        }
      ],
      outdated: [
        {
          type: 'document',
          title: 'Upload Assignment 1: Semantic HTML',
          course: 'Pemrograman Front-End Web',
          date: 'Before May 10, 2026, 23:59 GMT+7',
          isUrgent: true
        },
        {
          type: 'shield',
          title: 'Late Attendance Check-in: Session 2',
          course: 'Social Media Marketing & Analytics',
          date: 'Before May 14, 2026, 12:00 GMT+7',
          isUrgent: true
        }
      ]
    },
    id: {
      upcoming: [
        {
          type: 'document',
          title: 'Menyelesaikan 1 modul artikel',
          course: 'Pemrograman Front-End Web',
          date: 'Sebelum 22 Juni 2026, 15:00 GMT+7',
          isUrgent: true
        },
        {
          type: 'shield',
          title: 'Melakukan presensi kelas',
          course: 'Office Automation Industri Kreatif',
          date: 'Sebelum 23 Juni 2026, 15:00 GMT+7',
          isUrgent: true
        },
        {
          type: 'video',
          title: 'Menghadiri sesi kelas virtual',
          course: 'Pemrograman Front-End Web',
          date: 'Pada 25 Juni 2026, 13:20 GMT+7',
          isUrgent: false
        }
      ],
      outdated: [
        {
          type: 'document',
          title: 'Unggah Tugas 1: HTML Semantik',
          course: 'Pemrograman Front-End Web',
          date: 'Sebelum 10 Mei 2026, 23:59 GMT+7',
          isUrgent: true
        },
        {
          type: 'shield',
          title: 'Pencatatan Presensi Terlambat: Sesi 2',
          course: 'Social Media Marketing & Analytics',
          date: 'Sebelum 14 Mei 2026, 12:00 GMT+7',
          isUrgent: true
        }
      ]
    }
  }
}

const MOCK_ASSIGNMENTS: Record<'en' | 'id', { id: number; title: string; deadline: string }[]> = {
  en: [
    { id: 1, title: 'Assignment 1: Platform Introduction & Learning Navigation', deadline: 'June 22, 2026' },
    { id: 2, title: 'Assignment 2: Computational Thinking Case Study', deadline: 'June 29, 2026' }
  ],
  id: [
    { id: 1, title: 'Tugas 1: Pengenalan Platform & Navigasi Belajar', deadline: '22 Juni 2026' },
    { id: 2, title: 'Tugas 2: Studi Kasus Berpikir Komputasional', deadline: '29 Juni 2026' }
  ]
}

// ─── Context Definition ──────────────────────────────────────────────────────

type DashboardContextType = {
  userData: UserData | null
  attendanceCount: number
  hasAttendedToday: boolean
  assignmentsState: Record<number, { status: 'pending' | 'submitted'; score?: number }>
  handleAttendance: () => void
  handleFileUpload: (id: number) => void
  updateUserTier: (tier: 'sd' | 'smp' | 'sma' | 'univ') => void
  currentLang: 'en' | 'id'
  activeModules: CourseModule[]
  assignments: Assignment[]
  currentTodos: { upcoming: TodoItem[]; outdated: TodoItem[] }
  userInitials: string
  tierLabels: Record<string, string>
  showGrades: boolean
  toggleGradesVisibility: () => void
  activeQRToken: string
  qrCountdown: number
  deviceBindingID: string
  currentClientDeviceID: string
  setCurrentClientDeviceID: (id: string) => void
  handleAttendanceSecure: (scannedToken: string) => boolean
  resetAttendance: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const t = useTranslations('Dashboard')
  const locale = useLocale()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [attendanceCount, setAttendanceCount] = useState(12)
  const [hasAttendedToday, setHasAttendedToday] = useState(false)
  const [showGrades, setShowGrades] = useState(true)
  const [assignmentsState, setAssignmentsState] = useState<
    Record<number, { status: 'pending' | 'submitted'; score?: number }>
  >({
    1: { status: 'pending' },
    2: { status: 'pending' }
  })

  // Secure attendance variables
  const [activeQRToken, setActiveQRToken] = useState('QR-A79F')
  const [qrCountdown, setQrCountdown] = useState(10)
  const [deviceBindingID] = useState('device-iphone-15-pro')
  const [currentClientDeviceID, setCurrentClientDeviceIDState] = useState('device-iphone-15-pro')

  const setCurrentClientDeviceID = (id: string) => {
    setCurrentClientDeviceIDState(id)
    localStorage.setItem('mock_client_device_id', id)
  }

  // Load cookies and localStorage states on mount
  useEffect(() => {
    const cookie = Cookies.get('mock_user_data')
    if (cookie) {
      try {
        setUserData(JSON.parse(cookie))
      } catch (e) {
        console.error(e)
      }
    } else {
      setUserData({ name: 'Siswa Teladan', email: 'student@oneacademy.id', tier: 'univ', school: 'SATU University' })
    }

    // Clear stale persisted attendance from previous demo sessions
    localStorage.removeItem('mock_attendance_today')

    // Initialize mock client device ID based on user viewport on mount
    // Mobile always gets the registered device ID so attendance scanner works
    const isMobile = window.innerWidth < 768
    let deviceId = localStorage.getItem('mock_client_device_id')
    if (!deviceId || isMobile) {
      deviceId = isMobile ? 'device-iphone-15-pro' : 'device-macbook-pro'
      localStorage.setItem('mock_client_device_id', deviceId)
    }
    setCurrentClientDeviceIDState(deviceId)

    const savedState = localStorage.getItem('mock_assignments_state')
    if (savedState) {
      try {
        setAssignmentsState(JSON.parse(savedState))
      } catch (e) {
        console.error(e)
      }
    }

    const savedVisibility = localStorage.getItem('mock_show_grades')
    if (savedVisibility !== null) {
      setShowGrades(savedVisibility === 'true')
    }
  }, [])

  // QR Code token rotation interval
  useEffect(() => {
    const interval = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          const chars = '0123456789ABCDEF'
          let token = 'QR-'
          for (let i = 0; i < 4; i++) {
            token += chars[Math.floor(Math.random() * 16)]
          }
          setActiveQRToken(token)

          return 10
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleAttendance = () => {
    // Basic compatibility: delegates to secure verification
    handleAttendanceSecure(activeQRToken)
  }

  const handleAttendanceSecure = (scannedToken: string): boolean => {
    // 1. Verify token
    if (scannedToken !== activeQRToken) {
      toast.error(
        currentLang === 'id'
          ? 'QR Code Kedaluwarsa! Silakan scan QR Code yang baru di proyektor.'
          : 'QR Code Expired! Please scan the new QR Code on the projector.'
      )

      return false
    }
    // 2. Verify device binding
    if (currentClientDeviceID !== deviceBindingID) {
      toast.error(
        currentLang === 'id'
          ? 'Kecurangan Terdeteksi! Perangkat Anda tidak cocok dengan HP yang terdaftar.'
          : 'Fraud Detected! Your device does not match the registered smartphone.'
      )

      return false
    }

    setHasAttendedToday(true)
    setAttendanceCount((prev) => prev + 1)
    toast.success(t('attendSuccess'))

    return true
  }

  const resetAttendance = () => {
    setHasAttendedToday(false)
    setAttendanceCount(12)
    toast.info(currentLang === 'id' ? 'Status presensi direset untuk demo.' : 'Attendance reset for demo.')
  }

  const toggleGradesVisibility = () => {
    setShowGrades((prev) => {
      const newVal = !prev
      localStorage.setItem('mock_show_grades', String(newVal))
      toast.success(
        currentLang === 'id'
          ? newVal
            ? 'Nilai ditampilkan'
            : 'Nilai disembunyikan (disamarkan)'
          : newVal
            ? 'Grades visible'
            : 'Grades hidden (blurred)'
      )

      return newVal
    })
  }

  const handleFileUpload = (id: number) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        const updated = {
          ...assignmentsState,
          [id]: { status: 'submitted' as const, score: 95 }
        }
        setAssignmentsState(updated)
        localStorage.setItem('mock_assignments_state', JSON.stringify(updated))
        toast.success(`"${file.name}" ${t('uploadSuccess')}`)
      }
    }
    input.click()
  }

  const updateUserTier = (newTier: 'sd' | 'smp' | 'sma' | 'univ') => {
    if (!userData) return
    const updated = { ...userData, tier: newTier }
    setUserData(updated)
    Cookies.set('mock_user_data', JSON.stringify(updated))
    toast.success(
      currentLang === 'id'
        ? `Jenjang program diubah ke: ${tierLabels[newTier] || newTier.toUpperCase()}`
        : `Education level switched to: ${tierLabels[newTier] || newTier.toUpperCase()}`
    )
  }

  // Derive active language code
  const currentLang = (locale === 'en' ? 'en' : 'id') as 'en' | 'id'

  // Educational Tier Labels
  const tierLabels: Record<string, string> = {
    sd: t('tierSD'),
    smp: t('tierSMP'),
    sma: t('tierSMA'),
    univ: t('tierUniv')
  }

  // Derived modular modules and tasks based on user tier & active locale
  const tier = userData?.tier || 'univ'
  const activeModules = COURSE_MODULES[tier]?.[currentLang] || COURSE_MODULES['univ'][currentLang]
  const currentTodos = MOCK_TODOS[tier]?.[currentLang] || MOCK_TODOS['univ'][currentLang]

  const staticAssignments = MOCK_ASSIGNMENTS[currentLang]
  const assignments: Assignment[] = staticAssignments.map((asg) => ({
    id: asg.id,
    title: asg.title,
    deadline: asg.deadline,
    status: assignmentsState[asg.id]?.status ?? 'pending',
    score: assignmentsState[asg.id]?.score
  }))

  const nameParts = userData?.name.split(' ') || ['Siswa']
  const userInitials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : `${nameParts[0][0]}${nameParts[0][1] || ''}`.toUpperCase()

  return (
    <DashboardContext.Provider
      value={{
        userData,
        attendanceCount,
        hasAttendedToday,
        assignmentsState,
        handleAttendance,
        handleFileUpload,
        updateUserTier,
        currentLang,
        activeModules,
        assignments,
        currentTodos,
        userInitials,
        tierLabels,
        showGrades,
        toggleGradesVisibility,
        activeQRToken,
        qrCountdown,
        deviceBindingID,
        currentClientDeviceID,
        setCurrentClientDeviceID,
        handleAttendanceSecure,
        resetAttendance
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }

  return context
}
