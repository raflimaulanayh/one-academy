'use client'

import {
  ArrowLeftIcon,
  CaretDownIcon,
  CheckCircleIcon,
  DownloadSimpleIcon,
  FileTextIcon,
  FunnelIcon,
  ArrowsDownUpIcon,
  InfoIcon,
  XIcon,
  UserIcon,
  ClockIcon,
  UsersIcon,
  CheckIcon,
  EyeIcon,
  FileDocIcon
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/utils'

// Course mapping matching the screenshots
interface Course {
  id: number
  code: string
  title: string
  classCode: string
  type: 'LAB' | 'LEC'
  status: 'All Done' | 'Pending'
  completedCount: number
  totalCount: number
}

const COURSES: Course[] = [
  {
    id: 1,
    code: 'ISYS6014005',
    title: 'Office Automation Industri Kreatif',
    classCode: 'BA05',
    type: 'LAB',
    status: 'All Done',
    completedCount: 5,
    totalCount: 5
  },
  {
    id: 2,
    code: 'ISYS6016005',
    title: 'Pemrograman Front-End Web',
    classCode: 'BA05',
    type: 'LAB',
    status: 'All Done',
    completedCount: 4,
    totalCount: 4
  },
  {
    id: 3,
    code: 'ISYS6013005',
    title: 'Rekayasa Kebutuhan Perangkat Lunak',
    classCode: 'BA05',
    type: 'LEC',
    status: 'Pending',
    completedCount: 2,
    totalCount: 3
  }
]

// Mock Assignment Tasks list
interface Task {
  id: number
  title: string
  session: string
  sessionNum: number
  dueDate: string
  startDate: string
  status: 'Completed' | 'Pending'
  individual: boolean
  authentic: boolean
  scoringMethod: string
  totalAttempts: string
  totalQuestions: number
  expiredText: string
  attachmentName: string
  attachmentSize: string
  commentText: string
  submissionDate: string
  gradeDate: string
}

const TASKS: Record<string, Task[]> = {
  ISYS6014005: [
    {
      id: 101,
      title: 'Tugas Praktikum Ms.Word (Table of Content)',
      session: 'S2',
      sessionNum: 2,
      dueDate: '23 Feb 2026, 14:00 GMT+7',
      startDate: '19 Feb 2026, 16:30 GMT+7',
      status: 'Completed',
      individual: true,
      authentic: true,
      scoringMethod: 'Latest Score',
      totalAttempts: '1 of 1 Attempts',
      totalQuestions: 1,
      expiredText: 'Expired 114d 19h ago',
      attachmentName: 'WordAutomation_RafliMaulana',
      attachmentSize: '2.23 MB',
      commentText:
        'Halo,\nBerikut saya kirimkan file dan link tugas mata kuliah Office Automation Industri Kreatif:\n\nLink Word:\nhttps://binusianorg-my.sharepoint.com/personal/rafli_herman_satu_ac_id/Documents/WordAutomation_RafliMaulana\n\nCatatan: Mohon dibuka menggunakan aplikasi Microsoft Word (desktop) agar format dokumen tampil dengan baik.\n\nTerima kasih.\n\nHormat saya,\nRafli Maulana\n2810011156',
      submissionDate: '23 Feb 2026, 05:07 GMT+7',
      gradeDate: '25 Feb 2026, 14:07 GMT+7'
    },
    {
      id: 102,
      title: 'Latihan Studi Kasus Data Visually',
      session: 'S6',
      sessionNum: 6,
      dueDate: '26 Mar 2026, 17:20 GMT+7',
      startDate: '20 Mar 2026, 08:00 GMT+7',
      status: 'Completed',
      individual: true,
      authentic: true,
      scoringMethod: 'Latest Score',
      totalAttempts: '1 of 1 Attempts',
      totalQuestions: 1,
      expiredText: 'Expired 84d 15h ago',
      attachmentName: 'DataVisual_StudiKasus_Rafli',
      attachmentSize: '4.12 MB',
      commentText: 'Halo Pak, berikut file tugas visualisasi data menggunakan Excel. Terima kasih.',
      submissionDate: '25 Mar 2026, 16:45 GMT+7',
      gradeDate: '28 Mar 2026, 10:00 GMT+7'
    },
    {
      id: 103,
      title: 'Kuis Latihan Ms. Excel (If & Lookup)',
      session: 'S9',
      sessionNum: 9,
      dueDate: '07 Mei 2026, 17:10 GMT+7',
      startDate: '01 Mei 2026, 12:00 GMT+7',
      status: 'Completed',
      individual: true,
      authentic: false,
      scoringMethod: 'Highest Score',
      totalAttempts: '1 of 2 Attempts',
      totalQuestions: 10,
      expiredText: 'Expired 42d 12h ago',
      attachmentName: 'ExcelQuiz_Formula_Rafli',
      attachmentSize: '1.05 MB',
      commentText: 'Kuis selesai dikerjakan.',
      submissionDate: '06 Mei 2026, 10:15 GMT+7',
      gradeDate: '08 Mei 2026, 09:30 GMT+7'
    },
    {
      id: 104,
      title: 'Soal Studi Kasus Pivot Table',
      session: 'S10',
      sessionNum: 10,
      dueDate: '21 Mei 2026, 17:15 GMT+7',
      startDate: '15 Mei 2026, 14:00 GMT+7',
      status: 'Pending',
      individual: true,
      authentic: true,
      scoringMethod: 'Latest Score',
      totalAttempts: '0 of 1 Attempts',
      totalQuestions: 1,
      expiredText: 'Expired 28d 10h ago',
      attachmentName: '',
      attachmentSize: '',
      commentText: '',
      submissionDate: '',
      gradeDate: ''
    },
    {
      id: 105,
      title: 'Tugas presentasi dan demo Microsoft Excel',
      session: 'S12',
      sessionNum: 12,
      dueDate: '11 Jun 2026, 17:00 GMT+7',
      startDate: '05 Jun 2026, 09:00 GMT+7',
      status: 'Pending',
      individual: true,
      authentic: true,
      scoringMethod: 'Latest Score',
      totalAttempts: '0 of 1 Attempts',
      totalQuestions: 1,
      expiredText: 'Expired 7d ago',
      attachmentName: '',
      attachmentSize: '',
      commentText: '',
      submissionDate: '',
      gradeDate: ''
    }
  ],
  ISYS6016005: [
    {
      id: 201,
      title: 'Tugas Coding 1: Semantics HTML',
      session: 'S2',
      sessionNum: 2,
      dueDate: '15 Feb 2026, 23:59 GMT+7',
      startDate: '10 Feb 2026, 08:00 GMT+7',
      status: 'Completed',
      individual: true,
      authentic: true,
      scoringMethod: 'Latest Score',
      totalAttempts: '1 of 1 Attempts',
      totalQuestions: 1,
      expiredText: 'Expired 122d ago',
      attachmentName: 'SemanticHTML_Portfolio',
      attachmentSize: '124 KB',
      commentText: 'Link GitHub repositori: https://github.com/rafli/portfolio-semantic-html',
      submissionDate: '14 Feb 2026, 20:00 GMT+7',
      gradeDate: '17 Feb 2026, 10:00 GMT+7'
    }
  ]
}

type Props = {
  assignments?: any[]
  onUpload?: (id: number) => void
}

export function AssignmentsTab({ assignments: _assignments, onUpload: _onUpload }: Props = {}) {
  const [currentView, setCurrentView] = useState<'list' | 'course-detail' | 'task-detail'>('list')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const [runningPeriod, setRunningPeriod] = useState('2025-even')
  const [activeGroupTab, setActiveGroupTab] = useState<'LAB' | 'LEC'>('LAB')

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isAttemptModalOpen, setIsAttemptModalOpen] = useState(false)
  const [pdfPage, setPdfPage] = useState(1)

  const handleOpenCourse = (course: Course) => {
    setSelectedCourse(course)
    setCurrentView('course-detail')
  }

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task)
    setCurrentView('task-detail')
  }

  // Filter courses based on LAB or LEC
  const filteredCourses = COURSES.filter((course) => course.type === activeGroupTab)

  // Get tasks for the active course
  const activeTasks = selectedCourse ? TASKS[selectedCourse.code] || [] : []

  // Sort tasks
  const sortedTasks = [...activeTasks].sort((a, b) => {
    return sortOrder === 'asc' ? a.sessionNum - b.sessionNum : b.sessionNum - a.sessionNum
  })

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {/* ─── 1. ASSESSMENT MODULE: MAIN LIST VIEW ─── */}
        {currentView === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header row */}
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800/60">
              <div>
                <h3 className="text-xl font-black tracking-tight text-[#333] sm:text-2xl dark:text-white">Assessment</h3>
                <p className="mt-1 text-xs text-text-muted">Pantau rekap penugasan dan kuis akademik Anda</p>
              </div>

              {/* Running Period Selection */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Running Period</span>
                <div className="relative">
                  <select
                    value={runningPeriod}
                    onChange={(e) => setRunningPeriod(e.target.value)}
                    className="appearance-none rounded border border-slate-200 bg-white py-2 pr-8 pl-3.5 text-xs font-bold text-text-dark shadow-sm transition-all outline-none focus:border-[#ff9d00] dark:border-neutral-800 dark:bg-[#1a1a1a] dark:text-white"
                  >
                    <option value="2025-even">2025, Even Semester</option>
                    <option value="2025-odd">2025, Odd Semester</option>
                  </select>
                  <div className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-500">
                    <CaretDownIcon size={14} weight="bold" />
                  </div>
                </div>
              </div>
            </div>

            {/* LAB vs LEC Tabs */}
            <div className="border-slate-150 flex border-b dark:border-neutral-800/60">
              <button
                onClick={() => setActiveGroupTab('LAB')}
                className={cn(
                  'border-b-2 px-5 py-2.5 text-xs font-black tracking-wider uppercase transition-all focus:outline-none',
                  activeGroupTab === 'LAB'
                    ? 'border-[#ff9d00] text-[#ff9d00]'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-white'
                )}
              >
                LAB
              </button>
              <button
                onClick={() => setActiveGroupTab('LEC')}
                className={cn(
                  'border-b-2 px-5 py-2.5 text-xs font-black tracking-wider uppercase transition-all focus:outline-none',
                  activeGroupTab === 'LEC'
                    ? 'border-[#ff9d00] text-[#ff9d00]'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-white'
                )}
              >
                LEC
              </button>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleOpenCourse(course)}
                  className="group dark:border-neutral-850 relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#ff9d00]/40 hover:shadow-md dark:bg-[#1e1e1e] dark:hover:border-[#ff9d00]/45"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm leading-snug font-bold text-slate-800 transition-colors group-hover:text-[#ff9d00] dark:text-white dark:group-hover:text-[#ff9d00]">
                        {course.title}
                      </h4>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-neutral-400">
                          <FileTextIcon size={14} className="text-slate-400" />
                          <span>{course.code}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-neutral-400">
                          <UsersIcon size={14} className="text-slate-400" />
                          <span>{course.classCode}</span>
                        </div>
                      </div>
                    </div>

                    {/* Small Chevron Down Centered */}
                    <div className="flex justify-center pt-1 text-slate-300 dark:text-neutral-700">
                      <CaretDownIcon size={14} className="transition-transform group-hover:translate-y-0.5" />
                    </div>
                  </div>

                  {/* Divider and Status block */}
                  <div className="mt-4 border-t border-slate-100 pt-4 dark:border-neutral-800">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-green-600 dark:text-green-500">
                      <CheckCircleIcon size={14} weight="fill" className="text-green-500" />
                      <span>
                        {course.status === 'All Done'
                          ? 'All Done'
                          : `${course.completedCount} / ${course.totalCount} Tugas Selesai`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── 2. LAB: ASSIGNMENT COURSE DETAIL VIEW ─── */}
        {currentView === 'course-detail' && selectedCourse && (
          <motion.div
            key="course-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Header: Back & Metadata */}
            <div className="border-slate-150 flex flex-col gap-4 border-b pb-5 dark:border-neutral-800">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => setCurrentView('list')}
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  <ArrowLeftIcon size={16} weight="bold" />
                </button>
                <div>
                  <span className="block text-[10px] leading-none font-bold tracking-wider text-slate-400 uppercase">
                    {selectedCourse.type}: ASSIGNMENT
                  </span>
                  <h3 className="mt-1 text-lg leading-tight font-bold text-slate-800 sm:text-xl dark:text-white">
                    {selectedCourse.title}
                  </h3>

                  {/* Metadata labels row */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-bold text-slate-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <FileTextIcon size={14} className="text-slate-400" />
                      <span>{selectedCourse.code}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UsersIcon size={14} className="text-slate-400" />
                      <span>
                        {selectedCourse.classCode} - {selectedCourse.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Sort Toolbar */}
            <div className="flex items-center justify-end gap-2 text-xs">
              <button className="text-slate-650 flex h-9 w-9 items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                <FunnelIcon size={16} />
              </button>

              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="text-slate-650 appearance-none rounded border border-slate-200 bg-white py-2 pr-8 pl-8 text-xs font-bold outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                  >
                    <option value="asc">Sort by: Session</option>
                    <option value="desc">Sort by: Session (Latest)</option>
                  </select>
                  <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
                    <ArrowsDownUpIcon size={14} />
                  </div>
                  <div className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400">
                    <CaretDownIcon size={12} weight="bold" />
                  </div>
                </div>

                <div className="dark:border-neutral-850 dark:bg-neutral-850 rounded border border-slate-200 bg-slate-100 px-3.5 py-2 font-bold text-slate-500">
                  {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </div>
              </div>
            </div>

            {/* Tasks Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleOpenTask(task)}
                  className="dark:border-neutral-850 flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-[#ff9d00]/30 dark:bg-[#1e1e1e]"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm leading-snug font-bold text-slate-800 dark:text-white">{task.title}</h4>

                      {/* Icons bar (individual silhouette, doc list, session badge) */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-neutral-800">
                          <UserIcon size={12} />
                        </div>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-neutral-800">
                          <FileTextIcon size={12} />
                        </div>
                        <div className="text-slate-650 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[9px] font-black dark:bg-neutral-800 dark:text-neutral-300">
                          {task.session}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3.5 border-t border-slate-100 pt-4 dark:border-neutral-800">
                    <div className="text-[10px] font-bold text-slate-400">
                      Due
                      <p className="dark:text-neutral-350 mt-0.5 text-slate-600">{task.dueDate}</p>
                    </div>

                    {task.status === 'Completed' && (
                      <div className="dark:border-neutral-850 flex items-center justify-between border-t border-slate-50 pt-3">
                        <div className="text-xs">
                          <span className="block text-[9px] font-bold text-slate-400">Status</span>
                          <span className="font-bold text-slate-800 dark:text-white">Completed</span>
                        </div>
                        <div className="flex h-5 w-5 items-center justify-center rounded bg-green-500 text-white">
                          <CheckIcon size={12} weight="bold" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── 3. TASK DETAIL & SUBMISSION TIMELINE VIEW ─── */}
        {currentView === 'task-detail' && selectedTask && selectedCourse && (
          <motion.div
            key="task-detail"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="border-slate-150 flex flex-col gap-4 border-b pb-5 dark:border-neutral-800">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => setCurrentView('course-detail')}
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  <ArrowLeftIcon size={16} weight="bold" />
                </button>
                <div>
                  <span className="block text-[10px] leading-none font-bold tracking-wider text-slate-400 uppercase">
                    {selectedCourse.type}: ASSIGNMENT
                  </span>
                  <h3 className="mt-1 text-lg leading-tight font-bold text-slate-800 sm:text-xl dark:text-white">
                    {selectedCourse.title}
                  </h3>

                  {/* Metadata labels row with icons */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-bold text-slate-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <FileTextIcon size={14} className="text-slate-400" />
                      <span>{selectedCourse.code}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UsersIcon size={14} className="text-slate-400" />
                      <span>
                        {selectedCourse.classCode} - {selectedCourse.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ClockIcon size={14} className="text-slate-400" />
                      <span>Session {selectedTask.sessionNum}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Stats Block */}
            <div className="dark:border-neutral-850 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:bg-[#1e1e1e]">
              {/* Task Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 dark:border-neutral-800">
                <div>
                  <h4 className="text-slate-850 text-base leading-tight font-bold dark:text-white">{selectedTask.title}</h4>
                  <div className="mt-2 flex items-center gap-3 text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      <UserIcon size={12} />
                      {selectedTask.individual ? 'Individual' : 'Group'}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileTextIcon size={12} />
                      {selectedTask.authentic ? 'Authentic' : 'Practice'}
                    </span>
                  </div>
                </div>

                {/* Expired Pill */}
                <span className="shrink-0 rounded-full bg-neutral-700 px-3 py-1 text-[9px] font-bold text-white uppercase">
                  {selectedTask.expiredText}
                </span>
              </div>

              {/* Stats parameters */}
              <div className="grid grid-cols-2 gap-5 p-5 text-xs md:grid-cols-3">
                <div>
                  <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Start</p>
                  <p className="mt-1 font-semibold text-slate-700 dark:text-neutral-300">{selectedTask.startDate}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">End</p>
                  <p className="mt-1 font-semibold text-slate-700 dark:text-neutral-300">{selectedTask.dueDate}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Total Question</p>
                  <p className="mt-1 font-semibold text-slate-700 dark:text-neutral-300">{selectedTask.totalQuestions}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Total Attempts</p>
                  <p className="mt-1 font-semibold text-slate-700 dark:text-neutral-300">{selectedTask.totalAttempts}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Scoring Method</p>
                  <p className="mt-1 font-semibold text-slate-700 dark:text-neutral-300">{selectedTask.scoringMethod}</p>
                </div>
              </div>

              {/* Bottom alert info */}
              <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-neutral-400">
                  <InfoIcon size={16} className="shrink-0 text-slate-400" />
                  <span>Due date has passed, you cannot start or continue your attempt.</span>
                </div>
                <button
                  disabled
                  className="shrink-0 cursor-not-allowed rounded bg-slate-200 px-4 py-2 text-[10px] font-bold text-slate-400 uppercase dark:bg-neutral-800 dark:text-neutral-500"
                >
                  No More Attempt
                </button>
              </div>
            </div>

            {/* Answer Attempts Timeline */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Answer Attempts</h4>

              {selectedTask.status === 'Completed' ? (
                /* Attempt Card */
                <div className="dark:border-neutral-850 max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:bg-[#1e1e1e]">
                  {/* Student details header */}
                  <div className="flex items-start justify-between gap-3 p-4">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 dark:text-white">Attempt 1</h5>
                      <div className="mt-2.5 flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-slate-500">
                          <UserIcon size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-800 dark:text-white">RAFLI MAULANA YUSUF HERMAN</p>
                          <p className="mt-0.5 text-[8px] font-bold text-slate-400">{selectedTask.submissionDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* View Attempt Button */}
                    <button
                      onClick={() => setIsAttemptModalOpen(true)}
                      className="shrink-0 rounded bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                      <EyeIcon size={16} />
                    </button>
                  </div>

                  {/* Assessed status banner */}
                  <div className="bg-indigo-650 space-y-1 bg-[#4f46e5] p-4 text-xs font-bold text-white dark:bg-indigo-800">
                    <p className="text-[10px] font-bold tracking-wider text-indigo-200 uppercase">Status</p>
                    <p className="text-white">Your work has been assessed.</p>
                    <p className="pt-1 text-[9px] font-medium text-indigo-200/80">Last Updated: {selectedTask.gradeDate}</p>
                  </div>
                </div>
              ) : (
                /* No attempts state */
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-xs dark:border-neutral-800 dark:bg-neutral-900/10">
                  <p className="font-bold text-slate-400">Belum Ada Percobaan Jawaban</p>
                  <p className="mt-1 text-slate-400/80">Anda tidak mengumpulkan tugas ini tepat waktu.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 4. FULLSCREEN REVIEW ATTEMPT MODAL ─── */}
      <AnimatePresence>
        {isAttemptModalOpen && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-[#141414]"
          >
            {/* Modal Header */}
            <div className="border-slate-150 flex items-center justify-between border-b bg-white px-5 py-3.5 dark:border-neutral-800 dark:bg-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <span className="truncate text-xs font-bold text-slate-700 dark:text-white">
                  Attempt 1 - {selectedTask.title}
                </span>
              </div>
              <button
                onClick={() => setIsAttemptModalOpen(false)}
                className="hover:text-slate-650 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-800"
              >
                <XIcon size={18} weight="bold" />
              </button>
            </div>

            {/* Split Screen Layout */}
            <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
              {/* Left Column: Question Prompt Document Viewer */}
              <div className="border-slate-150 flex flex-1 flex-col overflow-hidden border-r dark:border-neutral-800">
                <div className="text-slate-450 flex items-center justify-between bg-slate-100 px-4 py-2 text-[10px] font-bold dark:bg-neutral-900">
                  <span>QUESTION LIST (Answered: 1 of 1)</span>
                  <span className="rounded bg-[#ff9d00]/10 px-1.5 py-0.5 font-black text-[#ff9d00]">100 pts</span>
                </div>

                {/* Question item tab */}
                <div className="dark:bg-neutral-850 border-b border-slate-100 bg-white p-3 dark:border-neutral-800">
                  <div className="flex w-fit cursor-default items-center gap-2 rounded border border-slate-200 bg-slate-50 p-2 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-slate-500">
                      <UserIcon size={12} />
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-neutral-300">Question 1</span>
                  </div>
                </div>

                {/* PDF Prompt Rendering View */}
                <div className="flex flex-1 justify-center overflow-y-auto bg-slate-100 p-5 dark:bg-[#181818]">
                  {/* Simulated PDF Document Page */}
                  <div className="border-slate-250 relative flex aspect-[1/1.41] w-full max-w-xl flex-col justify-between border bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    {/* Watermark ONE ACADEMY */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none">
                      <div className="-rotate-45 text-center">
                        <p className="text-4xl leading-none font-black tracking-widest text-slate-800 uppercase">
                          ONE ACADEMY
                        </p>
                        <p className="mt-2 text-xs font-bold text-slate-800">SATU University</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Document header banner */}
                      <div className="flex items-start justify-between border-b-2 border-slate-800 pb-3 dark:border-white">
                        <div>
                          <h3 className="text-slate-850 text-xs leading-none font-black tracking-wide uppercase dark:text-white">
                            LATIHAN PRAKTIKUM MICROSOFT WORD
                          </h3>
                          <p className="mt-1 text-[9px] font-bold text-slate-500 dark:text-neutral-400">
                            Mata Kuliah: Office Automation Industri Kreatif
                          </p>
                        </div>
                        <div className="text-right text-[8px] font-bold text-slate-400">
                          <p>Program Studi: Informatika</p>
                          <p className="mt-0.5">Semester: 4</p>
                        </div>
                      </div>

                      {/* Content Section A */}
                      <div className="text-slate-650 dark:text-neutral-350 space-y-1.5 text-xs">
                        <h4 className="text-slate-850 font-bold dark:text-white">A. Tujuan Praktikum</h4>
                        <p className="text-[11px] leading-relaxed">
                          Mahasiswa mampu menguasai pengaturan format dokumen profesional menggunakan Microsoft Word,
                          meliputi pengaturan layout, style teks, tabel, gambar, caption, daftar isi, dan penomoran halaman.
                        </p>
                      </div>

                      {/* Content Section B */}
                      <div className="text-slate-650 dark:text-neutral-350 space-y-2 text-xs">
                        <h4 className="text-slate-850 font-bold dark:text-white">B. Ketentuan Dokumen</h4>
                        <p className="text-[11px]">Buatlah dokumen baru dengan pengaturan berikut:</p>
                        <ul className="list-inside list-decimal space-y-1.5 pl-1 text-[11px]">
                          <li>
                            <span className="font-bold text-slate-800 dark:text-white">Ukuran kertas:</span> A4
                          </li>
                          <li>
                            <span className="font-bold text-slate-800 dark:text-white">Margin:</span>
                            <ul className="mt-0.5 list-inside list-disc space-y-0.5 pl-3">
                              <li>Atas: 3 cm</li>
                              <li>Bawah: 3 cm</li>
                              <li>Kanan: 3 cm</li>
                              <li>Kiri: 4 cm</li>
                            </ul>
                          </li>
                          <li>
                            <span className="font-bold text-slate-800 dark:text-white">Font seluruh isi dokumen:</span> Times
                            New Roman, 12 pt
                          </li>
                          <li>
                            <span className="font-bold text-slate-800 dark:text-white">Paragraf:</span> Spasi 1.5, Justify
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* PDF Footer page number controls */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[9px] font-bold text-slate-400 dark:border-neutral-800">
                      <span>Last saved: 23 Feb 2026, 05:07 GMT+7</span>

                      {/* PDF page actions */}
                      <div className="flex items-center gap-2">
                        <button
                          disabled={pdfPage === 1}
                          onClick={() => setPdfPage((p) => p - 1)}
                          className="rounded border px-1.5 py-0.5 disabled:opacity-40"
                        >
                          &lt;
                        </button>
                        <span>Halaman {pdfPage} / 4</span>
                        <button
                          disabled={pdfPage === 4}
                          onClick={() => setPdfPage((p) => p + 1)}
                          className="rounded border px-1.5 py-0.5 disabled:opacity-40"
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Submission Answer details */}
              <div className="w-full space-y-5 overflow-y-auto bg-white p-5 md:w-96 dark:bg-[#1a1a1a]">
                <h4 className="border-b border-slate-100 pb-2.5 text-xs font-bold tracking-wider text-slate-400 uppercase dark:border-neutral-800">
                  ANSWER
                </h4>

                {/* Uploaded File list */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">1 Attachment (2.23 MB)</span>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-900/60">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-blue-500 text-white">
                        <FileDocIcon size={20} weight="fill" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-800 dark:text-white">
                          {selectedTask.attachmentName}
                        </p>
                        <p className="mt-0.5 text-[9px] font-bold text-slate-400">{selectedTask.attachmentSize}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toast.success(`Mengunduh file jawaban: ${selectedTask.attachmentName}`)}
                      className="text-slate-450 hover:text-[#ff9d00]"
                    >
                      <DownloadSimpleIcon size={18} weight="bold" />
                    </button>
                  </div>
                </div>

                {/* Answer Comments Box */}
                <div className="space-y-2.5">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Student Comments</span>
                  <div className="rounded-xl border border-slate-200/50 bg-slate-50 p-4 dark:border-neutral-800/80 dark:bg-neutral-900/40">
                    <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-neutral-300">
                      {selectedTask.commentText}
                    </p>
                  </div>
                </div>

                {/* Submission footer details */}
                <div className="text-slate-450 space-y-1 rounded-xl bg-slate-50 p-3.5 text-[10px] font-bold dark:bg-neutral-900/30">
                  <p>Tanggal Pengiriman: {selectedTask.submissionDate}</p>
                  <p>Status Kelulusan: Lulus Kriteria (Assessed)</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
