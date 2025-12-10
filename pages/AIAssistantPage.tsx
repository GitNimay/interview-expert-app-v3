import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { MOCK_JOBS, MOCK_USER, MOCK_INTERVIEWS } from '../services/mockData';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AIAssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hi ${MOCK_USER.name}! I'm your personal career assistant. I can help you find jobs that match your skills, prepare for upcoming interviews, or analyze your past performance. How can I help you today?` }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Chat Session
  useEffect(() => {
    const initChat = () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct system instruction with context
      const systemContext = `
        You are an expert AI Career Coach for InterviewExpert.
        
        User Profile:
        Name: ${MOCK_USER.name}
        Email: ${MOCK_USER.email}
        Resume: ${MOCK_USER.resumeName} (Assume strong React/Frontend skills based on history)
        
        Available Jobs in System:
        ${JSON.stringify(MOCK_JOBS.map(j => `${j.title} at ${j.company} (${j.location}, ${j.salaryRange}) - ID: ${j.id}`))}
        
        Past Interview History:
        ${JSON.stringify(MOCK_INTERVIEWS.map(i => `${i.jobTitle} at ${i.companyName} (${i.status}) - Score: ${i.report?.overallScore || 'N/A'}`))}
        
        Your Goal:
        Help the user navigate their career. Recommend jobs from the available list that match their profile. 
        Provide interview tips based on their past performance weaknesses (e.g., if they had low communication scores).
        Be encouraging, professional, and concise.
        
        Format:
        Use Markdown for bolding key terms or listing jobs.
      `;

      chatSessionRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemContext,
        },
      });
    };

    if (!chatSessionRef.current) {
      initChat();
    }
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading || !chatSessionRef.current) return;

    const userMessage = inputText;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const resultStream = await chatSessionRef.current.sendMessageStream({ message: userMessage });
      
      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]); // Placeholder for streaming

      for await (const chunk of resultStream) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
          fullResponse += chunkText;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = fullResponse;
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            AI Assistant
            <Sparkles className="w-4 h-4 text-amber-500" />
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Your personalized career guide and job matcher.</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                ${msg.role === 'user' 
                  ? 'bg-slate-200 dark:bg-slate-700' 
                  : 'bg-blue-600 text-white'}
              `}>
                {msg.role === 'user' 
                  ? <User className="w-5 h-5 text-slate-600 dark:text-slate-300" /> 
                  : <Bot className="w-5 h-5" />
                }
              </div>
              
              <div className={`
                max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap
                ${msg.role === 'user'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tr-sm'
                  : 'bg-blue-50 dark:bg-blue-900/20 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-blue-100 dark:border-blue-900/30'}
              `}>
                {msg.text || <span className="animate-pulse">...</span>}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about jobs, interview tips, or resume advice..."
              className="w-full pl-4 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-slate-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-2">
            AI can make mistakes. Please verify important information.
          </p>
        </div>

      </div>
    </div>
  );
};