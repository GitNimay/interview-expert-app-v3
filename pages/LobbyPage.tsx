import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, Camera, Wifi, Check, AlertCircle } from 'lucide-react';
import { getInterviewById } from '../services/mockData';

export const LobbyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const interview = getInterviewById(id || '');
  
  const [checking, setChecking] = useState(true);
  const [checks, setChecks] = useState({
    camera: false,
    mic: false,
    connection: false
  });

  useEffect(() => {
    // Simulate system checks
    const timer = setTimeout(() => {
      setChecks({ camera: true, mic: true, connection: true });
      setChecking(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartSession = () => {
    // Navigate to the active interview session
    navigate(`/interview/${id}/session`);
  };

  if (!interview) return <div>Interview not found</div>;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">System Check</h1>
        <p className="text-slate-500 mb-8">Let's ensure everything is ready for your interview with {interview.companyName}.</p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${checks.camera ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Camera</p>
                <p className="text-xs text-slate-500">{checks.camera ? 'Connected' : 'Checking...'}</p>
              </div>
            </div>
            {checks.camera && <Check className="w-5 h-5 text-green-500" />}
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${checks.mic ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Microphone</p>
                <p className="text-xs text-slate-500">{checks.mic ? 'Connected' : 'Checking...'}</p>
              </div>
            </div>
             {checks.mic && <Check className="w-5 h-5 text-green-500" />}
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
             <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${checks.connection ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                <Wifi className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Connection</p>
                <p className="text-xs text-slate-500">{checks.connection ? 'Stable (45ms)' : 'Checking...'}</p>
              </div>
            </div>
             {checks.connection && <Check className="w-5 h-5 text-green-500" />}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-sm text-blue-800 mb-8 border border-blue-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>
            This interview is monitored for behavior analysis. Please ensure you are in a quiet room and your face is clearly visible. Tab switching is logged.
          </p>
        </div>

        <button
          onClick={handleStartSession}
          disabled={checking}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            checking 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
          }`}
        >
          {checking ? 'Checking System...' : 'Start Interview Session'}
        </button>
      </div>
    </div>
  );
};