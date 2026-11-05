import React, { useState } from 'react'
import {
  Sparkles,
  Users,
  TrendingUp,
  Bot,
  CheckCircle2,
  Clock,
  Radio,
  Building2,
  Award,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import type { ColumnDef, FilterConfig } from '@/components/data-table'
import { mockHRCandidates } from '@/layout/data/mockHRCandidates'
import type { HRCandidate } from '@/layout/data/mockHRCandidates'
import { toast } from 'sonner'

export const AdminDashboardPreview: React.FC = () => {
  const [candidates, setCandidates] = useState<HRCandidate[]>(mockHRCandidates)

  // Handlers for Row Actions
  const handleView = (candidate: HRCandidate) => {
    toast.info(`Viewing profile for ${candidate.candidateName}`, {
      description: `${candidate.department} • ${candidate.role} (${candidate.aiInterviewer})`,
    })
  }

  const handleEdit = (candidate: HRCandidate) => {
    toast.info(`Edit pipeline for ${candidate.candidateName}`, {
      description: `ID: ${candidate.id} • Status: ${candidate.status}`,
    })
  }

  const handleDelete = async (candidate: HRCandidate) => {
    // Simulate async network deletion
    await new Promise((resolve) => setTimeout(resolve, 600))
    setCandidates((prev) => prev.filter((c) => c.id !== candidate.id))
    toast.success(`Candidate record removed`, {
      description: `Permanently deleted ${candidate.candidateName}'s application (${candidate.id}).`,
    })
  }

  const handleBulkDelete = (selectedIds: (string | number)[]) => {
    const idSet = new Set(selectedIds)
    setCandidates((prev) => prev.filter((c) => !idSet.has(c.id)))
    toast.success(`Bulk deletion complete`, {
      description: `Successfully removed ${selectedIds.length} candidate applications.`,
    })
  }

  // Filter Configuration
  const tableFilters: FilterConfig<HRCandidate>[] = [
    {
      id: 'status',
      title: 'Status',
      accessorKey: 'status',
      options: [
        { label: 'Interviewing', value: 'Interviewing', icon: Radio },
        { label: 'Shortlisted', value: 'Shortlisted', icon: Sparkles },
        { label: 'Offer Sent', value: 'Offer Sent', icon: Award },
        { label: 'Under Review', value: 'Under Review', icon: Clock },
        { label: 'Screening Passed', value: 'Screening Passed', icon: CheckCircle2 },
      ],
    },
    {
      id: 'department',
      title: 'Department',
      accessorKey: 'department',
      options: [
        { label: 'Engineering', value: 'Engineering', icon: Building2 },
        { label: 'Product & Design', value: 'Product & Design', icon: Building2 },
        { label: 'Sales & Growth', value: 'Sales & Growth', icon: Building2 },
        { label: 'People & Culture', value: 'People & Culture', icon: Building2 },
        { label: 'Finance & Operations', value: 'Finance & Operations', icon: Building2 },
      ],
    },
  ]

  // Columns Configuration
  const columns: ColumnDef<HRCandidate>[] = [
    {
      id: 'id',
      header: 'Candidate ID',
      accessorKey: 'id',
      type: 'id',
      copyable: true,
      sortable: true,
      className: 'w-32',
    },
    {
      id: 'candidateName',
      header: 'Candidate Name',
      accessorKey: 'candidateName',
      sortable: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#E8B931]/30 to-amber-500/10 border border-[#E8B931]/40 flex items-center justify-center text-xs font-bold text-[#E8B931] shrink-0">
            {row.candidateName.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-foreground truncate max-w-[150px]">
              {row.candidateName}
            </span>
            <span className="text-[10px] text-muted-foreground truncate font-mono">
              {row.experienceLevel}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      type: 'email',
      copyable: true,
      defaultVisible: true,
    },
    {
      id: 'phone',
      header: 'Mobile Phone',
      accessorKey: 'phone',
      type: 'mobile',
      copyable: true,
      defaultVisible: true,
    },
    {
      id: 'department',
      header: 'Target Role & Dept',
      accessorKey: 'role',
      sortable: true,
      cell: ({ row }) => (
        <div className="space-y-0.5 max-w-[260px]">
          <div className="flex items-center gap-1.5">
            <span className="inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded bg-muted text-muted-foreground uppercase tracking-wide">
              {row.department}
            </span>
          </div>
          <p className="text-xs text-foreground font-medium truncate">
            {row.role}
          </p>
        </div>
      ),
    },
    {
      id: 'aiInterviewer',
      header: 'AI Evaluator',
      accessorKey: 'aiInterviewer',
      sortable: true,
      cell: ({ value }) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/60 text-xs font-mono text-muted-foreground">
          <Bot className="w-3 h-3 text-[#E8B931]" />
          <span>{String(value)}</span>
        </span>
      ),
    },
    {
      id: 'matchScore',
      header: 'Match Fit',
      accessorKey: 'matchScore',
      sortable: true,
      cell: ({ value }) => {
        const score = Number(value)
        const isHigh = score >= 90
        return (
          <span
            className={`inline-flex items-center gap-1 text-xs font-mono font-semibold px-2 py-0.5 rounded-md ${
              isHigh
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {score}%
          </span>
        )
      },
    },
    {
      id: 'duration',
      header: 'Interview Duration',
      accessorKey: 'duration',
      sortable: true,
      cell: ({ value }) => (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-mono">
          <Clock className="w-3 h-3 text-muted-foreground/70" />
          <span>{String(value)}</span>
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Hiring Status',
      accessorKey: 'status',
      sortable: true,
      cell: ({ value }) => {
        const val = String(value)
        if (val === 'Interviewing') {
          return (
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold gap-1.5 pl-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Interviewing
            </Badge>
          )
        }
        if (val === 'Shortlisted') {
          return (
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-[11px] font-semibold gap-1.5 pl-2"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              Shortlisted
            </Badge>
          )
        }
        if (val === 'Offer Sent') {
          return (
            <Badge
              variant="outline"
              className="border-blue-500/30 bg-blue-500/10 text-blue-400 text-[11px] font-semibold gap-1.5 pl-2"
            >
              <Award className="w-3 h-3 text-blue-400" />
              Offer Sent
            </Badge>
          )
        }
        if (val === 'Screening Passed') {
          return (
            <Badge
              variant="outline"
              className="border-teal-500/30 bg-teal-500/10 text-teal-400 text-[11px] font-semibold gap-1.5 pl-2"
            >
              <CheckCircle2 className="w-3 h-3 text-teal-400" />
              Passed
            </Badge>
          )
        }
        return (
          <Badge
            variant="outline"
            className="border-border bg-muted/40 text-muted-foreground text-[11px] font-medium"
          >
            Under Review
          </Badge>
        )
      },
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-card to-card border border-[#E8B931]/20">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E8B931] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-time Workforce Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            AI HR Command Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Monitor live AI candidate interviews, recruitment pipelines, and workforce intelligence metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="h-9 rounded-xl bg-[#E8B931] hover:bg-[#D8A721] text-zinc-950 font-semibold text-xs gap-1.5 cursor-pointer">
            <Zap className="w-3.5 h-3.5" />
            <span>Post Requisition</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Active Workforce</span>
            <Users className="w-4 h-4 text-[#E8B931]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">14,820</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12.4%
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Live AI Screenings</span>
            <Bot className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">{candidates.length}</span>
            <span className="text-xs font-semibold text-emerald-400">Online Now</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Candidate Match Fit</span>
            <CheckCircle2 className="w-4 h-4 text-[#E8B931]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">94.8%</span>
            <span className="text-xs font-semibold text-emerald-400">+3.1%</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Screening Hours Saved</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">12,850 hrs</span>
            <span className="text-xs text-muted-foreground">This Month</span>
          </div>
        </div>
      </div>

      {/* Custom Reusable DataTable */}
      <DataTable<HRCandidate>
        data={candidates}
        columns={columns}
        keyField="id"
        title="Active AI Candidate Screenings & Interviews"
        description="Real-time interactive technical & behavioral AI video screenings across departmental pipelines."
        enableRowSelection={true}
        enableExportExcel={true}
        exportExcelFilename="ai_candidate_screenings"
        searchPlaceholder="Search candidate name, ID, role, department, or AI interviewer..."
        filters={tableFilters}
        defaultPageSize={30}
        pageSizeOptions={[30, 50, 70, 100]}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteModalConfig={(candidate) => ({
          title: 'Withdraw & Delete Candidate Application',
          description: `Are you sure you want to permanently delete the candidate application for "${candidate.candidateName}"? All AI video transcripts, behavioral scores, and resume parsing records will be permanently removed.`,
          itemName: `${candidate.id} • ${candidate.department}: ${candidate.role}`,
          confirmText: 'Delete Record',
          cancelText: 'Keep Application',
        })}
        bulkActions={(selectedIds) => (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleBulkDelete(selectedIds)}
            className="h-7 text-xs rounded-lg gap-1.5 cursor-pointer font-semibold"
          >
            <span>Delete Selected ({selectedIds.length})</span>
          </Button>
        )}
      />
    </div>
  )
}

export default AdminDashboardPreview
