/**
 * Static constants and dummy data for the Job Vacancy Creation module.
 * Stored at: frontend/src/app/pages/job/constant.ts
 */

export interface DepartmentOption {
  id: string
  label: string
  code: string
  description?: string
}

/**
 * 3 dummy departments available initially in the department dropdown.
 */
export const DUMMY_DEPARTMENTS: DepartmentOption[] = [
  {
    id: "engineering",
    label: "Software Engineering & Tech",
    code: "ENG",
    description: "Frontend, Backend, AI Engineering & Cloud Architecture",
  },
  {
    id: "product-design",
    label: "Product & UI/UX Design",
    code: "PRD",
    description: "Product Strategy, UX Research, Design Systems & Interaction",
  },
  {
    id: "hr-operations",
    label: "Human Resources & Operations",
    code: "HRO",
    description: "People Operations, Talent Acquisition & Organizational Culture",
  },
]

/**
 * Employment type options for the dropdown select.
 */
export const EMPLOYMENT_TYPES = [
  { value: "Full-time", label: "Full-time (40 hrs/wk)" },
  { value: "Part-time", label: "Part-time (20-30 hrs/wk)" },
  { value: "Contract", label: "Contract / Project-based" },
  { value: "Internship", label: "Internship / Trainee" },
  { value: "Freelance", label: "Freelance" },
] as const

/**
 * Work mode options for the radio buttons.
 */
export const WORK_MODES = [
  {
    value: "On-site",
    label: "On-site",
    badge: "Office",
    description: "Work physically from the company office premises",
  },
  {
    value: "Hybrid",
    label: "Hybrid",
    badge: "Flexible",
    description: "Balanced schedule: in-office collaborative & remote days",
  },
  {
    value: "Remote",
    label: "Remote",
    badge: "Anywhere",
    description: "100% remote from anywhere within eligible time zones",
  },
] as const

export type WorkModeValue = (typeof WORK_MODES)[number]["value"]

/**
 * Popular suggested skills chips for quick addition into required skills.
 */
export const SUGGESTED_SKILLS: string[] = [
  "React.js",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Python",
  "Tailwind CSS",
  "PostgreSQL",
  "GraphQL",
  "Docker",
  "AWS",
  "Figma",
  "REST APIs",
  "Prompt Engineering",
  "Jest / Vitest",
  "CI/CD Pipelines",
]

/**
 * Experience Range Selector configuration (in Years).
 */
export const EXPERIENCE_RANGE_CONFIG = {
  min: 0,
  max: 20,
  step: 1,
  defaultMin: 2,
  defaultMax: 5,
  unit: "yrs",
}

/**
 * Salary Range Selector configuration.
 */
export const SALARY_RANGE_CONFIG = {
  min: 15000,
  max: 250000,
  step: 5000,
  defaultMin: 50000,
  defaultMax: 110000,
  currencies: [
    { code: "USD", symbol: "$", label: "USD ($) - Annual" },
    { code: "EUR", symbol: "€", label: "EUR (€) - Annual" },
    { code: "GBP", symbol: "£", label: "GBP (£) - Annual" },
    { code: "INR", symbol: "₹", label: "INR (₹) - Annual" },
    { code: "CAD", symbol: "C$", label: "CAD ($) - Annual" },
  ],
  defaultCurrency: "USD",
}

/**
 * Helper to compute an application deadline date string (e.g. 30 days from now)
 */
export function getDefaultDeadline(daysAhead = 30): string {
  const target = new Date()
  target.setDate(target.getDate() + daysAhead)
  return target.toISOString().split("T")[0]
}

/**
 * Full data model representing a Job Vacancy record.
 */
export interface JobVacancy {
  id: string
  jobTitle: string
  department: string
  jobDescription: string
  requiredSkills: string[]
  experienceMin: number
  experienceMax: number
  salaryMin: number
  salaryMax: number
  salaryCurrency: string
  employmentType: string
  workMode: WorkModeValue
  location: string
  vacancies: number
  applicationDeadline: string
  status: "Active" | "Draft" | "Closed"
  applicantsCount: number
  createdAt: string
  createdTime: string
  createdBy: string
  updatedBy: string
}

/**
 * 10 realistic static job vacancy records for table display and editing.
 */
export const MOCK_JOB_VACANCIES: JobVacancy[] = [
  {
    id: "JOB-2026-001",
    jobTitle: "Senior Full Stack Engineer",
    department: "engineering",
    jobDescription: "Architect and scale high-performance frontend interfaces in Next.js/React and robust cloud services in Node.js/PostgreSQL.",
    requiredSkills: ["React.js", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    experienceMin: 3,
    experienceMax: 6,
    salaryMin: 120000,
    salaryMax: 165000,
    salaryCurrency: "USD",
    employmentType: "Full-time",
    workMode: "Hybrid",
    location: "San Francisco, CA (Hybrid)",
    vacancies: 3,
    applicationDeadline: getDefaultDeadline(28),
    status: "Active",
    applicantsCount: 42,
    createdAt: "2026-10-15",
    createdTime: "09:30 AM",
    createdBy: "Sarah Jenkins (HR Lead)",
    updatedBy: "David Chen (Tech Recruiter)",
  },
  {
    id: "JOB-2026-002",
    jobTitle: "AI & Prompt Systems Architect",
    department: "engineering",
    jobDescription: "Design generative AI agent pipelines, multi-turn LLM reasoning evaluations, and enterprise vector search integration.",
    requiredSkills: ["Python", "Prompt Engineering", "TypeScript", "REST APIs", "AWS"],
    experienceMin: 4,
    experienceMax: 8,
    salaryMin: 145000,
    salaryMax: 210000,
    salaryCurrency: "USD",
    employmentType: "Full-time",
    workMode: "Remote",
    location: "Remote (Global)",
    vacancies: 2,
    applicationDeadline: getDefaultDeadline(35),
    status: "Active",
    applicantsCount: 68,
    createdAt: "2026-10-18",
    createdTime: "11:15 AM",
    createdBy: "Alex Wong (CTO)",
    updatedBy: "Alex Wong (CTO)",
  },
  {
    id: "JOB-2026-003",
    jobTitle: "Principal UI/UX Product Designer",
    department: "product-design",
    jobDescription: "Lead comprehensive end-to-end design systems, user journey wireframes, usability testing, and high-fidelity Figma components.",
    requiredSkills: ["Figma", "UI/UX Design", "Design Systems", "Prototyping"],
    experienceMin: 5,
    experienceMax: 10,
    salaryMin: 130000,
    salaryMax: 180000,
    salaryCurrency: "USD",
    employmentType: "Full-time",
    workMode: "Hybrid",
    location: "New York, NY (HQ)",
    vacancies: 1,
    applicationDeadline: getDefaultDeadline(20),
    status: "Active",
    applicantsCount: 31,
    createdAt: "2026-10-20",
    createdTime: "02:45 PM",
    createdBy: "Elena Rostova (Design Dir)",
    updatedBy: "Elena Rostova (Design Dir)",
  },
  {
    id: "JOB-2026-004",
    jobTitle: "People Operations & HR Generalist",
    department: "hr-operations",
    jobDescription: "Manage global employee onboarding, employee satisfaction surveys, attendance tracking, and compliance management.",
    requiredSkills: ["People Operations", "Talent Management", "HR Compliance"],
    experienceMin: 2,
    experienceMax: 5,
    salaryMin: 65000,
    salaryMax: 95000,
    salaryCurrency: "USD",
    employmentType: "Full-time",
    workMode: "On-site",
    location: "Austin, TX (HQ)",
    vacancies: 2,
    applicationDeadline: getDefaultDeadline(15),
    status: "Active",
    applicantsCount: 19,
    createdAt: "2026-10-22",
    createdTime: "10:00 AM",
    createdBy: "Marcus Vance (VP People)",
    updatedBy: "Sarah Jenkins (HR Lead)",
  },
  {
    id: "JOB-2026-005",
    jobTitle: "Cloud Infrastructure & DevOps Engineer",
    department: "engineering",
    jobDescription: "Maintain Kubernetes clusters, automated zero-downtime CI/CD workflows, Terraform cloud architecture, and DDoS protections.",
    requiredSkills: ["Docker", "AWS", "CI/CD Pipelines", "Kubernetes", "Linux"],
    experienceMin: 3,
    experienceMax: 7,
    salaryMin: 115000,
    salaryMax: 160000,
    salaryCurrency: "USD",
    employmentType: "Full-time",
    workMode: "Remote",
    location: "Remote (US/Canada)",
    vacancies: 4,
    applicationDeadline: getDefaultDeadline(45),
    status: "Active",
    applicantsCount: 54,
    createdAt: "2026-10-24",
    createdTime: "04:20 PM",
    createdBy: "David Chen (Tech Recruiter)",
    updatedBy: "Alex Wong (CTO)",
  },
  {
    id: "JOB-2026-006",
    jobTitle: "Senior Product Manager - AI Copilot",
    department: "product-design",
    jobDescription: "Drive product strategy for autonomous HR agents, customer discovery, cross-functional sprints, and feature rollout metrics.",
    requiredSkills: ["Product Strategy", "Agile Scrum", "User Research", "Data Analytics"],
    experienceMin: 4,
    experienceMax: 8,
    salaryMin: 135000,
    salaryMax: 190000,
    salaryCurrency: "USD",
    employmentType: "Full-time",
    workMode: "Hybrid",
    location: "San Francisco, CA (Hybrid)",
    vacancies: 1,
    applicationDeadline: getDefaultDeadline(25),
    status: "Active",
    applicantsCount: 39,
    createdAt: "2026-10-25",
    createdTime: "01:10 PM",
    createdBy: "Elena Rostova (Design Dir)",
    updatedBy: "Marcus Vance (VP People)",
  },
  {
    id: "JOB-2026-007",
    jobTitle: "Technical Talent Acquisition Partner",
    department: "hr-operations",
    jobDescription: "Partner with engineering leads to source, screen, and interview top AI/ML and full-stack software development candidates.",
    requiredSkills: ["Technical Recruiting", "Sourcing", "Applicant Tracking", "Interviewing"],
    experienceMin: 2,
    experienceMax: 6,
    salaryMin: 70000,
    salaryMax: 105000,
    salaryCurrency: "USD",
    employmentType: "Full-time",
    workMode: "Hybrid",
    location: "Seattle, WA (Hybrid)",
    vacancies: 2,
    applicationDeadline: getDefaultDeadline(14),
    status: "Draft",
    applicantsCount: 8,
    createdAt: "2026-10-28",
    createdTime: "03:50 PM",
    createdBy: "Sarah Jenkins (HR Lead)",
    updatedBy: "Sarah Jenkins (HR Lead)",
  },
  {
    id: "JOB-2026-008",
    jobTitle: "Frontend React/TypeScript Specialist",
    department: "engineering",
    jobDescription: "Craft pixel-perfect, accessible, and responsive user interfaces using Tailwind CSS, Shadcn UI primitives, and React 19.",
    requiredSkills: ["React.js", "TypeScript", "Tailwind CSS", "Jest / Vitest"],
    experienceMin: 2,
    experienceMax: 5,
    salaryMin: 90000,
    salaryMax: 130000,
    salaryCurrency: "USD",
    employmentType: "Full-time",
    workMode: "On-site",
    location: "Boston, MA (Office)",
    vacancies: 5,
    applicationDeadline: getDefaultDeadline(40),
    status: "Active",
    applicantsCount: 77,
    createdAt: "2026-10-29",
    createdTime: "08:45 AM",
    createdBy: "David Chen (Tech Recruiter)",
    updatedBy: "David Chen (Tech Recruiter)",
  },
  {
    id: "JOB-2026-009",
    jobTitle: "Design Systems & Interaction Lead",
    department: "product-design",
    jobDescription: "Build maintainable typography, motion libraries, and WCAG 2.1 AA accessible design system tokens for enterprise dashboards.",
    requiredSkills: ["Figma", "Design Systems", "Tailwind CSS", "UI/UX Design"],
    experienceMin: 3,
    experienceMax: 6,
    salaryMin: 110000,
    salaryMax: 155000,
    salaryCurrency: "USD",
    employmentType: "Contract",
    workMode: "Remote",
    location: "Remote (Global)",
    vacancies: 1,
    applicationDeadline: getDefaultDeadline(30),
    status: "Active",
    applicantsCount: 22,
    createdAt: "2026-11-01",
    createdTime: "12:00 PM",
    createdBy: "Elena Rostova (Design Dir)",
    updatedBy: "Elena Rostova (Design Dir)",
  },
  {
    id: "JOB-2026-010",
    jobTitle: "Culture & Employee Experience Manager",
    department: "hr-operations",
    jobDescription: "Champion employee retention, global team summits, workplace culture initiatives, diversity programs, and engagement scores.",
    requiredSkills: ["Employee Experience", "Internal Communications", "Leadership"],
    experienceMin: 3,
    experienceMax: 7,
    salaryMin: 75000,
    salaryMax: 110000,
    salaryCurrency: "USD",
    employmentType: "Part-time",
    workMode: "On-site",
    location: "Chicago, IL (Office)",
    vacancies: 1,
    applicationDeadline: getDefaultDeadline(10),
    status: "Closed",
    applicantsCount: 45,
    createdAt: "2026-10-10",
    createdTime: "05:15 PM",
    createdBy: "Marcus Vance (VP People)",
    updatedBy: "Marcus Vance (VP People)",
  },
]

/**
 * Default form values for initialization and reset.
 */
export const DEFAULT_JOB_VALUES = {
  jobTitle: "",
  department: "",
  jobDescription: "",
  requiredSkills: ["React.js", "TypeScript"],
  experienceRange: [EXPERIENCE_RANGE_CONFIG.defaultMin, EXPERIENCE_RANGE_CONFIG.defaultMax] as [number, number],
  salaryRange: [SALARY_RANGE_CONFIG.defaultMin, SALARY_RANGE_CONFIG.defaultMax] as [number, number],
  salaryCurrency: "USD",
  employmentType: "Full-time",
  workMode: "Hybrid" as WorkModeValue,
  location: "New York, NY (Hybrid)",
  vacancies: 1,
  applicationDeadline: getDefaultDeadline(),
}
