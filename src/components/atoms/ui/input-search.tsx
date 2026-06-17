import React from 'react'
import { MdSearch } from 'react-icons/md'

import { Input } from '@/components/atoms/ui/input'

import { cn } from '@/utils'

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> & {
  type?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, rawValue: string) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

const InputSearch = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value = '', onChange, className, placeholder }, _ref) => {
    const [focus, setFocus] = React.useState(false)

    return (
      <div
        className={cn(
          'relative flex h-10! w-full items-center rounded-full border bg-white text-sm transition-all sm:max-w-sm',
          focus ? 'border-gray-600!' : 'border-gray-200!',
          className
        )}
      >
        <MdSearch size={24} className={cn('ml-3 transition-all', focus ? 'text-gray-500' : 'text-gray-400')} />
        <Input
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-10! border-none bg-transparent! px-2! text-gray-900 placeholder:text-gray-400"
        />
      </div>
    )
  }
)

InputSearch.displayName = 'InputSearch'

export { InputSearch }
