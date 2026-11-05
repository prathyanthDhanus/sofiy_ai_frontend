import type { ModuleItem } from '../types/navigation'

/**
 * Default static modules and menus representing AI HR backend payload structure.
 * When backend API is ready, this same shape can be returned directly.
 */
export const defaultModules: ModuleItem[] = [
  {
    id: 'ai-recruitment',
    title: 'Job Creation',
    description: 'Create the right job requisitions, roles & interview pipelines with AI assistance',
    icon: 'Briefcase',
    badge: 'Core',  
    menus: [
      {
        id: 'hr-dashboard',
        title: 'HR Overview',
        icon: 'LayoutDashboard',
      },
      {
        id: 'candidate-pipeline',
        title: 'Create Job',
        icon: 'Radio',
        badge: '18',
        submenus: [
          { id: 'active-interviews', title: 'Create a job vacancy', icon: 'Bot' },
          { id: 'interview-transcripts', title: 'Interview Transcripts', icon: 'History' },
          { id: 'sentiment-analysis', title: 'Candidate Sentiment & Fit', icon: 'Sparkles' },
        ],
      },
      {
        id: 'requisitions-mgmt',
        title: 'Job Requisitions & Roles',
        icon: 'FileText',
        submenus: [
          { id: 'open-positions', title: 'Open Job Positions', icon: 'FileSpreadsheet' },
          { id: 'resume-matcher', title: 'AI Resume Matcher', icon: 'HelpCircle' },
          { id: 'competency-matrix', title: 'Skills & Competency Map', icon: 'GitFork' },
        ],
      },
      {
        id: 'recruitment-metrics',
        title: 'Hiring Funnel Analytics',
        icon: 'BarChart3',
      },
    ],
  },
  {
    id: 'workforce-admin',
    title: 'Workforce & Employees',
    description: 'Staff directory, onboarding, performance & attendance',
    icon: 'Users',
    menus: [
      {
        id: 'employee-directory',
        title: 'Employee Directory',
        icon: 'Users',
        submenus: [
          { id: 'all-employees', title: 'All Staff Members', icon: 'UserCheck' },
          { id: 'retention-risk', title: 'Retention & At-Risk Alerts', badge: '3', icon: 'AlertTriangle' },
          { id: 'onboarding-queue', title: 'Onboarding Pipeline', icon: 'UserPlus' },
        ],
      },
      {
        id: 'departments',
        title: 'Departments & Teams',
        icon: 'Layers',
      },
      {
        id: 'attendance-leave',
        title: 'Attendance & Time Off',
        icon: 'CalendarCheck',
      },
      {
        id: 'performance-reviews',
        title: 'Performance & OKRs',
        icon: 'Award',
      },
    ],
  },
  {
    id: 'ai-engine',
    title: 'AI HR Engine & Policies',
    description: 'HR policy embeddings, copilot tuning & labor compliance',
    icon: 'BrainCircuit',
    badge: 'v2.4',
    menus: [
      {
        id: 'knowledge-store',
        title: 'HR Knowledge Repositories',
        icon: 'Database',
        submenus: [
          { id: 'handbooks-policies', title: 'Handbooks & SOP Documents', icon: 'FileSpreadsheet' },
          { id: 'embeddings-index', title: 'Policy Vector Embeddings', icon: 'Cpu' },
          { id: 'hris-sync', title: 'HRIS & Payroll Data Sync', icon: 'RefreshCw' },
        ],
      },
      {
        id: 'prompt-engineering',
        title: 'HR Copilot Prompt Studio',
        icon: 'Sparkles',
      },
      {
        id: 'audit-compliance',
        title: 'Labor Law & Safety Compliance',
        icon: 'FileCheck',
      },
    ],
  },
  {
    id: 'system-settings',
    title: 'System & Security',
    description: 'Role-based permissions, SSO & ATS integrations',
    icon: 'Settings',
    menus: [
      {
        id: 'general-settings',
        title: 'General Preferences',
        icon: 'Sliders',
      },
      {
        id: 'security-roles',
        title: 'Roles & Access Control',
        icon: 'ShieldCheck',
      },
      {
        id: 'api-webhooks',
        title: 'API Keys & ATS Integrations',
        icon: 'Link',
      },
    ],
  },
]
