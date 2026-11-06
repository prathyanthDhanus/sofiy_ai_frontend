import React from 'react'
import {
  Briefcase,
  Building2,
  DollarSign,
  Calendar,
  Users,
  MapPin,
  Sparkles,
  Plus,
  X,
  Laptop,
  Globe,
  RotateCcw,
  Send,
  CheckCircle2,
  AlertCircle,
  Edit3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { SearchableSelect } from '@/components/ui/searchable-select'
import {
  DUMMY_DEPARTMENTS,
  EMPLOYMENT_TYPES,
  WORK_MODES,
  SUGGESTED_SKILLS,
  EXPERIENCE_RANGE_CONFIG,
  SALARY_RANGE_CONFIG,
  fetchDepartmentsApi,
  type WorkModeValue,
} from '../../constant'
import { useJobCreate, type UseJobCreateOptions } from './useJobCreate'
import { cn } from 'cn'

export interface JobCreateFormProps extends UseJobCreateOptions {
  className?: string
  onCancel?: () => void
}

export const JobCreateForm: React.FC<JobCreateFormProps> = ({
  className,
  initialData,
  isEditing = false,
  onSuccess,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
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
  } = useJobCreate({ initialData, isEditing, onSuccess })

  // Format currency display helper
  const currencySymbol =
    SALARY_RANGE_CONFIG.currencies.find((c) => c.code === currentSalaryCurrency)?.symbol || '$'

  const formatMoney = (val: number) => {
    return `${currencySymbol}${val.toLocaleString()}`
  }

  // Quick preset for deadline helper
  const setQuickDeadline = (days: number) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    const formatted = d.toISOString().split('T')[0]
    setValue('applicationDeadline', formatted, { shouldValidate: true, shouldDirty: true })
  }

  // If submitted successfully, show confirmation screen with quick summary and create another button
  if (createdJobData) {
    return (
      <Card className="w-full border-emerald-500/30 bg-card shadow-lg animate-in fade-in-50 duration-300">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              {isEditing ? 'Job Vacancy Updated!' : 'Job Vacancy Created!'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              The position <span className="font-semibold text-foreground">"{createdJobData.jobTitle}"</span> has been saved and updated in the active requisitions registry.
            </p>
          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left bg-muted/40 p-4 rounded-xl border border-border">
            <div>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">Department</span>
              <span className="text-xs font-semibold text-foreground">
                {DUMMY_DEPARTMENTS.find((d) => d.id === createdJobData.department)?.label || createdJobData.department}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">Mode & Type</span>
              <span className="text-xs font-semibold text-foreground">
                {createdJobData.workMode} • {createdJobData.employmentType}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">Experience</span>
              <span className="text-xs font-semibold text-foreground">
                {createdJobData.experienceMin} - {createdJobData.experienceMax} Years
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">Vacancies</span>
              <span className="text-xs font-semibold text-foreground">
                {createdJobData.vacancies} {createdJobData.vacancies === 1 ? 'Opening' : 'Openings'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              onClick={handleResetForm}
              className="bg-[#E8B931] hover:bg-[#D8A721] text-zinc-950 font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {isEditing ? 'Create New Vacancy' : 'Create Another Vacancy'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="cursor-pointer">
                Return to Overview & Table
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn('space-y-6 w-full max-w-full pb-6', className)}
    >
      {/* Top Banner / Card Header */}
      <Card className="border-border shadow-xs bg-card">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8B931]/15 border border-[#E8B931]/30 flex items-center justify-center text-[#E8B931] shrink-0 shadow-xs">
                {isEditing ? (
                  <Edit3 className="w-5 h-5 text-[#E8B931]" />
                ) : (
                  <Briefcase className="w-5 h-5 text-[#E8B931]" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  {isEditing ? `Edit Job Vacancy: ${watch('jobTitle') || 'Selected Role'}` : 'Create New Job Vacancy'}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  {isEditing
                    ? 'Update role compensation, department, required competencies, and screening guidelines'
                    : 'Publish a role requisition with customized requirements, compensation & AI pipeline settings'}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-[#E8B931]/10 text-[#E8B931] border-[#E8B931]/30 text-xs px-2.5 py-1 font-semibold"
              >
                {isEditing ? 'Editing Mode' : 'Draft Requisition'}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* SECTION 1: ROLE ESSENTIALS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Building2 className="w-4 h-4 text-[#E8B931]" />
              <span>General Information</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Field 1: Job Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="jobTitle" className="text-xs font-medium">
                    Job Title <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground">e.g. Senior Frontend Engineer</span>
                </div>
                <Input
                  id="jobTitle"
                  placeholder="e.g. Senior Frontend Engineer"
                  {...register('jobTitle')}
                  aria-invalid={Boolean(errors.jobTitle)}
                  className="h-10 text-sm focus-visible:ring-[#E8B931]"
                />
                {errors.jobTitle && (
                  <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.jobTitle.message}</span>
                  </p>
                )}
              </div>

              {/* Field 2: Department (Dropdown - 3 dummy departments from constant.ts) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="department" className="text-xs font-medium">
                    Department <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground">Select team unit</span>
                </div>
                <SearchableSelect
                  id="department"
                  value={currentDepartment}
                  onChange={(val) =>
                    setValue('department', val, { shouldValidate: true, shouldDirty: true })
                  }
                  fetchOptions={fetchDepartmentsApi}
                  placeholder="Choose Department..."
                  searchPlaceholder="Search departments by name or code..."
                  pageSize={20}
                  aria-invalid={Boolean(errors.department)}
                  error={Boolean(errors.department)}
                  triggerClassName="focus-visible:ring-[#E8B931]"
                />
                {errors.department && (
                  <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.department.message}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Field 3: Job Description */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="jobDescription" className="text-xs font-medium">
                  Job Description <span className="text-destructive">*</span>
                </Label>
                <span className="text-[10px] text-muted-foreground">
                  Minimum 20 characters • Markdown friendly
                </span>
              </div>
              <Textarea
                id="jobDescription"
                rows={4}
                placeholder="Provide role objectives, daily responsibilities, qualification expectations, and growth opportunities..."
                {...register('jobDescription')}
                aria-invalid={Boolean(errors.jobDescription)}
                className="text-sm resize-y focus-visible:ring-[#E8B931]"
              />
              <div className="flex items-center justify-between">
                {errors.jobDescription ? (
                  <p className="text-xs font-medium text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.jobDescription.message}</span>
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-[11px] text-muted-foreground">
                  {(watch('jobDescription') || '').length} characters
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-border/60 my-5" />

          {/* SECTION 2: REQUIRED SKILLS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="w-4 h-4 text-[#E8B931]" />
                <span>Required Skills & Tech Stack <span className="text-destructive">*</span></span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {currentSkills.length} {currentSkills.length === 1 ? 'skill selected' : 'skills selected'}
              </span>
            </div>

            {/* Skill Input + Add Button */}
            <div className="flex gap-2">
              <Input
                placeholder="Type a skill and press Enter (e.g. Next.js, GraphQL)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSkill(skillInput)
                  }
                }}
                className="h-10 text-sm focus-visible:ring-[#E8B931]"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addSkill(skillInput)}
                disabled={!skillInput.trim()}
                className="h-10 px-4 text-xs font-semibold cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 mr-1 text-[#E8B931]" />
                Add Skill
              </Button>
            </div>

            {/* Selected Skills Chips */}
            {currentSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted/40 border border-border min-h-[46px] items-center">
                {currentSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="pl-2.5 pr-1 py-1 text-xs font-medium gap-1.5 bg-[#E8B931]/15 text-foreground border border-[#E8B931]/40 hover:bg-[#E8B931]/25 transition-all"
                  >
                    <span>{skill}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => removeSkill(skill)}
                          aria-label={`Remove ${skill}`}
                          className="w-4 h-4 p-0 rounded-full hover:bg-black/10 dark:hover:bg-white/20 cursor-pointer"
                        >
                          <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <span>Remove {skill}</span>
                      </TooltipContent>
                    </Tooltip>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                No skills added yet. Type a skill or choose from suggestions below.
              </div>
            )}

            {errors.requiredSkills && (
              <p className="text-xs font-medium text-destructive flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.requiredSkills.message}</span>
              </p>
            )}

            {/* Suggested Skill Quick-Add Pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground">Suggested Skills (Click to add):</span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_SKILLS.map((item) => {
                  const isAdded = currentSkills.some((s) => s.toLowerCase() === item.toLowerCase())
                  return (
                    <Button
                      key={item}
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => (!isAdded ? addSkill(item) : removeSkill(item))}
                      className={cn(
                        'text-[11px] h-7 px-2.5 rounded-md border transition-all cursor-pointer inline-flex items-center gap-1',
                        isAdded
                          ? 'bg-[#E8B931] text-zinc-950 border-[#E8B931] font-semibold hover:bg-[#D8A721] hover:text-zinc-950'
                          : 'bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border'
                      )}
                    >
                      <span>{item}</span>
                      {isAdded ? <CheckCircle2 className="w-3 h-3" /> : <Plus className="w-3 h-3 opacity-60" />}
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="h-px bg-border/60 my-5" />

          {/* SECTION 3: RANGE SELECTORS (EXPERIENCE & SALARY) */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <DollarSign className="w-4 h-4 text-[#E8B931]" />
              <span>Experience & Compensation Ranges</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Field 4: Experience Range Selector */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-semibold text-foreground">
                      Experience Range <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-[11px] text-muted-foreground">Range in years of relevant industry experience</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs font-bold px-2 py-0.5 bg-[#E8B931]/15 text-[#E8B931] border-[#E8B931]/30"
                  >
                    {currentExperienceMin} - {currentExperienceMax} Years
                  </Badge>
                </div>

                {/* Range Slider for Experience */}
                <div className="pt-2 px-1">
                  <Slider
                    min={EXPERIENCE_RANGE_CONFIG.min}
                    max={EXPERIENCE_RANGE_CONFIG.max}
                    step={EXPERIENCE_RANGE_CONFIG.step}
                    value={[currentExperienceMin, currentExperienceMax]}
                    onValueChange={handleExperienceSliderChange}
                    className="py-2"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                    <span>{EXPERIENCE_RANGE_CONFIG.min} yrs (Fresher)</span>
                    <span>10 yrs</span>
                    <span>{EXPERIENCE_RANGE_CONFIG.max}+ yrs (Principal)</span>
                  </div>
                </div>

                {/* Explicit Manual Inputs for Precision */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <Label htmlFor="experienceMin" className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                      Min (Years)
                    </Label>
                    <Input
                      id="experienceMin"
                      type="number"
                      min={0}
                      max={currentExperienceMax}
                      {...register('experienceMin', { valueAsNumber: true })}
                      className="h-8 text-xs focus-visible:ring-[#E8B931]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experienceMax" className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                      Max (Years)
                    </Label>
                    <Input
                      id="experienceMax"
                      type="number"
                      min={currentExperienceMin}
                      max={EXPERIENCE_RANGE_CONFIG.max}
                      {...register('experienceMax', { valueAsNumber: true })}
                      className="h-8 text-xs focus-visible:ring-[#E8B931]"
                    />
                  </div>
                </div>
                {(errors.experienceMin || errors.experienceMax) && (
                  <p className="text-xs font-medium text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.experienceMax?.message || errors.experienceMin?.message}</span>
                  </p>
                )}
              </div>

              {/* Field 5: Salary Range Selector */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-semibold text-foreground">
                      Salary Range <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-[11px] text-muted-foreground">Annual base target compensation range</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs font-bold px-2 py-0.5 bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                  >
                    {formatMoney(currentSalaryMin)} - {formatMoney(currentSalaryMax)} / yr
                  </Badge>
                </div>

                {/* Currency selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground font-medium shrink-0">Currency:</span>
                  <Select
                    value={currentSalaryCurrency}
                    onValueChange={(val) =>
                      setValue('salaryCurrency', val, { shouldValidate: true, shouldDirty: true })
                    }
                  >
                    <SelectTrigger className="h-7 text-xs w-[140px] focus-visible:ring-[#E8B931]">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {SALARY_RANGE_CONFIG.currencies.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code} className="text-xs cursor-pointer">
                          {curr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Range Slider for Salary */}
                <div className="pt-1 px-1">
                  <Slider
                    min={SALARY_RANGE_CONFIG.min}
                    max={SALARY_RANGE_CONFIG.max}
                    step={SALARY_RANGE_CONFIG.step}
                    value={[currentSalaryMin, currentSalaryMax]}
                    onValueChange={handleSalarySliderChange}
                    className="py-2"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                    <span>{currencySymbol}15k</span>
                    <span>{currencySymbol}125k</span>
                    <span>{currencySymbol}250k+</span>
                  </div>
                </div>

                {/* Manual Numeric Inputs for Salary */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <Label htmlFor="salaryMin" className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                      Min ({currentSalaryCurrency})
                    </Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      step={1000}
                      min={0}
                      {...register('salaryMin', { valueAsNumber: true })}
                      className="h-8 text-xs focus-visible:ring-[#E8B931]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salaryMax" className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                      Max ({currentSalaryCurrency})
                    </Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      step={1000}
                      min={0}
                      {...register('salaryMax', { valueAsNumber: true })}
                      className="h-8 text-xs focus-visible:ring-[#E8B931]"
                    />
                  </div>
                </div>
                {(errors.salaryMin || errors.salaryMax) && (
                  <p className="text-xs font-medium text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.salaryMax?.message || errors.salaryMin?.message}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-border/60 my-5" />

          {/* SECTION 4: WORK TYPE & MODE */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Laptop className="w-4 h-4 text-[#E8B931]" />
              <span>Employment & Work Environment</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Field 6: Employment Type (Dropdown Select) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="employmentType" className="text-xs font-medium">
                    Employment Type <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground">Contract terms</span>
                </div>
                <Select
                  value={currentEmploymentType}
                  onValueChange={(val) =>
                    setValue('employmentType', val, { shouldValidate: true, shouldDirty: true })
                  }
                >
                  <SelectTrigger
                    id="employmentType"
                    className="w-full h-10 text-sm focus-visible:ring-[#E8B931]"
                    aria-invalid={Boolean(errors.employmentType)}
                  >
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="cursor-pointer py-2">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employmentType && (
                  <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.employmentType.message}</span>
                  </p>
                )}
              </div>

              {/* Field 7: Location */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="location" className="text-xs font-medium">
                    Location {currentWorkMode !== 'Remote' && <span className="text-destructive">*</span>}
                  </Label>
                  <span className="text-[10px] text-muted-foreground">City, State / HQ</span>
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="location"
                    placeholder={
                      currentWorkMode === 'Remote'
                        ? 'Remote worldwide or region-restricted'
                        : 'e.g. San Francisco, CA / London, UK'
                    }
                    {...register('location')}
                    aria-invalid={Boolean(errors.location)}
                    className="h-10 pl-9 text-sm focus-visible:ring-[#E8B931]"
                  />
                </div>
                {errors.location && (
                  <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.location.message}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Field 8: Work Mode (Radio Button Group) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">
                  Work Mode <span className="text-destructive">*</span>
                </Label>
                <span className="text-[10px] text-muted-foreground">Choose workplace flexibility</span>
              </div>

              <RadioGroup
                value={currentWorkMode}
                onValueChange={(val) =>
                  setValue('workMode', val as WorkModeValue, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                {WORK_MODES.map((mode) => {
                  const isChecked = currentWorkMode === mode.value
                  const IconComponent =
                    mode.value === 'On-site'
                      ? Building2
                      : mode.value === 'Hybrid'
                        ? Laptop
                        : Globe

                  return (
                    <label
                      key={mode.value}
                      htmlFor={`mode-${mode.value}`}
                      className={cn(
                        'flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer relative',
                        isChecked
                          ? 'border-[#E8B931] bg-[#E8B931]/10 shadow-xs'
                          : 'border-border bg-card hover:bg-muted/50 hover:border-border/80'
                      )}
                    >
                      <div className="pt-0.5">
                        <RadioGroupItem value={mode.value} id={`mode-${mode.value}`} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <IconComponent className={cn('w-3.5 h-3.5', isChecked ? 'text-[#E8B931]' : 'text-muted-foreground')} />
                          <span className={cn('text-xs font-semibold', isChecked ? 'text-foreground' : 'text-muted-foreground')}>
                            {mode.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug">
                          {mode.description}
                        </p>
                      </div>
                    </label>
                  )
                })}
              </RadioGroup>
              {errors.workMode && (
                <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.workMode.message}</span>
                </p>
              )}
            </div>
          </div>

          <div className="h-px bg-border/60 my-5" />

          {/* SECTION 5: VACANCIES & TIMELINE */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Calendar className="w-4 h-4 text-[#E8B931]" />
              <span>Logistics & Application Timeline</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Field 9: Number of Vacancies */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="vacancies" className="text-xs font-medium">
                    Number of Vacancies <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground">Seats to hire</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const cur = Number(watch('vacancies')) || 1
                      if (cur > 1) {
                        setValue('vacancies', cur - 1, { shouldValidate: true, shouldDirty: true })
                      }
                    }}
                    className="h-10 w-10 shrink-0 cursor-pointer"
                  >
                    -
                  </Button>
                  <div className="relative flex-1">
                    <Users className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="vacancies"
                      type="number"
                      min={1}
                      max={500}
                      {...register('vacancies', { valueAsNumber: true })}
                      aria-invalid={Boolean(errors.vacancies)}
                      className="h-10 pl-9 text-sm text-center font-semibold focus-visible:ring-[#E8B931]"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const cur = Number(watch('vacancies')) || 1
                      setValue('vacancies', cur + 1, { shouldValidate: true, shouldDirty: true })
                    }}
                    className="h-10 w-10 shrink-0 cursor-pointer"
                  >
                    +
                  </Button>
                </div>
                {errors.vacancies && (
                  <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.vacancies.message}</span>
                  </p>
                )}
              </div>

              {/* Field 10: Application Deadline */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="applicationDeadline" className="text-xs font-medium">
                    Application Deadline <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => setQuickDeadline(30)}
                      className="text-[10px] text-[#E8B931] hover:text-[#D8A721] h-5 px-1 font-semibold cursor-pointer"
                    >
                      +30 days
                    </Button>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => setQuickDeadline(60)}
                      className="text-[10px] text-[#E8B931] hover:text-[#D8A721] h-5 px-1 font-semibold cursor-pointer"
                    >
                      +60 days
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="applicationDeadline"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    {...register('applicationDeadline')}
                    aria-invalid={Boolean(errors.applicationDeadline)}
                    className="h-10 pl-9 text-sm focus-visible:ring-[#E8B931]"
                  />
                </div>
                {errors.applicationDeadline && (
                  <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.applicationDeadline.message}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FORM ACTION BAR */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-xs">
        <Button
          type="button"
          variant="outline"
          onClick={handleResetForm}
          disabled={isSubmitting}
          className="w-full sm:w-auto text-xs text-muted-foreground hover:text-foreground cursor-pointer h-10 px-3"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset Form
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial h-10 px-5 text-xs font-medium cursor-pointer"
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-initial h-10 px-6 bg-[#E8B931] hover:bg-[#D8A721] active:bg-[#C59619] text-zinc-950 font-bold text-sm shadow-md shadow-[#E8B931]/20 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4 text-zinc-950" />
                {isEditing ? 'Update Job Vacancy' : 'Create Job Vacancy'}
              </span>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default JobCreateForm
