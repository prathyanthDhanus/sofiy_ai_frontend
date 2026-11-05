import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from 'cn'

export interface BreadcrumbItemConfig {
  label: string
  href?: string
  onClick?: (e: React.MouseEvent) => void
  active?: boolean
}

export interface PageHeaderProps {
  /**
   * Breadcrumb navigation hierarchy
   */
  breadcrumbs?: BreadcrumbItemConfig[]
  /**
   * Callback fired when clicking the back button
   */
  onBack?: () => void
  /**
   * Whether to display the back button (defaults to true if onBack is supplied)
   */
  showBackButton?: boolean
  /**
   * Tooltip label for the back button
   */
  backTooltip?: string
  /**
   * Right-side action slot (e.g. Primary Create button, Filter, or Button Group)
   */
  action?: React.ReactNode
  /**
   * Optional title or badge rendered below or inline with breadcrumb
   */
  title?: React.ReactNode
  /**
   * Optional description text
   */
  description?: React.ReactNode
  /**
   * Additional container classes
   */
  className?: string
  /**
   * Children slot for custom extensions
   */
  children?: React.ReactNode
}

/**
 * Globally reusable PageHeader component for the application.
 * Provides synchronized breadcrumbs, accessible back navigation, and customizable action slots.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs = [],
  onBack,
  showBackButton = true,
  backTooltip = 'Back to previous view',
  action,
  title,
  description,
  className,
  children,
}) => {
  const handleDefaultBack = () => {
    if (onBack) {
      onBack()
    } else if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  const renderBackBtn = showBackButton && (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={handleDefaultBack}
          aria-label={backTooltip}
          className="h-8 w-8 rounded-lg shrink-0 border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <span>{backTooltip}</span>
      </TooltipContent>
    </Tooltip>
  )

  return (
    <div
      className={cn(
        'flex flex-col gap-3 pb-3 border-b border-border/60 w-full transition-all duration-200',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
        {/* Left Side: Back Button + Dynamic Breadcrumb Navigation */}
        <div className="flex items-center gap-2.5 min-w-0">
          {renderBackBtn}

          {breadcrumbs.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList className="text-xs">
                {breadcrumbs.map((crumb, idx) => {
                  const isLast = idx === breadcrumbs.length - 1 || crumb.active

                  return (
                    <React.Fragment key={crumb.label + idx}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="font-semibold text-[#E8B931] truncate max-w-[220px]">
                            {crumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            href={crumb.href || '#'}
                            onClick={(e) => {
                              if (crumb.onClick) {
                                crumb.onClick(e)
                              } else if (!crumb.href || crumb.href === '#') {
                                e.preventDefault()
                              }
                            }}
                            className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[180px]"
                          >
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>

        {/* Right Side: Action Slot (Create Button, Actions, Dropdowns, etc.) */}
        {action && (
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Optional Title / Description header extension */}
      {(title || description) && (
        <div className="pt-1 space-y-0.5">
          {title && (
            <div className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              {title}
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  )
}

export default PageHeader
