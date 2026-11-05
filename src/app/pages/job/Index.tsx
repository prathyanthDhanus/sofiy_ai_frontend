import React, { useState, useRef } from 'react'
import { JobHeader } from './components/JobHeader'
import { JobCreateForm } from './components/jobCreateForm/Index'
import { JobListingTable } from './components/tables/JobListingTable'
import {
  MOCK_JOB_VACANCIES,
  type JobVacancy,
} from './constant'
import type { JobCreateFormValues } from './components/jobCreateForm/schema'
import { toast } from 'sonner'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'

export interface JobPageProps {
  onBackToDashboard?: () => void
}

export const JobPage: React.FC<JobPageProps> = ({ onBackToDashboard }) => {
  // 10 Static data items initialized from constant.ts
  const [jobs, setJobs] = useState<JobVacancy[]>(MOCK_JOB_VACANCIES)
  
  // Default condition: Form is collapsed initially
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [editingJob, setEditingJob] = useState<JobVacancy | null>(null)
  
  const formRef = useRef<HTMLDivElement>(null)

  // Toggle create form from header button
  const handleToggleForm = () => {
    if (isFormOpen) {
      setIsFormOpen(false)
      setEditingJob(null)
    } else {
      setEditingJob(null)
      setIsFormOpen(true)
    }
  }

  // Edit handler: opens form, pre-fills with selected job data, and smoothly scrolls to top
  const handleEdit = (job: JobVacancy) => {
    setEditingJob(job)
    setIsFormOpen(true)
    toast.info(`Editing vacancy: ${job.jobTitle}`, {
      description: `Loaded data for ID ${job.id}`,
    })
    // Smoothly scroll the main container to top so header & form are visible
    setTimeout(() => {
      const scrollContainer = document.querySelector('main.overflow-y-auto')
      scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' })
    }, 50)
  }

  // Delete handler
  const handleDelete = (job: JobVacancy) => {
    setJobs((prev) => prev.filter((j) => j.id !== job.id))
    if (editingJob?.id === job.id) {
      setEditingJob(null)
      setIsFormOpen(false)
    }
    toast.success('Job Vacancy Deleted', {
      description: `Removed "${job.jobTitle}" (${job.id}) from listings.`,
    })
  }

  // View handler
  const handleView = (job: JobVacancy) => {
    toast.info(`Viewing job requisition`, {
      description: `${job.jobTitle} • ${job.workMode} • ${job.vacancies} Openings`,
    })
  }

  // Save / Update handler from JobCreateForm
  const handleFormSuccess = (values: JobCreateFormValues) => {
    if (editingJob) {
      // Update existing record
      setJobs((prev) =>
        prev.map((j) =>
          j.id === editingJob.id
            ? {
                ...j,
                jobTitle: values.jobTitle,
                department: values.department,
                jobDescription: values.jobDescription,
                requiredSkills: values.requiredSkills,
                experienceMin: values.experienceMin,
                experienceMax: values.experienceMax,
                salaryMin: values.salaryMin,
                salaryMax: values.salaryMax,
                salaryCurrency: values.salaryCurrency,
                employmentType: values.employmentType,
                workMode: values.workMode,
                location: values.location,
                vacancies: values.vacancies,
                applicationDeadline: values.applicationDeadline,
                updatedBy: 'Current User (HR Manager)',
              }
            : j
        )
      )
      toast.success('Record updated in table listing!')
    } else {
      // Add newly created job to top of the table list
      const now = new Date()
      const newJobId = `JOB-2026-${String(jobs.length + 1).padStart(3, '0')}`
      const newJob: JobVacancy = {
        id: newJobId,
        jobTitle: values.jobTitle,
        department: values.department,
        jobDescription: values.jobDescription,
        requiredSkills: values.requiredSkills,
        experienceMin: values.experienceMin,
        experienceMax: values.experienceMax,
        salaryMin: values.salaryMin,
        salaryMax: values.salaryMax,
        salaryCurrency: values.salaryCurrency,
        employmentType: values.employmentType,
        workMode: values.workMode,
        location: values.location,
        vacancies: values.vacancies,
        applicationDeadline: values.applicationDeadline,
        status: 'Active',
        applicantsCount: 0,
        createdAt: now.toISOString().split('T')[0],
        createdTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdBy: 'Current User (HR Manager)',
        updatedBy: 'Current User (HR Manager)',
      }
      setJobs((prev) => [newJob, ...prev])
      toast.success(`New job vacancy ${newJobId} added to table!`)
    }

    // Smoothly collapse form back after short confirmation
    setTimeout(() => {
      setIsFormOpen(false)
      setEditingJob(null)
    }, 1200)
  }

  const handleCancelForm = () => {
    setIsFormOpen(false)
    setEditingJob(null)
  }

  // Prepare initial data shape if editing
  const initialFormData: JobCreateFormValues | null = editingJob
    ? {
        jobTitle: editingJob.jobTitle,
        department: editingJob.department,
        jobDescription: editingJob.jobDescription,
        requiredSkills: editingJob.requiredSkills,
        experienceMin: editingJob.experienceMin,
        experienceMax: editingJob.experienceMax,
        salaryMin: editingJob.salaryMin,
        salaryMax: editingJob.salaryMax,
        salaryCurrency: editingJob.salaryCurrency || 'USD',
        employmentType: editingJob.employmentType,
        workMode: editingJob.workMode,
        location: editingJob.location,
        vacancies: editingJob.vacancies,
        applicationDeadline: editingJob.applicationDeadline,
      }
    : null

  return (
    <div className="space-y-6 w-full">
      {/* 1. Header with Breadcrumb on left + Back button, and Create Job toggle button on right */}
      <JobHeader
        isFormOpen={isFormOpen}
        onToggleForm={handleToggleForm}
        onBack={onBackToDashboard}
        totalJobsCount={jobs.length}
      />

      {/* 2. Collapsible Form Container (Default collapsed, expands when Create Job or Edit is clicked) */}
      <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen} className="w-full">
        <CollapsibleContent className="transition-all duration-300 ease-in-out data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
          <div ref={formRef} className="pt-1 pb-2">
            <JobCreateForm
              initialData={initialFormData}
              isEditing={Boolean(editingJob)}
              onCancel={handleCancelForm}
              onSuccess={handleFormSuccess}
            />
          </div>

          {/* Divider between the form and the table */}
          <div className="pt-3 pb-2">
            <Separator className="bg-border/70" />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* 3. Job Vacancy Listing Table powered by reusable DataTable primitive */}
      <div className="w-full">
        <JobListingTable
          data={jobs}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>
    </div>
  )
}

export default JobPage
