import React, { useState } from 'react';
import { Users, Building2, Video, Server, ArrowUpRight, ArrowDownRight, HardDrive, Sparkles, ShieldAlert, TrendingUp, ListTodo, Loader2, Bot } from 'lucide-react';
import { MOCK_ADMIN_STATS, MOCK_ADMIN_ACTIVITY_DATA, MOCK_ADMIN_DISTRIBUTION_DATA, MOCK_SYSTEM_LOGS } from '../../services/adminMockData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const StatCard = ({ label, value, icon: Icon, color, subtext }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')} dark:text-white`} />
      </div>
    </div>
    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{label}</p>
    <p className="text-xs text-slate-400">{subtext}</p>
  </div>
);

const COLORS = ['#9333ea', '#3b82f6'];

export const AdminDashboard = () => {
  const [aiInsights, setAiInsights] = useState<{ category: string; icon: any; color: string; content: string }[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateSystemInsights = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Role: System Administrator AI Assistant
        Task: Analyze the mock system data and provide 3 distinct insights.
        
        Data Context:
        - Stats: ${JSON.stringify(MOCK_ADMIN_STATS)}
        - Activity (Last 7 Days): ${JSON.stringify(MOCK_ADMIN_ACTIVITY_DATA)}
        - Recent Logs: ${JSON.stringify(MOCK_SYSTEM_LOGS)}
        
        Output Requirements:
        Return a valid JSON array with exactly 3 objects. 
        Each object must have: 
        - "category": String (One of: "System Health & Risks", "Growth Strategy", "Action Items")
        - "content": String (A concise 2-3 sentence analysis or recommendation. For Action Items, list 3 bullet points).
        
        Do not wrap the JSON in markdown code blocks. Just return the raw JSON array.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const text = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(text);

      const mappedData = data.map((item: any) => {
        let icon = Sparkles;
        let color = 'text-purple-600';
        
        if (item.category.includes("Health")) {
           icon = ShieldAlert;
           color = 'text-red-600';
        } else if (item.category.includes("Growth")) {
           icon = TrendingUp;
           color = 'text-blue-600';
        } else {
           icon = ListTodo;
           color = 'text-green-600';
        }

        return { ...item, icon, color };
      });

      setAiInsights(mappedData);

    } catch (error) {
      console.error("AI Error:", error);
      // Fallback in case of error
      setAiInsights([
        { category: "System Health & Risks", icon: ShieldAlert, color: "text-red-600", content: "High latency detected in US-East region based on recent logs. Suggest scaling load balancers immediately to prevent user churn." },
        { category: "Growth Strategy", icon: TrendingUp, color: "text-blue-600", content: "Interview volume is trending up by 15% this week. Consider upgrading Cloudinary storage plan to Enterprise to accommodate video retention." },
        { category: "Action Items", icon: ListTodo, color: "text-green-600", content: "• Review suspended accounts (User r-4)\n• Verify nightly backup integrity\n• Monitor API rate limits" }
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Real-time platform metrics and health status.</p>
        </div>
        <button 
          onClick={generateSystemInsights}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-70"
        >
          {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
          {isAnalyzing ? 'Running Diagnostics...' : 'Generate AI Insights'}
        </button>
      </div>

      {/* AI Insights Section */}
      {aiInsights && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
           {aiInsights.map((insight, idx) => (
             <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <insight.icon className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                     <div className={`p-2 bg-slate-100 dark:bg-slate-800 rounded-lg ${insight.color}`}>
                        <insight.icon className="w-5 h-5" />
                     </div>
                     <h3 className="font-bold text-slate-900 dark:text-white">{insight.category}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {insight.content}
                  </p>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Users" 
          value={MOCK_ADMIN_STATS.totalUsers.toLocaleString()} 
          icon={Users} 
          color="bg-purple-600"
          subtext="+120 this week"
        />
        <StatCard 
          label="Interviews Conducted" 
          value={MOCK_ADMIN_STATS.totalInterviews.toLocaleString()} 
          icon={Video} 
          color="bg-blue-600"
          subtext="4.8k hrs recorded"
        />
        <StatCard 
          label="System Health" 
          value={`${MOCK_ADMIN_STATS.systemHealth}%`} 
          icon={Server} 
          color="bg-green-500"
          subtext="All systems operational"
        />
        <StatCard 
          label="Storage Used" 
          value={MOCK_ADMIN_STATS.storageUsed} 
          icon={HardDrive} 
          color="bg-amber-500"
          subtext="Cloudinary Assets"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Platform Activity (7 Days)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ADMIN_ACTIVITY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="interviews" stroke="#9333ea" fillOpacity={1} fill="url(#colorInterviews)" strokeWidth={2} />
                <Area type="monotone" dataKey="signups" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSignups)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm text-slate-500 dark:text-slate-400">
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-600 rounded-full"></div> Interviews</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> New Signups</div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">User Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_ADMIN_DISTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_ADMIN_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-2">
             <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Recruiters</span>
                <span className="font-bold text-slate-900 dark:text-white">{MOCK_ADMIN_STATS.totalRecruiters}</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Candidates</span>
                <span className="font-bold text-slate-900 dark:text-white">{MOCK_ADMIN_STATS.totalCandidates.toLocaleString()}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Recent Logs */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent System Logs</h2>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">View All Logs</button>
         </div>
         <div className="space-y-3">
            {MOCK_SYSTEM_LOGS.map(log => (
               <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className={`w-2 h-2 rounded-full ${
                        log.type === 'ERROR' ? 'bg-red-500' : 
                        log.type === 'WARNING' ? 'bg-amber-500' : 'bg-blue-500'
                     }`} />
                     <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{log.action}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">User: {log.user}</p>
                     </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{log.timestamp}</span>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};