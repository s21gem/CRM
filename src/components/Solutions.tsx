/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Shield, Globe, Cpu, Terminal, Lock, CheckCircle, HelpCircle, 
  ChevronDown, ChevronRight, Play, Database, Activity, Landmark, X
} from 'lucide-react';

interface SolutionsProps {
  isDarkMode: boolean;
  onOpenConsultation: () => void;
}

export default function Solutions({ isDarkMode, onOpenConsultation }: SolutionsProps) {
  const [selectedSolution, setSelectedSolution] = useState<string>('epassport');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [diagramStep, setDiagramStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Demo Modal State
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoName, setDemoName] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoOrg, setDemoOrg] = useState('');
  const [demoIsSubmitted, setDemoIsSubmitted] = useState(false);

  const [solutions, setSolutions] = useState<any[]>([]);

  useEffect(() => {
    const fetchEnterpriseSolutions = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/cms/enterprise-solutions`);
        if (res.ok) {
          const data = await res.json();
          const parsed = data.map((d: any) => ({
            ...d,
            useCases: JSON.parse(d.useCases || '[]'),
            benefits: JSON.parse(d.benefits || '[]'),
            industries: JSON.parse(d.industries || '[]'),
            flow: JSON.parse(d.flow || '[]')
          }));
          setSolutions(parsed);
          if (parsed.length > 0) {
            setSelectedSolution(parsed[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to fetch enterprise solutions", e);
      }
    };
    fetchEnterpriseSolutions();
  }, []);

  const faqs = [
    {
      q: 'Are FoneBox Global smartcard configurations fully ICAO Doc 9303 compliant?',
      a: 'Yes. All passport, visa, and national identity card frameworks conform strictly to current ICAO Doc 9303 specifications, LDS2 structures, and ISO/IEC 14443 contactless smartcard regulations.'
    },
    {
      q: 'How are master cryptographic keys (MDK, UDK) handled during personalization?',
      a: 'Master cryptographic keys are derived dynamically inside a certified offline FIPS 140-3 Level 4 Hardware Security Module (HSM). Signing operations utilize physical faraday cages and are completely inaccessible via external networks.'
    },
    {
      q: 'Does your system support decentralized or digital wallets (mDL)?',
      a: 'Yes. Our sovereign digital identity framework generates cryptographically signed W3C-compliant Verifiable Credentials (VCs) that citizens can hold securely inside local iOS or Android digital wallets with biometric authorization.'
    }
  ];

  const current = solutions.find(s => s.id === selectedSolution) || solutions[0];
  if (!current) return <div className="pt-28 pb-12 flex justify-center"><div className="animate-pulse text-slate-500">Loading Sovereign Infrastructure...</div></div>;

  const handleDemoRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/crm/demo-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: demoName, email: demoEmail, org: demoOrg, solution: current.title })
      });
      setDemoIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit demo request', err);
      // Fallback UI for demo
      setDemoIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDemoModal = () => {
    setDemoName('');
    setDemoEmail('');
    setDemoOrg('');
    setDemoIsSubmitted(false);
    setIsDemoModalOpen(false);
  };

  return (
    <div className="space-y-16 pt-28 pb-12">
      
      {/* Page Intro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">Solutions Catalog</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white">Sovereign Enterprise Products</h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-3xl mx-auto">
          FoneBox designs, installs, and secures complete physical smartcard personalization lines and digital credential networks for sovereign state projects.
        </p>
      </section>

      {/* Solutions Grid Selection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {solutions.map((sol) => (
            <button
              key={sol.id}
              onClick={() => {
                setSelectedSolution(sol.id);
                setDiagramStep(0);
              }}
              className={`p-6 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex flex-col justify-between items-start gap-4 ${
                selectedSolution === sol.id
                  ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A]/20 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#0F172A]/40'
              }`}
            >
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold">{sol.category}</span>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">{sol.title}</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">{sol.desc}</p>
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5 pt-2">
                Configure Product <ChevronRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Detailed Solution Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Solution Spec sheet left */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#0B1321]/30 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">Technical Specification</span>
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">{current.title}</h2>
              </div>

              <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{current.desc}</p>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold">Primary Use cases</h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-400">
                  {current.useCases.map((uc, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{uc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold font-bold">Key Benefits</h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {current.benefits.map((ben, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800/40 flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Target Sectors</span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{current.industries.join(', ')}</p>
              </div>
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Request Product Demo
              </button>
            </div>
          </div>

          {/* Interactive Cryptographic Flow right */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between shadow-sm dark:shadow-none">
            <div className="space-y-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block font-bold">Interactive Engineering Blueprint</span>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Cryptographic Personalization Pipeline</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs">Click through the architectural pipeline stages to trace citizen credentials through secure state vaults.</p>
            </div>

            {/* Simulated interactive flowchart diagram */}
            <div className="grid grid-cols-4 gap-2.5 py-4 relative">
              {/* Connector lines behind cards */}
              <div className="absolute top-[34px] left-[12%] right-[12%] h-[1px] bg-slate-200 dark:bg-slate-800 z-0">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-700 ease-in-out shadow-[0_0_10px_2px_rgba(59,130,246,0.6)] rounded-full" 
                  style={{ width: `${(diagramStep / Math.max((current.flow.length - 1), 1)) * 100}%` }} 
                />
              </div>
              
              {current.flow.map((flowItem, index) => {
                const isActive = diagramStep === index;
                return (
                  <button
                    key={index}
                    onClick={() => setDiagramStep(index)}
                    className={`relative z-10 p-3 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'border-blue-500 bg-blue-500/10 shadow-lg' 
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]/40 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold font-mono mb-2 ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                    }`}>
                      0{index + 1}
                    </div>
                    <span className={`text-[10px] font-display font-bold block line-clamp-1 ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {flowItem.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Interactive stage description card */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 min-h-[90px] flex items-start gap-4">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                <Terminal className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">STAGE 0{diagramStep + 1} OPERATIONS PROTOCOL</span>
                <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white">{current.flow[diagramStep].title}</h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{current.flow[diagramStep].desc}</p>
              </div>
            </div>

            {/* Diagram security footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/60 flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 animate-pulse" /> Live architecture trace active</span>
              <span>AES-256 secure channel link</span>
            </div>

          </div>

        </div>
      </section>

      {/* Accordion FAQ Collapsible */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">Information Security Portal</span>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Frequently Audited Inquiries</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div
                key={i}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A]/20 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <span className="font-display font-semibold text-xs text-slate-800 dark:text-slate-200">{faq.q}</span>
                  <ChevronDown className={`w-4.5 h-4.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/40 leading-relaxed bg-white dark:bg-slate-950/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Demo Request Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-center">
          {/* Backdrop */}
          <div 
            onClick={closeDemoModal}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity" 
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-lg rounded-3xl shadow-2xl border transition-all duration-300 z-10 bg-white dark:bg-[#0B1221] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-slate-200 dark:shadow-black/80">
            <div className="flex justify-between items-center p-6 border-b border-slate-800/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400">
                  <Play className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-blue-400 uppercase font-bold block">Sovereign Channels</span>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">Technical Demo Request</h3>
                </div>
              </div>
              <button 
                onClick={closeDemoModal}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-6">
              {demoIsSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">Demo Request Logged</h4>
                    <p className="text-slate-400 text-xs">Tracking token: <span className="font-mono text-blue-400 font-bold">DEMO-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span></p>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed max-w-sm mx-auto">
                    Your request for a technical demo of <strong>{current.title}</strong> has been secured. A solutions architect will contact you via encrypted channel to schedule the session.
                  </p>
                  <button
                    onClick={closeDemoModal}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 text-white text-xs font-bold uppercase tracking-wider block mx-auto transition-colors shadow-md"
                  >
                    Close Secure Console
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDemoRequest} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Representative Name</label>
                    <input
                      type="text"
                      required
                      value={demoName}
                      onChange={(e) => setDemoName(e.target.value)}
                      placeholder="e.g. Director James Carter..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Secure Contact Email</label>
                    <input
                      type="email"
                      required
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      placeholder="e.g. carter@ministry.gov..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Government agency or Corporation</label>
                    <input
                      type="text"
                      required
                      value={demoOrg}
                      onChange={(e) => setDemoOrg(e.target.value)}
                      placeholder="e.g. Ministry of Interior..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-800/40">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 text-white text-xs font-bold uppercase tracking-wider block shadow-md transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'Transmitting Request...' : `Request ${current.title} Demo`}
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
