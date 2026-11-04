import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface DataTablePaginationProps {
  currentPage: number
  pageSize: number
  totalItems: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  pageSizeOptions = [30, 50, 70, 100],
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  // Start and end indices for display
  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems)

  // Generate pagination items array with ellipsis
  const getPageNumbers = () => {
    const delta = 1
    const range: (number | string)[] = []

    for (
      let i = Math.max(2, safeCurrentPage - delta);
      i <= Math.min(totalPages - 1, safeCurrentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (safeCurrentPage - delta > 2) {
      range.unshift('...')
    }
    if (safeCurrentPage + delta < totalPages - 1) {
      range.push('...')
    }

    range.unshift(1)
    if (totalPages > 1) {
      range.push(totalPages)
    }

    return range
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-t border-border bg-card/60 rounded-b-2xl">
      {/* Left: Page Size Selector */}
      <div className="flex items-center gap-2.5 text-xs text-muted-foreground order-2 md:order-1">
        <span className="font-medium whitespace-nowrap">Rows per page:</span>
        <Select
          value={String(pageSize)}
          onValueChange={(val) => {
            onPageSizeChange(Number(val))
          }}
        >
          <SelectTrigger className="h-8 w-[72px] rounded-lg text-xs font-semibold border-border bg-card">
            <SelectValue placeholder={String(pageSize)} />
          </SelectTrigger>
          <SelectContent side="top" className="border-border bg-card">
            {pageSizeOptions.map((opt) => (
              <SelectItem
                key={opt}
                value={String(opt)}
                className="text-xs cursor-pointer"
              >
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Center: Pagination Controls */}
      <div className="flex items-center gap-1 order-1 md:order-2">
        {/* First Page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={safeCurrentPage <= 1}
          className="h-8 w-8 rounded-lg border-border hover:bg-muted text-muted-foreground disabled:opacity-40 cursor-pointer"
          aria-label="First page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
          className="h-8 w-8 rounded-lg border-border hover:bg-muted text-muted-foreground disabled:opacity-40 cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button>

        {/* Numeric Page Buttons */}
        <div className="flex items-center gap-1 mx-1">
          {pageNumbers.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1.5 text-xs text-muted-foreground select-none"
                >
                  •••
                </span>
              )
            }

            const pageNum = p as number
            const isActive = pageNum === safeCurrentPage

            return (
              <Button
                key={`page-${pageNum}`}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[#E8B931] hover:bg-[#D8A721] text-zinc-950 font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </Button>
            )
          })}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= totalPages}
          className="h-8 w-8 rounded-lg border-border hover:bg-muted text-muted-foreground disabled:opacity-40 cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={safeCurrentPage >= totalPages}
          className="h-8 w-8 rounded-lg border-border hover:bg-muted text-muted-foreground disabled:opacity-40 cursor-pointer"
          aria-label="Last page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Right: Total and Current Showing Index Range */}
      <div className="text-xs text-muted-foreground order-3 text-right">
        {totalItems === 0 ? (
          <span>Showing <strong className="text-foreground">0</strong> of <strong className="text-foreground">0</strong> entries</span>
        ) : (
          <span>
            Showing <strong className="text-foreground font-semibold">{startItem}</strong> to{' '}
            <strong className="text-foreground font-semibold">{endItem}</strong> of{' '}
            <strong className="text-foreground font-semibold">{totalItems}</strong> entries
          </span>
        )}
      </div>
    </div>
  )
}
