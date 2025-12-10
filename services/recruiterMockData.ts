export interface RecruiterStats {
  activeJobs: number;
  totalCandidates: number;
  pendingReviews: number;
  upcomingInterviews: number;
}

export interface TranscriptItem {
  question: string;
  answer: string;
  timestamp: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface CandidateRequest {
  id: string;
  candidateName: string;
  candidateAvatar: string;
  role: string;
  requestDate: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  message: string;
}

export interface CandidateApplication {
  id: string;
  candidateName: string;
  candidateAvatar: string;
  role: string;
  appliedDate: string;
  status: 'New' | 'Interviewing' | 'Completed' | 'Offer' | 'Rejected' | 'On Hold';
  email?: string;
  scores?: {
    overall: number;
    technical: number;
    communication: number;
    behavioral: number;
  };
  flags?: {
    count: number;
    severity: 'Low' | 'Medium' | 'High';
  };
  // New detailed fields
  resumeAnalysis?: {
    matchScore: number;
    skillsFound: string[];
    skillsMissing: string[];
    experienceMatch: string;
  };
  aiAnalysis?: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    answerQuality: 'High' | 'Medium' | 'Low';
    behavioralTraits: { trait: string; score: number; explanation: string }[];
  };
  transcript?: TranscriptItem[];
}

export interface RecruiterJob {
  id: string;
  title: string;
  department: string;
  location: string;
  salaryRange: string;
  type: 'GLOBAL' | 'PRIVATE';
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  postedDate: string;
  applicants: number;
  description: string;
}

export const MOCK_RECRUITER_STATS: RecruiterStats = {
  activeJobs: 6,
  totalCandidates: 142,
  pendingReviews: 8,
  upcomingInterviews: 12
};

export const MOCK_REQUESTS: CandidateRequest[] = [
  {
    id: 'req-1',
    candidateName: 'Jordan Lee',
    candidateAvatar: 'https://picsum.photos/106/106',
    role: 'Senior React Engineer',
    requestDate: '2023-10-28',
    status: 'Pending',
    message: 'I have completed the technical assessment and would love to schedule a follow-up interview.'
  },
  {
    id: 'req-2',
    candidateName: 'Casey Smith',
    candidateAvatar: 'https://picsum.photos/107/107',
    role: 'Product Designer',
    requestDate: '2023-10-29',
    status: 'Pending',
    message: 'Requesting an interview to discuss my portfolio.'
  }
];

export const MOCK_RECRUITER_JOBS: RecruiterJob[] = [
  {
    id: 'rj-1',
    title: 'Senior React Engineer',
    department: 'Engineering',
    location: 'Remote',
    salaryRange: '$140k - $180k',
    type: 'GLOBAL',
    status: 'ACTIVE',
    postedDate: '2023-10-01',
    applicants: 45,
    description: 'We are looking for an experienced React developer...'
  },
  {
    id: 'rj-2',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Remote',
    salaryRange: '$130k - $160k',
    type: 'GLOBAL',
    status: 'ACTIVE',
    postedDate: '2023-10-10',
    applicants: 12,
    description: 'Manage our AWS infrastructure and CI/CD pipelines.'
  },
  {
    id: 'rj-3',
    title: 'Cloud Architect',
    department: 'Infrastructure',
    location: 'San Francisco, CA',
    salaryRange: '$180k - $240k',
    type: 'PRIVATE',
    status: 'ACTIVE',
    postedDate: '2023-10-05',
    applicants: 8,
    description: 'Design scalable cloud solutions.'
  },
  {
    id: 'rj-4',
    title: 'Product Designer',
    department: 'Design',
    location: 'New York, NY',
    salaryRange: '$110k - $150k',
    type: 'GLOBAL',
    status: 'ACTIVE',
    postedDate: '2023-10-20',
    applicants: 28,
    description: 'Join our award-winning design team...'
  }
];

export const MOCK_CANDIDATES: CandidateApplication[] = [
  {
    id: 'c-1',
    candidateName: 'Alex Chen',
    candidateAvatar: 'https://picsum.photos/100/100',
    role: 'Senior React Engineer',
    appliedDate: '2023-10-25',
    status: 'Completed',
    email: 'alex.chen@example.com',
    scores: {
      overall: 8.5,
      technical: 9.0,
      communication: 8.0,
      behavioral: 8.5
    },
    flags: { count: 1, severity: 'Low' },
    resumeAnalysis: {
      matchScore: 92,
      skillsFound: ['React', 'TypeScript', 'Redux', 'Node.js'],
      skillsMissing: ['GraphQL'],
      experienceMatch: 'High - 5+ years relevant experience'
    },
    aiAnalysis: {
      summary: "Alex demonstrates exceptional technical depth in React. His answers were structured and showed clear problem-solving skills. Behaviorally, he appeared confident and engaged throughout the session.",
      strengths: ["Deep knowledge of React Hooks", "Clear communication style", "Strong architectural thinking"],
      weaknesses: ["Could provide more concrete examples of conflict resolution"],
      answerQuality: 'High',
      behavioralTraits: [
        { trait: "Confidence", score: 9, explanation: "Maintained eye contact and spoke with a steady tone." },
        { trait: "Clarity", score: 8, explanation: "Explained complex concepts simply." },
        { trait: "Engagement", score: 9, explanation: "High attention level detected." }
      ]
    },
    transcript: [
      { question: "Tell me about a challenging bug you fixed.", answer: "In my last role, we had a race condition in our payment flow. I used extensive logging to identify...", timestamp: "02:15", sentiment: "Positive" },
      { question: "How do you handle state management?", answer: "I prefer using Context for simple state and Redux Toolkit for complex global state...", timestamp: "05:30", sentiment: "Neutral" },
      { question: "Describe a conflict with a team member.", answer: "I once disagreed with a designer about a UI pattern. We A/B tested both solutions...", timestamp: "08:45", sentiment: "Positive" }
    ]
  },
  {
    id: 'c-2',
    candidateName: 'Sarah Miller',
    candidateAvatar: 'https://picsum.photos/101/101',
    role: 'Product Designer',
    appliedDate: '2023-10-26',
    status: 'Interviewing',
    email: 'sarah.m@example.com',
  },
  {
    id: 'c-3',
    candidateName: 'James Wilson',
    candidateAvatar: 'https://picsum.photos/102/102',
    role: 'DevOps Engineer',
    appliedDate: '2023-10-24',
    status: 'Completed',
    email: 'j.wilson@example.com',
    scores: {
      overall: 6.2,
      technical: 5.5,
      communication: 7.0,
      behavioral: 6.0
    },
    flags: { count: 3, severity: 'High' },
    resumeAnalysis: {
      matchScore: 65,
      skillsFound: ['AWS', 'Docker'],
      skillsMissing: ['Kubernetes', 'Terraform'],
      experienceMatch: 'Medium - 2 years relevant experience'
    },
    aiAnalysis: {
      summary: "James struggled with core infrastructure concepts. While communicative, his technical answers lacked depth. Multiple tabs switches were detected during technical questions.",
      strengths: ["Good communication", "Honesty about knowledge gaps"],
      weaknesses: ["Lack of Kubernetes experience", "Distracted behavior"],
      answerQuality: 'Low',
      behavioralTraits: [
        { trait: "Confidence", score: 5, explanation: "Hesitant speech patterns detected." },
        { trait: "Focus", score: 4, explanation: "Frequent looking away and tab switching." }
      ]
    },
    transcript: [
      { question: "Explain the difference between a container and a VM.", answer: "Um, a VM is like a whole computer... and a container is... smaller?", timestamp: "01:20", sentiment: "Negative" },
      { question: "How do you secure an S3 bucket?", answer: "I think you set permissions in the console.", timestamp: "04:10", sentiment: "Neutral" }
    ]
  },
  {
    id: 'c-4',
    candidateName: 'Emily Zhang',
    candidateAvatar: 'https://picsum.photos/103/103',
    role: 'Senior React Engineer',
    appliedDate: '2023-10-23',
    status: 'Completed',
    email: 'emily.z@example.com',
    scores: {
      overall: 9.2,
      technical: 9.5,
      communication: 9.0,
      behavioral: 9.0
    },
    transcript: [],
    resumeAnalysis: {
        matchScore: 98,
        skillsFound: ['React', 'Node', 'AWS', 'Python'],
        skillsMissing: [],
        experienceMatch: "Perfect Match"
    }
  },
  {
    id: 'c-5',
    candidateName: 'Michael Brown',
    candidateAvatar: 'https://picsum.photos/104/104',
    role: 'Cloud Architect',
    appliedDate: '2023-10-27',
    status: 'New',
    email: 'm.brown@example.com',
  },
  {
    id: 'c-6',
    candidateName: 'David Lee',
    candidateAvatar: 'https://picsum.photos/105/105',
    role: 'DevOps Engineer',
    appliedDate: '2023-10-22',
    status: 'Offer',
    email: 'd.lee@example.com',
    scores: {
      overall: 8.8,
      technical: 9.0,
      communication: 8.5,
      behavioral: 8.8
    },
    transcript: []
  }
];