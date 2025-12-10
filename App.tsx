import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RecruiterLayout } from './layouts/RecruiterLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { LandingPage } from './pages/LandingPage';

// Candidate Pages
import { DashboardHome } from './pages/DashboardHome';
import { InterviewReportPage } from './pages/InterviewReportPage';
import { LobbyPage } from './pages/LobbyPage';
import { InterviewsPage } from './pages/InterviewsPage';
import { JobsPage } from './pages/JobsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { RecruiterJobsPage } from './pages/recruiter/RecruiterJobsPage';
import { RecruiterSettingsPage } from './pages/recruiter/RecruiterSettingsPage';
import { RecruiterCandidatesPage } from './pages/recruiter/RecruiterCandidatesPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminRecruitersPage } from './pages/admin/AdminRecruitersPage';
import { AdminCandidatesPage } from './pages/admin/AdminCandidatesPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Root Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Candidate Routes */}
        <Route path="/candidate" element={<Layout />}>
          <Route index element={<DashboardHome />} />
          <Route path="interviews" element={<InterviewsPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="ai-assistant" element={<AIAssistantPage />} />
          <Route path="report/:id" element={<InterviewReportPage />} />
          <Route path="practice" element={<div className="p-8">Practice mode coming soon.</div>} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* Shared Lobby Route (Accessible from candidate dashboard) */}
        <Route path="/lobby/:id" element={<LobbyPage />} />

        {/* Recruiter Routes */}
        <Route path="/recruiter" element={<RecruiterLayout />}>
           <Route index element={<RecruiterDashboard />} />
           <Route path="jobs" element={<RecruiterJobsPage />} />
           <Route path="candidates" element={<RecruiterCandidatesPage />} />
           <Route path="settings" element={<RecruiterSettingsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="recruiters" element={<AdminRecruitersPage />} />
          <Route path="candidates" element={<AdminCandidatesPage />} />
          <Route path="health" element={<div className="p-8 font-medium">System Health Details (Coming Soon)</div>} />
          <Route path="settings" element={<div className="p-8 font-medium">Admin Settings (Coming Soon)</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;