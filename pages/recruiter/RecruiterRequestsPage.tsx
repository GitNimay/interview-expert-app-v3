import React, { useState } from 'react';
import { MOCK_REQUESTS, CandidateRequest } from '../../services/recruiterMockData';
import { Check, X, Clock, MessageSquare } from 'lucide-react';

export const RecruiterRequestsPage = () => {
  const [requests, setRequests] = useState<CandidateRequest[]>(MOCK_REQUESTS);

  const handleAction = (id: string, action: 'Accepted' | 'Declined') => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: action } : req
    ));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Candidate Requests</h1>
        <p className="text-slate-500 dark:text-slate-400">Review and manage incoming interview requests from candidates.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
            <p className="text-slate-500 dark:text-slate-400">No pending requests found.</p>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-1 flex gap-4">
                <img src={request.candidateAvatar} alt="" className="w-12 h-12 rounded-full object-cover bg-slate-200" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{request.candidateName}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                      ${request.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                        request.status === 'Accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-2">{request.role}</p>
                  <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                    <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>"{request.message}"</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                    <Clock className="w-3 h-3" /> Requested on {request.requestDate}
                  </div>
                </div>
              </div>

              {request.status === 'Pending' && (
                <div className="flex md:flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                  <button 
                    onClick={() => handleAction(request.id, 'Accepted')}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm w-full md:w-32"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  <button 
                    onClick={() => handleAction(request.id, 'Declined')}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors w-full md:w-32"
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};