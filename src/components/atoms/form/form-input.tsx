import { Control, FieldValues, FormProps } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/atoms/ui/form'
import { Input as FormInput } from '@/components/atoms/ui/input'
import { Label } from '@/components/atoms/ui/label'

import { cn } from '@/utils'

interface FormInputProps extends FormProps<FieldValues> {
  name: string
  control?: Control<any, unknown>
  placeholder?: string
  label?: string
  required?: boolean
  className?: string
  type?: string
  disabled?: boolean
  hint?: string
  labelClassName?: string
  defaultValue?: string | number
}

export const Input: React.FC<FormInputProps> = ({
  control,
  name,
  defaultValue,
  placeholder,
  label,
  required = false,
  className,
  labelClassName,
  type,
  disabled,
  hint,
  ...props
}) => {
  return (
    <FormField
      {...props}
      control={control}
      name={name}
      render={({ field }) => {
        const value = field.value ?? defaultValue ?? ''

        return (
          <FormItem className={className}>
            <Label className={cn('text-sm font-medium text-gray-700', disabled && 'text-gray-500', labelClassName)}>
              {label} {required && <span className="text-red-600"> *</span>}
            </Label>
            <FormControl>
              <FormInput
                className={cn(disabled ? 'bg-gray-100' : '', 'max-md:text-sm')}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                onChange={(_, rawValue) => field.onChange(rawValue)}
              />
            </FormControl>
            {hint && <p className="text-xs leading-tight text-gray-500">{hint}</p>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
