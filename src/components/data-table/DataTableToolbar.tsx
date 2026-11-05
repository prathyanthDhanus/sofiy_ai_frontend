import {
  Search,
  X,
  Maximize2,
  Minimize2,
  Filter,
  Rows3,
  Rows4,
  AlignJustify,
  FileSpreadsheet,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnVisibility } from './DataTableColumnVisibility'
import type { ColumnDef, FilterConfig, TableDensity } from './types'
import { cn } from '@/lib/utils'

export interface DataTableToolbarProps<T> {
  searchQuery: string
  onSearchChange: (query: string) => void
  searchPlaceholder?: string
  filters?: FilterConfig<T>[]
  activeFilters: Record<string, string[]> | Record<string, string>
  onFilterChange: (filterId: string, value: string | string[]) => void
  onToggleFilterValue?: (filterId: string, value: string) => void
  onClearFilter?: (filterId: string) => void
  onClearFilters: () => void
  columns: ColumnDef<T>[]
  visibleColumns: Set<string>
  onToggleColumn: (columnId: string) => void
  onResetColumns: () => void
  density: TableDensity
  onCycleDensity: () => void
  isFullscreen: boolean
  onToggleFullscreen: () => void
  totalCount: number
  filteredCount: number
  enableExportExcel?: boolean
  onExportExcel?: () => void
}

export function DataTableToolbar<T>({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filters = [],
  activeFilters,
  onFilterChange,
  onToggleFilterValue,
  onClearFilter,
  onClearFilters,
  columns,
  visibleColumns,
  onToggleColumn,
  onResetColumns,
  density,
  onCycleDensity,
  isFullscreen,
  onToggleFullscreen,
  totalCount,
  filteredCount,
  enableExportExcel = false,
  onExportExcel,
}: DataTableToolbarProps<T>) {
  const hasActiveFilters =
    Boolean(searchQuery) ||
    Object.values(activeFilters).some((val) => {
      if (!val) return false
      if (Array.isArray(val)) return val.length > 0 && !val.every((v) => v === 'all')
      return val !== 'all'
    })

  const getDensityIcon = () => {
    switch (density) {
      case 'compact':
        return <AlignJustify className="w-3.5 h-3.5 text-muted-foreground" />
      case 'normal':
        return <Rows3 className="w-3.5 h-3.5 text-[#E8B931]" />
      case 'relaxed':
        return <Rows4 className="w-3.5 h-3.5 text-blue-400" />
    }
  }

  const getDensityLabel = () => {
    switch (density) {
      case 'compact':
        return 'Compact (tight padding)'
      case 'normal':
        return 'Normal (standard padding)'
      case 'relaxed':
        return 'Relaxed (spacious padding)'
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="p-4 border-b border-border bg-card/80 space-y-3">
        {/* Main Bar: Top Left Search + Filters + Top Right Utility Icons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Top Left: Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9 pr-8 h-9 text-xs rounded-xl bg-background border-border placeholder:text-muted-foreground/70 focus-visible:ring-[#E8B931]"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onSearchChange('')}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer rounded-md p-0"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            {/* Multi-Select Filter Dropdowns */}
            {filters.map((filter) => {
              const rawValues = activeFilters[filter.id]
              const currentValues = Array.isArray(rawValues)
                ? rawValues.filter((v) => v && v !== 'all')
                : rawValues && rawValues !== 'all'
                ? [rawValues]
                : []
              const hasSelected = currentValues.length > 0

              return (
                <DropdownMenu key={filter.id}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        'h-9 px-3 gap-1.5 rounded-xl border-border bg-card hover:bg-muted/60 text-xs font-medium cursor-pointer shadow-xs transition-colors',
                        hasSelected ? 'border-[#E8B931]/60 text-foreground bg-muted/40 font-semibold' : ''
                      )}
                      aria-label={`Filter by ${filter.title}`}
                    >
                      <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>{filter.title}</span>
                      {hasSelected ? (
                        <Badge
                          variant="secondary"
                          className="ml-1 h-4.5 min-w-4.5 px-1.5 rounded-md bg-[#E8B931] text-zinc-950 font-bold text-[10px]"
                        >
                          {currentValues.length}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground ml-0.5">All</span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    className="w-56 p-2 border-border bg-card shadow-xl space-y-1"
                  >
                    <div className="flex items-center justify-between px-2 py-1">
                      <DropdownMenuLabel className="p-0 text-xs font-bold text-foreground">
                        {filter.title}
                      </DropdownMenuLabel>
                      {hasSelected && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (onClearFilter) {
                              onClearFilter(filter.id)
                            } else {
                              onFilterChange(filter.id, 'all')
                            }
                          }}
                          className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          Reset
                        </Button>
                      )}
                    </div>

                    <DropdownMenuSeparator />

                    <div className="max-h-60 overflow-y-auto space-y-0.5 py-1">
                      {filter.options.map((opt) => {
                        const isChecked = currentValues.includes(opt.value)

                        return (
                          <DropdownMenuCheckboxItem
                            key={opt.value}
                            checked={isChecked}
                            onSelect={(e) => {
                              e.preventDefault()
                              if (onToggleFilterValue) {
                                onToggleFilterValue(filter.id, opt.value)
                              } else {
                                const next = isChecked
                                  ? currentValues.filter((v) => v !== opt.value)
                                  : [...currentValues, opt.value]
                                onFilterChange(filter.id, next.length > 0 ? next : 'all')
                              }
                            }}
                            className="text-xs cursor-pointer py-1.5 rounded-lg flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {opt.icon && <opt.icon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />}
                              <span className="truncate">{opt.label}</span>
                            </div>
                            {typeof opt.count === 'number' && (
                              <span className="ml-auto text-[10px] text-muted-foreground font-mono">
                                ({opt.count})
                              </span>
                            )}
                          </DropdownMenuCheckboxItem>
                        )
                      })}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            })}

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-9 px-2.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 cursor-pointer"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Reset filters
              </Button>
            )}
          </div>

          {/* Top Right Controls: Download Excel (optional), Column Visibility, Density Toggle, Fullscreen Toggle */}
          <div className="flex items-center gap-2 self-end lg:self-center">
            {/* Optional Download Excel Button */}
            {(enableExportExcel || Boolean(onExportExcel)) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onExportExcel}
                    className="h-9 gap-1.5 px-3 rounded-xl border-border bg-card hover:bg-muted/60 text-xs font-medium cursor-pointer shadow-xs text-foreground hover:text-emerald-500 hover:border-emerald-500/40 transition-colors"
                    aria-label="Download Excel spreadsheet"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="hidden sm:inline">Export Excel</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Download records as Excel spreadsheet (.xlsx / .csv)
                </TooltipContent>
              </Tooltip>
            )}

            {/* 1. Column Visibility Dropdown */}
            <DataTableColumnVisibility
              columns={columns}
              visibleColumns={visibleColumns}
              onToggleColumn={onToggleColumn}
              onResetColumns={onResetColumns}
            />

            {/* 2. Cell Density / Padding Toggle Icon */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onCycleDensity}
                  className="h-9 w-9 rounded-xl border-border bg-card hover:bg-muted/60 cursor-pointer shadow-xs"
                  aria-label="Toggle table cell density"
                >
                  {getDensityIcon()}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Density: {getDensityLabel()} (Click to toggle)
              </TooltipContent>
            </Tooltip>

            {/* 3. Full-Size View Toggle Icon */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isFullscreen ? 'default' : 'outline'}
                  size="icon"
                  onClick={onToggleFullscreen}
                  className={`h-9 w-9 rounded-xl border-border cursor-pointer shadow-xs transition-colors ${
                    isFullscreen
                      ? 'bg-[#E8B931] hover:bg-[#D8A721] text-zinc-950 font-bold border-[#E8B931]'
                      : 'bg-card hover:bg-muted/60 text-foreground'
                  }`}
                  aria-label={isFullscreen ? 'Exit full-size view' : 'View table in full-size'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {isFullscreen
                  ? 'Exit full size view (Esc)'
                  : 'View table in full size (without sidebar & navbar)'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Filter Values Active Chips Row */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Active Filters:
            </span>

            {searchQuery && (
              <Badge
                variant="secondary"
                className="gap-1.5 pl-2.5 pr-1 py-0.5 rounded-lg text-xs bg-muted/80 text-foreground border border-border"
              >
                <span>Query: &ldquo;{searchQuery}&rdquo;</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onSearchChange('')}
                  className="h-4 w-4 p-0 text-muted-foreground hover:text-destructive cursor-pointer hover:bg-transparent"
                  aria-label="Remove search filter"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}

            {Object.entries(activeFilters).flatMap(([key, rawVal]) => {
              if (!rawVal) return []
              const values = Array.isArray(rawVal) ? rawVal : [rawVal]
              const config = filters.find((f) => f.id === key)

              return values
                .filter((val) => val && val !== 'all')
                .map((val) => {
                  const opt = config?.options.find((o) => o.value === val)
                  const displayVal = opt ? opt.label : val

                  return (
                    <Badge
                      key={`${key}-${val}`}
                      variant="secondary"
                      className="gap-1.5 pl-2.5 pr-1 py-0.5 rounded-lg text-xs bg-muted/80 text-foreground border border-border"
                    >
                      <span className="text-muted-foreground">{config?.title || key}:</span>
                      <span className="font-semibold text-[#E8B931]">{displayVal}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (onToggleFilterValue) {
                            onToggleFilterValue(key, val)
                          } else {
                            const remaining = values.filter((v) => v !== val)
                            onFilterChange(key, remaining.length > 0 ? remaining : 'all')
                          }
                        }}
                        className="h-4 w-4 p-0 text-muted-foreground hover:text-destructive cursor-pointer hover:bg-transparent"
                        aria-label={`Remove ${key} ${displayVal} filter`}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )
                })
            })}

            <span className="ml-auto text-[11px] text-muted-foreground">
              Found <strong className="text-foreground">{filteredCount}</strong> of{' '}
              <strong className="text-foreground">{totalCount}</strong> records
            </span>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
