import { useMemo } from 'react'
import type { ColumnDef, FilterConfig } from '@/components/data-table/types'
import {
  type JobVacancy,
  DUMMY_DEPARTMENTS,
  WORK_MODES,
  EMPLOYMENT_TYPES,
} from '../../constant'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase,
  Building2,
  Laptop,
  Globe,
  Users,
  CheckCircle2,
  Clock,
  Archive,
  Calendar,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  Hourglass,
  Timer,
  FileText,
  GraduationCap,
  UserCheck,
  Code2,
  Palette,
} from 'lucide-react'

/**
 * Format ISO or YYYY-MM-DD date string to DD/MM/YYYY
 */
function formatDateToDDMMYYYY(dateStr: string): string {
  if (!dateStr) return '—'
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    const [year, month, day] = parts
    return `${day}/${month}/${year}`
  }
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Categorize Created On dates into filter buckets
 */
function getCreatedOnBuckets(dateStr: string): string[] {
  if (!dateStr) return []
  const buckets: string[] = []
  const createdDate = new Date(dateStr)
  const now = new Date()

  const month = createdDate.getMonth()
  const year = createdDate.getFullYear()
  if (year === 2026 && month === 9) buckets.push('october-2026')
  if (year === 2026 && month === 10) buckets.push('november-2026')

  const diffTime = now.getTime() - createdDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 1) buckets.push('today')
  if (diffDays <= 7) buckets.push('past-7-days')
  if (diffDays <= 30) buckets.push('past-30-days')

  buckets.push(dateStr)
  return buckets
}

/**
 * Categorize Application Deadline dates into filter buckets
 */
function getDeadlineBuckets(deadlineStr: string): string[] {
  if (!deadlineStr) return []
  const buckets: string[] = []
  const deadlineDate = new Date(deadlineStr)
  const now = new Date()

  const diffTime = deadlineDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    buckets.push('expired')
  } else {
    buckets.push('active-ongoing')
    if (diffDays <= 15) buckets.push('expiring-soon')
    if (diffDays <= 30) buckets.push('next-30-days')
    if (diffDays > 30) buckets.push('upcoming')
  }

  buckets.push(deadlineStr)
  return buckets
}

export interface UseJobListingTableHookReturn {
  columns: ColumnDef<JobVacancy>[]
  filters: FilterConfig<JobVacancy>[]
}

export function useJobListingTableHook(): UseJobListingTableHookReturn {
  const columns: ColumnDef<JobVacancy>[] = useMemo(
    () => [
      // 1. Created Date & Time (Placed first in the table, center aligned, DD/MM/YYYY format)
      {
        id: 'createdAt',
        header: 'Created On',
        accessorKey: 'createdAt',
        sortable: true,
        align: 'center',
        className: 'min-w-[130px]',
        cell: ({ row }) => (
          <div className="flex flex-col items-center justify-center text-center py-0.5">
            <span className="text-xs font-semibold font-mono text-foreground whitespace-nowrap">
              {formatDateToDDMMYYYY(row.createdAt)}
            </span>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap font-mono flex items-center gap-1 justify-center mt-0.5">
              <Clock className="w-2.5 h-2.5 text-muted-foreground" />
              <span>{row.createdTime || '09:00 AM'}</span>
            </span>
          </div>
        ),
      },

      // 2. Full Job ID (Not truncated, with copy capability)
      {
        id: 'id',
        header: 'Job ID',
        accessorKey: 'id',
        type: 'id',
        copyable: true,
        sortable: true,
        className: 'min-w-[165px] whitespace-nowrap',
      },

      // 3. Job Role & Unit
      {
        id: 'jobTitle',
        header: 'Job Role & Unit',
        accessorKey: 'jobTitle',
        sortable: true,
        searchable: true,
        className: 'min-w-[240px]',
        cell: ({ row }) => {
          const dept = DUMMY_DEPARTMENTS.find((d) => d.id === row.department)
          return (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E8B931]/15 border border-[#E8B931]/30 flex items-center justify-center text-[#E8B931] shrink-0 font-bold">
                <Briefcase className="w-4 h-4 text-[#E8B931]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-foreground truncate max-w-[220px]">
                  {row.jobTitle}
                </span>
                <span className="text-[11px] text-muted-foreground truncate">
                  {dept?.label || row.department} • {row.location}
                </span>
              </div>
            </div>
          )
        },
      },

      // 4. Department (Center aligned)
      {
        id: 'department',
        header: 'Department',
        accessorKey: 'department',
        sortable: true,
        align: 'center',
        className: 'min-w-[120px]',
        cell: ({ row }) => {
          const dept = DUMMY_DEPARTMENTS.find((d) => d.id === row.department)
          return (
            <div className="flex items-center justify-center">
              <Badge
                variant="outline"
                className="text-xs font-semibold px-2 py-0.5 border-border bg-muted/40 text-foreground"
              >
                {dept?.code || row.department.toUpperCase()}
              </Badge>
            </div>
          )
        },
      },

      // 5. Work Mode
      {
        id: 'workMode',
        header: 'Work Mode',
        accessorKey: 'workMode',
        sortable: true,
        cell: ({ row }) => {
          const isRemote = row.workMode === 'Remote'
          const isHybrid = row.workMode === 'Hybrid'
          return (
            <Badge
              variant="outline"
              className={
                isRemote
                  ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 gap-1 text-[11px] font-semibold'
                  : isHybrid
                    ? 'border-amber-500/30 bg-amber-500/10 text-[#E8B931] gap-1 text-[11px] font-semibold'
                    : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 gap-1 text-[11px] font-semibold'
              }
            >
              {isRemote && <Globe className="w-3 h-3" />}
              {isHybrid && <Laptop className="w-3 h-3" />}
              {!isRemote && !isHybrid && <Building2 className="w-3 h-3" />}
              <span>{row.workMode}</span>
            </Badge>
          )
        },
      },

      // 6. Employment Type
      {
        id: 'employmentType',
        header: 'Type',
        accessorKey: 'employmentType',
        sortable: true,
        className: 'text-xs text-muted-foreground whitespace-nowrap',
      },

      // 7. Experience (Center aligned)
      {
        id: 'experience',
        header: 'Experience',
        accessorFn: (row) => `${row.experienceMin}-${row.experienceMax}`,
        sortable: true,
        align: 'center',
        className: 'min-w-[110px]',
        cell: ({ row }) => (
          <div className="text-center text-xs font-medium text-foreground whitespace-nowrap">
            {row.experienceMin} - {row.experienceMax} yrs
          </div>
        ),
      },

      // 8. Salary Range
      {
        id: 'salary',
        header: 'Salary Range',
        accessorFn: (row) => row.salaryMin,
        sortable: true,
        cell: ({ row }) => {
          const min = (row.salaryMin / 1000).toFixed(0)
          const max = (row.salaryMax / 1000).toFixed(0)
          return (
            <span className="text-xs font-bold text-emerald-500 font-mono whitespace-nowrap">
              ${min}k - ${max}k /yr
            </span>
          )
        },
      },

      // 9. Vacancies (Center aligned)
      {
        id: 'vacancies',
        header: 'Vacancies',
        accessorKey: 'vacancies',
        sortable: true,
        align: 'center',
        className: 'min-w-[100px]',
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-foreground">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{row.vacancies}</span>
          </div>
        ),
      },

      // 10. Application Deadline (Formatted in DD/MM/YYYY)
      {
        id: 'applicationDeadline',
        header: 'Deadline',
        accessorKey: 'applicationDeadline',
        sortable: true,
        cell: ({ row }) => (
          <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
            {formatDateToDDMMYYYY(row.applicationDeadline)}
          </span>
        ),
      },

      // 11. Status (Closed status displayed in prominent RED color)
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        sortable: true,
        cell: ({ row }) => {
          if (row.status === 'Active') {
            return (
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold gap-1 pl-1.5 whitespace-nowrap"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Active
              </Badge>
            )
          }
          if (row.status === 'Draft') {
            return (
              <Badge
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 text-[#E8B931] text-[11px] font-semibold gap-1 pl-1.5 whitespace-nowrap"
              >
                <Clock className="w-3 h-3 text-[#E8B931]" />
                Draft
              </Badge>
            )
          }
          // Closed status in RED colour
          return (
            <Badge
              variant="outline"
              className="border-rose-500/40 bg-rose-500/15 text-rose-500 dark:text-rose-400 text-[11px] font-semibold gap-1 pl-1.5 whitespace-nowrap"
            >
              <Archive className="w-3 h-3 text-rose-500 dark:text-rose-400" />
              Closed
            </Badge>
          )
        },
      },

      // 12. Created By (Placed after status, default hidden)
      {
        id: 'createdBy',
        header: 'Created By',
        accessorKey: 'createdBy',
        sortable: true,
        defaultVisible: false,
        className: 'min-w-[180px] text-xs text-muted-foreground whitespace-nowrap',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground font-medium">
            {row.createdBy || 'System Admin'}
          </span>
        ),
      },

      // 13. Updated By (Placed after status, default hidden)
      {
        id: 'updatedBy',
        header: 'Updated By',
        accessorKey: 'updatedBy',
        sortable: true,
        defaultVisible: false,
        className: 'min-w-[180px] text-xs text-muted-foreground whitespace-nowrap',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground font-medium">
            {row.updatedBy || 'System Admin'}
          </span>
        ),
      },
    ],
    []
  )

  const filters: FilterConfig<JobVacancy>[] = useMemo(
    () => [
      // 1. Department Filter
      {
        id: 'department',
        title: 'Department',
        icon: Building2,
        accessorKey: 'department',
        options: DUMMY_DEPARTMENTS.map((dept) => ({
          label: dept.label,
          value: dept.id,
          icon:
            dept.id === 'engineering'
              ? Code2
              : dept.id === 'product-design'
                ? Palette
                : Users,
        })),
      },

      // 2. Work Mode Filter
      {
        id: 'workMode',
        title: 'Work Mode',
        icon: Laptop,
        accessorKey: 'workMode',
        options: WORK_MODES.map((mode) => ({
          label: mode.label,
          value: mode.value,
          icon:
            mode.value === 'Remote'
              ? Globe
              : mode.value === 'Hybrid'
                ? Laptop
                : Building2,
        })),
      },

      // 3. Employment Type Filter
      {
        id: 'employmentType',
        title: 'Type',
        icon: Briefcase,
        accessorKey: 'employmentType',
        options: EMPLOYMENT_TYPES.map((type) => ({
          label: type.label,
          value: type.value,
          icon:
            type.value === 'Full-time'
              ? Briefcase
              : type.value === 'Part-time'
                ? Clock
                : type.value === 'Contract'
                  ? FileText
                  : type.value === 'Internship'
                    ? GraduationCap
                    : UserCheck,
        })),
      },

      // 4. Status Filter
      {
        id: 'status',
        title: 'Status',
        icon: CheckCircle2,
        accessorKey: 'status',
        options: [
          { label: 'Active', value: 'Active', icon: CheckCircle2 },
          { label: 'Draft', value: 'Draft', icon: Clock },
          { label: 'Closed', value: 'Closed', icon: Archive },
        ],
      },

      // 5. Created On Filter
      {
        id: 'createdAt',
        title: 'Created On',
        icon: Calendar,
        accessorFn: (row) => getCreatedOnBuckets(row.createdAt),
        options: [
          { label: 'Today', value: 'today', icon: Calendar },
          { label: 'Last 7 Days', value: 'past-7-days', icon: CalendarDays },
          { label: 'Last 30 Days', value: 'past-30-days', icon: CalendarRange },
          { label: 'October 2026', value: 'october-2026', icon: Calendar },
          { label: 'November 2026', value: 'november-2026', icon: Calendar },
        ],
      },

      // 6. Application Deadline Filter
      {
        id: 'applicationDeadline',
        title: 'Deadline',
        icon: CalendarClock,
        accessorFn: (row) => getDeadlineBuckets(row.applicationDeadline),
        options: [
          { label: 'Expiring Soon (< 15 days)', value: 'expiring-soon', icon: Hourglass },
          { label: 'Within 30 Days', value: 'next-30-days', icon: Timer },
          { label: 'Upcoming (> 30 days)', value: 'upcoming', icon: CalendarDays },
          { label: 'Expired / Closed', value: 'expired', icon: Archive },
        ],
      },
    ],
    []
  )

  return {
    columns,
    filters,
  }
}
