import { SYSTEM_PROMPT, SYSTEM_PROMPT_EN } from '@/constants/chatbot-data'
import { google } from '@ai-sdk/google'
import { convertToCoreMessages, streamText } from 'ai'
import { z } from 'zod'

export const maxDuration = 30

const SERVICE_IDS = ['produk-project', 'kompetisi', 'edukasi', 'kolaborasi'] as const

type ServiceId = (typeof SERVICE_IDS)[number]

export async function POST(req: Request) {
  try {
    const { messages, lang } = await req.json()
    const isEn = lang === 'en'

    const systemPrompt = isEn ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT
    const serviceIdDesc = isEn
      ? 'Program slug: produk-project | kompetisi | edukasi | kolaborasi'
      : 'Slug program: produk-project | kompetisi | edukasi | kolaborasi'
    const planNameDesc = isEn
      ? 'Specific division/activity name, e.g., "Informatics & IS (Engineering)", "Hackathon Mentorship", etc.'
      : 'Nama divisi/kegiatan spesifik, misal "Informatika & SI (Engineering)", "Mentorship Hackathon", dll.'
    const servicesDesc = isEn
      ? "1-2 programs that are most relevant to the user's needs"
      : '1-2 program yang paling relevan dengan kebutuhan user'
    const reasoningDesc = isEn
      ? '1 sentence explanation in English why this program/division is suitable for the user'
      : '1 kalimat penjelasan dalam Bahasa Indonesia mengapa program/divisi ini cocok untuk user'
    const toolDesc = isEn
      ? 'Show recommendations for One Academy modules or levels as visual cards. Call this tool IMMEDIATELY when the user asks about courses, syllabus, modular learning paths, registration, SD, SMP, SMA, or university programs.'
      : 'Tampilkan rekomendasi modul belajar atau jenjang pendidikan One Academy sebagai visual card. Panggil tool ini SEGERA ketika user menanyakan kelas, kursus, modul pembelajaran, pendaftaran, SD, SMP, SMA, atau universitas.'

    const coreMessages = convertToCoreMessages(messages)

    const result = streamText({
      model: google(process.env.AI_MODEL || 'gemini-2.5-flash'),
      system: systemPrompt,
      messages: coreMessages,
      toolChoice: 'auto',
      tools: {
        recommendServices: {
          description: toolDesc,
          inputSchema: z.object({
            services: z
              .array(
                z.object({
                  serviceId: z.enum(SERVICE_IDS as unknown as [string, ...string[]]).describe(serviceIdDesc),
                  planName: z.string().optional().describe(planNameDesc)
                })
              )
              .min(1)
              .max(2)
              .describe(servicesDesc),
            reasoning: z.string().describe(reasoningDesc)
          }),
          execute: async ({
            services,
            reasoning
          }: {
            services: Array<{ serviceId: ServiceId; planName?: string }>
            reasoning: string
          }) => ({ services, reasoning })
        }
      }
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Chat API Error:', error instanceof Error ? error.message : String(error))

    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
