import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, BrainCircuit, AlertTriangle, Eye, Activity, Square, ArrowRight, Loader2 } from 'lucide-react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

const QUESTIONS = [
  "Tell me about a challenging project you've worked on recently and how you overcame obstacles.",
  "Explain a complex technical concept to someone without a technical background.",
  "Describe a time you had a conflict with a team member. How did you resolve it?",
  "Where do you see yourself in your career in the next 3-5 years?"
];

// Types for speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface LogEvent {
  timestamp: string;
  type: 'TAB_SWITCH' | 'COPY_PASTE' | 'FOCUS_LOST' | 'LOOKING_AWAY';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const ActiveInterviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  
  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [aiWarning, setAiWarning] = useState<string | null>(null);
  const [gazeStatus, setGazeStatus] = useState<'FOCUSED' | 'DISTRACTED'>('FOCUSED');
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const hasSpokenRef = useRef(false);

  // 1. Initialize Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        addLog('FOCUS_LOST', 'Camera permission denied or not available', 'HIGH');
      }
    };
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 2. Initialize Speech Recognition (User STT)
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // 3. AI Agent: Speak Question (TTS)
  useEffect(() => {
    const speakQuestion = () => {
      if ('speechSynthesis' in window && !hasSpokenRef.current) {
        // Reset state for new question
        setIsRecording(true);
        if (recognitionRef.current) try { recognitionRef.current.start(); } catch(e) {}
        
        const utterance = new SpeechSynthesisUtterance(QUESTIONS[currentQuestionIndex]);
        utterance.rate = 1;
        utterance.pitch = 1;
        
        // Find a decent voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;

        window.speechSynthesis.speak(utterance);
        hasSpokenRef.current = true;
      }
    };

    // Small delay to allow component to mount
    const timer = setTimeout(speakQuestion, 1000);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex]);

  // 4. Cheating Detection Logic
  const addLog = useCallback((type: LogEvent['type'], description: string, severity: LogEvent['severity']) => {
    const newLog: LogEvent = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      description,
      severity
    };
    
    setLogs(prev => {
      const updated = [newLog, ...prev];
      return updated.slice(0, 10); // Keep top 10 recent
    });

    setAiWarning(`Warning: ${description}`);
    
    // AI Warns User via Voice
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Please focus on the screen.");
      window.speechSynthesis.speak(utterance);
    }

    // Save to Firebase immediately
    if (id) {
       // We assume 'applications' collection holds the interview data for the candidate
       const docRef = doc(db, 'applications', id);
       // Just fire and forget for demo speed
       updateDoc(docRef, {
         flags: { count: (logs.length + 1), severity: 'High' } // Simplified update
       }).catch(e => console.log("Log save error", e));
    }
    
    // Clear visual warning after 3s
    setTimeout(() => setAiWarning(null), 4000);
  }, [id, logs.length]);

  useEffect(() => {
    // Tab Switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        addLog('TAB_SWITCH', 'User switched tabs or minimized browser', 'HIGH');
      }
    };

    // Focus Lost (Clicking outside)
    const handleBlur = () => {
      addLog('FOCUS_LOST', 'Window focus lost (possible app switch)', 'MEDIUM');
    };

    // Copy/Paste
    const handleCopy = () => addLog('COPY_PASTE', 'Clipboard copy detected', 'MEDIUM');
    const handlePaste = () => addLog('COPY_PASTE', 'Clipboard paste detected', 'MEDIUM');
    
    // Mouse leaving window (Look away proxy)
    const handleMouseLeave = () => {
       setGazeStatus('DISTRACTED');
       // Only log if gone for > 2 seconds to avoid jitter logs
    };
    const handleMouseEnter = () => setGazeStatus('FOCUSED');

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [addLog]);

  // Simulated Eye Tracking / Gaze Check Interval
  useEffect(() => {
    const interval = setInterval(() => {
       // Randomly check for "looking away" based on mouse position or just random simulation for demo
       if (gazeStatus === 'DISTRACTED') {
          addLog('LOOKING_AWAY', 'Eye gaze/Head pose drifted off-screen', 'MEDIUM');
       }
    }, 5000);
    return () => clearInterval(interval);
  }, [gazeStatus, addLog]);


  const handleNextQuestion = async () => {
    // Save current answer
    if (id) {
      try {
        const docRef = doc(db, 'applications', id);
        await updateDoc(docRef, {
          transcript: arrayUnion({
            question: QUESTIONS[currentQuestionIndex],
            answer: transcript,
            timestamp: new Date().toISOString(),
            sentiment: 'Neutral' // Placeholder for AI sentiment
          })
        });
      } catch (e) {
        console.error("Error saving answer", e);
      }
    }

    setTranscript('');
    hasSpokenRef.current = false;
    
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishInterview();
    }
  };

  const finishInterview = async () => {
    setIsRecording(false);
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch(e) {}
    
    // Final save
    if (id) {
       const docRef = doc(db, 'applications', id);
       await updateDoc(docRef, {
         status: 'Completed',
         'aiAnalysis.summary': 'Interview completed via AI Monitor. Check logs for behavioral analysis.'
       });
    }
    navigate('/candidate/interviews'); // Go back to list
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-medium text-red-400">REC • {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-4">
           <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${gazeStatus === 'FOCUSED' ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-red-900/30 text-red-400 border-red-800'}`}>
              <Eye className="w-3.5 h-3.5" />
              {gazeStatus === 'FOCUSED' ? 'EYES ON SCREEN' : 'LOOKING AWAY'}
           </div>
           <div className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
             Session ID: {id}
           </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 max-w-7xl mx-auto w-full">
        
        {/* Left: Video Feed & AI Monitor */}
        <div className="flex-1 flex flex-col gap-4 relative">
           
           {/* Camera Feed */}
           <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 aspect-video group">
             <video 
               ref={videoRef} 
               autoPlay 
               muted 
               playsInline 
               className="w-full h-full object-cover transform scale-x-[-1]" 
             />
             
             {/* Simulated Face Tracking Box */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-dashed border-blue-500/30 rounded-full pointer-events-none group-hover:border-blue-500/50 transition-colors">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-blue-400 tracking-widest uppercase">Face Detection Active</div>
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-500"></div>
             </div>

             {/* Warnings Overlay */}
             {aiWarning && (
               <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center animate-in fade-in zoom-in duration-200">
                 <div className="bg-red-600 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3">
                   <AlertTriangle className="w-8 h-8" />
                   <div>
                     <h3 className="font-bold text-lg">Suspicious Activity Detected</h3>
                     <p className="text-sm opacity-90">{aiWarning}</p>
                   </div>
                 </div>
               </div>
             )}
           </div>

           {/* AI Agent Panel */}
           <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex items-center gap-4">
              <div className="relative">
                 <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center relative z-10">
                    <BrainCircuit className="w-6 h-6 text-white" />
                 </div>
                 <div className="absolute inset-0 bg-blue-600 blur-lg opacity-50 animate-pulse"></div>
              </div>
              <div className="flex-1">
                 <h3 className="text-sm font-bold text-white flex items-center gap-2">
                   AI Proctor Agent
                   <span className="flex items-center gap-1 text-[10px] bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded">
                     <Activity className="w-3 h-3" /> Monitoring
                   </span>
                 </h3>
                 <p className="text-xs text-slate-400 mt-1">Analyzing behavior, eye movement, and browser events in real-time.</p>
              </div>
           </div>

        </div>

        {/* Right: Question & Controls */}
        <div className="w-96 flex flex-col gap-6">
           
           {/* Question Card */}
           <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Question {currentQuestionIndex + 1} of {QUESTIONS.length}</span>
              <h2 className="text-xl font-bold leading-tight mb-4">
                {QUESTIONS[currentQuestionIndex]}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                 AI Agent is speaking...
              </div>
           </div>

           {/* Transcript Area */}
           <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-bold text-slate-500 uppercase">Live Transcript</span>
                 {isRecording && <span className="text-xs text-red-400 animate-pulse">Listening...</span>}
              </div>
              <div className="flex-1 bg-black/20 rounded-xl p-3 text-sm text-slate-300 overflow-y-auto font-mono leading-relaxed">
                 {transcript || <span className="text-slate-600 italic">Waiting for answer...</span>}
              </div>
           </div>

           {/* Recent Logs (Mini) */}
           <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 max-h-48 overflow-y-auto">
             <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
               <Activity className="w-3 h-3" /> Activity Log
             </h4>
             <div className="space-y-2">
               {logs.length === 0 ? (
                 <p className="text-xs text-slate-600 text-center py-2">No flags detected yet.</p>
               ) : (
                 logs.map((log, i) => (
                   <div key={i} className="flex items-center gap-2 text-xs p-2 rounded bg-slate-800/50 border border-slate-800">
                      <AlertTriangle className={`w-3 h-3 ${log.severity === 'HIGH' ? 'text-red-500' : 'text-amber-500'}`} />
                      <span className="text-slate-300 flex-1 truncate">{log.description}</span>
                      <span className="text-slate-600">{log.timestamp}</span>
                   </div>
                 ))
               )}
             </div>
           </div>

           {/* Controls */}
           <button 
             onClick={handleNextQuestion}
             className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
           >
             {currentQuestionIndex < QUESTIONS.length - 1 ? (
               <>Next Question <ArrowRight className="w-5 h-5" /></>
             ) : (
               <>Finish Interview <Square className="w-4 h-4 fill-current" /></>
             )}
           </button>

        </div>

      </div>
    </div>
  );
};