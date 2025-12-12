import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Video, Settings, LogOut, Menu, X, Briefcase, CalendarCheck, Bot } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { userProfile, logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/candidate' },
    { icon: Bot, label: 'AI Assistant', path: '/candidate/ai-assistant' },
    { icon: CalendarCheck, label: 'Interviews', path: '/candidate/interviews' },
    { icon: Briefcase, label: 'Jobs', path: '/candidate/jobs' },
    { icon: Video, label: 'Practice Room', path: '/candidate/practice' },
    { icon: Settings, label: 'Settings', path: '/candidate/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30 transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                IE
              </div>
              <span className="font-bold text-xl text-slate-800 dark:text-white">InterviewExpert</span>
            </div>
            <button className="ml-auto lg:hidden" onClick={onClose}>
              <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/candidate'}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                {userProfile?.name?.charAt(0) || 'C'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{userProfile?.name || 'Candidate'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userProfile?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between flex-shrink-0">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                IE
              </div>
              <span className="font-bold text-xl text-slate-800 dark:text-white">InterviewExpert</span>
            </div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};