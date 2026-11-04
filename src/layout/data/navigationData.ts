import type { ModuleItem } from '../types/navigation'

/**
 * Default static modules and menus representing backend payload structure.
 * When backend API is ready, this same shape can be returned directly.
 */
export const defaultModules: ModuleItem[] = [
  {
    id: 'ai-tutoring',
    title: 'AI Tutoring & Learning',
    description: 'Adaptive mentoring, voice chat & lesson plans',
    icon: 'Bot',
    badge: 'Core',
    menus: [
      {
        id: 'tutor-dashboard',
        title: 'Tutor Overview',
        icon: 'LayoutDashboard',
      },
      {
        id: 'live-sessions',
        title: 'Live Tutoring Sessions',
        icon: 'Radio',
        badge: '18 Live',
        submenus: [
          { id: 'active-voice', title: 'Active Voice & Chat', icon: 'Bot' },
          { id: 'session-history', title: 'Session Transcripts', icon: 'History' },
          { id: 'sentiment-analysis', title: 'Learner Sentiment', icon: 'Sparkles' },
        ],
      },
      {
        id: 'curriculum-mgmt',
        title: 'Curriculum & Lessons',
        icon: 'BookOpen',
        submenus: [
          { id: 'adaptive-plans', title: 'Adaptive Lesson Plans', icon: 'FileText' },
          { id: 'quiz-engine', title: 'AI Quiz Generator', icon: 'HelpCircle' },
          { id: 'knowledge-graph', title: 'Subject Knowledge Tree', icon: 'GitFork' },
        ],
      },
      {
        id: 'diagnostics',
        title: 'Learning Diagnostics',
        icon: 'BarChart3',
      },
    ],
  },
  {
    id: 'student-admin',
    title: 'Learner Administration',
    description: 'Cohort enrollment, progress & user directories',
    icon: 'Users',
    menus: [
      {
        id: 'student-directory',
        title: 'Learners Directory',
        icon: 'Users',
        submenus: [
          { id: 'all-learners', title: 'All Enrolled Students', icon: 'UserCheck' },
          { id: 'at-risk-learners', title: 'Intervention Alerts', badge: '3 Alerts', icon: 'AlertTriangle' },
          { id: 'new-invites', title: 'Pending Invites', icon: 'UserPlus' },
        ],
      },
      {
        id: 'cohorts',
        title: 'Class Cohorts',
        icon: 'GraduationCap',
      },
      {
        id: 'engagement',
        title: 'Attendance & Engagement',
        icon: 'CalendarCheck',
      },
    ],
  },
  {
    id: 'ai-engine',
    title: 'AI Engine & Vector Base',
    description: 'Knowledge embeddings, prompt tuning & safety',
    icon: 'BrainCircuit',
    badge: 'v2.4',
    menus: [
      {
        id: 'knowledge-store',
        title: 'Knowledge Repositories',
        icon: 'Database',
        submenus: [
          { id: 'textbooks', title: 'Textbooks & Documents', icon: 'FileSpreadsheet' },
          { id: 'embeddings-index', title: 'Vector Embeddings', icon: 'Cpu' },
          { id: 'data-sync', title: 'Data Source Sync', icon: 'RefreshCw' },
        ],
      },
      {
        id: 'prompt-engineering',
        title: 'Tutor Prompt Studio',
        icon: 'Sparkles',
      },
      {
        id: 'audit-compliance',
        title: 'Safety & Audit Logs',
        icon: 'FileCheck',
      },
    ],
  },
  {
    id: 'system-settings',
    title: 'System & Security',
    description: 'Access controls, roles & platform configuration',
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
        title: 'API Keys & Webhooks',
        icon: 'Link',
      },
    ],
  },
]
