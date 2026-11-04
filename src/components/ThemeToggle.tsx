import React, { useId } from 'react'
import { useTheme, type Theme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface ThemeToggleProps {
  /**
   * Predefined scale sizing for the animated switch
   * - sm: 12px base (compact for navbars and headers)
   * - md: 15px base (standard size)
   * - lg: 18px base (prominent hero/footer display)
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Optional custom className for the wrapper
   */
  className?: string
  /**
   * Explicit theme state if used as a controlled component
   */
  theme?: Theme
  /**
   * Optional toggle callback
   */
  onToggle?: () => void
  /**
   * Unique input element id
   */
  id?: string
  /**
   * Optional accessible label
   */
  'aria-label'?: string
}

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-[12px]',
  md: 'text-[15px]',
  lg: 'text-[18px]',
}

/**
 * Animated Day / Night Theme Switch Component
 * Based on Uiverse.io animated sun/moon & clouds/stars toggle
 * Smoothly switches the application between light and dark modes
 * Uses Shadcn Tooltip for accessible, consistent hover hints
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'sm',
  className,
  theme: controlledTheme,
  onToggle: controlledOnToggle,
  id: customId,
  'aria-label': ariaLabel = 'Toggle dark and light theme',
}) => {
  const generatedId = useId()
  const switchId = customId || `theme-switch-${generatedId}`

  const { theme: hookTheme, toggleTheme: hookToggle } = useTheme()

  const currentTheme = controlledTheme !== undefined ? controlledTheme : hookTheme
  const handleToggle = controlledOnToggle || hookToggle

  // In this toggle:
  // Checked = Light Mode (Day Sky, Glowing Sun, Clouds)
  // Unchecked = Dark Mode (Night Sky, Crescent Moon, Stars)
  const isChecked = currentTheme === 'light'
  const tooltipText = isChecked ? 'Switch to Dark Mode' : 'Switch to Light Mode'

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'inline-flex items-center justify-center select-none',
              className
            )}
          >
            <label
              htmlFor={switchId}
              className={cn(
                'theme-switch cursor-pointer transition-transform active:scale-95 duration-200',
                sizeClasses[size]
              )}
              role="switch"
              aria-checked={isChecked}
              aria-label={ariaLabel}
            >
              <input
                id={switchId}
                type="checkbox"
                checked={isChecked}
                onChange={handleToggle}
                aria-label={ariaLabel}
              />
              <span className="theme-slider" />
              <span className="theme-decoration" />
            </label>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={6} className="text-xs font-medium">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ThemeToggle
