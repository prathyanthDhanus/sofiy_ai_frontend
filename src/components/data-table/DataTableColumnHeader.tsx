import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ColumnDef, SortState } from './types'

export interface DataTableColumnHeaderProps<T> {
  column: ColumnDef<T>
  sortState: SortState | null
  onSort: (columnId: string) => void
}

export function DataTableColumnHeader<T>({
  column,
  sortState,
  onSort,
}: DataTableColumnHeaderProps<T>) {
  const isSorted = sortState?.columnId === column.id ? sortState.direction : false
  const canSort = column.sortable !== false

  if (!canSort) {
    return (
      <div className={`font-semibold text-xs tracking-wider uppercase text-muted-foreground ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}>
        {typeof column.header === 'function'
          ? column.header({ column, isSorted: false })
          : column.header}
      </div>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => onSort(column.id)}
      className={`group h-auto -ml-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer select-none ${
        isSorted ? 'text-foreground font-bold' : ''
      } ${column.align === 'right' ? 'ml-auto' : column.align === 'center' ? 'mx-auto' : ''}`}
      aria-label={`Sort by ${typeof column.header === 'string' ? column.header : column.id}`}
    >
      <span>
        {typeof column.header === 'function'
          ? column.header({ column, isSorted })
          : column.header}
      </span>
      <span className="flex items-center">
        {isSorted === 'asc' ? (
          <ArrowUp className="w-3.5 h-3.5 text-[#E8B931] stroke-[2.5]" />
        ) : isSorted === 'desc' ? (
          <ArrowDown className="w-3.5 h-3.5 text-[#E8B931] stroke-[2.5]" />
        ) : (
          <ArrowUpDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
        )}
      </span>
    </Button>
  )
}
