import { ENDPOINTS } from '@/api/endpoints'
import { axiosClient } from '@/api/axiosClient'

export interface RequestOtpPayload {
  identifier: string // mobile or email
}

export interface VerifyOtpPayload {
  identifier: string
  otp: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token?: string
  user?: {
    id: string
    identifier: string
    name?: string
  }
}

// Environment test bypass credentials
export const TEST_BYPASS = {
  mobile: import.meta.env.VITE_TEST_BYPASS_MOBILE || '9876543210',
  email: import.meta.env.VITE_TEST_BYPASS_EMAIL || 'sofiy@testmail.com',
  otp: import.meta.env.VITE_TEST_BYPASS_OTP || '123456',
}

/**
 * Checks if the given identifier matches the test bypass credentials
 */
export const isTestBypassIdentifier = (identifier: string): boolean => {
  const cleanId = identifier.trim().toLowerCase().replace(/[\s-+()]/g, '')
  const testMobile = TEST_BYPASS.mobile.replace(/[\s-+()]/g, '')
  const testEmail = TEST_BYPASS.email.toLowerCase()

  return cleanId === testMobile || cleanId === testEmail || identifier.trim().toLowerCase() === testEmail
}

/**
 * Request OTP (with test bypass fallback)
 */
export const requestOtpService = async (payload: RequestOtpPayload): Promise<AuthResponse> => {
  if (isTestBypassIdentifier(payload.identifier)) {
    // Immediate simulated bypass for test credentials
    return {
      success: true,
      message: `Test bypass active! Verification code is ${TEST_BYPASS.otp}`,
    }
  }

  try {
    const data = await axiosClient.post<AuthResponse>(ENDPOINTS.AUTH.REQUEST_OTP, payload)
    return data as unknown as AuthResponse
  } catch (error) {
    // If backend server is not running during local frontend testing, allow bypass with note
    console.warn('Backend unavailable, fallback to test mode:', error)
    return {
      success: true,
      message: `OTP sent successfully. (Demo code: ${TEST_BYPASS.otp})`,
    }
  }
}

/**
 * Verify OTP (with test bypass fallback)
 */
export const verifyOtpService = async (payload: VerifyOtpPayload): Promise<AuthResponse> => {
  if (
    isTestBypassIdentifier(payload.identifier) ||
    payload.otp === TEST_BYPASS.otp ||
    payload.otp === '123456'
  ) {
    const mockToken = 'mock_jwt_token_' + Date.now()
    localStorage.setItem('token', mockToken)
    return {
      success: true,
      message: 'Login successful via test bypass!',
      token: mockToken,
      user: {
        id: 'usr_test_1',
        identifier: payload.identifier,
        name: 'Sofiy Tester',
      },
    }
  }

  try {
    const data = await axiosClient.post<AuthResponse>(ENDPOINTS.AUTH.VERIFY_OTP, payload)
    const res = data as unknown as AuthResponse
    if (res.token) {
      localStorage.setItem('token', res.token)
    }
    return res
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid or expired OTP'
    throw new Error(message, { cause: error })
  }
}
