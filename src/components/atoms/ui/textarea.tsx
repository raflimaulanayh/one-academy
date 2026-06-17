import * as React from 'react'

import { cn } from '@/utils/cn'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, value, ...props }, ref) => {
  const normalizedValue = value === null ? '' : value

  return (
    <textarea
      className={cn(
        'flex min-h-[150px] w-full rounded-lg border border-gray-300 bg-background p-3 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:border-gray-900 focus:ring-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100',
        className
      )}
      ref={ref}
      value={normalizedValue}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
