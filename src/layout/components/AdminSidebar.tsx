import React, { useState } from 'react'
import {
  Briefcase,
  ChevronRight,
  ArrowLeft,
  LogOut,
  Layers,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { DynamicIcon } from './DynamicIcon'
import { defaultModules } from '../data/navigationData'
import type { ModuleItem } from '../types/navigation'

export interface AdminSidebarProps {
  activeItem?: string
  onSelectItem?: (id: string) => void
  onNavigateToAuth?: () => void
  modules?: ModuleItem[]
}

/**
 * Extracts digits only from a badge string (e.g. "18 Active" -> "18", "3 Alerts" -> "3")
 */
function getBadgeNumber(badge?: string): string {
  if (!badge) return ''
  const match = badge.match(/\d+/)
  return match ? match[0] : badge
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeItem = 'hr-dashboard',
  onSelectItem,
  onNavigateToAuth,
  modules = defaultModules,
}) => {
  const { state, setOpen } = useSidebar()
  const isCollapsed = state === 'collapsed'

  // Module state
  const [activeModuleId, setActiveModuleId] = useState<string>(
    modules[0]?.id || 'ai-recruitment'
  )
  const [showModuleSelector, setShowModuleSelector] = useState<boolean>(false)

  // Submenu expansion state (records expanded menu IDs)
  const [expandedMenuIds, setExpandedMenuIds] = useState<string[]>([
    'candidate-pipeline',
    'requisitions-mgmt',
  ])

  // Active module
  const currentModule =
    modules.find((m) => m.id === activeModuleId) || modules[0]

  const toggleMenuExpanded = (menuId: string) => {
    // If sidebar is collapsed, clicking on an expandable item automatically opens sidebar
    if (isCollapsed) {
      setOpen(true)
    }
    setExpandedMenuIds((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    )
  }

  const handleSelectModule = (moduleId: string) => {
    setActiveModuleId(moduleId)
    setShowModuleSelector(false)
    const selectedMod = modules.find((m) => m.id === moduleId)
    if (selectedMod && selectedMod.menus.length > 0) {
      const firstMenu = selectedMod.menus[0]
      if (firstMenu.submenus && firstMenu.submenus.length > 0) {
        onSelectItem?.(firstMenu.submenus[0].id)
      } else {
        onSelectItem?.(firstMenu.id)
      }
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      {/* 1. Brand Header - Pixel-perfect centered in collapsed mode */}
      <SidebarHeader className="border-b border-border p-3.5 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center w-full">
          <div className="w-8 h-8 rounded-xl bg-[#E8B931] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#E8B931]/20">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-foreground truncate">
                Sofiy AI
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#E8B931]/20 border border-[#E8B931]/40 text-[#E8B931]">
                HR
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground truncate">
              HR Console v2.4
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* 2. Main Content Area */}
      <SidebarContent className="px-2 py-3 space-y-3 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2 overflow-x-hidden">
        {/* VIEW A: All Modules Selection View */}
        {showModuleSelector ? (
          <SidebarGroup className="p-0">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-border mb-2 group-data-[collapsible=icon]:hidden">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Layers className="w-3.5 h-3.5 text-[#E8B931]" />
                <span>Select Module</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModuleSelector(false)}
                className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </Button>
            </div>

            <SidebarGroupContent>
              <SidebarMenu className="gap-2.5 py-1">
                {modules.map((mod) => {
                  const isCurrent = mod.id === activeModuleId
                  return (
                    <SidebarMenuItem key={mod.id} className="my-1">
                      <SidebarMenuButton
                        isActive={isCurrent}
                        onClick={() => handleSelectModule(mod.id)}
                        tooltip={mod.title}
                        className={`h-auto py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#E8B931] text-zinc-950 font-semibold shadow-xs'
                            : 'hover:bg-muted/80'
                        }`}
                      >
                        <DynamicIcon name={mod.icon} className="w-4 h-4 shrink-0" />
                        <div className="flex flex-col min-w-0 text-left flex-1 group-data-[collapsible=icon]:hidden">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold truncate">
                              {mod.title}
                            </span>
                            {mod.badge && (
                              <Badge
                                variant="outline"
                                className={`text-[9px] px-1 py-0 h-4 border-current ${
                                  isCurrent
                                    ? 'bg-zinc-950/20 text-zinc-950'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {mod.badge}
                              </Badge>
                            )}
                          </div>
                          {mod.description && (
                            <span
                              className={`text-[10px] truncate ${
                                isCurrent
                                  ? 'text-zinc-950/80'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {mod.description}
                            </span>
                          )}
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70 shrink-0 group-data-[collapsible=icon]:hidden" />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          /* VIEW B: Active Module & Its Main Menus + Submenus */
          <>
            {/* Active Module Card with Switcher Pill */}
            <div className="px-1 mb-2.5 group-data-[collapsible=icon]:px-0">
              <div className="flex items-center justify-between p-2 rounded-xl bg-muted/60 border border-border group-data-[collapsible=icon]:p-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-0">
                <div className="flex items-center gap-2 min-w-0 group-data-[collapsible=icon]:justify-center">
                  <div className="w-7 h-7 rounded-lg bg-[#E8B931]/15 border border-[#E8B931]/30 flex items-center justify-center text-[#E8B931] shrink-0">
                    <DynamicIcon name={currentModule.icon} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#E8B931]">
                      Active Module
                    </p>
                    <p className="text-xs font-semibold text-foreground truncate">
                      {currentModule.title}
                    </p>
                  </div>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowModuleSelector(true)}
                      className="h-7 px-2 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-card border border-border rounded-lg group-data-[collapsible=icon]:hidden cursor-pointer"
                    >
                      Switch
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Browse & Switch Modules
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Main Menus & Expandable Submenus */}
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden px-2 pt-2 pb-1.5">
                {currentModule.title} Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2 py-1">
                  {currentModule.menus.map((menu) => {
                    const hasSubmenus =
                      Boolean(menu.submenus) && (menu.submenus?.length ?? 0) > 0
                    const isExpanded = expandedMenuIds.includes(menu.id)
                    const isMenuDirectActive = activeItem === menu.id
                    const isSubmenuChildActive =
                      menu.submenus?.some((sub) => sub.id === activeItem) ?? false

                    // If menu does NOT have submenus: direct click action
                    if (!hasSubmenus) {
                      return (
                        <SidebarMenuItem key={menu.id} className="my-1">
                          <SidebarMenuButton
                            isActive={isMenuDirectActive}
                            onClick={() => onSelectItem?.(menu.id)}
                            tooltip={menu.title}
                            className={`h-9 px-2.5 rounded-xl transition-all cursor-pointer ${
                              isMenuDirectActive
                                ? 'bg-[#E8B931] text-zinc-950 font-semibold hover:bg-[#D8A721] hover:text-zinc-950 shadow-xs'
                                : 'hover:bg-muted/80'
                            }`}
                          >
                            <DynamicIcon name={menu.icon} className="w-4 h-4 shrink-0" />
                            <span>{menu.title}</span>
                          </SidebarMenuButton>
                          {menu.badge && (
                            <SidebarMenuBadge
                              className={
                                isMenuDirectActive
                                  ? 'bg-zinc-950 text-white font-bold text-[10px] h-5 min-w-5 px-1.5 rounded-full whitespace-nowrap shrink-0'
                                  : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-bold text-[10px] h-5 min-w-5 px-1.5 rounded-full whitespace-nowrap shrink-0'
                              }
                            >
                              {getBadgeNumber(menu.badge)}
                            </SidebarMenuBadge>
                          )}
                        </SidebarMenuItem>
                      )
                    }

                    // If menu HAS submenus: Collapsible row expanding submenus underneath
                    return (
                      <Collapsible
                        key={menu.id}
                        open={isExpanded}
                        onOpenChange={() => toggleMenuExpanded(menu.id)}
                        className="group/collapsible my-1"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              isActive={isMenuDirectActive || isSubmenuChildActive}
                              tooltip={menu.title}
                              className={`h-9 px-2.5 rounded-xl cursor-pointer transition-all ${
                                isMenuDirectActive || isSubmenuChildActive
                                  ? 'font-semibold text-foreground bg-muted/80'
                                  : 'hover:bg-muted/60'
                              }`}
                            >
                              <DynamicIcon name={menu.icon} className="w-4 h-4 shrink-0" />
                              <span className="truncate">{menu.title}</span>
                              {menu.badge && (
                                <Badge
                                  variant="outline"
                                  className="ml-auto text-[10px] font-bold h-5 min-w-5 px-1.5 rounded-full bg-emerald-500/15 text-emerald-500 border-emerald-500/30 whitespace-nowrap shrink-0 group-data-[collapsible=icon]:hidden"
                                >
                                  {getBadgeNumber(menu.badge)}
                                </Badge>
                              )}
                              <ChevronRight className="w-3.5 h-3.5 ml-auto text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden shrink-0" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          {/* Submenu Expanded Row */}
                          <CollapsibleContent>
                            <SidebarMenuSub className="mt-2 mb-1.5 space-y-1.5 border-l-2 border-border/80 pl-3 ml-4 py-0.5">
                              {menu.submenus?.map((submenu) => {
                                const isSubActive = activeItem === submenu.id
                                return (
                                  <SidebarMenuSubItem key={submenu.id} className="my-1">
                                    <SidebarMenuSubButton
                                      isActive={isSubActive}
                                      onClick={() => onSelectItem?.(submenu.id)}
                                      className={`h-8 py-1.5 px-2.5 rounded-lg cursor-pointer transition-all ${
                                        isSubActive
                                          ? 'bg-[#E8B931] text-zinc-950 font-semibold hover:bg-[#D8A721] hover:text-zinc-950 shadow-xs'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                                      }`}
                                    >
                                      {submenu.icon && (
                                        <DynamicIcon
                                          name={submenu.icon}
                                          className="w-3.5 h-3.5 shrink-0"
                                        />
                                      )}
                                      <span className="truncate">{submenu.title}</span>
                                      {submenu.badge && (
                                        <Badge
                                          variant="outline"
                                          className={`ml-auto text-[9px] font-bold h-4 min-w-4 px-1 rounded-full whitespace-nowrap shrink-0 ${
                                            isSubActive
                                              ? 'bg-zinc-950 text-white border-zinc-950'
                                              : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                                          }`}
                                        >
                                          {getBadgeNumber(submenu.badge)}
                                        </Badge>
                                      )}
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                )
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* 3. Sidebar Footer - Pixel-perfect centered in collapsed mode */}
      <SidebarFooter className="border-t border-border p-3 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between w-full p-2 rounded-xl bg-muted/40 border border-border group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto">
              <div className="flex items-center gap-2.5 min-w-0 group-data-[collapsible=icon]:justify-center">
                <div className="relative shrink-0">
                  <Avatar className="w-8 h-8 rounded-full border border-border">
                    <AvatarFallback className="bg-gradient-to-tr from-[#E8B931] to-amber-600 text-white font-bold text-xs">
                      HR
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-card" />
                </div>
                <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                  <p className="text-xs font-semibold text-foreground truncate">
                    HR Operations
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    hr@sofiy.ai
                  </p>
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