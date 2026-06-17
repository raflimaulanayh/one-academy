'use client'

import { useDashboard } from '@/context/dashboard-context'

import { AssignmentsTab } from '@/components/organisms/dashboard'

export default function AssignmentsPage() {
  const { assignments, handleFileUpload } = useDashboard()

  return <AssignmentsTab assignments={assignments} onUpload={handleFileUpload} />
}
