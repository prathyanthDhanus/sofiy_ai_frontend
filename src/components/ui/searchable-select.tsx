import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { ChevronDown, Search, Check, X } from 'lucide-react'
import { DotLoader } from '@/components/loader/Index'
import { cn } from 'cn'

export interface SearchableSelectOption {
  value: string
  label: string
  subLabel?: string
  badge?: string
  disabled?: boolean
  [key: string]: unknown
}

export interface FetchOptionsParams {
  query: string
  page: number
  pageSize: number
  signal?: AbortSignal
}

export interface FetchOptionsResult {
  options: SearchableSelectOption[]
  hasMore: boolean
  total?: number
}

export interface SearchableSelectProps {
  id?: string
  name?: string
  value?: string
  onChange?: (value: string, selectedOption?: SearchableSelectOption) => void
  options?: SearchableSelectOption[]
  fetchOptions?: (params: FetchOptionsParams) => Promise<FetchOptionsResult>
  placeholder?: string
  searchPlaceholder?: string
  pageSize?: number
  debounceMs?: number
  disabled?: boolean
  className?: string
  triggerClassName?: string
  dropdownClassName?: string
  error?: boolean
  'aria-invalid'?: boolean
  renderOption?: (option: SearchableSelectOption, isSelected: boolean) => React.ReactNode
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  name,
  value,
  onChange,
  options: staticOptions,
  fetchOptions,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  pageSize = 20,
  debounceMs = 300,
  disabled = false,
  className,
  triggerClassName,
  dropdownClassName,
  error,
  'aria-invalid': ariaInvalid,
  renderOption,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [displayedOptions, setDisplayedOptions] = useState<SearchableSelectOption[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [selectedItemCache, setSelectedItemCache] = useState<SearchableSelectOption | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const isAsync = typeof fetchOptions === 'function'

  // Update selected item cache when static options change or value changes
  useEffect(() => {
    if (!value) {
      setSelectedItemCache(null)
      return
    }

    if (staticOptions) {
      const match = staticOptions.find((opt) => opt.value === value)
      if (match) {
        setSelectedItemCache(match)
        return
      }
    }

    // Check displayed options
    const matchDisplayed = displayedOptions.find((opt) => opt.value === value)
    if (matchDisplayed) {
      setSelectedItemCache(matchDisplayed)
    }
  }, [value, staticOptions, displayedOptions])

  // Filter static options locally if in static mode
  const filterStaticOptions = useCallback(
    (query: string, pageNum: number) => {
      if (!staticOptions) return { options: [], hasMore: false }
      const clean = query.trim().toLowerCase()
      const filtered = clean
        ? staticOptions.filter(
            (opt) =>
              opt.label.toLowerCase().includes(clean) ||
              (opt.subLabel && opt.subLabel.toLowerCase().includes(clean)) ||
              (opt.badge && opt.badge.toLowerCase().includes(clean))
          )
        : staticOptions

      const start = 0
      const end = pageNum * pageSize
      const slice = filtered.slice(start, end)
      const more = end < filtered.length

      return { options: slice, hasMore: more }
    },
    [staticOptions, pageSize]
  )

  // Fetch or filter data (Page 1) when query changes or dropdown opens
  const loadInitialData = useCallback(
    async (query: string) => {
      if (isAsync && fetchOptions) {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        const controller = new AbortController()
        abortControllerRef.current = controller

        setIsLoading(true)
        setPage(1)

        try {
          const res = await fetchOptions({
            query,
            page: 1,
            pageSize,
            signal: controller.signal,
          })
          setDisplayedOptions(res.options)
          setHasMore(res.hasMore)
        } catch (err: unknown) {
          if (err instanceof Error && err.name === 'AbortError') {
            return
          }
          console.error('Failed to fetch dropdown options:', err)
          setDisplayedOptions([])
          setHasMore(false)
        } finally {
          setIsLoading(false)
        }
      } else {
        // Static mode
        setIsLoading(true)
        setPage(1)
        const { options: chunk, hasMore: more } = filterStaticOptions(query, 1)
        setDisplayedOptions(chunk)
        setHasMore(more)
        setIsLoading(false)
      }
    },
    [isAsync, fetchOptions, pageSize, filterStaticOptions]
  )

  // Load next page on scroll
  const loadNextPage = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore) return

    const nextPage = page + 1

    if (isAsync && fetchOptions) {
      setIsLoadingMore(true)
      try {
        const res = await fetchOptions({
          query: searchQuery,
          page: nextPage,
          pageSize,
        })
        setDisplayedOptions((prev) => [...prev, ...res.options])
        setHasMore(res.hasMore)
        setPage(nextPage)
      } catch (err) {
        console.error('Failed to load next page options:', err)
      } finally {
        setIsLoadingMore(false)
      }
    } else {
      // Static mode
      setIsLoadingMore(true)
      const { options: chunk, hasMore: more } = filterStaticOptions(searchQuery, nextPage)
      setDisplayedOptions(chunk)
      setHasMore(more)
      setPage(nextPage)
      setIsLoadingMore(false)
    }
  }, [
    isLoading,
    isLoadingMore,
    hasMore,
    page,
    isAsync,
    fetchOptions,
    searchQuery,
    pageSize,
    filterStaticOptions,
  ])

  // Handle debounced search typing
  useEffect(() => {
    if (!isOpen) return

    const handler = setTimeout(() => {
      loadInitialData(searchQuery)
    }, debounceMs)

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery, isOpen, debounceMs, loadInitialData])

  // Handle open/close side effects (auto-focus search input)
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(-1)
      const timer = setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setSearchQuery('')
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [isOpen])

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen])

  // Scroll listener for infinite scroll pagination
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const threshold = 30
    const reachedBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - threshold

    if (reachedBottom && hasMore && !isLoading && !isLoadingMore) {
      loadNextPage()
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < displayedOptions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && displayedOptions[highlightedIndex]) {
          const opt = displayedOptions[highlightedIndex]
          if (!opt.disabled) {
            handleSelect(opt)
          }
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
      default:
        break
    }
  }

  const handleSelect = (option: SearchableSelectOption) => {
    setSelectedItemCache(option)
    onChange?.(option.value, option)
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedItemCache(null)
    onChange?.('', undefined)
  }

  const isInvalid = Boolean(error || ariaInvalid)

  const selectedDisplay = useMemo(() => {
    if (selectedItemCache) return selectedItemCache
    if (value && staticOptions) {
      return staticOptions.find((opt) => opt.value === value) || null
    }
    return null
  }, [selectedItemCache, value, staticOptions])

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full text-sm', className)}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden input for form integration */}
      {name && <input type="hidden" name={name} value={value || ''} />}

      {/* Select Trigger Field */}
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs transition-colors outline-none select-none',
          'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
          'hover:bg-muted/40 dark:bg-input/20 dark:hover:bg-input/40',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isInvalid &&
            'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30 dark:border-destructive',
          triggerClassName
        )}
      >
        <span
          className={cn(
            'truncate block text-left flex-1',
            !selectedDisplay && 'text-muted-foreground'
          )}
        >
          {selectedDisplay ? (
            <span className="flex items-center gap-2">
              <span className="font-medium text-foreground">
                {selectedDisplay.label}
              </span>
              {selectedDisplay.badge && (
                <span className="inline-flex items-center rounded-sm px-1.5 py-0.2 text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                  {selectedDisplay.badge}
                </span>
              )}
            </span>
          ) : (
            placeholder
          )}
        </span>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              className="text-muted-foreground/60 hover:text-foreground cursor-pointer p-0.5 rounded-sm hover:bg-muted"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={cn(
              'w-4 h-4 text-muted-foreground transition-transform duration-200',
              isOpen && 'rotate-180 text-foreground'
            )}
          />
        </div>
      </button>

      {/* Dropdown Menu - Positioned strictly BELOW the field */}
      {isOpen && (
        <div
          role="listbox"
          className={cn(
            'absolute left-0 right-0 top-full mt-1.5 z-50 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-150',
            dropdownClassName
          )}
        >
          {/* Search Input Box */}
          <div className="relative border-b border-border p-2 bg-popover/80 backdrop-blur-xs">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-8 pl-8 pr-8 text-xs bg-muted/40 rounded-md border border-input/60 focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Options List with Infinite Scroll (initial 20 + load more on scroll) */}
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-60 overflow-y-auto p-1 scroll-smooth divide-y-0"
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-xs text-muted-foreground">
                <DotLoader size="default" />
                <span>Searching options...</span>
              </div>
            ) : displayedOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No matching options found
              </div>
            ) : (
              displayedOptions.map((opt, idx) => {
                const isSelected = opt.value === value
                const isHighlighted = idx === highlightedIndex

                return (
                  <div
                    key={`${opt.value}-${idx}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      if (!opt.disabled) handleSelect(opt)
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={cn(
                      'relative flex items-center justify-between px-2.5 py-2 text-xs rounded-md cursor-pointer select-none transition-colors',
                      isHighlighted && 'bg-accent text-accent-foreground',
                      isSelected && !isHighlighted && 'bg-accent/60 font-medium',
                      opt.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                    )}
                  >
                    {renderOption ? (
                      renderOption(opt, isSelected)
                    ) : (
                      <div className="flex items-center justify-between w-full gap-2 pr-6">
                        <div className="flex flex-col min-w-0">
                          <span className="truncate text-foreground font-normal">
                            {opt.label}
                          </span>
                          {opt.subLabel && (
                            <span className="text-[11px] text-muted-foreground truncate">
                              {opt.subLabel}
                            </span>
                          )}
                        </div>
                        {opt.badge && (
                          <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground border border-border">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {isSelected && (
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-primary">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                )
              })
            )}

            {/* Bottom scroll loader */}
            {isLoadingMore && (
              <div className="flex items-center justify-center py-2.5 gap-2 text-[11px] text-muted-foreground border-t border-border/40 mt-1">
                <DotLoader size="sm" />
                <span>Loading more...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchableSelect
