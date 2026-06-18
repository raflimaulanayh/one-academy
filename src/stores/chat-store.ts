import { create } from 'zustand'

let msgCounter = 0
const genId = () => `msg-${Date.now()}-${++msgCounter}-${Math.random().toString(36).slice(2, 6)}`

export interface Message {
  id: string
  senderName: string
  senderRole: 'lecturer' | 'student' | 'ai'
  content: string
  timestamp: string
  attachedModuleCode?: string
}

export type SubChannel = 'pengumuman' | 'diskusi' | 'ai-group-tutor'

export interface CourseChat {
  courseId: string
  courseTitle: string
  subChannels: Record<SubChannel, Message[]>
  pinnedZoomLink?: string
  pinnedSyllabusUrl?: string
}

interface ChatState {
  activeCourseId: string | null
  activeSubChannel: SubChannel
  chats: Record<string, CourseChat>
  setActiveCourseId: (courseId: string) => void
  setActiveSubChannel: (subChannel: SubChannel) => void
  sendMessage: (
    courseId: string,
    subChannel: SubChannel,
    content: string,
    senderRole: 'lecturer' | 'student' | 'ai',
    senderName: string,
    attachedModuleCode?: string
  ) => void
  initializeChats: (courses: Array<{ code: string; title: string }>) => void
}

const getMockMessages = (courseCode: string, subChannel: SubChannel): Message[] => {
  const isUniv = courseCode.startsWith('CHAR') || courseCode.startsWith('ISYS')
  const isSma = courseCode.startsWith('SMA')
  const isSmp = courseCode.startsWith('SMP')

  if (subChannel === 'pengumuman') {
    if (isUniv) {
      if (courseCode === 'CHAR6002003') {
        return [
          {
            id: 'p-1',
            senderName: 'Prof. Dr. Ir. H. Suparman',
            senderRole: 'lecturer',
            content:
              'Selamat pagi mahasiswa sekalian, silakan unduh silabus perkuliahan pada panel Pinned Resources di atas. Jangan lupa untuk melakukan presensi mandiri sebelum kelas dimulai pukul 08:00 WIB.',
            timestamp: 'Senin, 07:45'
          }
        ]
      }

      return [
        {
          id: 'p-2',
          senderName: 'Dr. Diana Kusuma',
          senderRole: 'lecturer',
          content:
            'Pengumuman: Tugas 1 mengenai implementasi dasar telah dipublikasikan di halaman Tugas. Batas akhir pengumpulan adalah Senin depan pukul 23:59 WIB. Pastikan kode Anda valid dan responsif.',
          timestamp: 'Kemarin, 09:30'
        }
      ]
    } else if (isSma) {
      return [
        {
          id: 'p-3',
          senderName: 'Bu Endang Wahyuni, M.Pd.',
          senderRole: 'lecturer',
          content:
            'Anak-anak kelas SMA, materi persiapan ujian semester sudah Ibu upload di modul LMS. Silakan dibaca dan dikerjakan latihan kuisnya di rumah ya.',
          timestamp: 'Senin, 14:00'
        }
      ]
    } else if (isSmp) {
      return [
        {
          id: 'p-4',
          senderName: 'Pak Joko Susilo, S.Pd.',
          senderRole: 'lecturer',
          content:
            'Selamat belajar semuanya. Hari ini kita akan membahas latihan aljabar dasar. Silakan buka file rangkuman materi di dashboard kalian.',
          timestamp: 'Selasa, 08:15'
        }
      ]
    } else {
      return [
        {
          id: 'p-5',
          senderName: 'Ibu Ratna Pertiwi',
          senderRole: 'lecturer',
          content: 'Selamat pagi adik-adik! Jangan lupa tonton video materi berhitung ceria hari ini ya. Semangat!',
          timestamp: 'Senin, 08:00'
        }
      ]
    }
  }

  if (subChannel === 'diskusi') {
    if (isUniv) {
      if (courseCode === 'CHAR6002003') {
        return [
          {
            id: 'd-1',
            senderName: 'Budi Saputra',
            senderRole: 'student',
            content:
              'Halo semuanya, untuk kelompok 3 apakah ada yang mau didiskusikan terkait materi Identitas Nasional nanti sore?',
            timestamp: '13:10'
          },
          {
            id: 'd-2',
            senderName: 'Siti Rahmawati',
            senderRole: 'student',
            content:
              'Iya Bud, kita bahas di perpus kampus jam 4 sore ya setelah kelas kelar. Sekalian bawa laptop masing-masing.',
            timestamp: '13:12'
          },
          {
            id: 'd-3',
            senderName: 'Rian Hidayat',
            senderRole: 'student',
            content:
              'Siap! Saya nanti langsung merapat ke perpus. Oiya, boleh tolong mention @AI-Tutor ga ya di sini untuk cari rangkuman singkat hak warga negara biar kita ada bahan awal?',
            timestamp: '13:15'
          }
        ]
      }

      return [
        {
          id: 'd-4',
          senderName: 'Roni Wijaya',
          senderRole: 'student',
          content:
            'Teman-teman, ada yang punya referensi belajar CSS Flexbox vs Grid yang seru? Agak bingung kapan harus pakai Flexbox di proyek.',
          timestamp: '10:30'
        },
        {
          id: 'd-5',
          senderName: 'Siti Rahmawati',
          senderRole: 'student',
          content:
            'Coba baca dokumentasi MDN deh Ron, atau coba tanya ke @AI-Tutor langsung di sini, penjelasannya biasanya ringkas dan langsung dikasih contoh kode CSS.',
          timestamp: '10:32'
        }
      ]
    } else {
      return [
        {
          id: 'd-6',
          senderName: 'Andi Pratama',
          senderRole: 'student',
          content: 'Teman-teman, nomor 4 di kuis mingguan itu rumusnya pakai yang mana ya?',
          timestamp: '09:15'
        },
        {
          id: 'd-7',
          senderName: 'Lina Marlina',
          senderRole: 'student',
          content:
            'Pakai rumus dasar yang dijelaskan kemarin sore Andi, coba tanyakan ke @AI-Tutor di sini saja biar dapet penjelasan rumusnya.',
          timestamp: '09:18'
        }
      ]
    }
  }

  // ai-group-tutor
  return [
    {
      id: 'ai-welcome',
      senderName: 'AI Tutor',
      senderRole: 'ai',
      content: `Halo! Saya **AI Group Tutor** untuk kelas Anda. \n\nDi sini saya siap mendampingi belajar kelompok kalian 24/7. Ketik pertanyaan akademik apa saja tentang materi kuliah atau latihan soal, dan saya akan menjawab secara lengkap!`,
      timestamp: 'Kemarin'
    }
  ]
}

export const useChatStore = create<ChatState>((set) => ({
  activeCourseId: null,
  activeSubChannel: 'diskusi',
  chats: {},

  setActiveCourseId: (courseId) => set({ activeCourseId: courseId }),
  setActiveSubChannel: (subChannel) => set({ activeSubChannel: subChannel }),

  sendMessage: (courseId, subChannel, content, senderRole, senderName, attachedModuleCode) => {
    const time = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })

    set((state) => {
      const courseChat = state.chats[courseId]
      if (!courseChat) return state

      const newMessage: Message = {
        id: genId(),
        senderName,
        senderRole,
        content,
        timestamp: time,
        attachedModuleCode
      }

      const updatedSubChannels = {
        ...courseChat.subChannels,
        [subChannel]: [...courseChat.subChannels[subChannel], newMessage]
      }

      return {
        chats: {
          ...state.chats,
          [courseId]: {
            ...courseChat,
            subChannels: updatedSubChannels
          }
        }
      }
    })
  },

  initializeChats: (courses) => {
    set((state) => {
      const updatedChats = { ...state.chats }

      courses.forEach((course) => {
        if (!updatedChats[course.code]) {
          updatedChats[course.code] = {
            courseId: course.code,
            courseTitle: course.title,
            pinnedZoomLink: 'https://zoom.us/j/9876543210?pwd=OneAcademyLive',
            pinnedSyllabusUrl: '#',
            subChannels: {
              pengumuman: getMockMessages(course.code, 'pengumuman'),
              diskusi: getMockMessages(course.code, 'diskusi'),
              'ai-group-tutor': getMockMessages(course.code, 'ai-group-tutor')
            }
          }
        }
      })

      const newActiveCourseId = state.activeCourseId || (courses[0]?.code ?? null)

      return {
        chats: updatedChats,
        activeCourseId: newActiveCourseId
      }
    })
  }
}))
