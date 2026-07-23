/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, Shield, Globe, Cpu, Database, ChevronRight, Lock, MapPin, CheckCircle, Linkedin, Twitter, MessageSquare, Loader2, ArrowUp, X } from 'lucide-react';

interface FooterProps {
  isDarkMode: boolean;
  setActiveTab: (tab: string) => void;
  onStartTour?: () => void;
}

export default function Footer({ isDarkMode, setActiveTab, onStartTour }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<{title: string, content: string} | null>(null);
  
  const [socialLinks, setSocialLinks] = useState({
    linkedin: 'https://linkedin.com/company/fonebox',
    twitter: 'https://twitter.com/fonebox',
    website: 'https://fonebox.com',
    email: 'contact@fonebox.com'
  });

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/cms/system-settings`);
        if (res.ok) {
          const data = await res.json();
          setSocialLinks({
            linkedin: data.linkedin_url || 'https://linkedin.com/company/fonebox',
            twitter: data.twitter_url || 'https://twitter.com/fonebox',
            website: data.website_url || 'https://fonebox.com',
            email: data.email_address || 'contact@fonebox.com'
          });
        }
      } catch (e) {}
    };
    fetchSocialLinks();
  }, []);

  const legalContent = {
    privacy: "FoneBox Global processes sovereign data in compliance with ISO 27001, SOC 2 Type II, and PCI-DSS 4.0. We utilize zero-knowledge proofs (ZKP) to ensure citizen biodata remains absolutely confidential. All telemetry is hashed on-device before transmission.",
    terms: "Access to FoneBox operational dashboards and APIs is restricted to authorized state-level actors and corporate entities. Unauthorized usage is strictly prohibited and logged immutably. Misuse of cryptographic tokens will result in immediate revocation.",
    export: "Hardware Security Modules (HSMs) and FIPS 140-3 Level 4 cryptographic components are subject to strict export controls. Transfer of state-level encryption keys across sovereign borders requires explicit dual-custody authorization."
  };
  
  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/crm/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setIsSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error(err);
      setIsSubscribed(true); // Fallback for UI demo
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sitemap = {
    company: [
      { label: 'About Us', tab: 'about' },
      { label: 'Careers & Culture', tab: 'careers' },
      { label: 'Sovereign Controls', tab: 'security' },
      { label: 'Global Offices', tab: 'contact' }
    ],
    solutions: [
      { label: 'E-Passports', tab: 'solutions' },
      { label: 'Secure Bank Cards', tab: 'solutions' },
      { label: 'Electronic Visa', tab: 'solutions' },
      { label: 'National Registry', tab: 'solutions' }
    ],
    services: [
      { label: 'Identity Personalization', tab: 'services' },
      { label: 'FinTech Engineering', tab: 'services' },
      { label: 'Cyber Security Operations', tab: 'services' },
      { label: 'PKI Infrastructure CA', tab: 'services' }
    ]
  };

  return (
    <footer className="border-t transition-colors duration-300 bg-white dark:bg-[#060A12] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
      
      {/* Top Banner Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-200 dark:border-slate-800/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2 tracking-wide">
              Subscribe to FoneBox Security Briefings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Get official intelligence, cryptographic standards updates, and cyber security protocols formulated for sovereign identity ecosystems directly in your inbox.
            </p>
          </div>
          <div className="lg:col-span-5">
            {isSubscribed ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 w-full max-w-md mx-auto lg:mx-0">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Security intelligence subscription confirmed. Stand by for encrypted briefings.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full max-w-md mx-auto lg:mx-0 lg:max-w-none justify-center lg:justify-start">
                <div className="relative w-full sm:flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="enter enterprise email..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Join <ArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Sitemap Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-center md:text-left">
          
          {/* Brand Info */}
          <div className="col-span-1 sm:col-span-2 space-y-4 flex flex-col items-center md:items-start">
            <div className="flex items-center justify-center md:justify-start">
              <img src="/logo.png" alt="FoneBox Logo" className="h-8 object-contain bg-white/90 p-1 rounded-md" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center md:text-left">
              FoneBox Global is the leading global provider of sovereign identity personalization, high-security smart cards, national-level e-passport chips, and defense-grade public key infrastructure.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
              {socialLinks.email && (
                <a href={`mailto:${socialLinks.email}`} className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>
              )}
              {socialLinks.website && (
                <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Sitemaps */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {sitemap.company.map((item, i) => (
                <li key={i}>
                  <button onClick={() => handleNavClick(item.tab)} className="block w-full text-center md:text-left hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {sitemap.solutions.map((item, i) => (
                <li key={i}>
                  <button onClick={() => handleNavClick(item.tab)} className="block w-full text-center md:text-left hover:text-white cursor-pointer transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {sitemap.services.map((item, i) => (
                <li key={i}>
                  <button onClick={() => handleNavClick(item.tab)} className="block w-full text-center md:text-left hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors text-slate-500 dark:text-slate-400">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Compliance Certification Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200 dark:border-slate-800/40">
        <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold mr-2">Governing Standards:</span>
          <span className="text-[9px] font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">ISO 27001 Certified</span>
          <span className="text-[9px] font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">FIPS 140-3 L4 HSM</span>
          <span className="text-[9px] font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">PCI-DSS 4.0 Compliant</span>
          <span className="text-[9px] font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">SOC 2 Type II Audited</span>
          <span className="text-[9px] font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">ICAO DOC 9303 Compliant</span>
          <span className="text-[9px] font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">FedRAMP High</span>
        </div>
      </div>

      {/* Corporate Copyright and Back to Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-200 dark:border-slate-800/40 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
          <span>© {new Date().getFullYear()} FoneBox Global Ltd. All rights reserved. Sovereign Information Systems Group.</span>
          <div className="mt-1.5 flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 text-[10px] text-slate-500">
            <button onClick={() => setActiveLegalDoc({ title: "Privacy Policy", content: legalContent.privacy })} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
            <span className="text-slate-300 dark:text-slate-800">|</span>
            <button onClick={() => setActiveLegalDoc({ title: "Terms of Use", content: legalContent.terms })} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Terms of Use</button>
            <span className="text-slate-300 dark:text-slate-800">|</span>
            <button onClick={() => setActiveLegalDoc({ title: "Export Compliance Guidelines", content: legalContent.export })} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Export Compliance Guidelines</button>
            {onStartTour && (
              <>
                <span className="text-slate-300 dark:text-slate-800">|</span>
                <button onClick={onStartTour} className="hover:text-blue-500 text-blue-600 dark:text-blue-500 font-bold transition-colors cursor-pointer">Take a tour</button>
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-2.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer"
          title="Return to Sovereign Origin"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Legal Modal */}
      {activeLegalDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0B1321] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800/60 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">Legal & Compliance</span>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-1">{activeLegalDoc.title}</h3>
              </div>
              <button 
                onClick={() => setActiveLegalDoc(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {activeLegalDoc.content}
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/60 flex justify-end">
              <button 
                onClick={() => setActiveLegalDoc(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
}
