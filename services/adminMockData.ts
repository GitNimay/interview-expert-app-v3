export interface AdminStats {
  totalUsers: number;
  totalRecruiters: number;
  totalCandidates: number;
  totalInterviews: number;
  systemHealth: number; // 0-100
  storageUsed: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  type: 'INFO' | 'WARNING' | 'ERROR';
}

export interface AdminRecruiter {
  id: string;
  name: string;
  email: string;
  company: string;
  location: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Pending' | 'Suspended';
  jobsPosted: number;
  lastActive: string;
}

export interface AdminCandidate {
  id: string;
  name: string;
  email: string;
  applications: number;
  interviewsCompleted: number;
  avgScore: number;
  status: 'Active' | 'Inactive' | 'Banned';
  joinedDate: string;
}

export const MOCK_ADMIN_STATS: AdminStats = {
  totalUsers: 12450,
  totalRecruiters: 850,
  totalCandidates: 11600,
  totalInterviews: 45200,
  systemHealth: 98,
  storageUsed: '4.2 TB'
};

export const MOCK_ADMIN_ACTIVITY_DATA = [
  { name: 'Mon', interviews: 120, signups: 45 },
  { name: 'Tue', interviews: 132, signups: 52 },
  { name: 'Wed', interviews: 101, signups: 38 },
  { name: 'Thu', interviews: 134, signups: 65 },
  { name: 'Fri', interviews: 190, signups: 72 },
  { name: 'Sat', interviews: 230, signups: 20 },
  { name: 'Sun', interviews: 210, signups: 15 },
];

export const MOCK_ADMIN_DISTRIBUTION_DATA = [
  { name: 'Recruiters', value: 850 },
  { name: 'Candidates', value: 11600 },
];

export const MOCK_ADMIN_RECRUITERS: AdminRecruiter[] = [
  { id: 'r-1', name: 'Sarah Jenkins', email: 'sarah.j@techflow.com', company: 'TechFlow Systems', location: 'San Francisco, CA', plan: 'Enterprise', status: 'Active', jobsPosted: 12, lastActive: '2 mins ago' },
  { id: 'r-2', name: 'Mike Ross', email: 'mike.r@pearson.com', company: 'Pearson Specter', location: 'New York, NY', plan: 'Pro', status: 'Active', jobsPosted: 5, lastActive: '1 hour ago' },
  { id: 'r-3', name: 'Jessica Chung', email: 'j.chung@startup.io', company: 'Stealth Startup', location: 'Remote', plan: 'Free', status: 'Pending', jobsPosted: 1, lastActive: '2 days ago' },
  { id: 'r-4', name: 'David Wallace', email: 'd.wallace@dunder.com', company: 'Dunder Mifflin', location: 'Scranton, PA', plan: 'Enterprise', status: 'Suspended', jobsPosted: 0, lastActive: '1 week ago' },
  { id: 'r-5', name: 'Robert California', email: 'bob.c@sabres.com', company: 'Sabre', location: 'Florida', plan: 'Pro', status: 'Active', jobsPosted: 8, lastActive: '5 hours ago' },
];

export const MOCK_ADMIN_CANDIDATES: AdminCandidate[] = [
  { id: 'c-1', name: 'Alex Chen', email: 'alex.chen@example.com', applications: 15, interviewsCompleted: 8, avgScore: 8.5, status: 'Active', joinedDate: '2023-09-15' },
  { id: 'c-2', name: 'Emily Zhang', email: 'emily.z@example.com', applications: 4, interviewsCompleted: 2, avgScore: 9.2, status: 'Active', joinedDate: '2023-10-01' },
  { id: 'c-3', name: 'James Wilson', email: 'j.wilson@example.com', applications: 22, interviewsCompleted: 10, avgScore: 6.2, status: 'Inactive', joinedDate: '2023-08-20' },
  { id: 'c-4', name: 'Michael Brown', email: 'm.brown@example.com', applications: 1, interviewsCompleted: 0, avgScore: 0, status: 'Active', joinedDate: '2023-10-25' },
  { id: 'c-5', name: 'Spam Bot', email: 'bot123@spam.com', applications: 100, interviewsCompleted: 0, avgScore: 0, status: 'Banned', joinedDate: '2023-10-26' },
];

export const MOCK_SYSTEM_LOGS: ActivityLog[] = [
  { id: 'l-1', user: 'System', action: 'Daily backup completed successfully', timestamp: '04:00 AM', type: 'INFO' },
  { id: 'l-2', user: 'r-4 (David Wallace)', action: 'Account suspended due to policy violation', timestamp: 'Yesterday', type: 'WARNING' },
  { id: 'l-3', user: 'Load Balancer', action: 'High latency detected in US-East region', timestamp: '2 days ago', type: 'ERROR' },
];