import React, { useState } from 'react';
import { Plus, Search, Globe, Lock, MapPin, Users, MoreVertical, Send, X } from 'lucide-react';
import { useCollection } from '../../hooks/useFirestore';
import { db } from '../../lib/firebase';
import { collection, addDoc, where } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

export const RecruiterJobsPage = () => {
  const { userProfile } = useAuth();
  const { data: jobs } = useCollection('jobs', where('recruiterId', '==', userProfile?.uid || ''));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Form States
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    salaryRange: '',
    type: 'GLOBAL',
    description: ''
  });

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'jobs'), {
        ...newJob,
        recruiterId: userProfile?.uid,
        companyName: userProfile?.companyName || 'Tech Company',
        status: 'ACTIVE',
        postedDate: new Date().toISOString().split('T')[0],
        applicants: 0
      });
      setIsCreateModalOpen(false);
      setNewJob({ title: '', department: '', location: '', salaryRange: '', type: 'GLOBAL', description: '' });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

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

      {/* Job List */}
      <div className="grid grid-cols-1 gap-4">
        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
            <p className="text-slate-500">No jobs posted yet. Create your first job posting.</p>
          </div>
        ) : (
          jobs.map((job: any) => (
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
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-center items-end gap-3 pt-4 md:pt-0">
                  <button className="w-full md:w-auto px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    View Applicants
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
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

    </div>
  );
};