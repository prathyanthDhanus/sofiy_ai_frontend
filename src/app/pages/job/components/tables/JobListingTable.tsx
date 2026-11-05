import React from 'react'
import { DataTable } from '@/components/data-table/DataTable'
import {
  useJobListingTableHook,
  type UseJobListingTableHookReturn,
} from './useJobListingTableHook'
import type { JobVacancy } from '../../constant'

export interface JobListingTableProps {
  data: JobVacancy[]
  onEdit: (job: JobVacancy) => void
  onDelete?: (job: JobVacancy) => void
  onView?: (job: JobVacancy) => void
  className?: string
}

export const JobListingTable: React.FC<JobListingTableProps> = ({
  data,
  onEdit,
  onDelete,
  onView,
  className = '',
}) => {
  const { columns = [], filters = [] } = (useJobListingTableHook() ||
    {}) as UseJobListingTableHookReturn

  return (
    <div className={`space-y-4 ${className}`}>
      <DataTable<JobVacancy>
        data={data}
        columns={columns}
        keyField="id"
        title="Active Job Vacancies & Postings"
        description="Comprehensive list of open requisitions, compensation bands, required skills, and applicant pipelines."
        enableRowSelection={true}
        enableExportExcel={true}
        exportExcelFilename="job_vacancies_data"
        searchPlaceholder="Search job title, ID, department, skills, or location..."
        filters={filters}
        defaultPageSize={10}
        pageSizeOptions={[10, 20, 50]}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
        deleteModalConfig={(row) => ({
          itemName: `job vacancy "${row.jobTitle}" (${row.id})`,
          confirmText: 'Delete Vacancy',
        })}
      />
    </div>
  )
}

export default JobListingTable
