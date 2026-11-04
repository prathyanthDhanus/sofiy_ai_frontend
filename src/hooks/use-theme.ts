import React, { useState, useEffect, useCallback, createContext, useContext, createElement } from 'react'

export type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const THEME_STORAGE_KEY = 'theme'
const THEME_EVENT = 'sofiy-theme-change'

/**
 * Reads the active theme from localStorage or document element
 */
export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    if (stored === 'dark' || stored === 'light') {
      return stored
    }
  } catch {
    // localStorage might be unavailable in restricted environments
  }

  // Check if html already has dark class
  if (document.documentElement.classList.contains('dark')) {
    return 'dark'
  }

  // Default to dark theme for Sofiy AI Tutor's cinematic design
  return 'dark'
}

/**
 * Updates the <html> root element with the dark class
 */
export function applyThemeToDocument(theme: Theme): void {
  if (typeof window === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

/**
 * ThemeProvider provides reactive light/dark theme state across the entire application
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const initial = defaultTheme || getInitialTheme()
    applyThemeToDocument(initial)
    return initial
  })

  // Ensure DOM is synchronized whenever theme changes
  useEffect(() => {
    applyThemeToDocument(theme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore storage errors
    }
    // Dispatch event for other tabs/listeners
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }))
  }, [theme])

  // Listen for storage / cross-component sync
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY && event.newValue) {
        const newTheme = event.newValue as Theme
        if (newTheme === 'dark' || newTheme === 'light') {
          setThemeState(newTheme)
        }
      }
    }

    const handleCustomChange = (event: Event) => {
      const customEvent = event as CustomEvent<Theme>
      if (customEvent.detail && customEvent.detail !== theme) {
        setThemeState(customEvent.detail)
      }
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(THEME_EVENT, handleCustomChange)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(THEME_EVENT, handleCustomChange)
    }
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const value: ThemeContextType = {
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme,
  }

  return createElement(ThemeContext.Provider, { value }, children)
}

/**
 * Hook to access and toggle theme. Works seamlessly inside or outside ThemeProvider.
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  
  // If inside ThemeProvider, return context
  if (context) {
    return context
  }

  // Fallback for standalone usage without ThemeProvider
  const [theme, setThemeState] = useState<Theme>(() => {
    const initial = getInitialTheme()
    applyThemeToDocument(initial)
    return initial
  })

  useEffect(() => {
    applyThemeToDocument(theme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore
    }
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    applyThemeToDocument(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      applyThemeToDocument(next)
      return next
    })
  }, [])

  return {
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme,
  }
}
