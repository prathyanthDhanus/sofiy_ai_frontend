import React from 'react'
import { AdminDashboardPreview } from './AdminDashboardPreview'

export interface DashboardPageProps {
  onNavigateToAuth?: () => void
}

export const DashboardPage: React.FC<DashboardPageProps> = () => {
  return <AdminDashboardPreview />
}

export { AdminDashboardPreview }
export default DashboardPage
