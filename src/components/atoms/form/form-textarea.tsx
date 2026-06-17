import { Control, FieldValues, FormProps } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/atoms/ui/form'
import { Label } from '@/components/atoms/ui/label'
import { Textarea as FormTextArea } from '@/components/atoms/ui/textarea'

import { cn } from '@/utils'

interface FormTextAreaProps extends FormProps<FieldValues> {
  name: string
  control?: Control<any, unknown>
  placeholder?: string
  label?: string
  required?: boolean
  className?: string
  labelClassName?: string
  type?: string
  hint?: string
  disabled?: boolean
}

export const Textarea: React.FC<FormTextAreaProps> = ({
  control,
  name,
  placeholder,
  label,
  labelClassName,
  required = false,
  className,
  hint,
  disabled,
  ...props
}) => {
  return (
    <FormField
      {...props}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <Label className={cn('text-sm font-medium text-gray-700', disabled && 'text-gray-500', labelClassName)}>
              {label} {required && <span className="text-red-600"> *</span>}
            </Label>
          )}
          <FormControl>
            <FormTextArea disabled={disabled} placeholder={placeholder} {...field} className="resize-none max-md:text-sm" />
          </FormControl>
          {hint && <p className="text-xs leading-tight text-gray-500">{hint}</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
