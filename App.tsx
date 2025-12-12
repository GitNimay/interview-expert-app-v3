import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { RecruiterLayout } from './layouts/RecruiterLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// Candidate Pages
import { DashboardHome } from './pages/DashboardHome';
import { InterviewReportPage } from './pages/InterviewReportPage';
import { LobbyPage } from './pages/LobbyPage';
import { ActiveInterviewPage } from './pages/ActiveInterviewPage'; // Import the new page
import { InterviewsPage } from './pages/InterviewsPage';
import { JobsPage } from './pages/JobsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { RecruiterJobsPage } from './pages/recruiter/RecruiterJobsPage';
import { RecruiterSettingsPage } from './pages/recruiter/RecruiterSettingsPage';
import { RecruiterCandidatesPage } from './pages/recruiter/RecruiterCandidatesPage';
import { RecruiterRequestsPage } from './pages/recruiter/RecruiterRequestsPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }: React.PropsWithChildren<{ allowedRole: 'candidate' | 'recruiter' }>) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-500">Loading account data...</div>;
  
  if (!currentUser) return <Navigate to="/login" replace />;
  
  if (userProfile && userProfile.role !== allowedRole) {
    // Redirect to correct dashboard if logged in but wrong role
    return <Navigate to={userProfile.role === 'recruiter' ? '/recruiter' : '/candidate'} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Candidate Routes */}
          <Route path="/candidate" element={
            <ProtectedRoute allowedRole="candidate">
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="interviews" element={<InterviewsPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="ai-assistant" element={<AIAssistantPage />} />
            <Route path="report/:id" element={<InterviewReportPage />} />
            <Route path="practice" element={<div className="p-8 text-slate-500">Practice mode coming soon.</div>} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          {/* Shared Lobby Route - Protected for candidates */}
          <Route path="/lobby/:id" element={
            <ProtectedRoute allowedRole="candidate">
              <LobbyPage />
            </ProtectedRoute>
          } />

          {/* Active Interview Session - Protected for candidates */}
          <Route path="/interview/:id/session" element={
            <ProtectedRoute allowedRole="candidate">
              <ActiveInterviewPage />
            </ProtectedRoute>
          } />

          {/* Recruiter Routes */}
          <Route path="/recruiter" element={
             <ProtectedRoute allowedRole="recruiter">
               <RecruiterLayout />
             </ProtectedRoute>
          }>
             <Route index element={<RecruiterDashboard />} />
             <Route path="requests" element={<RecruiterRequestsPage />} />
             <Route path="jobs" element={<RecruiterJobsPage />} />
             <Route path="candidates" element={<RecruiterCandidatesPage />} />
             <Route path="settings" element={<RecruiterSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;