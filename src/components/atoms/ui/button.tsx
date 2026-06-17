'use client'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import * as React from 'react'

import { Loader } from '@/components/atoms/ui/loader'

import { cn } from '@/utils/index'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all duration-300 ease-out disabled:opacity-70",
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90 hover:shadow hover:shadow-primary/25 active:translate-y-0',
        secondary:
          'bg-secondary text-primary hover:bg-secondary/90 hover:shadow hover:shadow-secondary/25 active:translate-y-0',
        destructive:
          'bg-red-500 text-white hover:bg-red-500/90 hover:shadow hover:shadow-red-500/25 focus-visible:ring-red-500/20',
        outline: 'border border-border bg-background text-primary backdrop-blur-sm',
        'outline-primary':
          'border border-primary text-primary bg-transparent hover:bg-primary hover:text-white hover:shadow hover:shadow-primary/25',
        'outline-secondary':
          'border border-secondary text-secondary bg-transparent hover:bg-secondary hover:text-primary hover:shadow hover:shadow-secondary/25',
        'outline-red':
          'border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white hover:shadow hover:shadow-red-500/25',
        ghost: 'hover:bg-black/5 hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        'outline-blue':
          'bg-transparent text-accent-blue shadow-xs hover:bg-accent-blue/10 border border-accent-blue hover:text-white',
        'accent-blue':
          'bg-accent-blue text-white shadow-sm hover:bg-accent-blue/90 hover:shadow hover:shadow-accent-blue/25',
        none: 'bg-none border-none'
      },
      size: {
        default: 'h-10 px-5 py-2 has-[>svg]:px-3',
        xs: 'h-7 w-7 px-0 rounded-sm',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-12 px-6 has-[>svg]:px-4',
        icon: 'size-9'
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-xl',
        '4xl': 'rounded-4xl',
        default: 'rounded-lg',
        full: 'rounded-full'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default'
    }
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  url?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
  loadingMsg?: string
  external?: boolean
  disabledHref?: boolean
  ordinaryHref?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      asChild = false,
      url,
      leftIcon,
      rightIcon,
      loading,
      external = false,
      disabledHref = false,
      ordinaryHref = false,
      loadingMsg = 'Loading...',
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    if (url && !disabledHref && !ordinaryHref) {
      return (
        <Link
          href={url}
          className={cn(buttonVariants({ variant, size, rounded, className }))}
          target={external ? '_blank' : undefined}
          aria-label={props['aria-label']}
          {...(props as any)}
        >
          {!loading && leftIcon && leftIcon}
          {!loading && props.children}
          {!loading && rightIcon && rightIcon}
          {loading && (
            <React.Fragment>
              <Loader className={loadingMsg && 'mr-2 w-fit'} />
              {loadingMsg && <span>{loadingMsg}</span>}
            </React.Fragment>
          )}
        </Link>
      )
    }

    if (url && ordinaryHref) {
      return (
        <a
          href={url}
          className={cn(buttonVariants({ variant, size, rounded, className }))}
          target={external ? '_blank' : undefined}
          rel="noopener noreferrer"
          aria-label={props['aria-label']}
          {...(props as any)}
        >
          {!loading && leftIcon && leftIcon}
          {!loading && props.children}
          {!loading && rightIcon && rightIcon}
          {loading && (
            <React.Fragment>
              <Loader className={loadingMsg && 'mr-2 w-fit'} />
              {loadingMsg && <span>{loadingMsg}</span>}
            </React.Fragment>
          )}
        </a>
      )
    }

    if (asChild) {
      return (
        <Comp className={cn(buttonVariants({ variant, size, rounded, className }))} ref={ref} {...props}>
          {props.children}
        </Comp>
      )
    }

    return (
      <Comp className={cn(buttonVariants({ variant, size, rounded, className }))} ref={ref} {...props}>
        {!loading && leftIcon && leftIcon}
        {!loading && props.children}
        {!loading && rightIcon && rightIcon}
        {loading && (
          <React.Fragment>
            <Loader className={loadingMsg && 'mr-2 w-fit'} />
            {loadingMsg && <span>{loadingMsg}</span>}
          </React.Fragment>
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
