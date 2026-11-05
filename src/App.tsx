import { useState, useEffect } from 'react'
import AuthPage from './app/pages/auth/Index'
import RootLayout from './layout/RootLayout'

/**
 * Synchronously determine the initial view on the very first render
 * using standard HTML5 browser pathnames (e.g. /admin and /auth),
 * with automatic removal of legacy hash (#) routes.
 */
function resolveInitialView(): 'auth' | 'admin' {
  if (typeof window === 'undefined') return 'auth'

  // Clean up legacy hash if present in URL and replace with clean pathname
  if (window.location.hash === '#admin' || window.location.hash.startsWith('#admin')) {
    window.history.replaceState(null, '', '/admin')
  } else if (window.location.hash === '#auth' || window.location.hash === '#login') {
    window.history.replaceState(null, '', '/auth')
  } else if (window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname)
  }

  const pathname = window.location.pathname.toLowerCase()
  const token = localStorage.getItem('token')

  // Explicit admin or job create route in URL pathname
  if (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/jobs/create' ||
    pathname.startsWith('/jobs/')
  ) {
    return 'admin'
  }

  // Explicit auth / login route in URL pathname
  if (pathname === '/auth' || pathname === '/login') {
    return 'auth'
  }

  // Root or other path: if token exists, navigate to /admin, else /auth
  if (token) {
    if (pathname === '/' || pathname === '') {
      window.history.replaceState(null, '', '/admin')
    }
    return 'admin'
  }

  if (pathname === '/' || pathname === '') {
    window.history.replaceState(null, '', '/auth')
  }
  return 'auth'
}

export default function App() {
  // Synchronous initialization prevents any flash of AuthPage on page refresh
  const [currentView, setCurrentView] = useState<'auth' | 'admin'>(resolveInitialView)

  // Listen to popstate (browser back/forward & history changes) and hashchange
  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentView(resolveInitialView())
    }

    window.addEventListener('popstate', handleRouteChange)
    window.addEventListener('hashchange', handleRouteChange)
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      window.removeEventListener('hashchange', handleRouteChange)
    }
  }, [])

  const handleLoginSuccess = () => {
    window.history.pushState(null, '', '/admin')
    setCurrentView('admin')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.history.pushState(null, '', '/auth')
    setCurrentView('auth')
  }

  if (currentView === 'admin') {
    return <RootLayout onNavigateToAuth={handleLogout} />
  }

  return <AuthPage onLoginSuccess={handleLoginSuccess} />
}
