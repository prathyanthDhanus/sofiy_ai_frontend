export interface HRCandidate {
  id: string
  candidateName: string
  email: string
  phone: string
  department: 'Engineering' | 'Product & Design' | 'Sales & Growth' | 'People & Culture' | 'Finance & Operations'
  role: string
  aiInterviewer: string
  duration: string
  experienceLevel: 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Lead' | 'Director'
  status: 'Interviewing' | 'Shortlisted' | 'Offer Sent' | 'Under Review' | 'Screening Passed'
  matchScore: number
}

const departmentRoles = [
  {
    department: 'Engineering' as const,
    roles: [
      'Senior Full-Stack Engineer · React & Node.js',
      'Staff AI/ML Engineer · LLM Infrastructure',
      'Principal Cloud Architect · AWS & Kubernetes',
      'Lead DevOps Engineer · Terraform & CI/CD',
      'Senior Backend Engineer · Distributed Systems',
    ],
    aiInterviewers: ['Sofiy TechScreen-Pro', 'Sofiy CodeEvaluator-v3'],
  },
  {
    department: 'Product & Design' as const,
    roles: [
      'Director of Product · Enterprise AI',
      'Lead UI/UX Designer · Design Systems',
      'Senior Technical Product Manager',
      'Product Growth Manager · B2B SaaS',
      'Principal UX Researcher · AI Agents',
    ],
    aiInterviewers: ['Sofiy ProductLead-Pro', 'Sofiy DesignScreen-v2'],
  },
  {
    department: 'Sales & Growth' as const,
    roles: [
      'Enterprise Account Executive · Global Accounts',
      'Head of Global Revenue Operations',
      'Customer Success Lead · Strategic Accounts',
      'Senior Solutions Architect · Pre-Sales',
      'Senior B2B Performance Marketing Manager',
    ],
    aiInterviewers: ['Sofiy SalesScout-v2', 'Sofiy Behavioral-Pro'],
  },
  {
    department: 'People & Culture' as const,
    roles: [
      'Senior Technical Talent Acquisition Partner',
      'HR Business Partner · Engineering Org',
      'Global People Operations Specialist',
      'Total Rewards & Compensation Analyst',
      'Learning & Leadership Development Lead',
    ],
    aiInterviewers: ['Sofiy CultureFit-v3', 'Sofiy HR-Screener'],
  },
  {
    department: 'Finance & Operations' as const,
    roles: [
      'VP of Strategic Finance & FP&A',
      'Senior Financial Controller · GAAP/IFRS',
      'Corporate Legal Counsel · Tech Contracts',
      'Procurement & Global Vendor Manager',
      'Internal Audit & Compliance Lead',
    ],
    aiInterviewers: ['Sofiy FinScreen-v1', 'Sofiy Operations-Pro'],
  },
]

const candidateNames = [
  'Sophia Reynolds', 'Marcus Vance', 'Aarav Patel', 'Elena Rostova', 'Lucas Chen',
  'Amara Okafor', 'Julian Rossi', 'Chloe Dubois', 'Devon Washington', 'Isabella Morales',
  'Liam Gallagher', 'Mei-Ling Zhou', 'Noah Al-Mansoor', 'Emma Watson', 'Gabriel Silva',
  'Aria Montgomery', 'Zackary Taylor', 'Hana Tanaka', 'Ethan Wright', 'Maya Lin',
  'Oliver Bennett', 'Fatima Zahra', 'Leo Martinez', 'Kavya Sharma', 'Benjamin Fox',
  'Zara Qureshi', 'Alexander Novak', 'Mia Johansson', 'Daniel Kim', 'Tara O\'Connor',
  'Samuel Jackson', 'Nadia Petrova', 'Christopher Lee', 'Grace Hopper', 'Alan Turing',
  'Ada Lovelace', 'Marie Curie', 'Richard Feynman', 'Nikola Tesla', 'Carl Sagan',
  'Kiran Rao', 'Siddharth Roy', 'Freja Lind', 'Carlos Santana', 'Emily Bronte',
  'Arthur Conan', 'George Orwell', 'Virginia Woolf', 'Leo Tolstoy', 'Victor Hugo',
  'Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Johannes Kepler', 'Max Planck',
  'Niels Bohr', 'Erwin Schrodinger', 'Werner Heisenberg', 'Enrico Fermi', 'Paul Dirac',
  'Rosalind Franklin', 'Barbara McClintock', 'Jane Goodall', 'Rachel Carson', 'Dorothy Hodgkin',
  'Tim Berners-Lee', 'Linus Torvalds', 'Grace Murray', 'Claude Shannon', 'John von Neumann',
  'Donald Knuth', 'Dennis Ritchie', 'Ken Thompson', 'Bjarne Stroustrup', 'James Gosling',
  'Guido van Rossum', 'Brendan Eich', 'Anders Hejlsberg', 'Satya Nadella', 'Sundar Pichai',
  'Demis Hassabis', 'Geoffrey Hinton', 'Yann LeCun', 'Yoshua Bengio', 'Andrew Ng',
]

const statuses: HRCandidate['status'][] = [
  'Interviewing',
  'Shortlisted',
  'Offer Sent',
  'Under Review',
  'Screening Passed',
]

const experienceLevels: HRCandidate['experienceLevel'][] = [
  'Entry-Level',
  'Mid-Level',
  'Senior',
  'Lead',
  'Director',
]

// Generate 85 realistic mock candidate screenings
export const mockHRCandidates: HRCandidate[] = candidateNames.map((name, i) => {
  const deptObj = departmentRoles[i % departmentRoles.length]
  const role = deptObj.roles[i % deptObj.roles.length]
  const aiInterviewer = deptObj.aiInterviewers[i % deptObj.aiInterviewers.length]
  const status = statuses[i % statuses.length]
  const experienceLevel = experienceLevels[i % experienceLevels.length]
  const minutes = 20 + ((i * 7) % 40)
  const seconds = 10 + ((i * 13) % 49)
  const idNum = 1000 + i + 1
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '.')
  const matchScore = 82 + ((i * 7) % 17)

  return {
    id: `CAND-${idNum}`,
    candidateName: name,
    email: `${cleanName}@talent.sofiy.ai`,
    phone: `+1 (555) ${String(200 + (i * 9) % 700).padStart(3, '0')}-${String(1000 + (i * 37) % 8999)}`,
    department: deptObj.department,
    role,
    aiInterviewer,
    duration: `${minutes}m ${seconds}s`,
    experienceLevel,
    status,
    matchScore,
  }
})
