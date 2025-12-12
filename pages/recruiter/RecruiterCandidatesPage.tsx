import React, { useState } from 'react';
import { Search, Filter, X, CheckCircle2, XCircle, Clock, Play, AlertTriangle, ChevronRight, Mail, FileText, Sparkles, User, MessageSquare, Send, Paperclip } from 'lucide-react';
import { useCollection } from '../../hooks/useFirestore';
import { where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const RecruiterCandidatesPage = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  
  // Real-time Data
  const { data: candidates } = useCollection('applications', where('recruiterId', '==', userProfile?.uid || ''));
  const { data: jobs } = useCollection('jobs', where('recruiterId', '==', userProfile?.uid || ''));

  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'examination' | 'transcript'>('examination');

  // Derive unique roles
  const jobRoles = ['ALL', ...Array.from(new Set(jobs.map((j: any) => j.title)))];

  const filteredCandidates = candidates.filter((c: any) => {
    if (filterRole === 'ALL') return true;
    return c.role === filterRole;
  });

  const handleCandidateSelect = (candidate: any) => {
    setSelectedCandidate(candidate);
    setActiveTab('examination');
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'applications', id), { status: newStatus });
      if (selectedCandidate && selectedCandidate.id === id) {
        setSelectedCandidate((prev: any) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleRequestInterview = () => {
    if (selectedCandidate) {
      alert(`Interview request sent to ${selectedCandidate.email}`);
      handleStatusUpdate(selectedCandidate.id, 'Interviewing');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Offer': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'On Hold': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Interviewing': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
      {/* Left Column: Candidate List */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${selectedCandidate ? 'w-full lg:w-2/3 hidden lg:flex' : 'w-full'}`}>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Candidates</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and review applications across all your active roles.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <div className="flex items-center gap-2">
              {jobRoles.map(role => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`
                    whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${filterRole === role
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}
                  `}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Candidate Table */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-y-auto flex-1">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Applied For</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500 dark:text-slate-400">
                      No candidates found.
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate: any) => (
                    <tr 
                      key={candidate.id} 
                      onClick={() => handleCandidateSelect(candidate)}
                      className={`
                        cursor-pointer transition-colors
                        ${selectedCandidate?.id === candidate.id 
                          ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-600' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-transparent'}
                      `}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img src={candidate.candidateAvatar || `https://ui-avatars.com/api/?name=${candidate.candidateName}`} alt="" className="w-10 h-10 rounded-full object-cover bg-slate-200" />
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{candidate.candidateName}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{candidate.appliedDate}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{candidate.role}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {candidate.scores ? (
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${candidate.scores.overall >= 8 ? 'text-green-600' : candidate.scores.overall >= 6 ? 'text-amber-600' : 'text-red-600'}`}>
                              {candidate.scores.overall}
                            </span>
                            {candidate.flags && candidate.flags.count > 0 && (
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                         <ChevronRight className="w-5 h-5 text-slate-400 inline-block" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column: Candidate Details Panel */}
      {selectedCandidate && (
        <div className="w-full lg:w-[600px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300 fixed inset-0 lg:static z-40 lg:z-auto">
          
          {/* 1. Header & Actions */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-4 bg-white dark:bg-slate-900 flex-shrink-0">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <img src={selectedCandidate.candidateAvatar || `https://ui-avatars.com/api/?name=${selectedCandidate.candidateName}`} alt="" className="w-16 h-16 rounded-full border-2 border-white dark:border-slate-700 shadow-sm object-cover" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedCandidate.candidateName}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{selectedCandidate.role}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <a href={`mailto:${selectedCandidate.email}`} className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      <Mail className="w-3.5 h-3.5" />
                      {selectedCandidate.email || 'Email not provided'}
                    </a>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${getStatusColor(selectedCandidate.status).replace('bg-', 'bg-opacity-10 border-')}`}>
                {selectedCandidate.status === 'Completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                {selectedCandidate.status}
              </div>
              <div className="flex-1"></div>
              {/* Request Feature */}
              <button 
                onClick={handleRequestInterview}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                Request Interview
              </button>
            </div>
          </div>

          {/* 2. Tabs Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              Profile & Resume
            </button>
            <button
              onClick={() => setActiveTab('examination')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'examination' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              Examination
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'transcript' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              Transcript
            </button>
          </div>

          {/* 3. Content Sections */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950/50">
            
            {/* SECTION 1: Profile & Resume */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                   <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                     <FileText className="w-4 h-4" /> Resume Analysis
                   </h3>
                   
                   <div className="flex items-center gap-6 mb-6">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Match Score</span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{selectedCandidate.resumeAnalysis?.matchScore || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${selectedCandidate.resumeAnalysis?.matchScore || 0}%` }}></div>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                     <div>
                       <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Skills Found</p>
                       <div className="flex flex-wrap gap-2">
                         {selectedCandidate.resumeAnalysis?.skillsFound?.map((skill: string) => (
                           <span key={skill} className="px-2.5 py-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs font-medium rounded-md border border-green-100 dark:border-green-900/30">
                             {skill}
                           </span>
                         ))}
                       </div>
                     </div>
                     
                     {selectedCandidate.resumeAnalysis?.skillsMissing && selectedCandidate.resumeAnalysis.skillsMissing.length > 0 && (
                       <div>
                         <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Skills Missing</p>
                         <div className="flex flex-wrap gap-2">
                           {selectedCandidate.resumeAnalysis?.skillsMissing.map((skill: string) => (
                             <span key={skill} className="px-2.5 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700">
                               {skill}
                             </span>
                           ))}
                         </div>
                       </div>
                     )}

                     <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Experience Summary</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {selectedCandidate.resumeAnalysis?.experienceMatch || "No detailed experience analysis available."}
                        </p>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {/* SECTION 2: Examination Details */}
            {activeTab === 'examination' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {selectedCandidate.scores ? (
                  <>
                    {/* Score Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {/* Overall Score */}
                       <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center min-h-[140px]">
                          <div className="text-5xl font-extrabold text-slate-900 dark:text-white mb-2">{selectedCandidate.scores.overall}</div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Overall Score</div>
                       </div>
                       
                       {/* Skill Breakdown */}
                       <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center gap-6 min-h-[140px]">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-slate-600 dark:text-slate-400 font-medium">Technical</span>
                              <span className="font-bold text-slate-900 dark:text-white">{selectedCandidate.scores.technical}</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${selectedCandidate.scores.technical * 10}%` }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-slate-600 dark:text-slate-400 font-medium">Behavioral</span>
                              <span className="font-bold text-slate-900 dark:text-white">{selectedCandidate.scores.behavioral}</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-600 rounded-full" style={{ width: `${selectedCandidate.scores.behavioral * 10}%` }}></div>
                            </div>
                          </div>
                       </div>
                    </div>

                    {/* AI Summary Section */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                       <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                         <Sparkles className="w-4 h-4 text-purple-600" /> AI Examination Summary
                       </h3>
                       <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                         {selectedCandidate.aiAnalysis?.summary || "No automated summary available for this session."}
                       </p>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {/* Strengths */}
                         <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-100 dark:border-green-900/20">
                           <h4 className="text-xs font-bold text-green-800 dark:text-green-400 uppercase mb-3">Strengths</h4>
                           <ul className="space-y-2">
                             {selectedCandidate.aiAnalysis?.strengths.map((s: string, i: number) => (
                               <li key={i} className="flex items-start gap-2 text-xs text-green-700 dark:text-green-300">
                                 <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                 <span className="leading-snug">{s}</span>
                               </li>
                             ))}
                           </ul>
                         </div>
                         {/* Weaknesses */}
                         <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/20">
                           <h4 className="text-xs font-bold text-red-800 dark:text-red-400 uppercase mb-3">Weaknesses</h4>
                           <ul className="space-y-2">
                             {selectedCandidate.aiAnalysis?.weaknesses.map((w: string, i: number) => (
                               <li key={i} className="flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
                                 <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                 <span className="leading-snug">{w}</span>
                               </li>
                             ))}
                           </ul>
                         </div>
                       </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
                    <Clock className="w-8 h-8 mb-2 opacity-50" />
                    <p>Examination not yet completed.</p>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: Transcript */}
            {activeTab === 'transcript' && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-300">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Interview Log
                  </h3>
                </div>
                <div className="p-4 space-y-6">
                  {selectedCandidate.transcript && selectedCandidate.transcript.length > 0 ? (
                    selectedCandidate.transcript.map((item: any, idx: number) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex gap-3">
                           <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs flex-shrink-0">
                             AI
                           </div>
                           <div className="flex-1">
                             <p className="text-sm font-medium text-slate-900 dark:text-white">{item.question}</p>
                           </div>
                           <span className="text-xs text-slate-400">{item.timestamp}</span>
                        </div>
                        <div className="flex gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs flex-shrink-0">
                             <User className="w-4 h-4" />
                           </div>
                           <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg rounded-tl-none">
                             <p className="text-sm text-slate-700 dark:text-slate-300">{item.answer}</p>
                             <div className="mt-2 flex gap-2">
                               <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                 item.sentiment === 'Positive' ? 'bg-green-50 text-green-700 border-green-100' : 
                                 item.sentiment === 'Negative' ? 'bg-red-50 text-red-700 border-red-100' : 
                                 'bg-slate-100 text-slate-600 border-slate-200'
                               }`}>
                                 {item.sentiment} Sentiment
                               </span>
                             </div>
                           </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-sm">
                      No transcript available for this session.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 flex justify-end gap-3">
            <button 
              onClick={() => handleStatusUpdate(selectedCandidate.id, 'Rejected')}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
            >
              Reject
            </button>
            <button 
              onClick={() => handleStatusUpdate(selectedCandidate.id, 'Offer')}
              className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Make Offer
            </button>
          </div>

        </div>
      )}

    </div>
  );
};