import React from 'react';
import { InterviewCard } from '../components/InterviewCard';
import { JobCard } from '../components/JobCard';
import { MOCK_INTERVIEWS, MOCK_JOBS } from '../services/mockData';
import { TrendingUp, Award, Clock, Plus, Briefcase, CalendarCheck, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 transition-colors">
    <div className={`p-3 rounded-lg ${color} bg-opacity-10 dark:bg-opacity-20`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')} dark:text-white`} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  </div>
);

export const DashboardHome = () => {
  const navigate = useNavigate();
  // Simple aggregation for stats
  const completedInts = MOCK_INTERVIEWS.filter(i => i.status === 'COMPLETED');
  const upcomingInts = MOCK_INTERVIEWS.filter(i => i.status === 'SCHEDULED');
  const avgScore = completedInts.reduce((acc, curr) => acc + (curr.report?.overallScore || 0), 0) / (completedInts.length || 1);

  const chartData = completedInts.map(i => ({
    name: i.companyName,
    Tech: i.report?.technicalScore || 0,
    Comm: i.report?.communicationScore || 0,
    Behav: i.report?.behavioralScore || 0,
  }));

  // Show only limited items on dashboard
  const displayInterviews = MOCK_INTERVIEWS.slice(0, 3);
  const displayJobs = MOCK_JOBS.slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, Candidate</h1>
          <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your applications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={Clock} 
          label="Upcoming Interviews" 
          value={upcomingInts.length.toString()} 
          color="bg-blue-600" 
        />
        <StatCard 
          icon={Award} 
          label="Interviews Completed" 
          value={completedInts.length.toString()} 
          color="bg-green-600" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Average Score" 
          value={avgScore.toFixed(1)} 
          color="bg-indigo-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Interviews Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-slate-900 dark:text-slate-200" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Interviews</h2>
             </div>
             <button 
                onClick={() => navigate('/candidate/interviews')}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
             >
               View All
               <ChevronRight className="w-4 h-4" />
             </button>
          </div>
          <div className="space-y-4">
            {displayInterviews.map(interview => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 h-fit transition-colors">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Performance Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} interval={0} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#fff',
                  }} 
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="Tech" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Comm" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Behav" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div> Technical
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div> Communication
            </div>
             <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div> Behavioral
            </div>
          </div>
        </div>
      </div>

      {/* Available Jobs Section */}
      <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-slate-900 dark:text-slate-200" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Available Jobs</h2>
           </div>
           <button 
             onClick={() => navigate('/candidate/jobs')}
             className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
           >
             View All Positions
             <ChevronRight className="w-4 h-4" />
           </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};