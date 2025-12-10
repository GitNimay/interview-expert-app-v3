import React, { useState } from 'react';
import { Plus, Search, Globe, Lock, MapPin, Users, MoreVertical, Send, X, Check } from 'lucide-react';
import { MOCK_RECRUITER_JOBS, RecruiterJob } from '../../services/recruiterMockData';

export const RecruiterJobsPage = () => {
  const [jobs, setJobs] = useState<RecruiterJob[]>(MOCK_RECRUITER_JOBS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [inviteJob, setInviteJob] = useState<RecruiterJob | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'GLOBAL' | 'PRIVATE'>('ALL');

  // Form States
  const [newJob, setNewJob] = useState<Partial<RecruiterJob>>({
    title: '',
    department: '',
    location: '',
    salaryRange: '',
    type: 'GLOBAL',
    description: ''
  });

  const [inviteEmail, setInviteEmail] = useState('');

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const job: RecruiterJob = {
      id: `rj-${Date.now()}`,
      title: newJob.title!,
      department: newJob.department || 'General',
      location: newJob.location || 'Remote',
      salaryRange: newJob.salaryRange || 'Competitive',
      type: newJob.type as 'GLOBAL' | 'PRIVATE',
      status: 'ACTIVE',
      postedDate: new Date().toISOString().split('T')[0],
      applicants: 0,
      description: newJob.description || ''
    };
    setJobs([job, ...jobs]);
    setIsCreateModalOpen(false);
    setNewJob({ title: '', department: '', location: '', salaryRange: '', type: 'GLOBAL', description: '' });
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteJob) return;
    
    // Simulate API call
    alert(`Invitation sent to ${inviteEmail} for position: ${inviteJob.title}`);
    setInviteJob(null);
    setInviteEmail('');
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'GLOBAL') return job.type === 'GLOBAL';
    if (filter === 'PRIVATE') return job.type === 'PRIVATE';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Job Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Create, monitor, and manage your organizations job postings.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Post New Job
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {['ALL', 'GLOBAL', 'PRIVATE'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === f 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()} Jobs
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search positions..." 
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>
      </div>

      {/* Job List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{job.title}</h3>
                  <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    job.type === 'GLOBAL' 
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50' 
                      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50'
                  }`}>
                    {job.type === 'GLOBAL' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {job.type === 'GLOBAL' ? 'Global Post' : 'Private Invite'}
                  </span>
                  <span className="text-xs text-slate-400">Posted {job.postedDate}</span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {job.department}
                  </div>
                  <div>{job.salaryRange}</div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{job.applicants}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Applicants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                       {/* Mock stat */}
                       {Math.floor(job.applicants * 0.4)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Interviewed</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col justify-center items-end gap-3 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                <button 
                  onClick={() => setInviteJob(job)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Request Interview
                </button>
                <button className="w-full md:w-auto px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  View Applicants
                </button>
                <button className="hidden md:block p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                   <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Job Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Post New Position</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateJob} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                      placeholder="e.g. Engineering"
                      value={newJob.department}
                      onChange={(e) => setNewJob({...newJob, department: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                      placeholder="e.g. Remote, New York"
                      value={newJob.location}
                      onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Visibility</label>
                   <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setNewJob({...newJob, type: 'GLOBAL'})}
                        className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          newJob.type === 'GLOBAL' 
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                         <Globe className="w-5 h-5" />
                         <div className="text-left">
                           <div className="font-bold text-sm">Global Job</div>
                           <div className="text-xs opacity-80">Visible to all candidates</div>
                         </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNewJob({...newJob, type: 'PRIVATE'})}
                        className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          newJob.type === 'PRIVATE' 
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' 
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                         <Lock className="w-5 h-5" />
                         <div className="text-left">
                           <div className="font-bold text-sm">Private Job</div>
                           <div className="text-xs opacity-80">Invite-only application</div>
                         </div>
                      </button>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea 
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white h-24 resize-none"
                    placeholder="Briefly describe the role..."
                    value={newJob.description}
                    onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                >
                  Create Job Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Candidate Modal */}
      {inviteJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Request Interview</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Inviting candidate for <span className="font-medium text-slate-900 dark:text-white">{inviteJob.title}</span></p>
            </div>
            
            <form onSubmit={handleSendInvite} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Candidate Email Address</label>
                <input 
                  required
                  type="email" 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                  placeholder="candidate@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-slate-500 mt-2">
                  {inviteJob.type === 'PRIVATE' 
                    ? 'This is a private job. The candidate will receive a unique access link.'
                    : 'The candidate will be invited to apply to this global listing.'}
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setInviteJob(null)}
                  className="flex-1 px-4 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-transparent"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-slate-900 dark:bg-blue-600 text-white font-medium rounded-xl hover:opacity-90 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};