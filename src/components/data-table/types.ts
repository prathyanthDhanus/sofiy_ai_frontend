import React from 'react'

export type TableDensity = 'compact' | 'normal' | 'relaxed'

export type SortDirection = 'asc' | 'desc' | null

export interface SortState {
  columnId: string
  direction: 'asc' | 'desc'
}

export interface FilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  count?: number
}

export interface FilterConfig<T> {
  id: string
  title: string
  icon?: React.ComponentType<{ className?: string }>
  accessorKey?: keyof T
  accessorFn?: (row: T) => string | number | boolean | (string | number | boolean)[]
  options: FilterOption[]
}

export interface ColumnDef<T> {
  id: string
  header: string | ((props: { column: ColumnDef<T>; isSorted: 'asc' | 'desc' | false }) => React.ReactNode)
  accessorKey?: keyof T
  accessorFn?: (row: T) => unknown
  cell?: (props: { row: T; value: unknown; index: number }) => React.ReactNode
  sortable?: boolean
  searchable?: boolean
  type?: 'text' | 'id' | 'email' | 'mobile' | 'badge' | 'custom'
  copyable?: boolean
  defaultVisible?: boolean
  hideable?: boolean
  className?: string
  align?: 'left' | 'center' | 'right'
}

export interface RowAction<T> {
  id: string
  label: string
  icon: React.ReactNode
  tooltip?: string
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
  onClick: (row: T) => void
  disabled?: boolean
  hidden?: (row: T) => boolean
}

export interface DeleteModalConfig {
  title?: React.ReactNode
  description?: React.ReactNode
  itemName?: string
  confirmText?: string
  cancelText?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  keyField?: keyof T | ((row: T) => string | number)
  title?: string
  description?: string
  enableRowSelection?: boolean
  selectedRows?: Set<string | number>
  onSelectedRowsChange?: (selected: Set<string | number>) => void
  searchPlaceholder?: string
  filters?: FilterConfig<T>[]
  defaultPageSize?: number
  pageSizeOptions?: number[]
  onView?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void | Promise<void>
  deleteModalConfig?: (row: T) => DeleteModalConfig
  customActions?: (row: T) => RowAction<T>[]
  actionsColumnTitle?: string
  showActionsColumn?: boolean
  isLoading?: boolean
  emptyMessage?: React.ReactNode
  className?: string
  bulkActions?: (selectedIds: (string | number)[], selectedRows: T[]) => React.ReactNode
  enableExportExcel?: boolean
  onExportExcel?: (filteredData: T[], visibleColumns: ColumnDef<T>[]) => void
  exportExcelFilename?: string
}
