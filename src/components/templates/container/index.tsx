import { cn } from '@/utils/cn'

interface ContainerProps {
  className?: string
  children?: React.ReactNode
}

export const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return <div className={cn(className, 'mx-auto w-11/12 max-w-[1440px]')}>{children}</div>
}
