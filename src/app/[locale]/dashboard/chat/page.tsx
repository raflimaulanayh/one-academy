'use client'

import { useDashboard } from '@/context/dashboard-context'
import { useChatStore, Message } from '@/stores/chat-store'
import {
  ChatsIcon,
  MegaphoneIcon,
  ChatCircleDotsIcon,
  RobotIcon,
  PushPinIcon,
  PaperPlaneRightIcon,
  CaretLeftIcon,
  PlusIcon,
  BookOpenIcon,
  CaretDownIcon,
  SparkleIcon,
  AtIcon
} from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { cn } from '@/utils'

// Build participant list from messages + current user
const getParticipants = (messages: Message[], selfName: string): string[] => {
  const names = new Set<string>([selfName, 'AI Tutor'])
  messages.forEach((m) => {
    if (m.senderName) names.add(m.senderName)
  })

  return Array.from(names)
}

// Render text with @mention highlighting and **bold** support
function RenderContent({ text, selfName }: { text: string; selfName: string }) {
  // Split on @Mentions and **bold**
  const parts = text.split(/(@[\w\s.-]+(?=\s|$|[^a-zA-Z0-9_.\s-])|\*\*[^*]+\*\*)/)

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('@')) {
          const name = part.slice(1).trim()
          const isSelfMention = name.toLowerCase() === selfName.toLowerCase()

          return (
            <span
              key={i}
              className={cn(
                'mx-0.5 inline-flex items-center rounded px-1 py-px text-[12px] font-black',
                isSelfMention
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-400'
                  : 'bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary'
              )}
            >
              @{name}
            </span>
          )
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-bold">
              {part.slice(2, -2)}
            </strong>
          )
        }

        return <span key={i}>{part}</span>
      })}
    </>
  )
}

export default function ChatPage() {
  const t = useTranslations('Dashboard')
  const { activeModules, currentLang, userData } = useDashboard()
  const { activeCourseId, activeSubChannel, chats, setActiveCourseId, setActiveSubChannel, sendMessage, initializeChats } =
    useChatStore()

  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
  const [inputValue, setInputValue] = useState('')
  const [isAiStreaming, setIsAiStreaming] = useState(false)
  const [isAttachOpen, setIsAttachOpen] = useState(false)
  const [isPinnedOpen, setIsPinnedOpen] = useState(false)

  // @mention state
  const [mentionQuery, setMentionQuery] = useState<string | null>(null)
  const [mentionStart, setMentionStart] = useState(0)
  const [mentionIndex, setMentionIndex] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const feedRef = useRef<HTMLDivElement>(null)
  const attachRef = useRef<HTMLDivElement>(null)
  const pinnedRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (activeModules && activeModules.length > 0) {
      const courses = activeModules.map((m) => ({
        code: m.code,
        title: m.title.split(':')[0]
      }))
      initializeChats(courses)
    }
  }, [activeModules, initializeChats])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chats, activeCourseId, activeSubChannel])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (attachRef.current && !attachRef.current.contains(e.target as Node)) {
        setIsAttachOpen(false)
      }
      if (pinnedRef.current && !pinnedRef.current.contains(e.target as Node)) {
        setIsPinnedOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!activeCourseId || !chats[activeCourseId]) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="animate-pulse font-medium text-text-muted">{t('loading')}</p>
      </div>
    )
  }

  const activeCourseChat = chats[activeCourseId]
  const currentMessages = activeCourseChat.subChannels[activeSubChannel] || []
  const selfName = userData?.name || 'Siswa Teladan'
  const participants = getParticipants(currentMessages, selfName)

  const filteredMentions =
    mentionQuery !== null
      ? participants.filter((p) => p.toLowerCase().includes(mentionQuery.toLowerCase()) && p !== selfName)
      : []

  // Handle input change and parse @mention trigger
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)

    const pos = e.target.selectionStart ?? val.length
    // Find last @ before cursor
    const textUpToCursor = val.slice(0, pos)
    const lastAt = textUpToCursor.lastIndexOf('@')

    if (lastAt !== -1) {
      const query = textUpToCursor.slice(lastAt + 1)
      // Only trigger if no space in query (a mention won't have internal spaces during typing)
      if (!query.includes(' ') || query.length === 0) {
        setMentionQuery(query)
        setMentionStart(lastAt)
        setMentionIndex(0)

        return
      }
    }
    setMentionQuery(null)
  }

  const insertMention = (name: string) => {
    const before = inputValue.slice(0, mentionStart)
    const after = inputValue.slice(mentionStart + 1 + (mentionQuery?.length ?? 0))
    const newVal = `${before}@${name} ${after}`
    setInputValue(newVal)
    setMentionQuery(null)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  // Handle keyboard nav in mention list
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (mentionQuery !== null && filteredMentions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setMentionIndex((i) => (i + 1) % filteredMentions.length)

        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setMentionIndex((i) => (i - 1 + filteredMentions.length) % filteredMentions.length)

        return
      }
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault()
        insertMention(filteredMentions[mentionIndex])

        return
      }
      if (e.key === 'Escape') {
        setMentionQuery(null)

        return
      }
    }
    if (e.key === 'Enter' && !isAiStreaming && mentionQuery === null) handleSend()
  }

  const triggerGeminiAI = async (userText: string, contextMessages: Message[]) => {
    setIsAiStreaming(true)
    sendMessage(activeCourseId, activeSubChannel, '', 'ai', 'AI Tutor')

    try {
      const currentCourseModule = activeModules.find((m) => m.code === activeCourseId)
      const lessonsContext = currentCourseModule?.lessons?.join(', ') || ''

      const systemInstruction = `Anda adalah Asisten AI Tutor cerdas untuk mata kuliah "${activeCourseChat.courseTitle}" (Kode: ${activeCourseId}).
      Siswa sedang berdiskusi di dalam saluran #${activeSubChannel}.
      Daftar sub-bab pelajaran di kelas ini: [${lessonsContext}].
      Tugas Anda adalah membalas pertanyaan siswa dengan ramah, informatif, singkat, padat, dan menggunakan Bahasa Indonesia yang profesional dan mendidik.
      Gunakan markdown format untuk penjelasan agar mudah dibaca.`

      const formattedHistory = contextMessages
        .filter((msg) => msg.content.trim() !== '')
        .map((msg) => ({
          role: msg.senderRole === 'ai' ? 'assistant' : 'user',
          content: msg.senderRole === 'student' ? `${msg.senderName}: ${msg.content}` : msg.content
        }))

      formattedHistory.push({ role: 'user', content: userText })

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'system', content: systemInstruction }, ...formattedHistory],
          lang: currentLang
        })
      })

      if (!response.ok) throw new Error('Gagal menghubungi AI')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const cleanedText = chunk
            .split('\n')
            .filter((line) => line.startsWith('0:'))
            .map((line) => JSON.parse(line.substring(2)))
            .join('')

          accumulatedText += cleanedText || chunk.replace(/[0-9]:"([^"]*)"/g, '$1').replace(/\\n/g, '\n')

          useChatStore.setState((state) => {
            const courseChat = state.chats[activeCourseId]
            if (!courseChat) return state
            const channelMessages = [...courseChat.subChannels[activeSubChannel]]
            if (channelMessages.length > 0) {
              const lastMsg = { ...channelMessages[channelMessages.length - 1] }
              if (lastMsg.senderRole === 'ai') {
                lastMsg.content = accumulatedText
                channelMessages[channelMessages.length - 1] = lastMsg
              }
            }

            return {
              chats: {
                ...state.chats,
                [activeCourseId]: {
                  ...courseChat,
                  subChannels: { ...courseChat.subChannels, [activeSubChannel]: channelMessages }
                }
              }
            }
          })
        }
      }
    } catch (err) {
      console.error(err)
      toast.error('AI Tutor gagal merespons. Silakan coba lagi.')
      useChatStore.setState((state) => {
        const courseChat = state.chats[activeCourseId]
        if (!courseChat) return state
        const channelMessages = [...courseChat.subChannels[activeSubChannel]]
        if (channelMessages.length > 0 && channelMessages[channelMessages.length - 1].senderRole === 'ai') {
          channelMessages[channelMessages.length - 1].content =
            'Maaf, saya mengalami gangguan koneksi. Bisa tolong ulangi pertanyaan Anda?'
        }

        return {
          chats: {
            ...state.chats,
            [activeCourseId]: {
              ...courseChat,
              subChannels: { ...courseChat.subChannels, [activeSubChannel]: channelMessages }
            }
          }
        }
      })
    } finally {
      setIsAiStreaming(false)
    }
  }

  const handleSend = () => {
    if (!inputValue.trim()) return
    const userText = inputValue
    setInputValue('')
    setMentionQuery(null)
    sendMessage(activeCourseId, activeSubChannel, userText, 'student', selfName)
    const isAiChannel = activeSubChannel === 'ai-group-tutor'
    const isAiSummoned =
      activeSubChannel === 'diskusi' &&
      (userText.toLowerCase().includes('@ai-tutor') || userText.toLowerCase().includes('@ai'))
    if (isAiChannel || isAiSummoned) {
      triggerGeminiAI(userText, currentMessages)
    }
  }

  const handleAttachModule = (lessonName: string) => {
    setIsAttachOpen(false)
    const text =
      currentLang === 'id'
        ? `Saya merekomendasikan untuk membaca sub-bab ini: **${lessonName}**`
        : `I recommend reading this sub-lesson: **${lessonName}**`
    sendMessage(activeCourseId, activeSubChannel, text, 'student', selfName, activeCourseId)
    toast.success(currentLang === 'id' ? 'Modul berhasil dilampirkan!' : 'Module attached successfully!')
  }

  const currentCourseModule = activeModules.find((m) => m.code === activeCourseId)

  const getAvatarStyle = (role: string) => {
    if (role === 'lecturer') return 'bg-[#003057] text-white'
    if (role === 'ai') return 'bg-gradient-to-br from-primary to-secondary text-white'

    return 'bg-slate-200 text-slate-600 dark:bg-neutral-700 dark:text-neutral-200'
  }

  const getSelfAvatarStyle = () => 'bg-primary text-white'

  const getChannelIcon = (channel: string) => {
    if (channel === 'pengumuman') return '📢'
    if (channel === 'diskusi') return '💬'

    return '🤖'
  }

  return (
    <div className="flex h-[calc(100vh-176px)] overflow-hidden md:h-[calc(100vh-110px)]">
      {/* ─── SIDEBAR ─── */}
      <aside
        className={cn(
          'flex w-full shrink-0 flex-col border-r border-slate-200 bg-white md:flex md:w-[240px] dark:border-neutral-800 dark:bg-[#161616]',
          mobileView === 'list' ? 'flex' : 'hidden md:flex'
        )}
      >
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-200 px-4 dark:border-neutral-800">
          <ChatsIcon size={17} className="text-primary dark:text-secondary" weight="duotone" />
          <span className="text-[11px] font-black tracking-widest text-slate-700 uppercase dark:text-neutral-200">
            {currentLang === 'id' ? 'Obrolan Kelas' : 'Class Chat'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-3" style={{ scrollbarWidth: 'none' }}>
          {activeModules.map((course) => {
            const isCourseActive = activeCourseId === course.code
            const shortTitle = course.title.split(':')[0]

            return (
              <div key={course.code} className="mb-1">
                <button
                  onClick={() => setActiveCourseId(course.code)}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors',
                    isCourseActive
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 shrink-0 rounded-full transition-colors',
                      isCourseActive ? 'bg-primary dark:bg-secondary' : 'bg-slate-300 dark:bg-neutral-700'
                    )}
                  />
                  <span className="min-w-0">
                    <span className="block text-[9px] font-bold tracking-widest uppercase opacity-50">{course.code}</span>
                    <span className="block truncate text-[11px] leading-tight font-semibold">{shortTitle}</span>
                  </span>
                </button>

                {isCourseActive && (
                  <div className="mt-0.5 mb-2">
                    {(['pengumuman', 'diskusi', 'ai-group-tutor'] as const).map((ch) => (
                      <button
                        key={ch}
                        onClick={() => {
                          setActiveSubChannel(ch)
                          setMobileView('chat')
                        }}
                        className={cn(
                          'flex w-full items-center gap-2 px-4 py-1.5 text-left text-[12px] transition-colors',
                          activeSubChannel === ch
                            ? 'bg-slate-100 font-semibold text-slate-900 dark:bg-neutral-800 dark:text-white'
                            : 'font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:text-neutral-500 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-300'
                        )}
                      >
                        {ch === 'pengumuman' && (
                          <MegaphoneIcon
                            size={13}
                            weight={activeSubChannel === ch ? 'fill' : 'regular'}
                            className="shrink-0"
                          />
                        )}
                        {ch === 'diskusi' && (
                          <ChatCircleDotsIcon
                            size={13}
                            weight={activeSubChannel === ch ? 'fill' : 'regular'}
                            className="shrink-0"
                          />
                        )}
                        {ch === 'ai-group-tutor' && (
                          <RobotIcon
                            size={13}
                            weight={activeSubChannel === ch ? 'fill' : 'regular'}
                            className={cn('shrink-0', activeSubChannel === ch ? 'text-primary dark:text-secondary' : '')}
                          />
                        )}
                        <span className="flex items-center gap-1.5 truncate">
                          # {ch}
                          {ch === 'ai-group-tutor' && (
                            <span className="rounded bg-primary/10 px-1 py-px text-[8px] font-black text-primary uppercase dark:bg-secondary/15 dark:text-secondary">
                              AI
                            </span>
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* User info */}
        <div className="shrink-0 border-t border-slate-200 px-3 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-[10px] font-black text-white">
              {selfName.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] leading-tight font-bold text-slate-800 dark:text-white">{selfName}</p>
              <div className="mt-0.5 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-[9px] font-medium text-slate-400 dark:text-neutral-500">Online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CHAT AREA ─── */}
      <div
        className={cn(
          'flex h-full min-w-0 flex-1 flex-col bg-white dark:bg-[#1a1a1a]',
          mobileView === 'chat' ? 'flex' : 'hidden md:flex'
        )}
      >
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-neutral-800">
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={() => setMobileView('list')}
              className="mr-0.5 shrink-0 rounded-lg p-1 text-slate-500 hover:bg-slate-100 md:hidden dark:hover:bg-neutral-800"
            >
              <CaretLeftIcon size={16} weight="bold" />
            </button>

            {activeSubChannel === 'pengumuman' && (
              <MegaphoneIcon size={16} weight="fill" className="shrink-0 text-slate-400 dark:text-neutral-500" />
            )}
            {activeSubChannel === 'diskusi' && (
              <ChatCircleDotsIcon size={16} weight="fill" className="shrink-0 text-slate-400 dark:text-neutral-500" />
            )}
            {activeSubChannel === 'ai-group-tutor' && (
              <RobotIcon size={16} weight="fill" className="shrink-0 text-primary dark:text-secondary" />
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-bold text-slate-800 dark:text-white"># {activeSubChannel}</span>
                <span className="hidden shrink-0 text-[10px] font-medium text-slate-400 sm:block dark:text-neutral-500">
                  · {activeCourseId}
                </span>
              </div>
              <p className="hidden truncate text-[10px] leading-none text-slate-400 sm:block dark:text-neutral-500">
                {activeSubChannel === 'pengumuman' &&
                  (currentLang === 'id'
                    ? 'Pengumuman resmi dari Dosen Pengampu'
                    : 'Official announcements from the lecturer')}
                {activeSubChannel === 'diskusi' &&
                  (currentLang === 'id'
                    ? 'Diskusi dan tanya jawab bersama teman sekelas'
                    : 'Q&A and discussions with classmates')}
                {activeSubChannel === 'ai-group-tutor' &&
                  (currentLang === 'id'
                    ? 'Tanya AI Tutor pendamping belajar mandiri Anda'
                    : 'Ask your AI learning assistant')}
              </p>
            </div>
          </div>

          {/* Pinned */}
          <div className="relative shrink-0" ref={pinnedRef}>
            <button
              onClick={() => setIsPinnedOpen(!isPinnedOpen)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              <PushPinIcon size={14} weight="fill" className="text-slate-400 dark:text-neutral-500" />
              <span className="hidden sm:inline">{currentLang === 'id' ? 'Sematkan' : 'Pinned'}</span>
              <CaretDownIcon size={10} weight="bold" className="opacity-50" />
            </button>

            {isPinnedOpen && (
              <div className="absolute top-10 right-0 z-30 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-neutral-800 dark:bg-[#1e1e1e]">
                <h5 className="mb-2 px-2 text-[9px] font-bold tracking-widest text-slate-400 uppercase dark:text-neutral-500">
                  {currentLang === 'id' ? 'Sumber Daya Kelas' : 'Class Resources'}
                </h5>
                <div className="space-y-1">
                  <a
                    href={activeCourseChat.pinnedZoomLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 rounded-lg p-2 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-neutral-800"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-500/10 text-[8px] font-black text-blue-500">
                      ZOOM
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800 dark:text-white">Link Kelas Live</p>
                      <p className="truncate text-[9px] text-slate-400">Zoom Meeting Kelas</p>
                    </div>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      toast.info(currentLang === 'id' ? 'Silabus berhasil diunduh!' : 'Syllabus downloaded!')
                    }}
                    className="flex items-center gap-2.5 rounded-lg p-2 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-neutral-800"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-red-500/10 text-[8px] font-black text-red-500">
                      PDF
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800 dark:text-white">Silabus Matakuliah</p>
                      <p className="truncate text-[9px] text-slate-400">Syllabus-Genap-v1.pdf</p>
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message Feed */}
        <div
          ref={feedRef}
          data-lenis-prevent
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.08) transparent' }}
        >
          {/* Channel intro */}
          <div className="px-6 py-8 pb-4">
            <div
              className={cn(
                'mb-2 flex h-10 w-10 items-center justify-center rounded-xl text-lg',
                activeSubChannel === 'ai-group-tutor'
                  ? 'bg-gradient-to-br from-primary to-secondary text-white'
                  : 'bg-slate-100 dark:bg-neutral-800'
              )}
            >
              {getChannelIcon(activeSubChannel)}
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white"># {activeSubChannel}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
              {activeSubChannel === 'pengumuman' &&
                (currentLang === 'id'
                  ? 'Saluran ini digunakan oleh Dosen untuk menyampaikan pengumuman resmi.'
                  : 'This channel is used by the Lecturer for official announcements.')}
              {activeSubChannel === 'diskusi' &&
                (currentLang === 'id'
                  ? 'Ruang diskusi bebas untuk tanya jawab dan berbagi wawasan bersama teman sekelas.'
                  : 'An open discussion space for Q&A and sharing ideas with classmates.')}
              {activeSubChannel === 'ai-group-tutor' &&
                (currentLang === 'id'
                  ? 'Tanyakan apa saja kepada AI Tutor tentang materi pelajaran ini. AI siap membantu 24/7!'
                  : 'Ask the AI Tutor anything about this subject. Available 24/7!')}
            </p>
            <div className="mt-4 border-t border-slate-200 dark:border-neutral-800" />
          </div>

          {/* Messages */}
          <div className="pb-2">
            {currentMessages.map((msg, index) => {
              const isLecturer = msg.senderRole === 'lecturer'
              const isAi = msg.senderRole === 'ai'
              const isSelf = msg.senderRole === 'student' && msg.senderName === selfName

              const prevMsg = index > 0 ? currentMessages[index - 1] : null
              const isGrouped = prevMsg && prevMsg.senderName === msg.senderName && prevMsg.senderRole === msg.senderRole

              return (
                <div
                  key={msg.id}
                  className={cn(
                    'group relative px-4 py-0.5 transition-colors',
                    // Own message: subtle blue-tinted row with left accent border
                    isSelf
                      ? 'border-l-2 border-primary/30 bg-primary/[0.03] hover:bg-primary/[0.06] dark:border-secondary/30 dark:bg-secondary/[0.04] dark:hover:bg-secondary/[0.07]'
                      : 'hover:bg-slate-50 dark:hover:bg-neutral-800/30'
                  )}
                >
                  {!isGrouped ? (
                    <div className="flex items-start gap-3 pt-3">
                      {/* Avatar */}
                      <div
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-black',
                          isSelf ? getSelfAvatarStyle() : getAvatarStyle(msg.senderRole)
                        )}
                      >
                        {isAi ? <RobotIcon size={16} weight="fill" /> : msg.senderName.substring(0, 2).toUpperCase()}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        {/* Name row */}
                        <div className="mb-1 flex flex-wrap items-baseline gap-1.5">
                          <span
                            className={cn(
                              'text-[13px] leading-none font-black',
                              isLecturer ? 'text-[#003057] dark:text-blue-300' : '',
                              isAi ? 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent' : '',
                              isSelf ? 'text-primary dark:text-secondary' : '',
                              !isLecturer && !isAi && !isSelf ? 'text-slate-900 dark:text-white' : ''
                            )}
                          >
                            {msg.senderName}
                          </span>

                          {isLecturer && (
                            <span className="rounded bg-[#003057]/10 px-1.5 py-px text-[8px] font-black tracking-wider text-[#003057] uppercase dark:bg-blue-300/15 dark:text-blue-300">
                              Dosen
                            </span>
                          )}
                          {isAi && (
                            <span className="flex items-center gap-0.5 rounded bg-primary/10 px-1.5 py-px text-[8px] font-black tracking-wider text-primary uppercase dark:bg-secondary/15 dark:text-secondary">
                              <SparkleIcon size={8} weight="fill" />
                              AI
                            </span>
                          )}
                          {isSelf && (
                            <span className="rounded bg-primary/10 px-1.5 py-px text-[8px] font-bold text-primary dark:bg-secondary/15 dark:text-secondary">
                              Anda
                            </span>
                          )}
                          <span className="text-[10px] leading-none text-slate-400 dark:text-neutral-500">
                            {msg.timestamp}
                          </span>
                        </div>

                        {/* Message text */}
                        <p className="text-[13px] leading-relaxed whitespace-pre-line text-slate-800 dark:text-neutral-200">
                          <RenderContent text={msg.content} selfName={selfName} />
                        </p>

                        {/* Attached module */}
                        {msg.attachedModuleCode && (
                          <div className="mt-2 inline-flex max-w-sm items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-neutral-700 dark:bg-neutral-800/50">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary">
                              <BookOpenIcon size={18} weight="bold" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[9px] font-black tracking-wider text-primary uppercase dark:text-secondary">
                                {msg.attachedModuleCode}
                              </p>
                              <p className="mt-0.5 truncate text-[12px] font-bold text-slate-800 dark:text-white">
                                {activeModules.find((m) => m.code === msg.attachedModuleCode)?.title.split(':')[0] ||
                                  'Modul Pembelajaran'}
                              </p>
                              <p className="mt-0.5 text-[10px] text-slate-400 dark:text-neutral-500">
                                {activeModules.find((m) => m.code === msg.attachedModuleCode)?.lessons?.length || 0} Sub-bab
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                toast.success(currentLang === 'id' ? 'Membuka modul kelas...' : 'Opening class module...')
                              }
                              className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-[10px] font-black text-white transition-all hover:bg-primary/90"
                            >
                              {currentLang === 'id' ? 'Buka' : 'Open'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Grouped message — no avatar, indent-aligned */
                    <div className="flex items-start gap-3">
                      <div className="w-9 shrink-0" />
                      <p className="flex-1 text-[13px] leading-relaxed whitespace-pre-line text-slate-800 dark:text-neutral-200">
                        <RenderContent text={msg.content} selfName={selfName} />
                      </p>
                    </div>
                  )}
                </div>
              )
            })}

            {/* AI typing indicator */}
            {isAiStreaming && (
              <div className="group relative px-4 py-0.5">
                <div className="flex items-start gap-3 pt-3">
                  <div className="flex h-9 w-9 shrink-0 animate-pulse items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                    <RobotIcon size={16} weight="fill" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-[13px] font-black text-primary dark:text-secondary">AI Tutor</span>
                      <span className="rounded bg-primary/10 px-1.5 py-px text-[8px] font-black text-primary dark:bg-secondary/15 dark:text-secondary">
                        sedang mengetik...
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-slate-300 dark:bg-neutral-600"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-slate-300 dark:bg-neutral-600"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-slate-300 dark:bg-neutral-600"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ─── INPUT BAR ─── */}
        <div className="shrink-0 border-t border-slate-200 px-4 py-3 dark:border-neutral-800">
          {activeSubChannel === 'pengumuman' ? (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-slate-50 py-3 text-[12px] font-medium text-slate-500 dark:bg-neutral-800/60 dark:text-neutral-400">
              <span className="text-base">🔒</span>
              <span>
                {currentLang === 'id'
                  ? 'Hanya Pengajar yang dapat mengirim pesan di saluran ini'
                  : 'Only Instructors can post messages in this channel'}
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              {/* AI tag helper */}
              {activeSubChannel === 'diskusi' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!inputValue.includes('@AI-Tutor')) {
                        setInputValue((prev) => `@AI-Tutor ${prev}`)
                      }
                      inputRef.current?.focus()
                    }}
                    className="flex items-center gap-1 rounded-md border border-primary/15 bg-primary/5 px-2 py-1 text-[10px] font-bold text-primary transition-colors hover:bg-primary/10 dark:border-secondary/20 dark:bg-secondary/10 dark:text-secondary"
                  >
                    <SparkleIcon size={11} weight="fill" />
                    Tanya @AI-Tutor
                  </button>
                  <p className="text-[10px] text-slate-400 dark:text-neutral-500">
                    {currentLang === 'id'
                      ? 'Tag @AI-Tutor untuk memanggil asisten AI di dalam diskusi'
                      : 'Tag @AI-Tutor to summon the AI assistant in this discussion'}
                  </p>
                </div>
              )}

              {/* Input row (relative for @mention popover) */}
              <div className="relative">
                {/* @mention autocomplete popover */}
                {mentionQuery !== null && filteredMentions.length > 0 && (
                  <div className="absolute bottom-full left-0 z-40 mb-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-[#1e1e1e]">
                    <div className="px-3 py-1.5 text-[9px] font-bold tracking-widest text-slate-400 uppercase dark:text-neutral-500">
                      Anggota · ketik untuk memfilter
                    </div>
                    {filteredMentions.map((name, i) => (
                      <button
                        key={name}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          insertMention(name)
                        }}
                        className={cn(
                          'flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12px] font-semibold transition-colors',
                          i === mentionIndex
                            ? 'bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary'
                            : 'text-slate-700 hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800'
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[9px] font-black',
                            name === 'AI Tutor'
                              ? 'bg-gradient-to-br from-primary to-secondary text-white'
                              : 'bg-slate-200 text-slate-600 dark:bg-neutral-700 dark:text-neutral-200'
                          )}
                        >
                          {name === 'AI Tutor' ? <RobotIcon size={12} weight="fill" /> : name.substring(0, 2).toUpperCase()}
                        </span>
                        <span className="truncate">{name}</span>
                        {name === 'AI Tutor' && (
                          <span className="ml-auto rounded bg-primary/10 px-1 py-px text-[7px] font-black text-primary dark:text-secondary">
                            AI
                          </span>
                        )}
                      </button>
                    ))}
                    <div className="flex items-center gap-3 border-t border-slate-100 px-3 py-1.5 dark:border-neutral-800">
                      <span className="text-[9px] text-slate-400 dark:text-neutral-500">
                        ↑↓ navigasi · Tab pilih · Esc tutup
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition-colors focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 dark:border-neutral-700 dark:bg-neutral-800/60 dark:focus-within:border-secondary dark:focus-within:bg-neutral-800">
                  {/* Attach module */}
                  <div className="relative shrink-0" ref={attachRef}>
                    <button
                      onClick={() => setIsAttachOpen(!isAttachOpen)}
                      disabled={isAiStreaming}
                      title={currentLang === 'id' ? 'Lampirkan Modul' : 'Attach Module'}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
                    >
                      <PlusIcon size={16} weight="bold" />
                    </button>

                    {isAttachOpen && currentCourseModule?.lessons && (
                      <div className="absolute bottom-10 left-0 z-30 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-neutral-700 dark:bg-[#1e1e1e]">
                        <h5 className="mb-1.5 flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-bold tracking-widest text-slate-400 uppercase dark:text-neutral-500">
                          <BookOpenIcon size={11} weight="fill" />
                          {currentLang === 'id' ? 'Lampirkan Modul Belajar' : 'Attach Learning Module'}
                        </h5>
                        <div className="max-h-48 space-y-0.5 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                          {currentCourseModule.lessons.map((lesson) => (
                            <button
                              key={lesson}
                              onClick={() => handleAttachModule(lesson)}
                              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
                            >
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary dark:bg-secondary" />
                              <span className="truncate">{lesson}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* @ mention button */}
                  <button
                    onClick={() => {
                      if (!inputValue.endsWith('@')) {
                        const newVal = inputValue + '@'
                        setInputValue(newVal)
                        setMentionQuery('')
                        setMentionStart(newVal.length - 1)
                      }
                      inputRef.current?.focus()
                    }}
                    title="Mention seseorang"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
                  >
                    <AtIcon size={15} weight="bold" />
                  </button>

                  {/* Text input */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={isAiStreaming}
                    placeholder={
                      activeSubChannel === 'ai-group-tutor'
                        ? currentLang === 'id'
                          ? 'Tanya AI Tutor tentang pelajaran ini...'
                          : 'Ask AI Tutor about this class...'
                        : currentLang === 'id'
                          ? `Kirim pesan ke #${activeSubChannel}`
                          : `Message #${activeSubChannel}`
                    }
                    className="flex-1 border-none bg-transparent text-[13px] text-slate-800 placeholder-slate-400 outline-none dark:text-white dark:placeholder-neutral-500"
                  />

                  {/* Send button */}
                  <button
                    onClick={handleSend}
                    disabled={isAiStreaming || !inputValue.trim()}
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all',
                      inputValue.trim() && !isAiStreaming
                        ? 'bg-primary text-white shadow-sm shadow-primary/20 hover:bg-primary/90'
                        : 'cursor-not-allowed text-slate-300 dark:text-neutral-600'
                    )}
                  >
                    <PaperPlaneRightIcon size={14} weight="fill" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
