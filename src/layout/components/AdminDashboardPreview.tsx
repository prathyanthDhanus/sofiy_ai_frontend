import React, { useState } from 'react'
import {
  Sparkles,
  Zap,
  Users,
  TrendingUp,
  Bot,
  CheckCircle2,
  Clock,
  Radio,
  BookOpen,
  Award,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import type { ColumnDef, FilterConfig } from '@/components/data-table'
import { mockTutoringSessions } from '../data/mockTutoringSessions'
import type { TutoringSession } from '../data/mockTutoringSessions'
import { toast } from 'sonner'

export const AdminDashboardPreview: React.FC = () => {
  const [sessions, setSessions] = useState<TutoringSession[]>(mockTutoringSessions)

  // Handlers for Row Actions
  const handleView = (session: TutoringSession) => {
    toast.info(`Viewing session for ${session.studentName}`, {
      description: `${session.subject} • ${session.topic} (${session.mentorModel})`,
    })
  }

  const handleEdit = (session: TutoringSession) => {
    toast.info(`Edit mode initiated for ${session.studentName}`, {
      description: `ID: ${session.id} • Status: ${session.status}`,
    })
  }

  const handleDelete = async (session: TutoringSession) => {
    // Simulate async network deletion
    await new Promise((resolve) => setTimeout(resolve, 600))
    setSessions((prev) => prev.filter((s) => s.id !== session.id))
    toast.success(`Session deleted successfully`, {
      description: `Permanently removed ${session.studentName}'s session (${session.id}).`,
    })
  }

  const handleBulkDelete = (selectedIds: (string | number)[]) => {
    const idSet = new Set(selectedIds)
    setSessions((prev) => prev.filter((s) => !idSet.has(s.id)))
    toast.success(`Bulk deletion complete`, {
      description: `Successfully deleted ${selectedIds.length} tutoring sessions.`,
    })
  }

  // Filter Configuration
  const tableFilters: FilterConfig<TutoringSession>[] = [
    {
      id: 'status',
      title: 'Status',
      accessorKey: 'status',
      options: [
        { label: 'Live', value: 'Live', icon: Radio },
        { label: 'Solving Quiz', value: 'Solving Quiz', icon: Sparkles },
        { label: 'Completed', value: 'Completed', icon: Award },
        { label: 'Paused', value: 'Paused', icon: Clock },
      ],
    },
    {
      id: 'subject',
      title: 'Subject',
      accessorKey: 'subject',
      options: [
        { label: 'Mathematics', value: 'Mathematics', icon: BookOpen },
        { label: 'Physics', value: 'Physics', icon: BookOpen },
        { label: 'Chemistry', value: 'Chemistry', icon: BookOpen },
        { label: 'Biology', value: 'Biology', icon: BookOpen },
        { label: 'Computer Science', value: 'Computer Science', icon: BookOpen },
      ],
    },
  ]

  // Columns Configuration
  const columns: ColumnDef<TutoringSession>[] = [
    {
      id: 'id',
      header: 'Student ID',
      accessorKey: 'id',
      type: 'id',
      copyable: true,
      sortable: true,
      className: 'w-28',
    },
    {
      id: 'studentName',
      header: 'Student Name',
      accessorKey: 'studentName',
      sortable: true,
      cell: ({ value }) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#E8B931]/30 to-amber-500/10 border border-[#E8B931]/40 flex items-center justify-center text-xs font-bold text-[#E8B931] shrink-0">
            {String(value).charAt(0)}
          </div>
          <span className="font-semibold text-foreground truncate max-w-[150px]">
            {String(value)}
          </span>
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
      id: 'subject',
      header: 'Subject & Topic',
      accessorKey: 'topic',
      sortable: true,
      cell: ({ row }) => (
        <div className="space-y-0.5 max-w-[240px]">
          <div className="flex items-center gap-1.5">
            <span className="inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded bg-muted text-muted-foreground uppercase tracking-wide">
              {row.subject}
            </span>
          </div>
          <p className="text-xs text-foreground font-medium truncate">
            {row.topic}
          </p>
        </div>
      ),
    },
    {
      id: 'mentorModel',
      header: 'AI Mentor',
      accessorKey: 'mentorModel',
      sortable: true,
      cell: ({ value }) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/60 text-xs font-mono text-muted-foreground">
          <Bot className="w-3 h-3 text-[#E8B931]" />
          <span>{String(value)}</span>
        </span>
      ),
    },
    {
      id: 'duration',
      header: 'Duration',
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
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: ({ value }) => {
        const val = String(value)
        if (val === 'Live') {
          return (
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold gap-1.5 pl-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </Badge>
          )
        }
        if (val === 'Solving Quiz') {
          return (
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-[11px] font-semibold gap-1.5 pl-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Solving Quiz
            </Badge>
          )
        }
        if (val === 'Completed') {
          return (
            <Badge
              variant="outline"
              className="border-blue-500/30 bg-blue-500/10 text-blue-400 text-[11px] font-semibold gap-1.5 pl-2"
            >
              <CheckCircle2 className="w-3 h-3 text-blue-400" />
              Completed
            </Badge>
          )
        }
        return (
          <Badge
            variant="outline"
            className="border-border bg-muted/40 text-muted-foreground text-[11px] font-medium"
          >
            Paused
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
            <span>Real-time Learning Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Admin Command Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Monitor live AI tutoring sessions, student performance metrics, and adaptive learning engines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="h-9 rounded-xl bg-[#E8B931] hover:bg-[#D8A721] text-zinc-950 font-semibold text-xs gap-1.5 cursor-pointer">
            <Zap className="w-3.5 h-3.5" />
            <span>Train AI Model</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Active Learners</span>
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
            <span className="text-xs font-medium">Live AI Sessions</span>
            <Bot className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">{sessions.length}</span>
            <span className="text-xs font-semibold text-emerald-400">Online Now</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Concept Mastery Rate</span>
            <CheckCircle2 className="w-4 h-4 text-[#E8B931]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">94.8%</span>
            <span className="text-xs font-semibold text-emerald-400">+3.1%</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">AI Tutoring Hours</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">128,450</span>
            <span className="text-xs text-muted-foreground">This Month</span>
          </div>
        </div>
      </div>

      {/* Custom Reusable DataTable */}
      <DataTable<TutoringSession>
        data={sessions}
        columns={columns}
        keyField="id"
        title="Active AI Tutoring Sessions"
        description="Real-time interactive speech & visual tutoring sessions across student cohorts."
        enableRowSelection={true}
        searchPlaceholder="Search student name, ID, topic, email, or mentor..."
        filters={tableFilters}
        defaultPageSize={30}
        pageSizeOptions={[30, 50, 70, 100]}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteModalConfig={(session) => ({
          title: 'Terminate & Delete AI Session',
          description: `Are you sure you want to permanently delete the live tutoring session for "${session.studentName}"? All adaptive learning models, live audio transcripts, and grading analytics will be permanently erased.`,
          itemName: `${session.id} • ${session.subject}: ${session.topic}`,
          confirmText: 'Delete Session',
          cancelText: 'Keep Session',
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
