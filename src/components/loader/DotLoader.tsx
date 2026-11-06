import React from 'react'
import { cn } from 'cn'

export interface DotLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg'
  dotClassName?: string
}

const sizeConfig = {
  sm: {
    container: 'w-10 h-6',
    scale: 'scale-[0.5]',
  },
  default: {
    container: 'w-16 h-8',
    scale: 'scale-[0.75]',
  },
  lg: {
    container: 'w-20 h-12',
    scale: 'scale-100',
  },
}

export const DotLoader: React.FC<DotLoaderProps> = ({
  className,
  size = 'default',
  dotClassName,
  ...props
}) => {
  const currentSize = sizeConfig[size] || sizeConfig.default

  return (
    <div
      role="status"
      aria-label="Loading..."
      className={cn(
        'inline-flex items-center justify-center overflow-hidden select-none',
        currentSize.container,
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative w-[80px] h-[80px] shrink-0 origin-center pointer-events-none',
          currentSize.scale
        )}
      >
        <style>{`
          @keyframes uiverse-dot-flip1 {
            0% { transform: scale(0); }
            100% { transform: scale(1); }
          }
          @keyframes uiverse-dot-flip2 {
            0% { transform: translate(0, 0); }
            100% { transform: translate(24px, 0); }
          }
          @keyframes uiverse-dot-flip3 {
            0% { transform: scale(1); }
            100% { transform: scale(0); }
          }
          .uiverse-dot {
            position: absolute;
            top: 33px;
            width: 13px;
            height: 13px;
            border-radius: 9999px;
            animation-timing-function: cubic-bezier(0, 1, 1, 0);
          }
          .uiverse-dot-1 {
            left: 8px;
            animation: uiverse-dot-flip1 0.6s infinite;
          }
          .uiverse-dot-2 {
            left: 8px;
            animation: uiverse-dot-flip2 0.6s infinite;
          }
          .uiverse-dot-3 {
            left: 32px;
            animation: uiverse-dot-flip2 0.6s infinite;
          }
          .uiverse-dot-4 {
            left: 56px;
            animation: uiverse-dot-flip3 0.6s infinite;
          }
        `}</style>
        <div
          className={cn(
            'uiverse-dot uiverse-dot-1 bg-gray-300 dark:bg-gray-600',
            dotClassName
          )}
        />
        <div
          className={cn(
            'uiverse-dot uiverse-dot-2 bg-gray-300 dark:bg-gray-600',
            dotClassName
          )}
        />
        <div
          className={cn(
            'uiverse-dot uiverse-dot-3 bg-gray-300 dark:bg-gray-600',
            dotClassName
          )}
        />
        <div
          className={cn(
            'uiverse-dot uiverse-dot-4 bg-gray-300 dark:bg-gray-600',
            dotClassName
          )}
        />
      </div>
    </div>
  )
}

export default DotLoader
