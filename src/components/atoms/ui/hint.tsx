import { cn } from '@/utils/cn'

interface Props {
  text: string | React.ReactNode
  className?: string
}

export const Hint = ({ text, className }: Props) => {
  if (typeof text === 'string') {
    return <p className={cn('text-xs leading-tight text-gray-600', className)} dangerouslySetInnerHTML={{ __html: text }} />
  }

  return <p className={cn('text-xs leading-tight text-gray-600', className)}>{text}</p>
}
