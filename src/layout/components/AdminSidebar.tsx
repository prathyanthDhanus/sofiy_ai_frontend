import React from 'react'
import {
  GraduationCap,
  LayoutDashboard,
  Bot,
  Users,
  BookOpen,
  BarChart3,
  Database,
  Settings,
  LogOut,
  BrainCircuit,
  FileCheck,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface AdminSidebarProps {
  activeItem?: string
  onSelectItem?: (id: string) => void
  onNavigateToAuth?: () => void
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeItem = 'dashboard',
  onSelectItem,
  onNavigateToAuth,
}) => {
  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sessions', label: 'AI Tutor Sessions', icon: Bot, badge: 'Live 18' },
    { id: 'students', label: 'Students & Learners', icon: Users },
    { id: 'curriculum', label: 'Curriculum & Courses', icon: BookOpen },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
  ]

  const secondaryNavItems = [
    { id: 'knowledge', label: 'AI Knowledge Base', icon: Database },
    { id: 'prompts', label: 'Tutor Prompts & Skills', icon: BrainCircuit },
    { id: 'audits', label: 'Session Audit Logs', icon: FileCheck },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ]

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      {/* Sidebar Brand Header */}
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E8B931] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#E8B931]/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-foreground truncate">Sofiy AI</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#E8B931]/20 border border-[#E8B931]/40 text-[#E8B931]">
                ADMIN
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground truncate">Tutor Console v2.4</span>
          </div>
        </div>
      </SidebarHeader>

      {/* Sidebar Nav Content */}
      <SidebarContent className="px-2 py-3 space-y-4">
        {/* Main Navigation Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
            Overview & Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNavItems.map((item) => {
                const Icon = item.icon
                const isActive = activeItem === item.id

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => onSelectItem?.(item.id)}
                      tooltip={item.label}
                      className={isActive ? 'bg-[#E8B931] text-zinc-950 font-semibold hover:bg-[#D8A721] hover:text-zinc-950' : ''}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge className={isActive ? 'bg-zinc-950 text-white' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'}>
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AI & Infrastructure Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
            AI Engine & Controls
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => {
                const Icon = item.icon
                const isActive = activeItem === item.id

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => onSelectItem?.(item.id)}
                      tooltip={item.label}
                      className={isActive ? 'bg-[#E8B931] text-zinc-950 font-semibold hover:bg-[#D8A721] hover:text-zinc-950' : ''}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar User Footer */}
      <SidebarFooter className="border-t border-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between w-full p-2 rounded-xl bg-muted/40 border border-border group-data-[collapsible=icon]:p-1.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <Avatar className="w-8 h-8 rounded-full border border-border">
                    <AvatarFallback className="bg-gradient-to-tr from-[#E8B931] to-amber-600 text-white font-bold text-xs">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-card" />
                </div>
                <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                  <p className="text-xs font-semibold text-foreground truncate">Admin Console</p>
                  <p className="text-[10px] text-muted-foreground truncate">admin@sofiy.ai</p>
                </div>
              </div>

              {onNavigateToAuth && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={onNavigateToAuth}
                      className="h-8 w-8 text-muted-foreground hover:text-rose-400 hover:bg-muted rounded-lg transition-colors group-data-[collapsible=icon]:hidden cursor-pointer"
                      aria-label="Sign out & return to login"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Sign out & return to login
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

export default AdminSidebar
