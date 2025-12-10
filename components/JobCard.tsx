import React from 'react';
import { MapPin, DollarSign, Clock, Briefcase } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md dark:hover:shadow-slate-900 transition-all group">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.title}</h3>
          <p className="text-slate-600 dark:text-slate-400 font-medium">{job.company}</p>
        </div>
        <span className="text-xs text-slate-400 whitespace-nowrap">{job.postedDate}</span>
      </div>

      <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {job.location}
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5" />
          {job.salaryRange}
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex gap-2">
          {job.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-md">
              {tag}
            </span>
          ))}
          {job.tags.length > 2 && (
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-md">
              +{job.tags.length - 2}
            </span>
          )}
        </div>
        <button className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">
          Apply Now
        </button>
      </div>
    </div>
  );
};