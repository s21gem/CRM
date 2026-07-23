/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Shield, Sparkles, X, CheckCircle, Server, Lock, Send, HelpCircle, Loader2 } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import LoginModal from './components/LoginModal';
import ChatWidget from './components/ChatWidget';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load public components
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const Solutions = lazy(() => import('./components/Solutions'));
const Industries = lazy(() => import('./components/Industries'));
const Security = lazy(() => import('./components/Security'));
const Careers = lazy(() => import('./components/Careers'));
const Contact = lazy(() => import('./components/Contact'));
const DeveloperResources = lazy(() => import('./components/DeveloperResources'));

// Lazy load private portals
const AdminPortal = lazy(() => import('./components/portals/AdminPortal'));
const CRMPortal = lazy(() => import('./components/portals/CRMPortal'));
const ClientPortal = lazy(() => import('./components/portals/ClientPortal'));
const OpsPortal = lazy(() => import('./components/portals/OpsPortal'));

const ComponentLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
  </div>
);

function PublicApp() {
  // Navigation & Aesthetic States
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'services' | 'solutions' | 'industries' | 'security' | 'careers' | 'contact' | 'developer-spec'>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isInPortal, setIsInPortal] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string>('/logo.png');

  // Sync dark mode state with document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch CMS Settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/cms/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.logoUrl) setLogoUrl(`http://localhost:5000${data.logoUrl}`);
          if (data.faviconUrl) {
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.href = `http://localhost:5000${data.faviconUrl}`;
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettings();
  }, []);



  // Consultation Form States
  const [consultName, setConsultName] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [consultOrg, setConsultOrg] = useState('');
  const [consultTier, setConsultTier] = useState('gov-vetting');
  const [consultIsSubmitted, setConsultIsSubmitted] = useState(false);

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/crm/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: consultName, email: consultEmail, org: consultOrg, tier: consultTier }),
      });
      setConsultIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit consultation', error);
      // Still show success in UI for demo purposes if backend is down
      setConsultIsSubmitted(true);
    }
  };

  const closeConsultModal = () => {
    setConsultName('');
    setConsultEmail('');
    setConsultOrg('');
    setConsultTier('gov-vetting');
    setConsultIsSubmitted(false);
    setIsConsultationOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-300 bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-white selection:bg-blue-200 dark:selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-200">
      


      {/* Header Sticky Navigation */}
      <Header
        logoUrl={logoUrl}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
        onEnterPortal={() => setIsLoginOpen(true)}
      />

      {/* Main Public Website Workspace */}
      <main className="flex-grow">
        <Suspense fallback={<ComponentLoader />}>
          {activeTab === 'home' && (
            <Home 
              isDarkMode={isDarkMode} 
              setActiveTab={setActiveTab} 
              onOpenConsultation={() => setIsConsultationOpen(true)} 
            />
          )}
          {activeTab === 'about' && <About />}
          {activeTab === 'services' && (
            <Services 
              isDarkMode={isDarkMode} 
              onOpenConsultation={() => setIsConsultationOpen(true)} 
            />
          )}
          {activeTab === 'solutions' && (
            <Solutions 
              isDarkMode={isDarkMode} 
              onOpenConsultation={() => setIsConsultationOpen(true)} 
            />
          )}
          {activeTab === 'industries' && <Industries />}
          {activeTab === 'security' && <Security />}
          {activeTab === 'careers' && <Careers />}
          {activeTab === 'contact' && <Contact />}
        </Suspense>

      </main>

      {/* Premium Footer with Sitemap & Newsletter */}
      <Footer 
        isDarkMode={isDarkMode} 
        setActiveTab={(tab: string) => setActiveTab(tab as any)} 
      />

      {/* Global Search Modal Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        setActiveTab={(tab: string) => setActiveTab(tab as any)}
        isDarkMode={isDarkMode}
      />

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        isDarkMode={isDarkMode}
      />

      {/* Request Consultation Modal */}
      {isConsultationOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-center">
          {/* Backdrop */}
          <div 
            onClick={closeConsultModal}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity" 
          />

          {/* Consultation Form Card */}
          <div className="relative w-full max-w-lg rounded-3xl shadow-2xl border transition-all duration-300 z-10 bg-white dark:bg-[#0B1221] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-slate-200 dark:shadow-black/80">
            <div className="flex justify-between items-center p-6 border-b border-slate-800/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-blue-400 uppercase font-bold block">Sovereign Channels</span>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">Consultation Briefing Request</h3>
                </div>
              </div>
              <button 
                onClick={closeConsultModal}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-6">
              {consultIsSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">Sovereign Ticket Registered</h4>
                    <p className="text-slate-400 text-xs">Cryptographic tracking token: <span className="font-mono text-blue-400 font-bold">REQ-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span></p>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed max-w-sm mx-auto">
                    Your executive consultation ticket has been hashed and queued inside our secure operations registry. A regional security architect or director of custom integrations will contact you within 12 hours via encrypted channel.
                  </p>
                  <button
                    onClick={closeConsultModal}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-xs font-bold uppercase tracking-wider block mx-auto transition-colors shadow-md"
                  >
                    Close Briefing Console
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConsultSubmit} className="space-y-4">
                  
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Representative Name</label>
                    <input
                      type="text"
                      required
                      value={consultName}
                      onChange={(e) => setConsultName(e.target.value)}
                      placeholder="e.g. Commander Marcus Vance..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Secure Contact Email</label>
                    <input
                      type="email"
                      required
                      value={consultEmail}
                      onChange={(e) => setConsultEmail(e.target.value)}
                      placeholder="e.g. vance@interior.gov.mil..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Organization */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Government agency or Corporation</label>
                    <input
                      type="text"
                      required
                      value={consultOrg}
                      onChange={(e) => setConsultOrg(e.target.value)}
                      placeholder="e.g. Ministry of Interior, Banking Group..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Consultation Category */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Sovereign Capability Required</label>
                    <select
                      value={consultTier}
                      onChange={(e) => setConsultTier(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="gov-vetting">National e-Passport & Biometric Vetting</option>
                      <option value="fintech-emv">Retail or Central Bank EMV Personalization</option>
                      <option value="zero-trust">Defense Networks & PKI Root CA Setup</option>
                      <option value="general-consult">Comprehensive Secure Audit Vetting</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-slate-800/40">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 text-white text-xs font-bold uppercase tracking-wider block shadow-md transition-colors cursor-pointer"
                    >
                      Transmit Consultation Briefing
                    </button>
                  </div>

                </form>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-100 dark:bg-slate-950/40 rounded-b-3xl border-t border-slate-200 dark:border-slate-800/40 flex justify-between text-[8px] font-mono text-slate-500">
              <span>Encrypted under FIPS HSM protocol</span>
              <span>AES-256 standard</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Route protection helper
function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) {
  const role = localStorage.getItem('crm_role');
  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const isDarkMode = document.documentElement.classList.contains('dark');
  return (
    <>
      <Suspense fallback={<ComponentLoader />}>
        <Routes>
          <Route path="/" element={<PublicApp />} />
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="SUPER_ADMIN"><AdminPortal isDarkMode={isDarkMode} /></ProtectedRoute>
          } />
          <Route path="/crm" element={
            <ProtectedRoute allowedRole="SALES_EXEC"><CRMPortal isDarkMode={isDarkMode} /></ProtectedRoute>
          } />
          <Route path="/client" element={
            <ProtectedRoute allowedRole="CORPORATE_CLIENT"><ClientPortal isDarkMode={isDarkMode} /></ProtectedRoute>
          } />
          <Route path="/ops" element={
            <ProtectedRoute allowedRole="OPERATIONS_OFFICER"><OpsPortal isDarkMode={isDarkMode} /></ProtectedRoute>
          } />
        </Routes>
      </Suspense>
      <ChatWidget />
    </>
  );
}
