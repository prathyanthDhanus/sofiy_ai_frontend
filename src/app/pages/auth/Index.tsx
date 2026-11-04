import React from 'react'
import { AuthLayout } from '@/layout/AuthLayout'
import { LoginForm } from './components/loginForm'

export interface AuthPageProps {
  onLoginSuccess?: () => void
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  return (
    <AuthLayout>
      <LoginForm onSuccess={onLoginSuccess} />
    </AuthLayout>
  )
}

export default AuthPage
