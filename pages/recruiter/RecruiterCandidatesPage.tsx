import React, { useState, useRef } from 'react';
import { Search, Plus, Filter, MoreVertical, X, CheckCircle2, XCircle, Clock, Play, AlertTriangle, ChevronRight, Mail, FileText, Sparkles, LayoutDashboard, BrainCircuit, UserCheck, MessageSquare, Bot, Loader2 } from 'lucide-react';
import { MOCK_CANDIDATES, MOCK_RECRUITER_JOBS, CandidateApplication } from '../../services/recruiterMockData';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

export const RecruiterCandidatesPage = () => {
  const navigate = useNavigate();
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [candidates, setCandidates] = useState<CandidateApplication[]>(MOCK_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateApplication | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'transcript'>('overview');
  
  // AI State
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Derive unique roles from active jobs for the filter bar
  const jobRoles = ['ALL', ...Array.from(new Set(MOCK_RECRUITER_JOBS.map(j => j.title)))];

  const filteredCandidates = candidates.filter(c => {
    if (filterRole === 'ALL') return true;
    return c.role === filterRole;
  });

  const handleCandidateSelect = (candidate: CandidateApplication) => {
    setSelectedCandidate(candidate);
    setActiveTab('overview');
    setAiRecommendation(null); // Reset AI state when switching candidates
  };

  const handleStatusUpdate = (id: string, newStatus: CandidateApplication['status']) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    if (selectedCandidate && selectedCandidate.id === id) {
      setSelectedCandidate(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const generateHiringRecommendation = async () => {
    if (!selectedCandidate) return;
    setIsAiLoading(true);
    setAiRecommendation(''); // Clear previous

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        Role: Senior Tech Recruiter
        Task: Analyze the following candidate and provide a hiring recommendation.
        
        Candidate Profile:
        Name: ${selectedCandidate.candidateName}
        Role Applied: ${selectedCandidate.role}
        Scores: Overall ${selectedCandidate.scores?.overall}/10 (Tech: ${selectedCandidate.scores?.technical}, Comm: ${selectedCandidate.scores?.communication})
        Resume Match: ${selectedCandidate.resumeAnalysis?.matchScore}%
        Key Skills Found: ${selectedCandidate.resumeAnalysis?.skillsFound.join(', ')}
        Transcript Snippets: ${JSON.stringify(selectedCandidate.transcript?.slice(0, 2))}
        
        Output Requirements:
        1. "Executive Summary": 3-4 lines summarizing the candidate's fit, strengths, and any red flags.
        2. "Why Hire Me": A persuasive paragraph written from the perspective of why this candidate is the best choice (or why they might not be if scores are low).
        
        Format the output clearly with bold headings.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      setAiRecommendation(response.text);
    } catch (error) {
      console.error("AI Generation Error:", error);
      setAiRecommendation("Unable to generate recommendation at this time. Please try again later.");
    } finally {
      setIsAiLoading(false);
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
      {/* Main Content - Candidate List */}
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
              <button 
                onClick={() => navigate('/recruiter/jobs')}
                className="whitespace-nowrap px-3 py-2 rounded-full text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
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
                {filteredCandidates.map((candidate) => (
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
                        <img src={candidate.candidateAvatar} alt="" className="w-10 h-10 rounded-full object-cover bg-slate-200" />
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
                          {candidate.flags && candidate.flags.severity === 'High' && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
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
                ))}
              </tbody>
            </table>
            {filteredCandidates.length === 0 && (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                No candidates found for this role.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Slide-over / Panel */}
      {selectedCandidate && (
        <div className="w-full lg:w-[550px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300 fixed inset-0 lg:static z-40 lg:z-auto">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0">
            <div className="flex gap-4">
              <img src={selectedCandidate.candidateAvatar} alt="" className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" />
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedCandidate.candidateName}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedCandidate.role}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 dark:text-blue-400">
                  <Mail className="w-3 h-3" />
                  {selectedCandidate.email || 'email@example.com'}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setSelectedCandidate(null)}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Status Banner */}
            <div className={`p-4 rounded-lg flex items-center justify-between ${getStatusColor(selectedCandidate.status)}`}>
               <span className="font-medium text-sm">Current Status</span>
               <span className="font-bold text-sm uppercase tracking-wide">{selectedCandidate.status}</span>
            </div>

            {/* AI Recommendation Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800/50 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Sparkles className="w-24 h-24 text-indigo-600" />
               </div>
               
               <div className="relative z-10">
                 <div className="flex items-center justify-between mb-3">
                   <h3 className="font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                     <Bot className="w-5 h-5" /> AI Hiring Recommendation
                   </h3>
                   {!aiRecommendation && !isAiLoading && (
                     <button 
                      onClick={generateHiringRecommendation}
                      className="text-xs bg-white dark:bg-indigo-700 text-indigo-600 dark:text-white px-3 py-1.5 rounded-full font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-1"
                     >
                       <Sparkles className="w-3 h-3" /> Generate Analysis
                     </button>
                   )}
                 </div>

                 {isAiLoading && (
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 text-sm animate-pulse py-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Analyzing candidate profile...
                    </div>
                 )}

                 {aiRecommendation && (
                   <div className="text-sm text-indigo-800 dark:text-indigo-200 whitespace-pre-line leading-relaxed animate-in fade-in duration-500 bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800">
                     {aiRecommendation}
                   </div>
                 )}
                 
                 {!aiRecommendation && !isAiLoading && (
                   <p className="text-sm text-indigo-700 dark:text-indigo-300 opacity-80">
                     Click to generate a real-time summary and "Why Hire Me" argument based on interview data.
                   </p>
                 )}
               </div>
            </div>

            {/* Interview Result Section */}
            {selectedCandidate.scores && (
              <div>
                 <div className="flex items-center gap-3 mb-3">
                   <h3 className="font-bold text-slate-900 dark:text-white">Interview Result</h3>
                   {selectedCandidate.flags && selectedCandidate.flags.count > 0 && (
                     <span className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full flex items-center gap-1 border border-red-200 dark:border-red-900/50">
                       <AlertTriangle className="w-3 h-3" />
                       {selectedCandidate.flags.count} Flags Detected
                     </span>
                   )}
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-4">
                    {/* Score Box */}
                    <div className="w-full sm:w-1/3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center p-6">
                       <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">{selectedCandidate.scores.overall}</div>
                       <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Overall</div>
                    </div>

                    {/* Progress Bars */}
                    <div className="flex-1 space-y-5 py-2">
                       <div>
                          <div className="flex justify-between text-sm mb-1.5">
                             <span className="text-slate-600 dark:text-slate-400 font-medium">Technical</span>
                             <span className="font-bold text-slate-900 dark:text-white">{selectedCandidate.scores.technical}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                             <div className="bg-blue-600 h-full rounded-full" style={{width: `${selectedCandidate.scores.technical * 10}%`}}></div>
                          </div>
                       </div>
                       <div>
                          <div className="flex justify-between text-sm mb-1.5">
                             <span className="text-slate-600 dark:text-slate-400 font-medium">Communication</span>
                             <span className="font-bold text-slate-900 dark:text-white">{selectedCandidate.scores.communication}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                             <div className="bg-green-500 h-full rounded-full" style={{width: `${selectedCandidate.scores.communication * 10}%`}}></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* Session Recording */}
            {selectedCandidate.status !== 'New' && selectedCandidate.status !== 'Interviewing' && (
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">Session Recording</h3>
                <div className="bg-slate-900 rounded-xl aspect-video relative group cursor-pointer overflow-hidden shadow-md">
                   <img src="https://picsum.photos/800/450" alt="Thumbnail" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                         <Play className="w-6 h-6 text-white fill-current ml-1" />
                      </div>
                   </div>
                   <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">
                     45:20
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
             <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => handleStatusUpdate(selectedCandidate.id, 'Rejected')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all hover:scale-[1.02]"
                >
                   <XCircle className="w-6 h-6 mb-1.5" />
                   <span className="text-sm font-bold">Reject</span>
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedCandidate.id, 'On Hold')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-all hover:scale-[1.02]"
                >
                   <Clock className="w-6 h-6 mb-1.5" />
                   <span className="text-sm font-bold">Hold</span>
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedCandidate.id, 'Offer')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-green-100 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 transition-all hover:scale-[1.02]"
                >
                   <CheckCircle2 className="w-6 h-6 mb-1.5" />
                   <span className="text-sm font-bold">Accept</span>
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};