import { useState, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { jobCreateSchema, type JobCreateFormValues } from './schema'
import {
  DEFAULT_JOB_VALUES,
  EXPERIENCE_RANGE_CONFIG,
  SALARY_RANGE_CONFIG,
} from '../../constant'
import { toast } from 'sonner'

export interface UseJobCreateOptions {
  initialData?: JobCreateFormValues | null
  isEditing?: boolean
  onSuccess?: (createdJob: JobCreateFormValues) => void
}

export function useJobCreate(options?: UseJobCreateOptions) {
  const { initialData, isEditing, onSuccess } = options || {}
  const [skillInput, setSkillInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdJobData, setCreatedJobData] = useState<JobCreateFormValues | null>(null)

  const getDefaults = (): JobCreateFormValues => {
    if (initialData) {
      return {
        jobTitle: initialData.jobTitle,
        department: initialData.department,
        jobDescription: initialData.jobDescription,
        requiredSkills: initialData.requiredSkills || [],
        experienceMin: initialData.experienceMin,
        experienceMax: initialData.experienceMax,
        salaryMin: initialData.salaryMin,
        salaryMax: initialData.salaryMax,
        salaryCurrency: initialData.salaryCurrency || 'USD',
        employmentType: initialData.employmentType,
        workMode: initialData.workMode,
        location: initialData.location,
        vacancies: initialData.vacancies,
        applicationDeadline: initialData.applicationDeadline,
      }
    }
    return {
      jobTitle: DEFAULT_JOB_VALUES.jobTitle,
      department: DEFAULT_JOB_VALUES.department,
      jobDescription: DEFAULT_JOB_VALUES.jobDescription,
      requiredSkills: DEFAULT_JOB_VALUES.requiredSkills,
      experienceMin: DEFAULT_JOB_VALUES.experienceRange[0],
      experienceMax: DEFAULT_JOB_VALUES.experienceRange[1],
      salaryMin: DEFAULT_JOB_VALUES.salaryRange[0],
      salaryMax: DEFAULT_JOB_VALUES.salaryRange[1],
      salaryCurrency: DEFAULT_JOB_VALUES.salaryCurrency,
      employmentType: DEFAULT_JOB_VALUES.employmentType,
      workMode: DEFAULT_JOB_VALUES.workMode,
      location: DEFAULT_JOB_VALUES.location,
      vacancies: DEFAULT_JOB_VALUES.vacancies,
      applicationDeadline: DEFAULT_JOB_VALUES.applicationDeadline,
    }
  }

  const form = useForm<JobCreateFormValues>({
    resolver: zodResolver(jobCreateSchema),
    defaultValues: getDefaults(),
    mode: 'onTouched',
  })

  const {
    setValue,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = form

  // Re-sync whenever initialData or isEditing changes
  useEffect(() => {
    reset(getDefaults())
    setCreatedJobData(null)
  }, [initialData, reset])

  const currentSkills = useWatch({ control, name: 'requiredSkills' }) || []
  const currentExperienceMin = useWatch({ control, name: 'experienceMin' }) ?? EXPERIENCE_RANGE_CONFIG.defaultMin
  const currentExperienceMax = useWatch({ control, name: 'experienceMax' }) ?? EXPERIENCE_RANGE_CONFIG.defaultMax
  const currentSalaryMin = useWatch({ control, name: 'salaryMin' }) ?? SALARY_RANGE_CONFIG.defaultMin
  const currentSalaryMax = useWatch({ control, name: 'salaryMax' }) ?? SALARY_RANGE_CONFIG.defaultMax
  const currentWorkMode = useWatch({ control, name: 'workMode' })
  const currentDepartment = useWatch({ control, name: 'department' })
  const currentEmploymentType = useWatch({ control, name: 'employmentType' })
  const currentSalaryCurrency = useWatch({ control, name: 'salaryCurrency' })

  /**
   * Add a skill by name (from manual input or preset suggestion chips)
   */
  const addSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim()
    if (!trimmed) return

    if (currentSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.info(`"${trimmed}" is already added`)
      return
    }

    const updated = [...currentSkills, trimmed]
    setValue('requiredSkills', updated, { shouldValidate: true, shouldDirty: true })
    setSkillInput('')
  }

  /**
   * Remove a skill tag
   */
  const removeSkill = (skillToRemove: string) => {
    const updated = currentSkills.filter((s) => s !== skillToRemove)
    setValue('requiredSkills', updated, { shouldValidate: true, shouldDirty: true })
  }

  /**
   * Handle dual slider movement for experience range [min, max]
   */
  const handleExperienceSliderChange = (vals: number[]) => {
    if (vals.length >= 2) {
      const [min, max] = vals
      setValue('experienceMin', min, { shouldValidate: true, shouldDirty: true })
      setValue('experienceMax', max, { shouldValidate: true, shouldDirty: true })
    }
  }

  /**
   * Handle dual slider movement for salary range [min, max]
   */
  const handleSalarySliderChange = (vals: number[]) => {
    if (vals.length >= 2) {
      const [min, max] = vals
      setValue('salaryMin', min, { shouldValidate: true, shouldDirty: true })
      setValue('salaryMax', max, { shouldValidate: true, shouldDirty: true })
    }
  }

  /**
   * Submit Handler
   */
  const onSubmit = async (data: JobCreateFormValues) => {
    setIsSubmitting(true)
    try {
      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 600))

      setCreatedJobData(data)
      const actionVerb = isEditing ? 'Updated' : 'Created'
      toast.success(`Job Vacancy ${actionVerb} Successfully!`, {
        description: `Position "${data.jobTitle}" has been saved with ${data.vacancies} vacancy.`,
      })

      onSuccess?.(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save job vacancy'
      toast.error('Error saving job vacancy', {
        description: msg,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Reset the form to initial state
   */
  const handleResetForm = () => {
    reset(getDefaults())
    setSkillInput('')
    setCreatedJobData(null)
    toast.info('Form cleared')
  }

  return {
    form,
    register: form.register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    watch: form.watch,
    control,
    setValue,
    isSubmitting,
    createdJobData,
    skillInput,
    setSkillInput,
    addSkill,
    removeSkill,
    currentSkills,
    currentExperienceMin,
    currentExperienceMax,
    currentSalaryMin,
    currentSalaryMax,
    currentWorkMode,
    currentDepartment,
    currentEmploymentType,
    currentSalaryCurrency,
    handleExperienceSliderChange,
    handleSalarySliderChange,
    handleResetForm,
  }
}
