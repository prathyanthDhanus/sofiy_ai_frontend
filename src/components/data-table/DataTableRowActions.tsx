import { Eye, Edit3, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { RowAction } from './types'

export interface DataTableRowActionsProps<T> {
  row: T
  onView?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  customActions?: (row: T) => RowAction<T>[]
}

export function DataTableRowActions<T>({
  row,
  onView,
  onEdit,
  onDelete,
  customActions,
}: DataTableRowActionsProps<T>) {
  const custom = customActions ? customActions(row) : []

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center justify-end gap-1">
        {/* Custom Actions */}
        {custom.map((action) => {
          if (action.hidden && action.hidden(row)) return null

          const btn = (
            <Button
              key={action.id}
              variant={action.variant || 'ghost'}
              size="icon"
              disabled={action.disabled}
              onClick={(e) => {
                e.stopPropagation()
                action.onClick(row)
              }}
              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 cursor-pointer"
              aria-label={action.label}
            >
              {action.icon}
            </Button>
          )

          if (!action.tooltip && !action.label) return btn

          return (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>{btn}</TooltipTrigger>
              <TooltipContent side="top" className="text-xs bg-popover text-popover-foreground border border-border shadow-md">
                {action.tooltip || action.label}
              </TooltipContent>
            </Tooltip>
          )
        })}

        {/* View Action */}
        {onView && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onView(row)
                }}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 cursor-pointer"
                aria-label="View details"
              >
                <Eye className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs bg-popover text-popover-foreground border border-border shadow-md">
              View details
            </TooltipContent>
          </Tooltip>
        )}

        {/* Edit Action */}
        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(row)
                }}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-[#E8B931] hover:bg-[#E8B931]/10 cursor-pointer"
                aria-label="Edit record"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs bg-popover text-popover-foreground border border-border shadow-md">
              Edit record
            </TooltipContent>
          </Tooltip>
        )}

        {/* Delete Action */}
        {onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(row)
                }}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                aria-label="Delete record"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs bg-popover text-destructive border border-border shadow-md">
              Delete record
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
