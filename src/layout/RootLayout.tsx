import React, { useState } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminNavbar } from './components/AdminNavbar'
import { AdminFooter } from './components/AdminFooter'
import { AdminDashboardPreview } from './components/AdminDashboardPreview'

export interface RootLayoutProps {
  children?: React.ReactNode
  onNavigateToAuth?: () => void
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children, onNavigateToAuth }) => {
  const [activeItem, setActiveItem] = useState<string>('dashboard')

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={true}>
        <div className="dark min-h-screen flex w-full bg-background text-foreground">
          {/* Shadcn Admin Sidebar Component */}
          <AdminSidebar
            activeItem={activeItem}
            onSelectItem={setActiveItem}
            onNavigateToAuth={onNavigateToAuth}
          />

          {/* Inset Main Column with Navbar, Content, and Footer */}
          <SidebarInset className="flex flex-col min-h-screen w-full bg-background overflow-hidden">
            <AdminNavbar
              title={activeItem}
              onNavigateToAuth={onNavigateToAuth}
            />

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
              {children || <AdminDashboardPreview />}
            </main>

            <AdminFooter />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default RootLayout
