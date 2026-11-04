export interface TutoringSession {
  id: string
  studentName: string
  email: string
  phone: string
  subject: 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology' | 'Computer Science'
  topic: string
  mentorModel: string
  duration: string
  gradeLevel: string
  status: 'Live' | 'Solving Quiz' | 'Completed' | 'Paused'
  score?: number
}

const subjectsList = [
  { subject: 'Mathematics', topics: ['Advanced Calculus · Integration by Parts', 'Linear Algebra · Eigenvalues', 'Differential Equations', 'Discrete Probability'], models: ['Sofiy Math-v3', 'Sofiy Math-Pro'] },
  { subject: 'Physics', topics: ['Quantum Physics · Wave-Particle Duality', 'Electromagnetism · Maxwell Equations', 'Thermodynamics · Entropy', 'Classical Mechanics · Lagrangian'], models: ['Sofiy Physics-Pro', 'Sofiy Quantum-v2'] },
  { subject: 'Chemistry', topics: ['Organic Chemistry · Reaction Mechanisms', 'Biochemistry · Enzyme Kinetics', 'Inorganic Chemistry · Coordination Complexes', 'Electrochemistry · Nernst Equation'], models: ['Sofiy Chem-v2', 'Sofiy Molecular-v1'] },
  { subject: 'Biology', topics: ['Genetics · CRISPR Gene Editing', 'Neurobiology · Synaptic Transmission', 'Cellular Respiration · Krebs Cycle', 'Immunology · T-Cell Activation'], models: ['Sofiy Bio-v1', 'Sofiy Cellular-v3'] },
  { subject: 'Computer Science', topics: ['Algorithms · Dynamic Programming', 'System Design · Distributed Cache', 'Machine Learning · Transformer Attention', 'Compilers · Abstract Syntax Trees'], models: ['Sofiy CS-Deep', 'Sofiy CodeMentor'] },
] as const

const studentNames = [
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

const statuses: TutoringSession['status'][] = ['Live', 'Solving Quiz', 'Completed', 'Paused']
const gradeLevels = ['Grade 10', 'Grade 11', 'Grade 12', 'Undergraduate', 'Postgraduate']

// Generate 85 realistic mock sessions
export const mockTutoringSessions: TutoringSession[] = studentNames.map((name, i) => {
  const subObj = subjectsList[i % subjectsList.length]
  const topic = subObj.topics[i % subObj.topics.length]
  const mentorModel = subObj.models[i % subObj.models.length]
  const status = statuses[i % statuses.length]
  const gradeLevel = gradeLevels[i % gradeLevels.length]
  const minutes = 10 + ((i * 7) % 50)
  const seconds = 10 + ((i * 13) % 49)
  const idNum = 1000 + i + 1
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '.')

  return {
    id: `STU-${idNum}`,
    studentName: name,
    email: `${cleanName}@tutoring.sofiy.ai`,
    phone: `+1 (555) ${String(200 + (i * 9) % 700).padStart(3, '0')}-${String(1000 + (i * 37) % 8999)}`,
    subject: subObj.subject,
    topic,
    mentorModel,
    duration: `${minutes}m ${seconds}s`,
    gradeLevel,
    status,
    score: status === 'Completed' ? 80 + ((i * 3) % 20) : undefined,
  }
})
