import React from 'react';
import { JobCard } from '../components/JobCard';
import { useAuth } from '../contexts/AuthContext';
import { useCollection } from '../hooks/useFirestore';
import { Briefcase, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardHome = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  
  // Real-time jobs
  const { data: jobs, loading } = useCollection('jobs');
  
  // Mock recent for now as we transition interviews to DB
  const displayJobs = jobs.slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {userProfile?.name}</h1>
          <p className="text-slate-500 dark:text-slate-400">View available jobs and manage your interviews.</p>
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
        
        {loading ? (
          <div>Loading jobs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayJobs.map((job: any) => (
              <JobCard key={job.id} job={{
                id: job.id,
                title: job.title,
                company: job.companyName,
                location: job.location,
                salaryRange: job.salaryRange,
                tags: [job.department],
                postedDate: job.postedDate
              }} />
            ))}
            {displayJobs.length === 0 && (
               <p className="text-slate-500 col-span-3 text-center py-8">No jobs posted yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};