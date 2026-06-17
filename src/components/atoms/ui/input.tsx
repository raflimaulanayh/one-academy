import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import * as React from 'react'

import { cn } from '@/utils/cn'

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> & {
  type?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, rawValue: string) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

const handleFormatValue = (value: string | number, type?: string) => {
  if (type === 'nominal') {
    return String(value || '')
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  } else if (type === 'percentage') {
    const formatted = String(value || '')
      .replace(',', '.')
      .replace(/[^0-9.]/g, '')
    const floatVal = parseFloat(formatted)
    if (floatVal >= 1 && floatVal <= 100) {
      return formatted
    } else {
      return ''
    }
  } else if (type === 'youtube') {
    return String(value || '').replace('https://', '')
  } else if (type === 'number') {
    return String(value || '').replace(/\D/g, '')
  } else {
    return String(value || '')
  }
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type = 'text', value = '', onChange, className, placeholder, disabled, ...props }, ref) => {
    const [isShow, setIsShow] = React.useState(false)
    const [displayValue, setDisplayValue] = React.useState('')
    const inputType = React.useMemo(() => {
      if (type === 'password' || type === 'pin') {
        return isShow ? 'text' : 'password'
      }
      if (type === 'nominal' || type === 'percentage' || type === 'youtube') {
        return 'text'
      }

      return type
    }, [type, isShow])

    React.useEffect(() => {
      setDisplayValue(handleFormatValue(value, type))
    }, [value, type])

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      let rawValue = e.target.value
      let formattedValue = rawValue
      if (type === 'nominal') {
        rawValue = rawValue.replace(/\D/g, '')
        formattedValue = handleFormatValue(rawValue, type)
        setDisplayValue(formattedValue)
      } else if (type === 'percentage') {
        formattedValue = formattedValue.replaceAll(',', '.')
        const floatVal = parseFloat(formattedValue)
        if (floatVal >= 1 && floatVal <= 100) {
          rawValue = formattedValue
        } else {
          rawValue = ''
        }
        setDisplayValue(handleFormatValue(rawValue, type))
      } else if (type === 'youtube') {
        rawValue = rawValue.replace('https://', '')
        setDisplayValue(rawValue)
      } else if (type === 'number') {
        rawValue = rawValue.replace(/\D/g, '')
        setDisplayValue(rawValue)
      } else {
        setDisplayValue(rawValue)
      }
      if (onChange) {
        const event = {
          ...e,
          target: {
            ...e.target,
            value: rawValue
          }
        }
        onChange(event as React.ChangeEvent<HTMLInputElement>, rawValue)
      }
    }

    const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
      if (type === 'pin' || type === 'nominal' || type === 'number') {
        const inputEvent = e as unknown as InputEvent
        if (!/^[0-9]*$/.test(inputEvent.data || '')) {
          inputEvent.preventDefault()
        }
      }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (type === 'pin' || type === 'nominal' || type === 'number') {
        const pasted = e.clipboardData.getData('Text')
        if (!/^[0-9]*$/.test(pasted)) {
          e.preventDefault()
        }
      }
    }

    const Eye = isShow ? EyeIcon : EyeSlashIcon
    const stringValue = value !== undefined && value !== null ? String(value) : ''

    return (
      <div className="relative w-full">
        <input
          type={inputType}
          className={cn(
            'flex h-12 w-full rounded-lg border border-border bg-background p-3 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted/60 focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          onBeforeInput={handleBeforeInput}
          onPaste={handlePaste}
          onChange={handleInput}
          maxLength={type === 'pin' ? 6 : undefined}
          value={displayValue !== undefined ? displayValue : stringValue}
          inputMode={type === 'pin' || type === 'nominal' || type === 'number' ? 'numeric' : undefined}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
        {(type === 'password' || type === 'pin') && (
          <Eye
            className="absolute top-[50%] right-3 h-5 w-5 -translate-y-[50%] cursor-pointer"
            onClick={() => setIsShow(!isShow)}
          />
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
export { Input }
