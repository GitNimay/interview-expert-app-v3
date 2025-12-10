import React, { useState } from 'react';
import { Search, Filter, MoreVertical, User, Activity, AlertTriangle, Ban, Check, Sparkles, Loader2 } from 'lucide-react';
import { MOCK_ADMIN_CANDIDATES } from '../../services/adminMockData';
import { GoogleGenAI } from "@google/genai";

export const AdminCandidatesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredCandidates = MOCK_ADMIN_CANDIDATES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Role: Admin AI
        Task: Analyze the following candidate pool data and provide a brief summary (3 sentences max).
        
        Data: ${JSON.stringify(MOCK_ADMIN_CANDIDATES.map(c => ({ status: c.status, avgScore: c.avgScore, apps: c.applications })))}
        
        Focus on:
        1. Average candidate quality (Scores).
        2. Platform misuse (Banned users/spam).
        3. Engagement levels (Applications count).
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      setAiAnalysis(response.text);
    } catch (e) {
      console.error(e);
      setAiAnalysis("Unable to generate analysis at this time.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Candidate Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Oversee user accounts, applications, and activity.</p>
        </div>
        <button 
          onClick={runAiAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-70"
        >
          {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          AI Talent Pool Analysis
        </button>
      </div>

      {aiAnalysis && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2">
           <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
           <p className="text-sm text-purple-900 dark:text-purple-200 leading-relaxed">{aiAnalysis}</p>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Candidates List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Profile</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Activity Stats</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Score</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{candidate.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {candidate.email}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">Joined: {candidate.joinedDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="space-y-1">
                       <div className="text-sm font-medium text-slate-900 dark:text-white">
                         {candidate.applications} Applications
                       </div>
                       <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                         <Activity className="w-3 h-3" /> {candidate.interviewsCompleted} Interviews Done
                       </div>
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {candidate.avgScore > 0 ? (
                      <span className={`font-bold ${candidate.avgScore >= 8 ? 'text-green-600' : candidate.avgScore >= 6 ? 'text-amber-600' : 'text-red-600'}`}>
                        {candidate.avgScore.toFixed(1)}/10
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      candidate.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50' :
                      candidate.status === 'Banned' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50' :
                      'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    }`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                       {candidate.status === 'Banned' ? (
                          <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Unban">
                             <Check className="w-4 h-4" />
                          </button>
                       ) : (
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Ban User">
                             <Ban className="w-4 h-4" />
                          </button>
                       )}
                       <button className="p-1.5 text-slate-400 hover:text-purple-600 transition-colors">
                         <MoreVertical className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};