import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInterviewById } from '../services/mockData';
import { ArrowLeft, Play, Download, AlertTriangle, Eye, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export const InterviewReportPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const interview = getInterviewById(id || '');

  if (!interview || !interview.report) {
    return <div className="p-8 text-center text-slate-500">Interview report not found.</div>;
  }

  const { report } = interview;

  // Transform data for charts
  const skillsData = report.skillScores.map(s => ({
    subject: s.skill,
    A: s.score,
    fullMark: 10,
  }));

  // Mock behavior timeline data
  const behaviorData = Array.from({ length: 20 }, (_, i) => ({
    time: i * 2,
    attention: 8 + Math.random() * 2,
    sentiment: 7 + Math.random() * 3,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/candidate')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
            <Download className="w-4 h-4" />
            PDF Report
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{interview.jobTitle}</h1>
            <p className="text-slate-500 text-lg mb-6">{interview.companyName} • {new Date(interview.date).toDateString()}</p>
            
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
              <h3 className="font-semibold text-slate-900 mb-2">AI Summary</h3>
              <p className="text-slate-700 leading-relaxed">{report.summary}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Technical: {report.technicalScore}/10
              </div>
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Communication: {report.communicationScore}/10
              </div>
              <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Behavioral: {report.behavioralScore}/10
              </div>
            </div>
          </div>

          {/* Overall Score Circle */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-xl text-white w-full md:w-48">
            <div className="text-5xl font-bold mb-1">{report.overallScore}</div>
            <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">Overall Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Radar */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Skill Analysis</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} />
                <Radar
                  name="Candidate"
                  dataKey="A"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-6">
           <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Key Strengths
            </h3>
            <ul className="space-y-3">
              {report.strengths.map((str, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  {str}
                </li>
              ))}
            </ul>
           </div>
           <div className="border-t border-slate-100 pt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {report.weaknesses.map((wk, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  {wk}
                </li>
              ))}
            </ul>
           </div>
        </div>
      </div>

      {/* Behavior Analysis */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Behavioral Timeline</h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Attention
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-indigo-500 rounded-sm"></span> Sentiment
            </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={behaviorData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAttention" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 10]} hide />
              <Tooltip />
              <Area type="monotone" dataKey="attention" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAttention)" strokeWidth={2} />
              <Area type="monotone" dataKey="sentiment" stroke="#6366f1" fillOpacity={1} fill="url(#colorSentiment)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Flagged Events */}
        <div className="mt-6 border-t border-slate-100 pt-6">
          <h4 className="font-semibold text-slate-900 mb-4">Flagged Events</h4>
          <div className="space-y-3">
            {report.behaviorEvents.length === 0 ? (
              <p className="text-slate-500 text-sm">No suspicious behavior detected.</p>
            ) : (
              report.behaviorEvents.map((event, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-amber-50 text-amber-900 rounded-lg text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold">
                    {Math.floor(event.timestamp / 60)}:{(event.timestamp % 60).toString().padStart(2, '0')}
                  </span>
                  <span>
                    {event.type.replace('_', ' ')} detected ({event.severity} severity)
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

       {/* Video Playback Placeholder */}
       <div className="bg-slate-900 rounded-xl overflow-hidden aspect-video relative group cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
              <Play className="w-8 h-8 text-white fill-current ml-1" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
             <p className="text-white font-medium">Watch Full Interview Recording</p>
          </div>
       </div>

    </div>
  );
};