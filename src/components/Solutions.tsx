/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Shield, Globe, Cpu, Terminal, Lock, CheckCircle, HelpCircle, 
  ChevronDown, ChevronRight, Play, Database, Activity, Landmark 
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

  const [solutions, setSolutions] = useState<any[]>([]);

  useEffect(() => {
    const fetchEnterpriseSolutions = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/cms/enterprise-solutions');
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

  const handleDemoRequest = async () => {
    const email = prompt("Enter your enterprise email address for contact:");
    if (!email) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/crm/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, solution: current.title })
      });
      if (res.ok) {
        alert(`Request for ${current.title} Technical Demo has been logged. Our executive engineering board will establish contact via secure email.`);
      } else {
        alert('Failed to submit demo request.');
      }
    } catch (err) {
      alert('Network error. Failed to submit request.');
    } finally {
      setIsSubmitting(false);
    }
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
                onClick={handleDemoRequest}
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

    </div>
  );
}
