import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, ShieldCheck } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white font-bold text-3xl mb-4 shadow-xl shadow-blue-600/20">
          IE
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">InterviewExpert</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">Select your portal to continue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {/* Candidate */}
        <button 
          onClick={() => navigate('/candidate')}
          className="group relative bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Candidate</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Join interviews, practice with AI, and view your performance reports.
          </p>
        </button>

        {/* Recruiter */}
        <button 
          onClick={() => navigate('/recruiter')}
          className="group relative bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Recruiter</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage jobs, review AI-graded reports, and shortlist candidates.
          </p>
        </button>

        {/* Admin */}
        <button 
          onClick={() => navigate('/admin')}
          className="group relative bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Admin</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            System configuration, user management, and platform analytics.
          </p>
        </button>
      </div>
    </div>
  );
};