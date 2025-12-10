import React from 'react';
import { Calendar, Clock, ChevronRight, BarChart3, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Interview, InterviewStatus } from '../types';
import { useNavigate } from 'react-router-dom';

interface InterviewCardProps {
  interview: Interview;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({ interview }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: InterviewStatus) => {
    switch (status) {
      case InterviewStatus.COMPLETED: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case InterviewStatus.SCHEDULED: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case InterviewStatus.CANCELLED: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const formattedDate = new Date(interview.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md dark:hover:shadow-slate-900 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(interview.status)}`}>
              {interview.status.replace('_', ' ')}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{interview.jobTitle}</h3>
          <p className="text-slate-600 dark:text-slate-400">{interview.companyName}</p>
        </div>

        <div className="flex items-center gap-4">
          {interview.status === InterviewStatus.COMPLETED && interview.report && (
            <div className="flex items-center gap-4 border-l pl-4 border-slate-100 dark:border-slate-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{interview.report.overallScore}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Score</div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 mb-1">
                  <BarChart3 className="w-3 h-3" /> Tech: {interview.report.technicalScore}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="w-3 h-3" /> Comm: {interview.report.communicationScore}
                </div>
              </div>
            </div>
          )}

          {interview.status === InterviewStatus.SCHEDULED && (
            <button 
              onClick={() => navigate(`/lobby/${interview.id}`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              Join Room
            </button>
          )}

          {interview.status === InterviewStatus.COMPLETED && (
             <button 
             onClick={() => navigate(`/candidate/report/${interview.id}`)}
             className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-all flex items-center gap-2"
           >
             View Report
             <ChevronRight className="w-4 h-4" />
           </button>
          )}
        </div>
      </div>
    </div>
  );
};