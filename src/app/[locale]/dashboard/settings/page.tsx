'use client'

import { useDashboard } from '@/context/dashboard-context'

import { SettingsTab } from '@/components/organisms/dashboard'

export default function SettingsPage() {
  const { userData } = useDashboard()

  if (!userData) return null

  return <SettingsTab userData={userData} />
}
