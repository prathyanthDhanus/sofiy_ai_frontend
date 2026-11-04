import { z } from 'zod'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const identifierSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Please enter your mobile number or email')
    .refine(
      (val) => {
        const cleanVal = val.replace(/[\s-+()]/g, '')
        return emailRegex.test(val) || /^\d{10,12}$/.test(cleanVal)
      },
      {
        message: 'Please enter a valid email address or 10-digit mobile number',
      }
    ),
})

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Please enter all 6 digits of the OTP')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
})

export type IdentifierFormData = z.infer<typeof identifierSchema>
export type OtpFormData = z.infer<typeof otpSchema>
