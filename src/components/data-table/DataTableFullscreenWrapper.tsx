import React, { useEffect } from 'react'

export interface DataTableFullscreenWrapperProps {
  isFullscreen: boolean
  onToggleFullscreen: () => void
  children: React.ReactNode
}

export const DataTableFullscreenWrapper: React.FC<DataTableFullscreenWrapperProps> = ({
  isFullscreen,
  onToggleFullscreen,
  children,
}) => {
  // Listen for Escape key to exit fullscreen mode
  useEffect(() => {
    if (!isFullscreen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onToggleFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    // Prevent document body scrolling while in fullscreen overlay
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isFullscreen, onToggleFullscreen])

  if (!isFullscreen) {
    return <div className="w-full relative">{children}</div>
  }

  return (
    <div
      role="dialog"
      aria-label="Full-size table view"
      className="fixed inset-0 z-50 bg-background text-foreground flex flex-col p-3 sm:p-6 overflow-hidden animate-in fade-in-0 duration-200"
    >
      <div className="flex-1 flex flex-col min-h-0 w-full max-w-[1920px] mx-auto overflow-hidden">
        {children}
      </div>
    </div>
  )
}
