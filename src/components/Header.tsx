/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Shield,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  ChevronDown,
  ExternalLink,
  Laptop,
} from 'lucide-react';

interface HeaderProps {
  logoUrl: string;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onOpenSearch: () => void;
  onOpenConsultation: () => void;
  onEnterPortal: () => void;
}

export default function Header({
  logoUrl,
  isDarkMode,
  setIsDarkMode,
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenConsultation,
  onEnterPortal,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'solutions', label: 'Solutions' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-[#090D16]/80 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm dark:shadow-lg dark:shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo Left */}
          <button
            onClick={() => handleNavClick('home')}
            className="tour-logo flex items-center gap-3 group focus:outline-none cursor-pointer"
          >
            <div className="flex items-center">
              <img
                src={logoUrl}
                alt="FoneBox Logo"
                className="h-8 sm:h-10 object-contain bg-white/90 p-1 rounded-md"
              />
            </div>
          </button>

          {/* Navigation Center */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-500 bg-blue-500/10 dark:bg-blue-500/5 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* CTA & Utilities Right */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg border transition-colors cursor-pointer border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40"
              title="Global Enterprise Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg border transition-colors cursor-pointer border-slate-200 dark:border-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/40"
              title="Toggle System Environment Aesthetic"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onEnterPortal}
              className="tour-login px-4 py-2.5 rounded-xl border border-blue-500/35 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md shadow-blue-500/5 cursor-pointer flex items-center gap-1.5"
            >
              <Laptop className="w-4 h-4" />
              Enterprise Portals
            </button>

            {/* CTA Button */}
            <button
              onClick={onOpenConsultation}
              className="tour-consultation px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Request Consultation
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-amber-400"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-white dark:bg-[#090D16] border-slate-200 dark:border-slate-800/80 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2.5 rounded-lg text-left text-xs font-semibold tracking-wide uppercase transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-500 bg-blue-500/10 dark:bg-blue-500/5 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="pt-3 border-t border-slate-800/40 space-y-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onEnterPortal();
              }}
              className="w-full py-3 rounded-xl border border-blue-500/35 text-blue-400 hover:bg-blue-500/10 text-xs font-bold uppercase tracking-wider text-center block shadow-md flex items-center justify-center gap-1.5"
            >
              <Laptop className="w-4 h-4" />
              Enterprise Portals
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-xs font-bold uppercase tracking-wider text-center block shadow-md"
            >
              Request Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
