import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white font-bold text-3xl mb-4 shadow-xl shadow-blue-600/20">
          IE
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">InterviewExpert</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">AI-Powered Interview Intelligence Platform</p>
      </div>

      <div className="flex gap-4 max-w-md w-full">
        <button 
          onClick={() => navigate('/login')}
          className="flex-1 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group"
        >
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <LogIn className="w-6 h-6" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">Log In</span>
        </button>

        <button 
          onClick={() => navigate('/signup')}
          className="flex-1 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group"
        >
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
            <UserPlus className="w-6 h-6" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">Sign Up</span>
        </button>
      </div>
    </div>
  );
};