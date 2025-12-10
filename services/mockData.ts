import { Interview, InterviewStatus, Job, UserProfile } from '../types';

export const MOCK_USER: UserProfile = {
  id: 'u-123',
  name: 'Alex Chen',
  email: 'alex.chen@example.com',
  avatarUrl: 'https://picsum.photos/100/100',
  phone: '+1 (555) 123-4567',
  resumeName: 'Alex_Chen_Resume_2023.pdf'
};

export const MOCK_INTERVIEWS: Interview[] = [
  {
    id: 'int-001',
    jobTitle: 'Senior React Engineer',
    companyName: 'TechFlow Systems',
    date: '2023-10-25T14:00:00Z',
    durationMinutes: 45,
    status: InterviewStatus.COMPLETED,
    report: {
      overallScore: 8.5,
      technicalScore: 9.0,
      communicationScore: 8.0,
      behavioralScore: 8.5,
      summary: "Candidate demonstrated strong technical proficiency in React hooks and performance optimization. Communication was clear, though slightly fast-paced. Behavior metrics indicate high engagement throughout the session.",
      strengths: [
        "Deep understanding of React lifecycle and hooks",
        "Clear explanation of complex architectural patterns",
        "Efficient problem-solving approach"
      ],
      weaknesses: [
        "Tendency to interrupt the interviewer (simulated AI agent)",
        "Could provide more concrete examples for soft-skill questions"
      ],
      skillScores: [
        { skill: 'React/Redux', score: 9.5 },
        { skill: 'TypeScript', score: 9.0 },
        { skill: 'System Design', score: 7.5 },
        { skill: 'Testing', score: 8.0 }
      ],
      transcripts: [
        { question: "Explain the difference between useMemo and useCallback.", answer: "useMemo is used to memoize values... while useCallback memoizes functions..." }
      ],
      behaviorEvents: [
        { timestamp: 120, type: 'LOOKING_AWAY', severity: 'LOW' },
        { timestamp: 450, type: 'TAB_SWITCH', severity: 'MEDIUM' }
      ]
    }
  },
  {
    id: 'int-002',
    jobTitle: 'Full Stack Developer',
    companyName: 'NovaStart',
    date: '2023-10-28T10:00:00Z',
    durationMinutes: 30,
    status: InterviewStatus.SCHEDULED,
  },
  {
    id: 'int-003',
    jobTitle: 'Frontend Architect',
    companyName: 'Global Corp',
    date: '2023-10-15T09:00:00Z',
    durationMinutes: 60,
    status: InterviewStatus.COMPLETED,
    report: {
      overallScore: 7.2,
      technicalScore: 7.0,
      communicationScore: 7.5,
      behavioralScore: 7.0,
      summary: "Solid foundational knowledge but struggled with advanced system design concepts. Good communicator.",
      strengths: ["Clean code style", "Polite and professional demeanor"],
      weaknesses: ["System scaling knowledge gaps", "Nervous body language detected"],
      skillScores: [
        { skill: 'Architecture', score: 6.5 },
        { skill: 'Frontend Ops', score: 7.0 },
        { skill: 'Leadership', score: 7.5 }
      ],
      transcripts: [],
      behaviorEvents: []
    }
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'j-1',
    title: 'Senior Frontend Engineer',
    company: 'TechFlow Systems',
    location: 'Remote',
    salaryRange: '$140k - $180k',
    tags: ['React', 'TypeScript', 'Tailwind'],
    postedDate: '2 days ago'
  },
  {
    id: 'j-2',
    title: 'Product Designer',
    company: 'Creative AI',
    location: 'New York, NY',
    salaryRange: '$110k - $150k',
    tags: ['Figma', 'UI/UX', 'Prototyping'],
    postedDate: '5 days ago'
  },
  {
    id: 'j-3',
    title: 'Backend Developer',
    company: 'DataStream Inc',
    location: 'Hybrid',
    salaryRange: '$130k - $170k',
    tags: ['Python', 'Django', 'PostgreSQL'],
    postedDate: '1 week ago'
  }
];

export const getInterviewById = (id: string): Interview | undefined => {
  return MOCK_INTERVIEWS.find(i => i.id === id);
};