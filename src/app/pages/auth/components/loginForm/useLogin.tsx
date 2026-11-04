import { useState, useEffect, useRef } from 'react'
import { usePost } from '@/api/useApiHooks'
import { ENDPOINTS } from '@/api/endpoints'
import {
  TEST_BYPASS,
  isTestBypassIdentifier,
  type AuthResponse,
  type RequestOtpPayload,
  type VerifyOtpPayload,
} from '../../auth.service'

export type AuthStep = 'IDENTIFIER' | 'OTP' | 'SUCCESS'

export function useLogin() {
  const [step, setStep] = useState<AuthStep>('IDENTIFIER')
  const [identifier, setIdentifier] = useState<string>('')
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number>(30)
  const [isBypassLoading, setIsBypassLoading] = useState<boolean>(false)

  const canResend = countdown === 0
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([])

  // Reusable TanStack Query mutation hooks from useApiHooks.ts
  const requestOtpMutation = usePost<AuthResponse, RequestOtpPayload>(ENDPOINTS.AUTH.REQUEST_OTP)
  const verifyOtpMutation = usePost<AuthResponse, VerifyOtpPayload>(ENDPOINTS.AUTH.VERIFY_OTP)

  const loading = requestOtpMutation.isPending || verifyOtpMutation.isPending || isBypassLoading

  // Timer countdown effect for OTP resend
  useEffect(() => {
    if (step !== 'OTP' || countdown <= 0) return

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [step, countdown])

  // Auto focus first OTP input on transition to OTP step
  useEffect(() => {
    if (step === 'OTP') {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus()
      }, 100)
    }
  }, [step])

  // Handle Identifier submission (Email or Mobile)
  const handleRequestOtp = async (inputIdentifier?: string) => {
    const targetIdentifier = (inputIdentifier || identifier).trim()

    if (!targetIdentifier) {
      setErrorMessage('Please enter your email or mobile number')
      return
    }

    setErrorMessage(null)
    setSuccessMessage(null)

    // Test bypass flow
    if (isTestBypassIdentifier(targetIdentifier)) {
      setIsBypassLoading(true)
      setTimeout(() => {
        setIsBypassLoading(false)
        setIdentifier(targetIdentifier)
        setStep('OTP')
        setCountdown(30)
        setSuccessMessage(`Test mode active! OTP is ${TEST_BYPASS.otp}`)
      }, 400)
      return
    }

    try {
      const response = await requestOtpMutation.mutateAsync({ identifier: targetIdentifier })
      setIdentifier(targetIdentifier)
      setStep('OTP')
      setCountdown(30)
      setSuccessMessage(response?.message || 'OTP sent successfully')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP. Please try again.'
      setErrorMessage(message)
    }
  }

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric inputs
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]

    // Support pasting full 6 digits
    if (value.length > 1) {
      const pastedDigits = value.slice(0, 6).split('')
      pastedDigits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit
      })
      setOtp(newOtp)
      const nextIndex = Math.min(pastedDigits.length, 5)
      otpInputsRef.current[nextIndex]?.focus()
      return
    }

    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Focus next input if entered
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus()
    }
  }

  // Handle Backspace in OTP
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        otpInputsRef.current[index - 1]?.focus()
      }
    }
  }

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    const fullOtp = otp.join('')
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the OTP')
      return
    }

    setErrorMessage(null)

    // Test bypass flow
    if (
      isTestBypassIdentifier(identifier) ||
      fullOtp === TEST_BYPASS.otp ||
      fullOtp === '123456'
    ) {
      setIsBypassLoading(true)
      setTimeout(() => {
        setIsBypassLoading(false)
        const mockToken = 'mock_jwt_token_' + Date.now()
        localStorage.setItem('token', mockToken)
        setSuccessMessage('Login successful via test bypass!')
        setStep('SUCCESS')
      }, 400)
      return
    }

    try {
      const response = await verifyOtpMutation.mutateAsync({
        identifier,
        otp: fullOtp,
      })

      if (response?.token) {
        localStorage.setItem('token', response.token)
      }

      setSuccessMessage(response?.message || 'Verification successful!')
      setStep('SUCCESS')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid OTP. Please check and try again.'
      setErrorMessage(message)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || loading) return
    setOtp(['', '', '', '', '', ''])
    await handleRequestOtp(identifier)
  }

  // Switch back to edit identifier
  const handleEditIdentifier = () => {
    setStep('IDENTIFIER')
    setOtp(['', '', '', '', '', ''])
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  // Use test bypass credentials
  const fillTestCredentials = (type: 'email' | 'mobile') => {
    const cred = type === 'email' ? TEST_BYPASS.email : TEST_BYPASS.mobile
    setIdentifier(cred)
    setErrorMessage(null)
  }

  // Google OAuth placeholder
  const handleGoogleLogin = () => {
    setIsBypassLoading(true)
    setTimeout(() => {
      setIsBypassLoading(false)
      setSuccessMessage('Google sign-in initialized')
    }, 600)
  }

  return {
    step,
    identifier,
    setIdentifier,
    otp,
    loading,
    errorMessage,
    successMessage,
    countdown,
    canResend,
    otpInputsRef,
    handleRequestOtp,
    handleOtpChange,
    handleOtpKeyDown,
    handleVerifyOtp,
    handleResendOtp,
    handleEditIdentifier,
    fillTestCredentials,
    handleGoogleLogin,
    testBypass: TEST_BYPASS,
  }
}
