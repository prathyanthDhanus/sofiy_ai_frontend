import { SlidersHorizontal, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { ColumnDef } from './types'

export interface DataTableColumnVisibilityProps<T> {
  columns: ColumnDef<T>[]
  visibleColumns: Set<string>
  onToggleColumn: (columnId: string) => void
  onResetColumns: () => void
}

export function DataTableColumnVisibility<T>({
  columns,
  visibleColumns,
  onToggleColumn,
  onResetColumns,
}: DataTableColumnVisibilityProps<T>) {
  // Only columns that can be hidden (hideable !== false)
  const toggleableColumns = columns.filter((col) => col.hideable !== false)
  const visibleCount = toggleableColumns.filter((col) => visibleColumns.has(col.id)).length

  return (
    <DropdownMenu>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 gap-2 rounded-xl border-border bg-card hover:bg-muted/60 text-xs font-medium cursor-pointer shadow-xs"
                aria-label="Toggle column visibility"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="hidden sm:inline">Columns</span>
                <span className="inline-flex items-center justify-center h-4 px-1.5 rounded-full bg-muted text-[10px] font-bold text-foreground">
                  {visibleCount}/{toggleableColumns.length}
                </span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Show/hide table columns
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent align="end" className="w-52 p-2 border-border bg-card shadow-xl">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-xs font-bold text-foreground">
            Table Columns
          </DropdownMenuLabel>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetColumns}
            className="h-auto p-0 inline-flex items-center gap-1 text-[11px] text-[#E8B931] hover:underline cursor-pointer hover:bg-transparent"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </Button>
        </div>

        <DropdownMenuSeparator />

        <div className="max-h-60 overflow-y-auto py-1 space-y-0.5">
          {toggleableColumns.map((col) => {
            const isVisible = visibleColumns.has(col.id)
            const title = typeof col.header === 'string' ? col.header : col.id

            return (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={isVisible}
                onSelect={(e) => {
                  e.preventDefault()
                  onToggleColumn(col.id)
                }}
                className="text-xs cursor-pointer rounded-lg hover:bg-muted/80 capitalize"
              >
                {title}
              </DropdownMenuCheckboxItem>
            )
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
