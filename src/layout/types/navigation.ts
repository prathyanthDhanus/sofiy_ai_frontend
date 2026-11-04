export interface SubMenuItem {
  id: string
  title: string
  icon?: string
  path?: string
  badge?: string
}

export interface MenuItem {
  id: string
  title: string
  icon?: string
  path?: string
  badge?: string
  submenus?: SubMenuItem[]
}

export interface ModuleItem {
  id: string
  title: string
  description?: string
  icon: string
  badge?: string
  menus: MenuItem[]
}
