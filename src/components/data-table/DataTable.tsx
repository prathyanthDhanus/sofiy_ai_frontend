import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { DataTableToolbar } from './DataTableToolbar'
import { DataTablePagination } from './DataTablePagination'
import { DataTableColumnHeader } from './DataTableColumnHeader'
import { DataTableRowActions } from './DataTableRowActions'
import { DataTableFullscreenWrapper } from './DataTableFullscreenWrapper'
import { CopyableCell } from './CopyableCell'
import { useDataTable } from './useDataTable'
import type { DataTableProps, DeleteModalConfig, TableDensity } from './types'
import { Loader2, Inbox, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DataTable<T>({
  data,
  columns,
  keyField,
  title,
  description,
  enableRowSelection = true,
  selectedRows,
  onSelectedRowsChange,
  searchPlaceholder = 'Search records...',
  filters = [],
  defaultPageSize = 30,
  pageSizeOptions = [30, 50, 70, 100],
  onView,
  onEdit,
  onDelete,
  deleteModalConfig,
  customActions,
  actionsColumnTitle = 'Actions',
  showActionsColumn = true,
  isLoading = false,
  emptyMessage,
  className = '',
  bulkActions,
}: DataTableProps<T>) {
  const table = useDataTable<T>({
    data,
    columns,
    keyField,
    filters,
    defaultPageSize,
  })

  // Sync external selected rows if controlled
  const activeSelectedRowIds = selectedRows ?? table.selectedRowIds
  const handleToggleRow = (id: string | number) => {
    if (onSelectedRowsChange) {
      const next = new Set(activeSelectedRowIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      onSelectedRowsChange(next)
    } else {
      table.toggleRow(id)
    }
  }

  const handleToggleAllPage = () => {
    if (onSelectedRowsChange) {
      const next = new Set(activeSelectedRowIds)
      const allSelected = table.isAllPageRowsSelected
      // calculate current page ids
      table.paginatedData.forEach((row, idx) => {
        const id = table.getRowId(row, idx)
        if (allSelected) {
          next.delete(id)
        } else {
          next.add(id)
        }
      })
      onSelectedRowsChange(next)
    } else {
      table.toggleAllPageRows()
    }
  }

  // Delete Confirmation Modal State
  const [deleteTargetRow, setDeleteTargetRow] = useState<T | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteTrigger = (row: T) => {
    setDeleteTargetRow(row)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTargetRow || !onDelete) return
    try {
      setIsDeleting(true)
      await onDelete(deleteTargetRow)
      setDeleteTargetRow(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const resolvedDeleteModalConfig: DeleteModalConfig = deleteTargetRow && deleteModalConfig
    ? deleteModalConfig(deleteTargetRow)
    : {
        title: 'Delete Confirmation',
        description: 'Are you sure you want to delete this record? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      }

  // Cell padding classes based on density
  const getCellPaddingClass = (density: TableDensity) => {
    switch (density) {
      case 'compact':
        return 'py-1.5 px-3 text-xs'
      case 'normal':
        return 'py-3 px-4 text-xs sm:text-sm'
      case 'relaxed':
        return 'py-4 px-5 text-sm'
    }
  }

  const cellPaddingClass = getCellPaddingClass(table.density)

  // Filter columns by visibility
  const displayedColumns = columns.filter((col) => table.visibleColumns.has(col.id))

  // Has actions
  const hasActions =
    showActionsColumn &&
    (Boolean(onView) || Boolean(onEdit) || Boolean(onDelete) || Boolean(customActions))

  return (
    <DataTableFullscreenWrapper
      isFullscreen={table.isFullscreen}
      onToggleFullscreen={table.toggleFullscreen}
    >
      <div
        className={`w-full rounded-2xl border border-border bg-card shadow-sm flex flex-col overflow-hidden transition-all duration-200 ${
          table.isFullscreen ? 'h-full flex-1' : ''
        } ${className}`}
      >
        {/* Optional Table Header Title Bar */}
        {(title || description) && (
          <div className="p-4 sm:p-5 border-b border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              {title && (
                <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {description}
                </p>
              )}
            </div>

            {table.isFullscreen && (
              <Button
                variant="outline"
                size="sm"
                onClick={table.toggleFullscreen}
                className="h-8 px-3 rounded-xl border-border text-xs gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <span>Exit Fullscreen</span>
                <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground font-mono">
                  Esc
                </kbd>
              </Button>
            )}
          </div>
        )}

        {/* Top Bar: Search, Filters, Column Visibility, Density Toggle, Fullscreen Toggle */}
        <DataTableToolbar
          searchQuery={table.searchQuery}
          onSearchChange={table.setSearchQuery}
          searchPlaceholder={searchPlaceholder}
          filters={filters}
          activeFilters={table.activeFilters}
          onFilterChange={table.handleFilterChange}
          onClearFilters={table.clearAllFilters}
          columns={columns}
          visibleColumns={table.visibleColumns}
          onToggleColumn={table.toggleColumn}
          onResetColumns={table.resetColumns}
          density={table.density}
          onCycleDensity={table.cycleDensity}
          isFullscreen={table.isFullscreen}
          onToggleFullscreen={table.toggleFullscreen}
          totalCount={data.length}
          filteredCount={table.totalItems}
        />

        {/* Selected Rows Bulk Action Banner */}
        {enableRowSelection && activeSelectedRowIds.size > 0 && (
          <div className="px-4 py-2 bg-[#E8B931]/10 border-b border-[#E8B931]/20 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8B931] text-zinc-950 font-bold text-[11px]">
                {activeSelectedRowIds.size}
              </span>
              <span>
                {activeSelectedRowIds.size === 1
                  ? '1 row selected'
                  : `${activeSelectedRowIds.size} rows selected`}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={table.clearSelection}
                className="h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground underline ml-2 cursor-pointer flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear selection
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {bulkActions ? (
                bulkActions(
                  Array.from(activeSelectedRowIds),
                  data.filter((row, idx) =>
                    activeSelectedRowIds.has(table.getRowId(row, idx))
                  )
                )
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (onDelete) {
                      // Bulk delete trigger
                    }
                  }}
                  className="h-7 text-xs rounded-lg gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected</span>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Table Viewport Container */}
        <div className="relative w-full flex-1 overflow-x-auto min-h-[300px]">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/60 backdrop-blur-xs">
              <Loader2 className="w-8 h-8 animate-spin text-[#E8B931]" />
              <span className="text-xs font-semibold text-muted-foreground mt-2">
                Loading records...
              </span>
            </div>
          )}

          <Table className="w-full caption-bottom text-left">
            <TableHeader className="bg-muted/40 border-b border-border sticky top-0 z-10 backdrop-blur-xs">
              <TableRow className="hover:bg-transparent">
                {/* Master Row Checkbox Column */}
                {enableRowSelection && (
                  <TableHead className="w-12 px-4 py-3 text-center align-middle">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={
                          table.isAllPageRowsSelected
                            ? true
                            : table.isSomePageRowsSelected
                            ? 'indeterminate'
                            : false
                        }
                        onCheckedChange={handleToggleAllPage}
                        aria-label="Select all rows on page"
                        className="cursor-pointer"
                      />
                    </div>
                  </TableHead>
                )}

                {/* Visible Data Columns */}
                {displayedColumns.map((col) => (
                  <TableHead
                    key={col.id}
                    className={`${cellPaddingClass} font-semibold text-muted-foreground align-middle ${
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    } ${col.className || ''}`}
                  >
                    <DataTableColumnHeader
                      column={col}
                      sortState={table.sortState}
                      onSort={table.handleSort}
                    />
                  </TableHead>
                ))}

                {/* Last Actions Column Header */}
                {hasActions && (
                  <TableHead className={`w-28 ${cellPaddingClass} text-right font-semibold text-xs tracking-wider uppercase text-muted-foreground align-middle`}>
                    {actionsColumnTitle}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-border">
              {table.paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      displayedColumns.length +
                      (enableRowSelection ? 1 : 0) +
                      (hasActions ? 1 : 0)
                    }
                    className="h-64 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Inbox className="w-10 h-10 opacity-30 stroke-1" />
                      <div className="text-sm font-semibold text-foreground">
                        No records found
                      </div>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        {emptyMessage ||
                          (table.searchQuery || Object.keys(table.activeFilters).length > 0
                            ? 'Try clearing your search query or reset active filters.'
                            : 'There is currently no data to display.')}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                table.paginatedData.map((row, idx) => {
                  const globalIdx = (table.currentPage - 1) * table.pageSize + idx
                  const rowId = table.getRowId(row, globalIdx)
                  const isSelected = activeSelectedRowIds.has(rowId)

                  return (
                    <TableRow
                      key={String(rowId)}
                      data-state={isSelected ? 'selected' : undefined}
                      className={`group transition-colors ${
                        isSelected
                          ? 'bg-[#E8B931]/10 hover:bg-[#E8B931]/15'
                          : 'hover:bg-muted/40'
                      }`}
                    >
                      {/* Row Checkbox */}
                      {enableRowSelection && (
                        <TableCell className="w-12 px-4 py-3 text-center align-middle">
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleToggleRow(rowId)}
                              aria-label={`Select row ${globalIdx + 1}`}
                              className="cursor-pointer"
                            />
                          </div>
                        </TableCell>
                      )}

                      {/* Data Cells */}
                      {displayedColumns.map((col) => {
                        const rawVal = col.accessorFn
                          ? col.accessorFn(row)
                          : col.accessorKey
                          ? row[col.accessorKey]
                          : undefined

                        const renderedCell = (() => {
                          if (col.cell) {
                            return col.cell({ row, value: rawVal, index: globalIdx })
                          }
                          if (
                            col.copyable ||
                            col.type === 'id' ||
                            col.type === 'email' ||
                            col.type === 'mobile'
                          ) {
                            return (
                              <CopyableCell
                                value={rawVal !== undefined && rawVal !== null ? String(rawVal) : ''}
                                type={col.type || 'text'}
                                label={typeof col.header === 'string' ? col.header : col.id}
                              />
                            )
                          }
                          if (rawVal !== undefined && rawVal !== null) {
                            return String(rawVal)
                          }
                          return <span className="text-muted-foreground/60">—</span>
                        })()

                        return (
                          <TableCell
                            key={col.id}
                            className={`${cellPaddingClass} align-middle ${
                              col.align === 'right'
                                ? 'text-right'
                                : col.align === 'center'
                                ? 'text-center'
                                : 'text-left'
                            } ${col.className || ''}`}
                          >
                            {renderedCell}
                          </TableCell>
                        )
                      })}

                      {/* Action Column */}
                      {hasActions && (
                        <TableCell className={`${cellPaddingClass} text-right align-middle`}>
                          <DataTableRowActions<T>
                            row={row}
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete ? () => handleDeleteTrigger(row) : undefined}
                            customActions={customActions}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Bottom Pagination Bar: Left (Page size), Center (Pagination), Right (Total/Index) */}
        <DataTablePagination
          currentPage={table.currentPage}
          pageSize={table.pageSize}
          totalItems={table.totalItems}
          pageSizeOptions={pageSizeOptions}
          onPageChange={table.setCurrentPage}
          onPageSizeChange={table.setPageSize}
        />

        {/* Reusable Delete Confirmation Modal */}
        <ConfirmDialog
          open={Boolean(deleteTargetRow)}
          onOpenChange={(open) => {
            if (!open) setDeleteTargetRow(null)
          }}
          title={resolvedDeleteModalConfig.title}
          description={resolvedDeleteModalConfig.description}
          itemName={resolvedDeleteModalConfig.itemName}
          confirmText={resolvedDeleteModalConfig.confirmText || 'Delete'}
          cancelText={resolvedDeleteModalConfig.cancelText || 'Cancel'}
          variant="destructive"
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </DataTableFullscreenWrapper>
  )
}
