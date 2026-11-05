import React, { useState, useEffect } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminNavbar } from './components/AdminNavbar'
import { AdminFooter } from './components/AdminFooter'
import { AdminDashboardPreview } from '@/app/pages/dashboard/AdminDashboardPreview'
import { JobPage } from '@/app/pages/job/Index'
import { ChatbotWidget } from '@/components/chatbot'

export interface RootLayoutProps {
  children?: React.ReactNode
  onNavigateToAuth?: () => void
}

function resolveInitialActiveItem(): string {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.toLowerCase()
    if (path === '/jobs/create' || path.startsWith('/jobs/')) {
      return 'create-job-vacancy'
    }
  }
  return 'hr-dashboard'
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children, onNavigateToAuth }) => {
  const [activeItem, setActiveItem] = useState<string>(resolveInitialActiveItem)

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase()
      if (path === '/jobs/create' || path.startsWith('/jobs/')) {
        setActiveItem('create-job-vacancy')
      } else if (path === '/admin') {
        setActiveItem('hr-dashboard')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleSelectItem = (id: string) => {
    setActiveItem(id)
    if (id === 'create-job-vacancy' || id === 'active-interviews') {
      if (window.location.pathname !== '/jobs/create') {
        window.history.pushState(null, '', '/jobs/create')
      }
    } else if (id === 'hr-dashboard') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin')
      }
    }
  }

  // Format title for the top Admin Navbar
  const getNavbarTitle = () => {
    if (activeItem === 'create-job-vacancy' || activeItem === 'active-interviews') {
      return 'Create a Job Vacancy'
    }
    if (activeItem === 'hr-dashboard') {
      return 'HR Overview & Metrics'
    }
    return activeItem.replace(/-/g, ' ')
  }

  const isJobCreateView =
    activeItem === 'create-job-vacancy' ||
    activeItem === 'active-interviews' ||
    (typeof window !== 'undefined' &&
      window.location.pathname.toLowerCase() === '/jobs/create')

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={true} className="h-screen max-h-screen overflow-hidden">
        <div className="h-screen max-h-screen flex w-full bg-background text-foreground transition-colors duration-300 overflow-hidden">
          {/* Shadcn Admin Sidebar Component */}
          <AdminSidebar
            activeItem={activeItem}
            onSelectItem={handleSelectItem}
            onNavigateToAuth={onNavigateToAuth}
          />

          {/* Inset Main Column with Navbar, Content, and Footer */}
          <SidebarInset className="flex flex-col h-screen max-h-screen w-full bg-background overflow-hidden">
            <AdminNavbar
              title={getNavbarTitle()}
              onNavigateToAuth={onNavigateToAuth}
            />

            <main className="flex-1 overflow-y-auto flex flex-col">
              <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
                {children ? (
                  children
                ) : isJobCreateView ? (
                  <JobPage onBackToDashboard={() => handleSelectItem('hr-dashboard')} />
                ) : (
                  <AdminDashboardPreview
                    onNavigateToCreateJob={() => handleSelectItem('create-job-vacancy')}
                  />
                )}
              </div>
              <AdminFooter />
            </main>
          </SidebarInset>
        </div>

        {/* Global AI Chatbot Assistant Widget */}
        <ChatbotWidget />
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default RootLayout
