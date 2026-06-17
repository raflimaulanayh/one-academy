import { cn } from '@/utils/cn'

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  return <main className={cn(className)}>{children}</main>
}
