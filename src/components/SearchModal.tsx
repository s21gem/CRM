/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, X, Shield, Globe, Cpu, Terminal, FileText, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: any) => void;
  isDarkMode: boolean;
}

export default function SearchModal({
  isOpen,
  onClose,
  setActiveTab,
  isDarkMode,
}: SearchModalProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  // Static index of public website content to search
  const searchIndex = [
    // Solutions
    {
      title: 'Electronic Passport (e-Passport)',
      category: 'Solutions',
      tab: 'solutions',
      desc: 'ICAO Doc 9303 compliant national passports with secure contactless RFID chip and biometrics.',
    },
    {
      title: 'Secure EMV Bank Cards',
      category: 'Solutions',
      tab: 'solutions',
      desc: 'Retail and Central Bank card personalization conforming to PCI-DSS 4.0 standards.',
    },
    {
      title: 'Electronic Visa Systems (e-Visa)',
      category: 'Solutions',
      tab: 'solutions',
      desc: 'Secure consular workflow with automated watchlist checking and signed QR-code visa issuance.',
    },
    {
      title: 'National Cryptographic Registries',
      category: 'Solutions',
      tab: 'solutions',
      desc: 'Sovereign citizen registries backed by hardware-protected public key infrastructure.',
    },
    {
      title: 'Zero Trust Core Network Access',
      category: 'Solutions',
      tab: 'solutions',
      desc: 'Micro-segmented military-grade secure gateway structures.',
    },

    // Services
    {
      title: 'Identity Personalization Solutions',
      category: 'Services',
      tab: 'services',
      desc: 'Laser engraving, smartcard chip flashing, and multi-factor biometric deduplication.',
    },
    {
      title: 'FinTech Payment Customization',
      category: 'Services',
      tab: 'services',
      desc: 'Electrical and physical smartcard customization with derived EMV key injection.',
    },
    {
      title: 'Public Key Infrastructure Operations',
      category: 'Services',
      tab: 'services',
      desc: 'Root Certificate Authority (CA) pipelines, online OCSP response validation.',
    },
    {
      title: 'Sovereign Cyber Defense Command',
      category: 'Services',
      tab: 'services',
      desc: 'Automated threat orchestration, risk analysis, and append-only ledger audit logs.',
    },

    // Security
    {
      title: 'FIPS 140-3 Level 4 HSM Cryptography',
      category: 'Security',
      tab: 'security',
      desc: 'Tamper-resistant cryptographic hardware modules for high-assurance signing keys.',
    },
    {
      title: 'ISO 27001 & SOC 2 Compliance',
      category: 'Security',
      tab: 'security',
      desc: 'Corporate audits and strict risk governance controls protecting user-authored registries.',
    },

    // Careers
    {
      title: 'Senior Identity Security Architect',
      category: 'Careers',
      tab: 'careers',
      desc: 'Lead high-security sovereign chip programming architecture initiatives.',
    },
    {
      title: 'PKI Root Operations Engineer',
      category: 'Careers',
      tab: 'careers',
      desc: 'Maintain offline Faraday-cage Root CA pipelines and registration nodes.',
    },

    // Developer resources (Part 1 specs)
    {
      title: 'Interactive Hardware Sandbox Simulator',
      category: 'Developer Spec',
      tab: 'developer-spec',
      desc: 'FIPS 140-3 HSM key signer simulation and dynamic request editor.',
    },
    {
      title: 'Monorepo Structural Directory Tree',
      category: 'Developer Spec',
      tab: 'developer-spec',
      desc: 'Browse the official FoneBox Global secure enterprise code layout.',
    },
    {
      title: 'Compliance Design Tokens Console',
      category: 'Developer Spec',
      tab: 'developer-spec',
      desc: 'System spacing, typography, and atomic branding assets library.',
    },
  ];

  const results =
    query.trim() === ''
      ? searchIndex.slice(0, 4) // Show featured items on empty search
      : searchIndex.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.desc.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

  const handleResultClick = (tab: string) => {
    setActiveTab(tab);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-start">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Search Console Card */}
      <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl border transition-all duration-300 mt-8 bg-white dark:bg-[#0B1221] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-slate-200 dark:shadow-black/80">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-4 border-b border-slate-200 dark:border-slate-800/60">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search solutions, services, security standards..."
            className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="p-4 max-h-[420px] overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-slate-500 uppercase px-2">
            <span>{query.trim() === '' ? 'Featured Shortcuts' : 'Search Results'}</span>
            <span>{results.length} matched</span>
          </div>

          {results.length > 0 ? (
            <div className="space-y-1.5">
              {results.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleResultClick(item.tab)}
                  className="w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start gap-3.5 group cursor-pointer bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 hover:border-blue-400 dark:hover:border-blue-500/40"
                >
                  <div
                    className={`p-2 rounded-lg mt-0.5 ${
                      item.category === 'Solutions'
                        ? 'bg-indigo-500/10 text-indigo-400'
                        : item.category === 'Services'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : item.category === 'Security'
                            ? 'bg-rose-500/10 text-rose-400'
                            : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    {item.category === 'Solutions' && <Globe className="w-4.5 h-4.5" />}
                    {item.category === 'Services' && <Cpu className="w-4.5 h-4.5" />}
                    {item.category === 'Security' && <Shield className="w-4.5 h-4.5" />}
                    {item.category === 'Careers' && <FileText className="w-4.5 h-4.5" />}
                    {item.category === 'Developer Spec' && <Terminal className="w-4.5 h-4.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-xs transition-colors group-hover:text-blue-400 text-[#0F172A] dark:text-slate-200">
                        {item.title}
                      </span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-blue-400 transition-colors self-center shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Shield className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3 animate-bounce" />
              <p className="text-xs text-slate-600 dark:text-slate-400 font-display">
                No high-security matches found for "{query}"
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                Please audit request inputs or contact local security command
              </p>
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/40 rounded-b-2xl border-t border-slate-200 dark:border-slate-800/40 flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span>Search index encrypted under AES-GCM-256</span>
          <span className="flex items-center gap-1">
            <kbd className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-1.5 py-0.2 rounded">
              ESC
            </kbd>{' '}
            to exit console
          </span>
        </div>
      </div>
    </div>
  );
}
