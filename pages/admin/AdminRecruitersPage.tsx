import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Building2, MapPin, Mail, Shield, CheckCircle, XCircle, Sparkles, Loader2 } from 'lucide-react';
import { MOCK_ADMIN_RECRUITERS } from '../../services/adminMockData';
import { GoogleGenAI } from "@google/genai";

export const AdminRecruitersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const filteredRecruiters = MOCK_ADMIN_RECRUITERS.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const runAiAudit = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Role: Admin AI
        Task: Audit the following recruiter list and provide a brief status report (3 sentences max).
        
        Data: ${JSON.stringify(MOCK_ADMIN_RECRUITERS.map(r => ({ name: r.name, plan: r.plan, status: r.status, jobs: r.jobsPosted })))}
        
        Focus on:
        1. Distribution of plans (Enterprise vs Free).
        2. Account health (Suspended users).
        3. Overall activity level.
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      setAiAnalysis(response.text);
    } catch (e) {
      console.error(e);
      setAiAnalysis("Unable to generate audit at this time.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recruiter Management</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage organization accounts and permissions.</p>
        </div>
        <button 
          onClick={runAiAudit}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-70"
        >
          {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          AI Network Audit
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
            placeholder="Search by name or company..." 
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

      {/* Recruiters List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Recruiter Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecruiters.map((recruiter) => (
                <tr key={recruiter.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                        {recruiter.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{recruiter.name}</div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <Mail className="w-3 h-3" /> {recruiter.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                       <Building2 className="w-3.5 h-3.5 text-slate-400" />
                       {recruiter.company}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {recruiter.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                      recruiter.plan === 'Enterprise' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/50' :
                      recruiter.plan === 'Pro' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50' :
                      'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    }`}>
                      {recruiter.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {recruiter.status === 'Active' ? <CheckCircle className="w-4 h-4 text-green-500" /> :
                       recruiter.status === 'Suspended' ? <XCircle className="w-4 h-4 text-red-500" /> :
                       <Shield className="w-4 h-4 text-amber-500" />}
                      <span className={`text-sm font-medium ${
                        recruiter.status === 'Active' ? 'text-green-600' :
                        recruiter.status === 'Suspended' ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {recruiter.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
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