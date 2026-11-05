import React, { useState, useEffect } from 'react'
import {
  Briefcase,
  ChevronDown,
  LogOut,
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

/**
 * Helper to determine which module owns a specific item
 */
function findModuleIdByItemId(modules: ModuleItem[], itemId: string): string | undefined {
  for (const mod of modules) {
    for (const menu of mod.menus) {
      if (menu.id === itemId) return mod.id
      if (menu.submenus?.some((sub) => sub.id === itemId)) return mod.id
    }
  }
  return undefined
}

/**
 * Helper to determine which main menu owns a specific submenu
 */
function findMenuIdBySubmenuId(modules: ModuleItem[], itemId: string): string | undefined {
  for (const mod of modules) {
    for (const menu of mod.menus) {
      if (menu.submenus?.some((sub) => sub.id === itemId)) return menu.id
    }
  }
  return undefined
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeItem = 'hr-dashboard',
  onSelectItem,
  onNavigateToAuth,
  modules = defaultModules,
}) => {
  const { state, setOpen } = useSidebar()
  const isCollapsed = state === 'collapsed'

  // Expanded module state: exclusive single accordion (only one module expanded at a time)
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(
    'ai-recruitment'
  )

  // Expanded main menu state: exclusive single accordion (only one main menu expanded at a time)
  const [expandedMenuId, setExpandedMenuId] = useState<string | null>(
    'candidate-pipeline'
  )

  // Automatically ensure the module and menu containing the active item are expanded
  useEffect(() => {
    const modId = findModuleIdByItemId(modules, activeItem)
    if (modId) {
      setExpandedModuleId(modId)
    }
    const menuId = findMenuIdBySubmenuId(modules, activeItem)
    if (menuId) {
      setExpandedMenuId(menuId)
    }
  }, [activeItem, modules])

  // Toggle module expansion: opening one automatically closes any previously open module
  const toggleModuleExpanded = (moduleId: string) => {
    if (isCollapsed) {
      setOpen(true)
    }
    setExpandedModuleId((prev) => (prev === moduleId ? null : moduleId))
  }

  // Toggle main menu submenu expansion: opening one automatically closes any previously open menu
  const toggleMenuExpanded = (menuId: string) => {
    if (isCollapsed) {
      setOpen(true)
    }
    setExpandedMenuId((prev) => (prev === menuId ? null : menuId))
  }

  // Handle clicking a leaf menu or submenu item
  const handleItemClick = (itemId: string, itemPath?: string) => {
    if (itemPath) {
      window.history.pushState(null, '', itemPath)
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (itemId === 'create-job-vacancy' || itemId === 'active-interviews') {
      window.history.pushState(null, '', '/jobs/create')
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (itemId === 'hr-dashboard') {
      window.history.pushState(null, '', '/admin')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
    onSelectItem?.(itemId)
  }

  const activeModuleId = findModuleIdByItemId(modules, activeItem)

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      {/* 1. Brand Header - Synced to h-16 to match AdminNavbar's bottom border exactly */}
      <SidebarHeader className="h-16 shrink-0 border-b border-border px-3.5 flex items-center justify-center group-data-[collapsible=icon]:px-0">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center w-full">
          <div className="w-8 h-8 rounded-xl bg-[#E8B931] flex items-center justify-center text-zinc-950 font-bold shrink-0 shadow-md shadow-[#E8B931]/20">
            <Briefcase className="w-4 h-4 text-zinc-950" />
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

      {/* 2. Main Navigation Area: Modules -> Main Menus -> Submenus */}
      <SidebarContent className="px-2 py-3 space-y-2 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2 overflow-x-hidden">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden px-2 py-1 mb-1">
            Application Modules
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-2 py-1">
              {modules.map((mod) => {
                const isModuleExpanded = expandedModuleId === mod.id
                const isModuleActive = mod.id === activeModuleId

                return (
                  <Collapsible
                    key={mod.id}
                    open={isModuleExpanded}
                    onOpenChange={() => toggleModuleExpanded(mod.id)}
                    className="group/module my-1"
                  >
                    <SidebarMenuItem>
                      {/* Level 1: Module Header Row with Right-side Tooltip */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              className={`h-10 py-2 px-3 rounded-xl transition-all cursor-pointer group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center ${
                                isModuleActive
                                  ? 'bg-muted/80 text-foreground font-semibold border border-border/80 shadow-xs group-data-[collapsible=icon]:border-[#E8B931]/40 group-data-[collapsible=icon]:bg-[#E8B931]/15'
                                  : 'hover:bg-muted/70 text-foreground/90 group-data-[collapsible=icon]:hover:bg-muted/70'
                              }`}
                            >
                              <div className="w-6 h-6 rounded-lg bg-[#E8B931]/15 border border-[#E8B931]/30 flex items-center justify-center text-[#E8B931] shrink-0 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-0">
                                <DynamicIcon name={mod.icon} className="w-3.5 h-3.5 group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4 text-[#E8B931]" />
                              </div>

                              <div className="flex items-center justify-between gap-1.5 min-w-0 text-left flex-1 group-data-[collapsible=icon]:hidden">
                                <span className="text-xs font-bold truncate">
                                  {mod.title}
                                </span>
                                {mod.badge && (
                                  <Badge
                                    variant="outline"
                                    className="text-[9px] px-1.5 py-0 h-4 border-[#E8B931]/30 text-[#E8B931] bg-[#E8B931]/10 shrink-0 font-medium"
                                  >
                                    {mod.badge}
                                  </Badge>
                                )}
                              </div>

                              <ChevronDown className="w-3.5 h-3.5 ml-auto text-muted-foreground transition-transform duration-200 group-data-[state=open]/module:rotate-180 group-data-[collapsible=icon]:hidden shrink-0" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                        </TooltipTrigger>

                        <TooltipContent
                          side="right"
                          align="center"
                          sideOffset={10}
                          className="max-w-[240px] text-xs text-left leading-relaxed flex flex-col gap-1 p-2.5 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg"
                        >
                          <span className="font-bold text-xs text-foreground block">{mod.title}</span>
                          {mod.description && (
                            <span className="text-muted-foreground text-[11px] block leading-snug">
                              {mod.description}
                            </span>
                          )}
                        </TooltipContent>
                      </Tooltip>

                      {/* Level 2: Main Menus directly below the selected Module */}
                      <CollapsibleContent>
                        <div className="ml-3 pl-3 border-l-2 border-border/80 my-1.5 space-y-1 py-0.5 group-data-[collapsible=icon]:hidden">
                          {mod.menus.map((menu) => {
                            const hasSubmenus =
                              Boolean(menu.submenus) && (menu.submenus?.length ?? 0) > 0
                            const isMenuExpanded = expandedMenuId === menu.id
                            const isMenuDirectActive = activeItem === menu.id
                            const isSubmenuChildActive =
                              menu.submenus?.some((sub) => sub.id === activeItem) ?? false

                            // Case A: Main menu has NO submenus -> Direct Clickable Item
                            if (!hasSubmenus) {
                              return (
                                <SidebarMenuItem key={menu.id} className="my-1">
                                  <SidebarMenuButton
                                    isActive={isMenuDirectActive}
                                    onClick={() => handleItemClick(menu.id, menu.path)}
                                    tooltip={menu.title}
                                    className={`h-8.5 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                      isMenuDirectActive
                                        ? 'bg-[#E8B931] text-zinc-950 font-semibold hover:bg-[#D8A721] hover:text-zinc-950 shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                                    }`}
                                  >
                                    <DynamicIcon name={menu.icon} className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">{menu.title}</span>
                                    {menu.badge && (
                                      <Badge
                                        variant="outline"
                                        className={`ml-auto text-[9px] font-bold h-4.5 min-w-4.5 px-1 rounded-full whitespace-nowrap shrink-0 ${
                                          isMenuDirectActive
                                            ? 'bg-zinc-950 text-white border-zinc-950'
                                            : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                                        }`}
                                      >
                                        {getBadgeNumber(menu.badge)}
                                      </Badge>
                                    )}
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              )
                            }

                            // Case B: Main menu HAS submenus -> Expandable Row with Submenus below
                            return (
                              <Collapsible
                                key={menu.id}
                                open={isMenuExpanded}
                                onOpenChange={() => toggleMenuExpanded(menu.id)}
                                className="group/menu my-1"
                              >
                                <SidebarMenuItem>
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                      isActive={isMenuDirectActive || isSubmenuChildActive}
                                      tooltip={menu.title}
                                      className={`h-8.5 px-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                                        isMenuDirectActive || isSubmenuChildActive
                                          ? 'font-semibold text-foreground bg-muted/80'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                      }`}
                                    >
                                      <DynamicIcon name={menu.icon} className="w-3.5 h-3.5 shrink-0" />
                                      <span className="truncate">{menu.title}</span>

                                      {menu.badge && (
                                        <Badge
                                          variant="outline"
                                          className="ml-auto text-[9px] font-bold h-4.5 min-w-4.5 px-1 rounded-full bg-emerald-500/15 text-emerald-500 border-emerald-500/30 whitespace-nowrap shrink-0"
                                        >
                                          {getBadgeNumber(menu.badge)}
                                        </Badge>
                                      )}

                                      <ChevronDown className="w-3 h-3 ml-auto text-muted-foreground transition-transform duration-200 group-data-[state=open]/menu:rotate-180 shrink-0" />
                                    </SidebarMenuButton>
                                  </CollapsibleTrigger>

                                  {/* Level 3: Submenus directly below the corresponding Main Menu */}
                                  <CollapsibleContent>
                                    <SidebarMenuSub className="ml-2.5 pl-2.5 border-l-2 border-border/60 my-1 space-y-1 py-0.5">
                                      {menu.submenus?.map((submenu) => {
                                        const isSubActive = activeItem === submenu.id

                                        return (
                                          <SidebarMenuSubItem key={submenu.id} className="my-0.5">
                                            <SidebarMenuSubButton
                                              isActive={isSubActive}
                                              onClick={() => handleItemClick(submenu.id, submenu.path)}
                                              className={`h-7.5 py-1 px-2 rounded-md text-[11px] cursor-pointer transition-all ${
                                                isSubActive
                                                  ? 'bg-[#E8B931] text-zinc-950 font-semibold hover:bg-[#D8A721] hover:text-zinc-950 shadow-xs'
                                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                                              }`}
                                            >
                                              {submenu.icon && (
                                                <DynamicIcon
                                                  name={submenu.icon}
                                                  className="w-3 h-3 shrink-0"
                                                />
                                              )}
                                              <span className="truncate">{submenu.title}</span>

                                              {submenu.badge && (
                                                <Badge
                                                  variant="outline"
                                                  className={`ml-auto text-[8px] font-bold h-4 min-w-4 px-1 rounded-full whitespace-nowrap shrink-0 ${
                                                    isSubActive
                                                      ? 'bg-zinc-950 text-white border-zinc-950'
                                                      : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
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
                        </div>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 3. Sidebar Footer - Synced to h-16 to align seamlessly with AdminFooter */}
      <SidebarFooter className="h-16 shrink-0 border-t border-border p-0 px-3 flex flex-col justify-center group-data-[collapsible=icon]:px-0">
        <SidebarMenu className="w-full">
          <SidebarMenuItem className="w-full">
            <div className="flex items-center justify-between w-full px-2 py-1.5 rounded-xl bg-muted/40 border border-border group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto">
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
                  <p className="text-xs font-semibold text-foreground truncate leading-tight">
                    HR Operations
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate leading-tight">
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
                      className="h-7 w-7 text-muted-foreground hover:text-rose-400 hover:bg-muted rounded-lg transition-colors group-data-[collapsible=icon]:hidden cursor-pointer shrink-0"
                      aria-label="Sign out & return to login"
                    >
                      <LogOut className="w-3.5 h-3.5" />
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