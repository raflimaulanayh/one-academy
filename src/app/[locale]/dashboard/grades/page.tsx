'use client'

import { useDashboard } from '@/context/dashboard-context'
import { Link } from '@/i18n/routing'
import {
  GraduationCapIcon,
  DownloadSimpleIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  WarningIcon,
  CaretDownIcon,
  ArrowUpIcon,
  ArrowLeftIcon,
  InfoIcon,
  XIcon
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/utils'

// TypeScript Types for Grade Items
interface CourseGrade {
  code: string
  title: string
  credits: number
  attendance: number // 10%
  assignment: number // 20%
  midExam: number // 30%
  finalExam: number // 40%
  finalScore: number
  grade: string
  status: 'passed' | 'failed'
}

interface SemesterData {
  id: string
  name: string
  gpa: number // IPS for univ, Average for school
  creditsPassed?: number // Univ only
  courses: CourseGrade[]
}

export default function GradesPage() {
  const t = useTranslations('Dashboard')
  const { userData, showGrades, toggleGradesVisibility, currentLang } = useDashboard()

  const isIndo = currentLang === 'id'

  // Local state variables (declared at the very top, unconditionally)
  const [selectedSemId, setSelectedSemId] = useState<string>('')
  const [isSemFilterOpen, setIsSemFilterOpen] = useState(false)
  const [downloadStep, setDownloadStep] = useState<number>(-1) // -1 means inactive
  const [appealCourse, setAppealCourse] = useState<CourseGrade | null>(null)
  const [appealReason, setAppealReason] = useState<string>('')
  const [isAppealing, setIsAppealing] = useState<boolean>(false)

  // If not logged in, return null (handled by middleware redirect)
  if (!userData) return null

  const tier = userData.tier

  // Mock Grades Data based on Education Tiers & Semesters
  const MOCK_UNIV_GRADES: SemesterData[] = [
    {
      id: 'sem3',
      name: isIndo ? 'Semester 3 (Ganjil 2025/2026)' : 'Semester 3 (Odd 2025/2026)',
      gpa: 3.9,
      creditsPassed: 15,
      courses: [
        {
          code: 'ISYS6016005',
          title: 'Pemrograman Front-End Web',
          credits: 4,
          attendance: 100,
          assignment: 95,
          midExam: 85,
          finalExam: 92,
          finalScore: 90.9,
          grade: 'A',
          status: 'passed'
        },
        {
          code: 'ISYS6013005',
          title: 'Data and Information Management',
          credits: 4,
          attendance: 100,
          assignment: 92,
          midExam: 88,
          finalExam: 90,
          finalScore: 90.2,
          grade: 'A',
          status: 'passed'
        },
        {
          code: 'CHAR6002003',
          title: 'Character Building: Kewarganegaraan',
          credits: 2,
          attendance: 100,
          assignment: 90,
          midExam: 95,
          finalExam: 92,
          finalScore: 92.3,
          grade: 'A',
          status: 'passed'
        },
        {
          code: 'ISYS6014005',
          title: 'Office Automation Industri Kreatif',
          credits: 2,
          attendance: 100,
          assignment: 95,
          midExam: 95,
          finalExam: 98,
          finalScore: 96.5,
          grade: 'A',
          status: 'passed'
        },
        {
          code: 'ISYS6015005',
          title: 'Social Media Marketing & Analytics',
          credits: 3,
          attendance: 100,
          assignment: 85,
          midExam: 78,
          finalExam: 82,
          finalScore: 81.9,
          grade: 'B+',
          status: 'passed'
        }
      ]
    },
    {
      id: 'sem2',
      name: isIndo ? 'Semester 2 (Genap 2024/2025)' : 'Semester 2 (Even 2024/2025)',
      gpa: 3.82,
      creditsPassed: 12,
      courses: [
        {
          code: 'COMP6050001',
          title: 'Object Oriented Programming',
          credits: 4,
          attendance: 100,
          assignment: 92,
          midExam: 85,
          finalExam: 90,
          finalScore: 89.4,
          grade: 'A',
          status: 'passed'
        },
        {
          code: 'MATH6030001',
          title: 'Discrete Mathematics',
          credits: 4,
          attendance: 100,
          assignment: 85,
          midExam: 92,
          finalExam: 88,
          finalScore: 88.6,
          grade: 'A',
          status: 'passed'
        },
        {
          code: 'COMP6060001',
          title: 'Database Systems',
          credits: 4,
          attendance: 100,
          assignment: 85,
          midExam: 78,
          finalExam: 80,
          finalScore: 80.6,
          grade: 'B+',
          status: 'passed'
        }
      ]
    },
    {
      id: 'sem1',
      name: isIndo ? 'Semester 1 (Ganjil 2024/2025)' : 'Semester 1 (Odd 2024/2025)',
      gpa: 3.75,
      creditsPassed: 12,
      courses: [
        {
          code: 'CHAR6002003',
          title: 'Character Building: Pancasila',
          credits: 2,
          attendance: 100,
          assignment: 85,
          midExam: 90,
          finalExam: 88,
          finalScore: 88.6,
          grade: 'A',
          status: 'passed'
        },
        {
          code: 'COMP6047001',
          title: 'Algorithm and Programming',
          credits: 6,
          attendance: 100,
          assignment: 90,
          midExam: 80,
          finalExam: 85,
          finalScore: 84.5,
          grade: 'A-',
          status: 'passed'
        },
        {
          code: 'COMP6048001',
          title: 'Data Structures',
          credits: 4,
          attendance: 100,
          assignment: 80,
          midExam: 75,
          finalExam: 82,
          finalScore: 79.8,
          grade: 'B+',
          status: 'passed'
        }
      ]
    }
  ]

  const MOCK_SCHOOL_GRADES: Record<'sd' | 'smp' | 'sma', SemesterData[]> = {
    sd: [
      {
        id: 'sem2',
        name: isIndo ? 'Semester 2 (Genap)' : 'Semester 2 (Even)',
        gpa: 92.8,
        courses: [
          {
            code: 'SD101',
            title: 'Bab 1: Matematika Ceria & Berhitung',
            credits: 4,
            attendance: 100,
            assignment: 98,
            midExam: 95,
            finalExam: 96,
            finalScore: 96.7,
            grade: 'A',
            status: 'passed'
          },
          {
            code: 'SD102',
            title: 'Bab 2: Flora & Fauna Sekitar Kita',
            credits: 4,
            attendance: 100,
            assignment: 94,
            midExam: 92,
            finalExam: 90,
            finalScore: 91.6,
            grade: 'A',
            status: 'passed'
          },
          {
            code: 'SD103',
            title: 'Bab 3: Keterampilan Bahasa & Bercerita',
            credits: 3,
            attendance: 100,
            assignment: 90,
            midExam: 88,
            finalExam: 92,
            finalScore: 90.2,
            grade: 'A',
            status: 'passed'
          }
        ]
      },
      {
        id: 'sem1',
        name: isIndo ? 'Semester 1 (Ganjil)' : 'Semester 1 (Odd)',
        gpa: 92.0,
        courses: [
          {
            code: 'SD101',
            title: 'Bab 1: Matematika Ceria & Berhitung',
            credits: 4,
            attendance: 100,
            assignment: 94,
            midExam: 92,
            finalExam: 95,
            finalScore: 94.1,
            grade: 'A',
            status: 'passed'
          },
          {
            code: 'SD102',
            title: 'Bab 2: Flora & Fauna Sekitar Kita',
            credits: 4,
            attendance: 100,
            assignment: 92,
            midExam: 90,
            finalExam: 88,
            finalScore: 89.8,
            grade: 'A-',
            status: 'passed'
          },
          {
            code: 'SD103',
            title: 'Bab 3: Keterampilan Bahasa & Bercerita',
            credits: 3,
            attendance: 100,
            assignment: 90,
            midExam: 95,
            finalExam: 92,
            finalScore: 92.1,
            grade: 'A',
            status: 'passed'
          }
        ]
      }
    ],
    smp: [
      {
        id: 'sem2',
        name: isIndo ? 'Semester 2 (Genap)' : 'Semester 2 (Even)',
        gpa: 88.2,
        courses: [
          {
            code: 'SMP201',
            title: 'Aljabar Dasar & Himpunan Matematika',
            credits: 4,
            attendance: 100,
            assignment: 88,
            midExam: 85,
            finalExam: 90,
            finalScore: 88.1,
            grade: 'A-',
            status: 'passed'
          },
          {
            code: 'SMP202',
            title: 'Struktur Organisme Sel & Ekosistem',
            credits: 4,
            attendance: 100,
            assignment: 92,
            midExam: 88,
            finalExam: 86,
            finalScore: 87.8,
            grade: 'A-',
            status: 'passed'
          },
          {
            code: 'SMP203',
            title: 'Grammar Dasar & Tenses Inggris',
            credits: 3,
            attendance: 100,
            assignment: 92,
            midExam: 85,
            finalExam: 90,
            finalScore: 88.9,
            grade: 'A-',
            status: 'passed'
          }
        ]
      },
      {
        id: 'sem1',
        name: isIndo ? 'Semester 1 (Ganjil)' : 'Semester 1 (Odd)',
        gpa: 86.4,
        courses: [
          {
            code: 'SMP201',
            title: 'Aljabar Dasar & Himpunan Matematika',
            credits: 4,
            attendance: 100,
            assignment: 84,
            midExam: 82,
            finalExam: 85,
            finalScore: 83.9,
            grade: 'B+',
            status: 'passed'
          },
          {
            code: 'SMP202',
            title: 'Struktur Organisme Sel & Ekosistem',
            credits: 4,
            attendance: 100,
            assignment: 90,
            midExam: 85,
            finalExam: 88,
            finalScore: 87.7,
            grade: 'A-',
            status: 'passed'
          },
          {
            code: 'SMP203',
            title: 'Grammar Dasar & Tenses Inggris',
            credits: 3,
            attendance: 100,
            assignment: 88,
            midExam: 88,
            finalExam: 86,
            finalScore: 87.2,
            grade: 'A-',
            status: 'passed'
          }
        ]
      }
    ],
    sma: [
      {
        id: 'sem2',
        name: isIndo ? 'Semester 2 (Genap)' : 'Semester 2 (Even)',
        gpa: 85.0,
        courses: [
          {
            code: 'SMA301',
            title: 'Kalkulus Dasar: Limit & Turunan',
            credits: 4,
            attendance: 100,
            assignment: 82,
            midExam: 80,
            finalExam: 85,
            finalScore: 82.4,
            grade: 'B+',
            status: 'passed'
          },
          {
            code: 'SMA302',
            title: 'Fisika Optik, Gelombang, & Cahaya',
            credits: 4,
            attendance: 100,
            assignment: 88,
            midExam: 85,
            finalExam: 86,
            finalScore: 86.1,
            grade: 'A-',
            status: 'passed'
          },
          {
            code: 'SMA303',
            title: 'Persiapan Tryout UTBK & Skolastik',
            credits: 3,
            attendance: 100,
            assignment: 90,
            midExam: 82,
            finalExam: 88,
            finalScore: 86.6,
            grade: 'A-',
            status: 'passed'
          }
        ]
      },
      {
        id: 'sem1',
        name: isIndo ? 'Semester 1 (Ganjil)' : 'Semester 1 (Odd)',
        gpa: 84.1,
        courses: [
          {
            code: 'SMA301',
            title: 'Kalkulus Dasar: Limit & Turunan',
            credits: 4,
            attendance: 100,
            assignment: 80,
            midExam: 82,
            finalExam: 80,
            finalScore: 80.6,
            grade: 'B+',
            status: 'passed'
          },
          {
            code: 'SMA302',
            title: 'Fisika Optik, Gelombang, & Cahaya',
            credits: 4,
            attendance: 100,
            assignment: 85,
            midExam: 80,
            finalExam: 88,
            finalScore: 85.1,
            grade: 'A-',
            status: 'passed'
          },
          {
            code: 'SMA303',
            title: 'Persiapan Tryout UTBK & Skolastik',
            credits: 3,
            attendance: 100,
            assignment: 86,
            midExam: 85,
            finalExam: 86,
            finalScore: 85.8,
            grade: 'A-',
            status: 'passed'
          }
        ]
      }
    ]
  }

  // Determine standard source based on user tier
  const isUniv = tier === 'univ'
  const allSemesters = isUniv ? MOCK_UNIV_GRADES : MOCK_SCHOOL_GRADES[tier as 'sd' | 'smp' | 'sma'] || MOCK_SCHOOL_GRADES.sma

  // Find active semester data based on state selection
  const activeSemId = selectedSemId || allSemesters[0].id
  const activeSemester = allSemesters.find((s) => s.id === activeSemId) || allSemesters[0]

  // Overall calculations
  const cumulativeGPAVal = 3.85
  const totalSksPassed = 39
  const currentAverageGrade = isUniv ? activeSemester.gpa : activeSemester.gpa
  const qualitativePredicate =
    currentAverageGrade >= 90
      ? 'A (Sangat Sempurna)'
      : currentAverageGrade >= 85
        ? 'A- (Sangat Memuaskan)'
        : 'B+ (Memuaskan)'

  // Handle PDF Transcript export animation
  const handlePdfDownload = () => {
    if (downloadStep !== -1) return
    setDownloadStep(0)

    const steps = [
      isIndo ? 'Menghubungkan ke Portal Akademik...' : 'Connecting to Academic Portal...',
      isIndo ? 'Merekapitulasi nilai dan IPK...' : 'Aggregating grades and GPA...',
      isIndo ? 'Menghasilkan dokumen PDF terenkripsi...' : 'Generating encrypted PDF document...',
      isIndo ? 'Selesai! Dokumen berhasil diunduh.' : 'Completed! Document downloaded successfully.'
    ]

    const runSteps = (index: number) => {
      if (index >= steps.length) {
        setTimeout(() => {
          setDownloadStep(-1)
          toast.success(
            isIndo ? 'Laporan Nilai / KHS berhasil disimpan ke perangkat.' : 'Grade Report / KHS successfully downloaded.'
          )
        }, 1000)

        return
      }

      setTimeout(() => {
        setDownloadStep(index)
        runSteps(index + 1)
      }, 1200)
    }

    runSteps(1)
  }

  // Handle grade appeal (sanggah) submission
  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!appealCourse || !appealReason.trim()) return

    setIsAppealing(true)
    setTimeout(() => {
      setIsAppealing(false)
      toast.success(
        isIndo
          ? `Sanggahan nilai untuk mata pelajaran ${appealCourse.code} berhasil dikirim ke pengajar!`
          : `Grade appeal for ${appealCourse.code} successfully submitted to the instructor!`
      )
      setAppealCourse(null)
      setAppealReason('')
    }, 1500)
  }

  // Define SVG graph points based on semester data
  // Scaling factors to draw the SVG line chart
  const gpaHistory = isUniv
    ? [
        { label: 'Sem 1', val: 3.75 },
        { label: 'Sem 2', val: 3.82 },
        { label: 'Sem 3', val: 3.9 }
      ]
    : [
        { label: 'Sem 1', val: allSemesters[1]?.gpa || 92.0 },
        { label: 'Sem 2', val: allSemesters[0]?.gpa || 92.8 }
      ]

  // Construct SVG Path points
  const chartWidth = 500
  const chartHeight = 150
  const paddingX = 60
  const paddingY = 35

  interface Coordinate {
    x: number
    y: number
    val: number
    label: string
  }

  const getCoordinates = (): Coordinate[] => {
    const pointsCount = gpaHistory.length
    if (pointsCount < 2) return []

    const minVal = isUniv ? 3.5 : 80
    const maxVal = isUniv ? 4.0 : 100

    return gpaHistory.map((pt, i) => {
      const x = paddingX + (i * (chartWidth - paddingX * 2)) / (pointsCount - 1)
      const ratio = (pt.val - minVal) / (maxVal - minVal)
      const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2)

      return { x, y, val: pt.val, label: pt.label }
    })
  }

  const coords = getCoordinates()

  let linePath = ''
  let areaPath = ''

  if (coords.length >= 2) {
    linePath = `M ${coords[0].x} ${coords[0].y} `
    for (let i = 1; i < coords.length; i++) {
      // Draw smooth curves using midpoint calculation
      const prev = coords[i - 1]
      const curr = coords[i]
      const cpX1 = prev.x + (curr.x - prev.x) / 2
      const cpY1 = prev.y
      const cpX2 = prev.x + (curr.x - prev.x) / 2
      const cpY2 = curr.y
      linePath += `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y} `
    }

    areaPath =
      linePath + `L ${coords[coords.length - 1].x} ${chartHeight - paddingY} L ${coords[0].x} ${chartHeight - paddingY} Z`
  }

  return (
    <div className="space-y-6">
      {/* ─── Page Title and Toggle Visibility ─── */}
      <div className="flex flex-col gap-3.5 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800/60">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="dark:hover:bg-neutral-850 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-text-dark transition-all hover:bg-slate-50 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
          >
            <ArrowLeftIcon size={16} weight="bold" />
          </Link>
          <div>
            <h1 className="text-xl font-black tracking-tight text-[#333] sm:text-2xl dark:text-white">{t('gradesTitle')}</h1>
            <p className="mt-1 text-xs text-text-muted">{t('gradesSubtitle')}</p>
          </div>
        </div>

        {/* Global Privacy eyeball toggle */}
        <button
          onClick={toggleGradesVisibility}
          className="dark:hover:bg-neutral-850 flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98] sm:self-auto dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
        >
          {showGrades ? <EyeIcon size={16} weight="bold" /> : <EyeSlashIcon size={16} weight="bold" />}
          <span>
            {showGrades ? (isIndo ? 'Samarkan Nilai' : 'Hide Grades') : isIndo ? 'Tampilkan Nilai' : 'Show Grades'}
          </span>
        </button>
      </div>

      {/* ─── Academic Statistics Cards ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* GPA Cumulative or School Average */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_12px_rgba(0,48,87,0.02)] dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
          <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">
            {isUniv ? t('cumulativeGpa') : t('averageGrade')}
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span
              className={cn(
                'text-2xl font-black text-text-dark transition-all duration-300 dark:text-white',
                !showGrades && 'blur-md select-none'
              )}
            >
              {isUniv ? cumulativeGPAVal.toFixed(2) : currentAverageGrade.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-text-muted">{isUniv ? '/ 4.00' : '/ 100'}</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-green-500">
            <ArrowUpIcon size={10} weight="bold" />
            <span>{isIndo ? 'Peningkatan dari semester lalu' : 'Improvement from last term'}</span>
          </div>
        </div>

        {/* Semester GPA / QUALITATIVE PREDICATE */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_12px_rgba(0,48,87,0.02)] dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
          <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">
            {isUniv ? t('semesterGpa') : t('gradePredicate')}
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span
              className={cn(
                'text-2xl font-black text-text-dark transition-all duration-300 dark:text-white',
                !showGrades && 'blur-md select-none'
              )}
            >
              {isUniv ? activeSemester.gpa.toFixed(2) : qualitativePredicate.split(' ')[0]}
            </span>
            <span className="text-xs font-semibold text-text-muted">
              {isUniv ? `/ 4.00` : qualitativePredicate.slice(qualitativePredicate.indexOf(' '))}
            </span>
          </div>
          <div className="mt-1 text-[10px] text-text-muted">
            {isIndo ? `Untuk ${activeSemester.name}` : `For ${activeSemester.name}`}
          </div>
        </div>

        {/* SKS Passed or Total subjects */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_12px_rgba(0,48,87,0.02)] dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
          <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">
            {isUniv ? t('creditsPassed') : isIndo ? 'Jumlah Pelajaran' : 'Total Subjects'}
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-text-dark dark:text-white">
              {isUniv ? totalSksPassed : activeSemester.courses.length}
            </span>
            <span className="text-xs font-semibold text-text-muted">
              {isUniv ? '/ 144 SKS' : isIndo ? 'Mata Pelajaran' : 'Subjects'}
            </span>
          </div>
          <div className="mt-1 text-[10px] font-bold text-primary dark:text-secondary">
            {isIndo ? 'Status Kelulusan: Aman' : 'Academic Status: Safe'}
          </div>
        </div>
      </div>

      {/* ─── Premium Progress Graph & Export ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* GPA Progress SVG Graph */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 dark:text-neutral-200">
              {isIndo ? 'Grafik Progres Akademik' : 'Academic Progress Chart'}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-black text-primary uppercase dark:bg-secondary/15 dark:text-secondary">
              {isUniv ? 'IPK Kumulatif' : 'Rata-rata Nilai'}
            </span>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full overflow-visible">
              {/* Grid Lines */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={chartWidth - paddingX}
                y2={paddingY}
                className="stroke-slate-100 dark:stroke-neutral-800/60"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <line
                x1={paddingX}
                y1={chartHeight - paddingY}
                x2={chartWidth - paddingX}
                y2={chartHeight - paddingY}
                className="stroke-slate-200 dark:stroke-neutral-800"
                strokeWidth={1.5}
              />

              {/* Area Under Curve Gradient */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary, #008ae3)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-primary, #008ae3)" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Draw Paths */}
              {coords.length >= 2 && (
                <>
                  {/* Shaded Area */}
                  <path d={areaPath} fill="url(#chartGradient)" />

                  {/* Connecting Line */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="var(--color-primary, #008ae3)"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Circular Points */}
                  {coords.map((pt, idx) => (
                    <g key={idx} className="group cursor-pointer">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={6}
                        fill="white"
                        stroke="var(--color-primary, #008ae3)"
                        strokeWidth={3}
                        className="group-hover:r-8 transition-all"
                      />
                      {/* Interactive score tooltip */}
                      <text
                        x={pt.x}
                        y={pt.y - 12}
                        textAnchor="middle"
                        className={cn(
                          'fill-slate-700 text-[10px] font-black transition-all duration-300 dark:fill-neutral-300',
                          !showGrades && 'blur-sm select-none'
                        )}
                      >
                        {pt.val}
                      </text>
                      {/* X Axis Labels */}
                      <text
                        x={pt.x}
                        y={chartHeight - 12}
                        textAnchor="middle"
                        className="fill-text-muted text-[9px] font-bold"
                      >
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Actions Sidebar (Download PDF & Info Card) */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                <GraduationCapIcon size={18} weight="bold" />
              </div>
              <h4 className="text-xs font-black tracking-wider text-slate-800 uppercase dark:text-neutral-200">
                {isIndo ? 'Status & Akreditasi' : 'Status & Accreditation'}
              </h4>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b border-slate-50 pb-2 dark:border-neutral-800/40">
                <span className="text-text-muted">{isIndo ? 'Status Siswa' : 'Student Status'}</span>
                <span className="font-bold text-green-500">{isIndo ? 'Aktif' : 'Active'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2 dark:border-neutral-800/40">
                <span className="text-text-muted">{isIndo ? 'Akreditasi Program' : 'Program Accreditation'}</span>
                <span className="font-bold text-[#333] dark:text-white">A (Unggul)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">{isIndo ? 'Beban SKS Semester' : 'Semester SKS Load'}</span>
                <span className="font-bold text-[#333] dark:text-white">
                  {isUniv
                    ? `${activeSemester.courses.reduce((acc, c) => acc + c.credits, 0)} SKS`
                    : `${activeSemester.courses.length} Mapel`}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5 dark:border-neutral-800/60">
            {downloadStep === -1 ? (
              <button
                onClick={handlePdfDownload}
                className="bg-cta-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-black text-white shadow-md transition-all hover:scale-[0.99] active:scale-95"
              >
                <DownloadSimpleIcon size={16} weight="bold" />
                <span>{t('downloadTranscript')}</span>
              </button>
            ) : (
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-neutral-900/60">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-xs font-bold text-[#333] dark:text-neutral-200">
                    {downloadStep === 0
                      ? isIndo
                        ? 'Menghubungkan ke database...'
                        : 'Connecting...'
                      : downloadStep === 1
                        ? isIndo
                          ? 'Merekapitulasi nilai...'
                          : 'Aggregating...'
                        : downloadStep === 2
                          ? isIndo
                            ? 'Membuat dokumen PDF...'
                            : 'Generating PDF...'
                          : isIndo
                            ? 'Menyelesaikan download...'
                            : 'Finishing...'}
                  </span>
                </div>
                {/* Progress bar line */}
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-800">
                  <div
                    className="h-full bg-primary transition-all duration-1000 ease-out"
                    style={{ width: `${(downloadStep + 1) * 25}%` }}
                  />
                </div>
              </div>
            )}
            <p className="mt-2.5 text-center text-[9px] text-text-muted">
              {isIndo
                ? '*Laporan nilai ini hanya representasi portal. Dokumen resmi dikeluarkan oleh BAA.'
                : '*This grades report is a portal draft. Official documents are certified by BAA.'}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Semester Selector Dropdown ─── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-black text-slate-800 dark:text-white">
              {isIndo ? 'Laporan Rincian Nilai' : 'Detailed Grades Statement'}
            </h3>
            <p className="text-xs text-text-muted">
              {isIndo
                ? 'Lihat pembagian nilai absensi, tugas kelompok/mandiri, UTS, dan UAS'
                : 'View attendance, homework, midterm, and final exam break-downs'}
            </p>
          </div>

          {/* Semester Selector Dropdown button */}
          <div className="relative self-start sm:self-auto">
            <button
              onClick={() => setIsSemFilterOpen(!isSemFilterOpen)}
              className="dark:hover:bg-neutral-850 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-text-dark transition-all hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
            >
              <span>{activeSemester.name}</span>
              <CaretDownIcon size={14} weight="bold" />
            </button>
            {isSemFilterOpen && (
              <div className="absolute right-0 z-30 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                {allSemesters.map((sem) => (
                  <button
                    key={sem.id}
                    onClick={() => {
                      setSelectedSemId(sem.id)
                      setIsSemFilterOpen(false)
                    }}
                    className={cn(
                      'dark:hover:bg-neutral-850 w-full rounded-lg px-3.5 py-2.5 text-left text-xs font-bold transition-colors hover:bg-slate-50',
                      selectedSemId === sem.id && 'bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary'
                    )}
                  >
                    {sem.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── Grades Table (Scrollable on mobile) ─── */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-black tracking-wider text-text-muted uppercase dark:border-neutral-800 dark:bg-neutral-900/60">
                <th className="px-4 py-3">{isIndo ? 'KODE' : 'CODE'}</th>
                <th className="px-4 py-3">{t('tableCourse')}</th>
                <th className="px-4 py-3">{isUniv ? 'SKS' : 'MAPEL'}</th>
                <th className="px-4 py-3 text-center">{t('tableAttendance')} (10%)</th>
                <th className="px-4 py-3 text-center">{t('tableAssignment')} (20%)</th>
                <th className="px-4 py-3 text-center">{t('tableMidExam')} (30%)</th>
                <th className="px-4 py-3 text-center">{t('tableFinalExam')} (40%)</th>
                <th className="px-4 py-3 text-center">{t('tableFinalScore')}</th>
                <th className="px-4 py-3 text-center">{t('tableGrade')}</th>
                <th className="px-4 py-3 text-center">{t('tableStatus')}</th>
                <th className="px-4 py-3 text-center">{isIndo ? 'AKSI' : 'ACTION'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/40">
              {activeSemester.courses.map((course) => (
                <tr key={course.code} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-neutral-900/30">
                  <td className="px-4 py-4.5 font-black text-slate-800 dark:text-neutral-200">{course.code}</td>
                  <td className="px-4 py-4.5 font-bold text-[#333] dark:text-white">{course.title}</td>
                  <td className="px-4 py-4.5 font-semibold text-text-muted">{course.credits}</td>

                  {/* Sub-Scores with global toggle check */}
                  <td
                    className={cn(
                      'px-4 py-4.5 text-center font-medium text-slate-700 transition-all duration-300 dark:text-neutral-300',
                      !showGrades && 'blur-md select-none'
                    )}
                  >
                    {course.attendance}
                  </td>
                  <td
                    className={cn(
                      'px-4 py-4.5 text-center font-medium text-slate-700 transition-all duration-300 dark:text-neutral-300',
                      !showGrades && 'blur-md select-none'
                    )}
                  >
                    {course.assignment}
                  </td>
                  <td
                    className={cn(
                      'px-4 py-4.5 text-center font-medium text-slate-700 transition-all duration-300 dark:text-neutral-300',
                      !showGrades && 'blur-md select-none'
                    )}
                  >
                    {course.midExam}
                  </td>
                  <td
                    className={cn(
                      'px-4 py-4.5 text-center font-medium text-slate-700 transition-all duration-300 dark:text-neutral-300',
                      !showGrades && 'blur-md select-none'
                    )}
                  >
                    {course.finalExam}
                  </td>

                  {/* Final Average & Letter Grade */}
                  <td
                    className={cn(
                      'px-4 py-4.5 text-center font-black text-slate-900 transition-all duration-300 dark:text-white',
                      !showGrades && 'blur-md select-none'
                    )}
                  >
                    {course.finalScore.toFixed(1)}
                  </td>
                  <td className="px-4 py-4.5 text-center">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-black transition-all duration-300',
                        course.grade.startsWith('A')
                          ? 'bg-green-500/10 text-green-600 dark:bg-green-500/25 dark:text-green-400'
                          : 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/25 dark:text-blue-400',
                        !showGrades && 'blur-md select-none'
                      )}
                    >
                      {course.grade}
                    </span>
                  </td>

                  {/* Graduation status check */}
                  <td className="px-4 py-4.5 text-center">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase',
                        course.status === 'passed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                      )}
                    >
                      {course.status === 'passed' ? <CheckCircleIcon size={12} /> : <WarningIcon size={12} />}
                      <span>{course.status === 'passed' ? t('statusPassed') : t('statusFailed')}</span>
                    </span>
                  </td>

                  {/* Sanggah (Appeal) action button */}
                  <td className="px-4 py-4.5 text-center">
                    <button
                      onClick={() => setAppealCourse(course)}
                      className="dark:hover:bg-neutral-850 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-black text-slate-600 transition-all hover:bg-slate-50 hover:text-primary active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:text-secondary"
                    >
                      {isIndo ? 'Sanggah' : 'Appeal'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Sanggah Modal Drawer (Framer Motion) ─── */}
      <AnimatePresence>
        {appealCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setAppealCourse(null)}
              className="absolute inset-0 bg-black/60"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-slate-100 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-[#1e1e1e]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-4 dark:border-neutral-800/60">
                <div className="flex items-center gap-2">
                  <WarningIcon size={20} className="text-amber-500" />
                  <h3 className="text-sm font-black text-slate-800 dark:text-white">{t('appealModalTitle')}</h3>
                </div>
                <button
                  onClick={() => setAppealCourse(null)}
                  className="dark:hover:bg-neutral-850 rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:hover:text-white"
                >
                  <XIcon size={18} weight="bold" />
                </button>
              </div>

              {/* Course Reference Alert */}
              <div className="mt-4 rounded-xl bg-slate-50 p-3.5 text-xs dark:bg-neutral-900/60">
                <span className="font-bold text-primary dark:text-secondary">{appealCourse.code}</span>
                <p className="mt-0.5 font-black text-slate-800 dark:text-white">{appealCourse.title}</p>
                <div className="mt-2.5 flex items-center gap-4 text-[10px] font-bold text-text-muted">
                  <span>UTS: {appealCourse.midExam}</span>
                  <span>UAS: {appealCourse.finalExam}</span>
                  <span>
                    Nilai Akhir: {appealCourse.finalScore.toFixed(1)} ({appealCourse.grade})
                  </span>
                </div>
              </div>

              {/* Detailed Appeal Form */}
              <form onSubmit={handleAppealSubmit} className="mt-6 flex-1 space-y-5">
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-bold text-slate-700 dark:text-neutral-300">
                    {t('appealReason')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={appealReason}
                    onChange={(e) => setAppealReason(e.target.value)}
                    placeholder={t('appealReasonPlaceholder')}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                  />
                  <p className="text-[10px] text-text-muted">
                    {isIndo
                      ? 'Berikan alasan logis serta detail pembetulan nilai (misal: "Nilai tugas ke-3 belum masuk rekap").'
                      : 'Provide a logical reason and detail grade rectification details.'}
                  </p>
                </div>

                {/* Document verification file upload */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-bold text-slate-700 dark:text-neutral-300">
                    {isIndo ? 'Unggah Bukti Pendukung (Opsional)' : 'Upload Supporting Evidence (Optional)'}
                  </label>
                  <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-5 text-center transition-colors hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900/30">
                    <DownloadSimpleIcon size={20} className="rotate-180 text-slate-400" />
                    <span className="mt-2 text-[10px] font-bold text-slate-600 dark:text-neutral-300">
                      {isIndo ? 'Klik untuk memilih file' : 'Click to select files'}
                    </span>
                    <span className="mt-0.5 text-[9px] text-text-muted">PDF, PNG, JPG (Max 5MB)</span>
                  </div>
                </div>

                {/* Information Callout */}
                <div className="rounded-xl border border-slate-100 bg-[#fafafa] p-3 text-[10px] leading-relaxed text-text-muted dark:border-neutral-800/40 dark:bg-[#181818]">
                  <div className="flex gap-2">
                    <InfoIcon size={14} className="mt-0.5 shrink-0 text-primary" />
                    <p>
                      {isIndo
                        ? 'Pengajuan sanggahan akan diproses oleh Dosen Pengampu dalam waktu maksimal 3x24 jam kerja. Anda akan menerima notifikasi jika status disetujui.'
                        : 'Appeals are processed by the lecturer in charge within a maximum of 3x24 working hours.'}
                    </p>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="absolute right-6 bottom-6 left-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setAppealCourse(null)}
                    className="dark:hover:bg-neutral-850 flex-1 rounded-xl border border-slate-200 py-3 text-xs font-black text-slate-600 transition-colors hover:bg-slate-50 dark:border-neutral-800 dark:text-neutral-300"
                  >
                    {isIndo ? 'Batal' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isAppealing}
                    className="bg-cta-gradient flex-1 rounded-xl py-3 text-xs font-black text-white shadow-md transition-all hover:scale-[0.99] active:scale-95 disabled:opacity-50"
                  >
                    {isAppealing ? (
                      <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      t('appealSubmit')
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
