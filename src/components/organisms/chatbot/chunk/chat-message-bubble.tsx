'use client'

import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

import { Loader } from '@/components/atoms/ui/loader'
import { MarkdownComponents } from '@/components/atoms/ui/markdown'

import { cn } from '@/utils/cn'

import type { MessagePart, RecommendServiceOutput } from './types'

export interface ChatMessageBubbleProps {
  role: 'user' | 'assistant'
  parts?: MessagePart[]
}

const PROGRAM_NAMES: Record<string, string> = {
  'produk-project': 'Product & Project Build',
  kompetisi: 'Competition & Hackathon',
  edukasi: 'Edukasi & Workshop',
  kolaborasi: 'Kolaborasi Multidisiplin'
}

const ProgramRecommendationCard = ({
  services,
  reasoning
}: {
  services: Array<{ serviceId: string; planName?: string }>
  reasoning: string
}) => {
  return (
    <div className="border-slate-150 mt-4 max-w-sm rounded-xl border bg-slate-50/90 p-4 text-left shadow-sm sm:max-w-md">
      <span className="mb-2 block text-[10px] font-bold tracking-wider text-accent-blue uppercase">
        Rekomendasi Divisi & Program
      </span>
      <div className="flex flex-col gap-2">
        {services.map((svc, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-xs"
          >
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-bold text-slate-800">
                {PROGRAM_NAMES[svc.serviceId] || svc.serviceId}
              </span>
              {svc.planName && <span className="mt-0.5 truncate text-[10px] text-slate-500">Fokus: {svc.planName}</span>}
            </div>
            <a
              href="/pendaftaran"
              className="inline-flex h-7 shrink-0 items-center justify-center rounded-full bg-primary px-3 text-[10px] font-bold text-white transition-all hover:bg-primary/95 active:scale-95"
            >
              Gabung
            </a>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-lg border border-slate-100 bg-white/60 p-2.5 text-[11px] leading-relaxed text-slate-600">
        💡 {reasoning}
      </p>
    </div>
  )
}

function isRecommendServiceOutput(output: unknown): output is RecommendServiceOutput {
  return (
    typeof output === 'object' &&
    output !== null &&
    'services' in output &&
    'reasoning' in output &&
    Array.isArray((output as RecommendServiceOutput).services) &&
    typeof (output as RecommendServiceOutput).reasoning === 'string'
  )
}

export const ChatMessageBubble = ({ role, parts }: ChatMessageBubbleProps) => {
  const hasRecommendation = parts?.some(
    (part) => part.type === 'tool-recommendServices' && part.state === 'output-available'
  )

  return (
    <div className={cn('flex max-w-[85%] flex-col gap-1', role === 'user' ? 'items-end' : 'items-start')}>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className={cn(
          'group relative overflow-hidden rounded-lg px-4 py-3 shadow-sm transition-all duration-300 hover:shadow md:px-5 md:py-3.5',
          role === 'user'
            ? 'rounded-tr-sm bg-primary text-white'
            : 'rounded-tl-sm border border-slate-100 bg-white/90 backdrop-blur-sm',
          hasRecommendation && 'pb-6'
        )}
      >
        <div className="space-y-3">
          {parts?.map((part, partIdx: number) => {
            if (part.type === 'text') {
              return (
                <div
                  key={partIdx}
                  className={cn(
                    'prose prose-sm max-w-none max-sm:text-sm md:prose-base',
                    role === 'user'
                      ? 'text-white *:text-white [&_li]:text-white [&_p]:text-white [&_strong]:text-white'
                      : 'prose-slate prose-p:text-slate-700 prose-strong:text-slate-900'
                  )}
                >
                  {part.text ? (
                    <ReactMarkdown components={MarkdownComponents}>{part.text}</ReactMarkdown>
                  ) : (
                    <Loader className="size-4 text-slate-400" />
                  )}
                </div>
              )
            }

            if (part.type === 'tool-recommendServices') {
              if (part.state === 'output-available' && isRecommendServiceOutput(part.output)) {
                return (
                  <ProgramRecommendationCard
                    key={partIdx}
                    services={part.output.services}
                    reasoning={part.output.reasoning}
                  />
                )
              }

              return (
                <div key={partIdx} className="flex items-center gap-1.5 py-1 text-xs text-slate-500 italic">
                  <Loader className="size-3.5 text-slate-400" />
                  Menganalisis kecocokan program...
                </div>
              )
            }

            return null
          })}
        </div>
      </motion.div>

      <span className="mt-1 px-2 text-xs text-gray-400">{role === 'user' ? 'Anda' : 'One Academy AI'}</span>
    </div>
  )
}
