import React from 'react';
import { Users, Briefcase, FileCheck, Calendar, MoreVertical, TrendingUp, AlertTriangle, Eye, ArrowUpRight } from 'lucide-react';
import { MOCK_RECRUITER_STATS, MOCK_CANDIDATES } from '../../services/recruiterMockData';

const StatCard = ({ label, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
        <ArrowUpRight className="w-3 h-3" />
        {trend}
      </span>
    </div>
    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
  </div>
);

export const RecruiterDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back! You have {MOCK_RECRUITER_STATS.pendingReviews} new candidate reports to review.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Active Jobs" 
          value={MOCK_RECRUITER_STATS.activeJobs} 
          icon={Briefcase} 
          trend="+12%"
          color="bg-blue-600"
        />
        <StatCard 
          label="Total Candidates" 
          value={MOCK_RECRUITER_STATS.totalCandidates} 
          icon={Users} 
          trend="+5%"
          color="bg-indigo-600"
        />
        <StatCard 
          label="Pending Reviews" 
          value={MOCK_RECRUITER_STATS.pendingReviews} 
          icon={FileCheck} 
          trend="+8%"
          color="bg-amber-500"
        />
        <StatCard 
          label="Interviews Scheduled" 
          value={MOCK_RECRUITER_STATS.upcomingInterviews} 
          icon={Calendar} 
          trend="+2%"
          color="bg-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Candidates Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Applications</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Score</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {MOCK_CANDIDATES.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src={candidate.candidateAvatar} alt="" className="w-8 h-8 rounded-full" />
                        <div className="font-medium text-slate-900 dark:text-white">{candidate.candidateName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                      {candidate.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {candidate.scores ? (
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${candidate.scores.overall >= 8 ? 'text-green-600' : candidate.scores.overall >= 6 ? 'text-amber-600' : 'text-red-600'}`}>
                            {candidate.scores.overall}
                          </span>
                          {candidate.flags && candidate.flags.severity === 'High' && (
                            <span title="High Suspicion Flag">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                        ${candidate.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          candidate.status === 'Interviewing' ? 'bg-blue-100 text-blue-700' : 
                          'bg-slate-100 text-slate-600'}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Insight */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">Create New Position</h3>
            <p className="text-blue-100 text-sm mb-4">Set up a new AI-driven interview pipeline for your next role.</p>
            <button className="w-full py-2.5 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
              Post a Job
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Pipeline Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Senior React Engineer</span>
                  <span className="font-medium text-slate-900 dark:text-white">12/20</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Product Designer</span>
                  <span className="font-medium text-slate-900 dark:text-white">8/15</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '53%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Backend Developer</span>
                  <span className="font-medium text-slate-900 dark:text-white">5/10</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};