import React, { useState } from 'react';
import { MOCK_INTERVIEWS } from '../services/mockData';
import { InterviewCard } from '../components/InterviewCard';
import { CalendarCheck, Search, Filter } from 'lucide-react';
import { InterviewStatus } from '../types';

export const InterviewsPage = () => {
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED'>('ALL');

  const filteredInterviews = MOCK_INTERVIEWS.filter(interview => {
    if (filter === 'UPCOMING') return interview.status === InterviewStatus.SCHEDULED;
    if (filter === 'COMPLETED') return interview.status === InterviewStatus.COMPLETED;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 dark:text-white">
             <CalendarCheck className="w-7 h-7 text-blue-600" />
             My Interviews
           </h1>
           <p className="text-slate-500 dark:text-slate-400">Manage your scheduled sessions and view past reports.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-full sm:w-auto">
          {['ALL', 'UPCOMING', 'COMPLETED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex-1 sm:flex-none ${
                filter === f 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search company or role..." 
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredInterviews.length > 0 ? (
          filteredInterviews.map(interview => (
            <InterviewCard key={interview.id} interview={interview} />
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
            <p className="text-slate-500 dark:text-slate-400">No interviews found matching your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};