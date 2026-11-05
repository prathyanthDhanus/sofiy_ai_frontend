import React from 'react'
import {
  LayoutDashboard,
  Bot,
  Users,
  BookOpen,
  BarChart3,
  BrainCircuit,
  Database,
  FileCheck,
  Settings,
  Radio,
  History,
  Sparkles,
  FileText,
  HelpCircle,
  GitFork,
  UserCheck,
  AlertTriangle,
  UserPlus,
  GraduationCap,
  CalendarCheck,
  FileSpreadsheet,
  Cpu,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Link,
  Layers,
  Folder,
  Briefcase,
  Award,
  Building2,
  Target,
  type LucideProps,
} from 'lucide-react'

const iconMap: Record<string, React.FC<LucideProps>> = {
  LayoutDashboard,
  Bot,
  Users,
  BookOpen,
  BarChart3,
  BrainCircuit,
  Database,
  FileCheck,
  Settings,
  Radio,
  History,
  Sparkles,
  FileText,
  HelpCircle,
  GitFork,
  UserCheck,
  AlertTriangle,
  UserPlus,
  GraduationCap,
  CalendarCheck,
  FileSpreadsheet,
  Cpu,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Link,
  Layers,
  Folder,
  Briefcase,
  Award,
  Building2,
  Target,
}

export interface DynamicIconProps extends LucideProps {
  name?: string
  fallback?: React.FC<LucideProps>
}

/**
 * Dynamically renders a Lucide icon based on string name returned by the backend
 */
export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  fallback: Fallback = Folder,
  className,
  ...props
}) => {
  if (!name) {
    return <Fallback className={className} {...props} />
  }

  // Normalize name lookup (support exact, lowercase, or capitalized)
  const normalizedKey = Object.keys(iconMap).find(
    (key) => key.toLowerCase() === name.toLowerCase().replace(/[-_]/g, '')
  )

  const ResolvedIcon = normalizedKey ? iconMap[normalizedKey] : Fallback

  return <ResolvedIcon className={className} {...props} />
}

export default DynamicIcon
