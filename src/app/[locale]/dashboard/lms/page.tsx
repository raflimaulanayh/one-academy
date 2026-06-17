'use client'

import { useDashboard } from '@/context/dashboard-context'

import { LmsTab } from '@/components/organisms/dashboard'

export default function LmsPage() {
  const { activeModules } = useDashboard()

  return <LmsTab activeModules={activeModules} />
}
