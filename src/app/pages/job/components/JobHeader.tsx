import React from 'react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Plus, ChevronUp } from 'lucide-react'
import { cn } from 'cn'

export interface JobHeaderProps {
  isFormOpen: boolean
  onToggleForm: () => void
  onBack?: () => void
  totalJobsCount?: number
  className?: string
}

export const JobHeader: React.FC<JobHeaderProps> = ({
  isFormOpen,
  onToggleForm,
  onBack,
  className,
}) => {
  const handleBackClick = () => {
    if (onBack) {
      onBack()
    } else if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/admin')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  const actionButton = (
    <Button
      type="button"
      onClick={onToggleForm}
      className={cn(
        'h-9 px-4 rounded-xl font-bold text-xs gap-1.5 transition-all duration-200 cursor-pointer shadow-xs',
        isFormOpen
          ? 'bg-muted hover:bg-muted/80 text-foreground border border-border'
          : 'bg-[#E8B931] hover:bg-[#D8A721] text-zinc-950 shadow-[#E8B931]/20'
      )}
    >
      {isFormOpen ? (
        <>
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
          <span>Collapse Form</span>
        </>
      ) : (
        <>
          <Plus className="w-4 h-4 text-zinc-950" />
          <span>Create Job</span>
        </>
      )}
    </Button>
  )

  return (
    <PageHeader
      onBack={handleBackClick}
      backTooltip="Back to HR Console Overview"
      breadcrumbs={[
        {
          label: 'HR Console',
          href: '/admin',
          onClick: (e) => {
            e.preventDefault()
            handleBackClick()
          },
        },
        { label: 'Job Requisitions', href: '#requisitions' },
        { label: 'Job Vacancies & Roles', active: true },
      ]}
      action={actionButton}
      className={className}
    />
  )
}

export default JobHeader
