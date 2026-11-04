import { useState, useMemo, useCallback } from 'react'
import type {
  ColumnDef,
  FilterConfig,
  SortState,
  TableDensity,
} from './types'

export interface UseDataTableOptions<T> {
  data: T[]
  columns: ColumnDef<T>[]
  keyField?: keyof T | ((row: T) => string | number)
  filters?: FilterConfig<T>[]
  defaultPageSize?: number
}

export function useDataTable<T>({
  data,
  columns,
  keyField,
  filters = [],
  defaultPageSize = 30,
}: UseDataTableOptions<T>) {
  // 1. Search Query State
  const [searchQuery, setSearchQuery] = useState('')

  // 2. Active Filters State
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  // 3. Sorting State
  const [sortState, setSortState] = useState<SortState | null>(null)

  // 4. Pagination State (Default 30)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  // 5. Density State ('compact' | 'normal' | 'relaxed')
  const [density, setDensity] = useState<TableDensity>('normal')

  // 6. Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 7. Row Selection State
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(new Set())

  // 8. Column Visibility State (Settled defaults)
  const defaultVisibleColumnIds = useMemo(() => {
    return new Set(
      columns
        .filter((col) => col.defaultVisible !== false)
        .map((col) => col.id)
    )
  }, [columns])

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(defaultVisibleColumnIds)

  // Helper to extract unique ID for a row
  const getRowId = useCallback(
    (row: T, index: number): string | number => {
      if (typeof keyField === 'function') {
        return keyField(row)
      }
      if (keyField && row[keyField] !== undefined) {
        return row[keyField] as unknown as string | number
      }
      const anyRow = row as Record<string, unknown>
      if (typeof anyRow.id === 'string' || typeof anyRow.id === 'number') return anyRow.id
      if (typeof anyRow._id === 'string' || typeof anyRow._id === 'number') return anyRow._id
      return index
    },
    [keyField]
  )

  // Cycle Density: normal -> relaxed -> compact -> normal
  const cycleDensity = useCallback(() => {
    setDensity((prev) => {
      if (prev === 'normal') return 'relaxed'
      if (prev === 'relaxed') return 'compact'
      return 'normal'
    })
  }, [])

  // Toggle Column Visibility
  const toggleColumn = useCallback((columnId: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev)
      if (next.has(columnId)) {
        // Prevent hiding the very last column
        if (next.size > 1) {
          next.delete(columnId)
        }
      } else {
        next.add(columnId)
      }
      return next
    })
  }, [])

  const resetColumns = useCallback(() => {
    setVisibleColumns(new Set(defaultVisibleColumnIds))
  }, [defaultVisibleColumnIds])

  // Sorting Handler: null -> asc -> desc -> null
  const handleSort = useCallback((columnId: string) => {
    setSortState((prev) => {
      if (!prev || prev.columnId !== columnId) {
        return { columnId, direction: 'asc' }
      }
      if (prev.direction === 'asc') {
        return { columnId, direction: 'desc' }
      }
      return null
    })
  }, [])

  // Filter change handler
  const handleFilterChange = useCallback((filterId: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }))
    setCurrentPage(1)
  }, [])

  const clearAllFilters = useCallback(() => {
    setSearchQuery('')
    setActiveFilters({})
    setCurrentPage(1)
  }, [])

  // Row Selection Handlers
  const toggleRow = useCallback((rowId: string | number) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev)
      if (next.has(rowId)) {
        next.delete(rowId)
      } else {
        next.add(rowId)
      }
      return next
    })
  }, [])

  // 9. Pipeline: Search + Filters
  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      const searchableColumns = columns.filter((col) => col.searchable !== false)

      result = result.filter((row) => {
        return searchableColumns.some((col) => {
          let cellValue = ''
          if (col.accessorFn) {
            cellValue = String(col.accessorFn(row) ?? '')
          } else if (col.accessorKey) {
            cellValue = String(row[col.accessorKey] ?? '')
          }
          return cellValue.toLowerCase().includes(query)
        })
      })
    }

    // Apply Filters
    if (filters.length > 0) {
      result = result.filter((row) => {
        return filters.every((filter) => {
          const activeVal = activeFilters[filter.id]
          if (!activeVal || activeVal === 'all') return true

          let rowVal: unknown = ''
          if (filter.accessorFn) {
            rowVal = filter.accessorFn(row)
          } else if (filter.accessorKey) {
            rowVal = row[filter.accessorKey]
          }
          return String(rowVal).toLowerCase() === String(activeVal).toLowerCase()
        })
      })
    }

    return result
  }, [data, columns, filters, searchQuery, activeFilters])

  // 10. Pipeline: Sort
  const sortedData = useMemo(() => {
    if (!sortState) return filteredData

    const column = columns.find((c) => c.id === sortState.columnId)
    if (!column) return filteredData

    return [...filteredData].sort((a, b) => {
      let aVal = column.accessorFn ? column.accessorFn(a) : column.accessorKey ? a[column.accessorKey] : ''
      let bVal = column.accessorFn ? column.accessorFn(b) : column.accessorKey ? b[column.accessorKey] : ''

      if (aVal === null || aVal === undefined) aVal = ''
      if (bVal === null || bVal === undefined) bVal = ''

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortState.direction === 'asc' ? aVal - bVal : bVal - aVal
      }

      const strA = String(aVal).toLowerCase()
      const strB = String(bVal).toLowerCase()

      if (strA < strB) return sortState.direction === 'asc' ? -1 : 1
      if (strA > strB) return sortState.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortState, columns])

  // 11. Pipeline: Pagination
  const totalItems = sortedData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  // Ensure current page is valid when data changes
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  const paginatedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, safeCurrentPage, pageSize])

  // Master Checkbox Status for visible page
  const pageRowIds = useMemo(() => {
    return paginatedData.map((row, idx) => getRowId(row, (safeCurrentPage - 1) * pageSize + idx))
  }, [paginatedData, safeCurrentPage, pageSize, getRowId])

  const isAllPageRowsSelected = useMemo(() => {
    if (pageRowIds.length === 0) return false
    return pageRowIds.every((id) => selectedRowIds.has(id))
  }, [pageRowIds, selectedRowIds])

  const isSomePageRowsSelected = useMemo(() => {
    if (pageRowIds.length === 0) return false
    const some = pageRowIds.some((id) => selectedRowIds.has(id))
    return some && !isAllPageRowsSelected
  }, [pageRowIds, selectedRowIds, isAllPageRowsSelected])

  const toggleAllPageRows = useCallback(() => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev)
      if (isAllPageRowsSelected) {
        pageRowIds.forEach((id) => next.delete(id))
      } else {
        pageRowIds.forEach((id) => next.add(id))
      }
      return next
    })
  }, [isAllPageRowsSelected, pageRowIds])

  const clearSelection = useCallback(() => {
    setSelectedRowIds(new Set())
  }, [])

  return {
    searchQuery,
    setSearchQuery,
    activeFilters,
    handleFilterChange,
    clearAllFilters,
    sortState,
    handleSort,
    currentPage: safeCurrentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    density,
    cycleDensity,
    isFullscreen,
    setIsFullscreen,
    toggleFullscreen: () => setIsFullscreen((prev) => !prev),
    visibleColumns,
    toggleColumn,
    resetColumns,
    selectedRowIds,
    setSelectedRowIds,
    toggleRow,
    toggleAllPageRows,
    clearSelection,
    isAllPageRowsSelected,
    isSomePageRowsSelected,
    getRowId,
    totalItems,
    filteredData,
    sortedData,
    paginatedData,
  }
}
