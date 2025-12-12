import React from 'react';
import { Users, Briefcase, FileCheck, Calendar, MoreVertical, TrendingUp, AlertTriangle, Eye, ArrowUpRight } from 'lucide-react';
import { useCollection } from '../../hooks/useFirestore';
import { where } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

const StatCard = ({ label, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
  </div>
);

export const RecruiterDashboard = () => {
  const { userProfile } = useAuth();
  
  // Real-time data fetching
  const { data: jobs } = useCollection('jobs', where('recruiterId', '==', userProfile?.uid || ''));
  const { data: applications } = useCollection('applications', where('recruiterId', '==', userProfile?.uid || ''));

  const stats = {
    activeJobs: jobs.filter(j => j.status === 'ACTIVE').length,
    totalCandidates: applications.length,
    pendingReviews: applications.filter(a => a.status === 'Interviewing').length,
    upcomingInterviews: applications.filter(a => a.status === 'Interviewing').length // Simplified logic
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back, {userProfile?.name}! Real-time data from your pipeline.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Active Jobs" 
          value={stats.activeJobs} 
          icon={Briefcase} 
          trend="+12%"
          color="bg-blue-600"
        />
        <StatCard 
          label="Total Applications" 
          value={stats.totalCandidates} 
          icon={Users} 
          trend="+5%"
          color="bg-indigo-600"
        />
        <StatCard 
          label="Pending Reviews" 
          value={stats.pendingReviews} 
          icon={FileCheck} 
          trend="+8%"
          color="bg-amber-500"
        />
        <StatCard 
          label="Active Interviews" 
          value={stats.upcomingInterviews} 
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
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {applications.slice(0, 5).map((app: any) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {app.candidateName?.[0] || 'C'}
                        </div>
                        <div className="font-medium text-slate-900 dark:text-white">{app.candidateName || 'Unknown'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                      {app.role || 'General Application'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      No applications yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">Create New Position</h3>
            <p className="text-blue-100 text-sm mb-4">Set up a new AI-driven interview pipeline for your next role.</p>
            <button className="w-full py-2.5 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
              Post a Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};