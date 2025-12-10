import React from 'react';
import { MOCK_JOBS } from '../services/mockData';
import { JobCard } from '../components/JobCard';
import { Briefcase, Search, MapPin, SlidersHorizontal } from 'lucide-react';

export const JobsPage = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Briefcase className="w-7 h-7 text-blue-600" />
             Available Positions
           </h1>
           <p className="text-slate-500">Explore open roles tailored to your skills.</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for job title, keyword or company" 
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full md:w-64 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Location" 
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Find Jobs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_JOBS.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
        {/* Duplicate mock jobs to fill the page for demo purposes */}
        {MOCK_JOBS.map(job => (
          <JobCard key={`${job.id}-dup`} job={{...job, id: `${job.id}-dup`}} />
        ))}
      </div>
    </div>
  );
};