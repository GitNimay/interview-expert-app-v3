export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  IN_PROGRESS = 'IN_PROGRESS'
}

export interface SkillScore {
  skill: string;
  score: number; // 0-10
}

export interface BehaviorEvent {
  timestamp: number; // seconds from start
  type: 'TAB_SWITCH' | 'LOOKING_AWAY' | 'ABSENCE' | 'NO_SPEECH';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface InterviewReport {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  behavioralScore: number;
  strengths: string[];
  weaknesses: string[];
  transcripts: { question: string; answer: string }[];
  behaviorEvents: BehaviorEvent[];
  skillScores: SkillScore[];
  summary: string;
}

export interface Interview {
  id: string;
  jobTitle: string;
  companyName: string;
  date: string; // ISO date string
  durationMinutes: number;
  status: InterviewStatus;
  report?: InterviewReport;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  resumeName?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  tags: string[];
  postedDate: string;
}