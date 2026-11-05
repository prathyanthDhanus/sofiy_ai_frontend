import { z } from 'zod'

export const jobCreateSchema = z
  .object({
    jobTitle: z
      .string()
      .trim()
      .min(3, 'Job title must be at least 3 characters')
      .max(100, 'Job title must not exceed 100 characters'),
    department: z
      .string()
      .trim()
      .min(1, 'Please select a department from the dropdown'),
    jobDescription: z
      .string()
      .trim()
      .min(20, 'Job description must be at least 20 characters')
      .max(5000, 'Job description cannot exceed 5000 characters'),
    requiredSkills: z
      .array(z.string().trim())
      .min(1, 'Please add at least one required skill'),
    experienceMin: z
      .number()
      .min(0, 'Minimum experience cannot be negative')
      .max(30, 'Minimum experience cannot exceed 30 years'),
    experienceMax: z
      .number()
      .min(0, 'Maximum experience cannot be negative')
      .max(30, 'Maximum experience cannot exceed 30 years'),
    salaryMin: z
      .number()
      .min(0, 'Minimum salary cannot be negative'),
    salaryMax: z
      .number()
      .min(0, 'Maximum salary cannot be negative'),
    salaryCurrency: z.string().min(1, 'Please select a currency'),
    employmentType: z
      .string()
      .min(1, 'Please select an employment type'),
    workMode: z.enum(['On-site', 'Hybrid', 'Remote'], {
      message: 'Please select a valid work mode',
    }),
    location: z.string().trim(),
    vacancies: z
      .number()
      .int('Vacancies must be a whole number')
      .min(1, 'At least 1 vacancy is required')
      .max(500, 'Vacancies cannot exceed 500'),
    applicationDeadline: z
      .string()
      .min(1, 'Application deadline is required')
      .refine(
        (val) => {
          if (!val) return false
          const selected = new Date(val)
          const now = new Date()
          now.setHours(0, 0, 0, 0)
          return !isNaN(selected.getTime()) && selected >= now
        },
        {
          message: 'Application deadline must be today or in the future',
        }
      ),
  })
  .refine((data) => data.experienceMax >= data.experienceMin, {
    message: 'Max experience must be greater than or equal to min experience',
    path: ['experienceMax'],
  })
  .refine((data) => data.salaryMax >= data.salaryMin, {
    message: 'Max salary must be greater than or equal to min salary',
    path: ['salaryMax'],
  })
  .refine(
    (data) => {
      if (data.workMode !== 'Remote') {
        return data.location.length >= 2
      }
      return true
    },
    {
      message: 'Office location is required for On-site or Hybrid positions',
      path: ['location'],
    }
  )

export type JobCreateFormValues = z.infer<typeof jobCreateSchema>
