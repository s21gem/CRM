import React, { useState } from 'react';
import { Shield, ArrowLeft, Search, Bell, ChevronDown, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SharedPortalLayoutProps {
  isDarkMode: boolean;
  roleName: string;
  portalTitle: string;
  sidebarItems: React.ReactNode;
  children: React.ReactNode;
}

export default function SharedPortalLayout({
  isDarkMode,
  roleName,
  portalTitle,
  sidebarItems,
  children,
}: SharedPortalLayoutProps) {
  const navigate = useNavigate();
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleExit = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))}/api/auth/logout`,
        { method: 'POST', credentials: 'include' }
      );
    } catch (e) {}
    localStorage.removeItem('crm_role');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-slate-50 dark:bg-[#060A13] text-slate-900 dark:text-white">
      {/* Top Header */}
      <header className="h-12 flex items-center justify-between px-4 border-b z-40 select-none bg-white dark:bg-[#0B132B] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={handleExit}
            className="hidden sm:flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Logout & Exit
          </button>

          <button
            onClick={handleExit}
            className="sm:hidden p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center">
              <Shield className="w-3 h-3 text-slate-900 dark:text-white" />
            </div>
            <span className="font-display font-bold text-xs tracking-wider uppercase text-slate-900 dark:text-white sm:inline-block hidden">
              FoneBox Cloud Console
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 max-w-md w-96 relative">
          <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-500 dark:text-slate-500" />
          <input
            type="text"
            readOnly
            placeholder="Search resources, services, and docs... (mTLS active)"
            className="w-full bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-300 focus:outline-none placeholder-slate-400 dark:placeholder-slate-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
              className="relative p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer text-slate-500 dark:text-slate-400"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-[#0B132B]"></span>
            </button>
            {showNotificationDrawer && (
              <div className="absolute right-0 mt-1 w-80 max-h-96 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1221] p-0 text-slate-900 dark:text-white shadow-2xl z-50 animate-fade-in font-sans">
                <div className="p-3 border-b border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/50 sticky top-0 z-10 flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-slate-500 font-bold block">
                    System Notifications
                  </span>
                </div>
                <div className="p-4 text-xs text-slate-600 dark:text-slate-500 text-center">
                  No new alerts.
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-850">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
              U
            </div>
            <span className="hidden sm:inline-block text-slate-900 dark:text-slate-300 font-semibold">
              {roleName}
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-64 max-w-sm h-full bg-white dark:bg-[#0B132B] border-r border-slate-200 dark:border-slate-800 flex flex-col animate-slide-in">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="font-bold text-slate-900 dark:text-white">{portalTitle}</span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              className="p-4 overflow-y-auto flex-1 space-y-1.5"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              {sidebarItems}
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow flex relative">
        {/* Left Sidebar */}
        <aside className="w-64 border-r shrink-0 select-none hidden lg:block bg-white dark:bg-[#090E17] border-slate-200 dark:border-slate-850">
          <div className="p-4 space-y-4">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-600 dark:text-slate-500 block font-bold">
                Active Systems
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 mt-1">
                {portalTitle}
              </h4>
            </div>
            <nav className="space-y-1.5">{sidebarItems}</nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow relative h-[calc(100vh-48px)] overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-transparent">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto animate-fade-in pb-24">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
