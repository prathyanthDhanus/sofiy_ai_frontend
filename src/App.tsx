import { useState, useEffect } from 'react'
import AuthPage from './app/pages/auth/Index'
import RootLayout from './layout/RootLayout'

export default function App() {
  const [currentView, setCurrentView] = useState<'auth' | 'admin'>('auth')

  // Listen to hash and check for token on mount
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash
      const token = localStorage.getItem('token')
      if (hash === '#admin' || (token && hash !== '#auth')) {
        setCurrentView('admin')
      } else {
        setCurrentView('auth')
      }
    }

    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const handleLoginSuccess = () => {
    window.location.hash = 'admin'
    setCurrentView('admin')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.hash = 'auth'
    setCurrentView('auth')
  }

  if (currentView === 'admin') {
    return <RootLayout onNavigateToAuth={handleLogout} />
  }

  return <AuthPage onLoginSuccess={handleLoginSuccess} />
}
