import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Bell, Search, ExternalLink } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface AdminNavbarProps {
  title?: string
  onNavigateToAuth?: () => void
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  title = 'Overview & Metrics',
  onNavigateToAuth,
}) => {
  return (
    <header className="h-16 shrink-0 sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 bg-card/85 backdrop-blur-md border-b border-border">
      {/* Left: Sidebar Trigger & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="cursor-pointer hover:bg-muted text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="h-4 bg-border" />
        <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
          <span className="hidden sm:inline">Admin Portal</span>
          <span className="hidden sm:inline">/</span>
          <span className="text-foreground font-semibold truncate capitalize">{title}</span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search candidates, employees, job requisitions, AI HR logs..."
            className="pl-9 pr-14 h-9 rounded-xl bg-muted/40 border-border text-xs focus-visible:ring-[#E8B931]/30 focus-visible:border-[#E8B931]"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground bg-card px-1.5 py-0.5 rounded border border-border">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right: AI Status, Theme Toggle, Notifications & View Switcher */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Live AI Status Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>AI HR Core Active</span>
        </div>

        {/* Day / Night Animated Theme Switch */}
        <ThemeToggle size="sm" />

        {/* Notifications Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E8B931]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Notifications
          </TooltipContent>
        </Tooltip>

        {/* Switch to Login View for testing */}
        {onNavigateToAuth && (
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateToAuth}
            className="h-8 gap-1.5 text-xs rounded-xl border-border hover:border-[#E8B931] hover:text-[#E8B931] cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Login</span>
          </Button>
        )}
      </div>
    </header>
  )
}

export default AdminNavbar
