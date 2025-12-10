import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, Settings, LogOut, Menu, X, ShieldCheck, Activity } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Building2, label: 'Recruiters', path: '/admin/recruiters' },
    { icon: Users, label: 'Candidates', path: '/admin/candidates' },
    { icon: Activity, label: 'System Health', path: '/admin/health' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
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
        fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-30 transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full text-white">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                AD
              </div>
              <span className="font-bold text-xl">AdminPortal</span>
            </div>
            <button className="ml-auto lg:hidden" onClick={onClose}>
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Admin User Profile */}
          <div className="p-4 border-t border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                SA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Super Admin</p>
                <p className="text-xs text-slate-400 truncate">System Owner</p>
              </div>
            </div>
            <NavLink to="/" className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-800 transition-colors">
              <LogOut className="w-4 h-4" />
              Exit Admin
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 overflow-hidden font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
               <ShieldCheck className="w-5 h-5 text-purple-600" />
               <span className="text-sm font-medium">Secure Admin Environment</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-950">
          <Outlet />
        </div>
      </main>
    </div>
  );
};