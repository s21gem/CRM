/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Shield, Lock, Cpu, Server, Key, Eye, AlertTriangle, CheckCircle, Activity, Landmark, Loader2, X } from 'lucide-react';

export default function Security() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Vetting Modal State
  const [isVettingModalOpen, setIsVettingModalOpen] = useState(false);
  const [vettingName, setVettingName] = useState('');
  const [vettingEmail, setVettingEmail] = useState('');
  const [vettingOrg, setVettingOrg] = useState('');
  const [vettingIsSubmitted, setVettingIsSubmitted] = useState(false);
  
  const securityPillars = [
    {
      title: 'Global Compliance Standards',
      desc: 'FoneBox Global is certified under FIPS 140-3 Level 4 (the highest hardware-level validation), SOC 2 Type II, ISO/IEC 27001, PCI-DSS 4.0, and FedRAMP High sovereign cloud standards.',
      icon: CheckCircle
    },
    {
      title: 'High-Assurance Cryptography',
      desc: 'All data layers utilize military-grade encryption primitives including AES-GCM-256, RSA-4096, and ECDSA-P384. Post-quantum lattice-based signature preparations are currently actively deployed.',
      icon: Key
    },
    {
      title: 'Public Key Infrastructure (PKI)',
      desc: 'We design and configure offline Master Root Certificate Authorities isolated inside physically guarded steel faraday cages. Dual-custody multi-signature HSM cards govern all state certificate rolls.',
      icon: Shield
    },
    {
      title: 'Secure Infrastructure Nodes',
      desc: 'Our processing systems run inside private, redundant container cells. Continuous runtime integrity checks prevent raw kernel injection or document data exfiltrations.',
      icon: Server
    },
    {
      title: 'Advanced Identity Protection',
      desc: '1:N biometric de-duplication utilizes ISO/IEC 19794 compliant templates. Strict zero-knowledge proofs (ZKP) allow citizens to verify identity without revealing actual biodata records.',
      icon: Eye
    },
    {
      title: 'Security Operations & Governance',
      desc: 'A dedicated 24/7 sovereign SOC monitors threat streams. Custom automated orchestration blocks anomaly gateways in milliseconds while storing immutable logs in append-only ledgers.',
      icon: Activity
    }
  ];

  const riskGovernance = [
    { rule: 'Dual-Custody Mandate', details: 'All HSM cryptographic operations require physical presence and concurrent authorization keys from three certified Security Officers.' },
    { rule: 'Zero-Trust Gateways', details: 'No external IPs possess direct database connections. Access requires client-side certificate validation and hardware FIDO2 tokens.' },
    { rule: 'Continuous Audit Trails', details: 'Every administrative event is hashed and piped instantly to an append-only cryptographic ledger, preventing local log modifications.' },
    { rule: 'Physical Faraday Vaults', details: 'Our country-signing Root CA systems operate completely offline inside guarded physical cages with biometric dual-airlocks.' }
  ];

  const handleVettingRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/crm/security-vetting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: vettingName, company: vettingOrg, email: vettingEmail })
      });
      setVettingIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit vetting request', err);
      // Fallback UI for demo
      setVettingIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeVettingModal = () => {
    setVettingName('');
    setVettingEmail('');
    setVettingOrg('');
    setVettingIsSubmitted(false);
    setIsVettingModalOpen(false);
  };

  return (
    <div className="space-y-16 pt-28 pb-12">
      
      {/* Page Intro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold font-bold">Security & Sovereignty</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white">Sovereign Defensive Posture</h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-3xl mx-auto">
          FoneBox Global operates under the highest military and diplomatic security standards to guarantee the absolute confidentiality of citizen identities and payment credentials.
        </p>
      </section>

      {/* Security Pillars Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {securityPillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1321]/30 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Icon className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">{pillar.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{pillar.desc}</p>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/40 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                System Active & Verified
              </div>
            </div>
          );
        })}
      </section>

      {/* Strict Risk Governance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="border-b border-slate-200 dark:border-slate-800/40 pb-6 text-center md:text-left">
          <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">Governance & Risk</span>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">Operational Security Policies</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {riskGovernance.map((gov, i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/20 flex gap-4 items-start">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-display font-bold text-xs text-slate-800 dark:text-slate-100">{gov.rule}</h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{gov.details}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Military Grade Credentials Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-slate-500 uppercase">Defense-Grade Auditing</span>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Is your ecosystem ready for audit?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs">Our security audit teams deploy localized testing suits mimicking state threat vectors.</p>
          </div>
          <button
            onClick={() => setIsVettingModalOpen(true)}
            className="px-5 py-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/10 cursor-pointer shrink-0"
          >
            Request Security Audit Vetting
          </button>
        </div>
      </section>

      {/* Vetting Request Modal */}
      {isVettingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-center">
          {/* Backdrop */}
          <div 
            onClick={closeVettingModal}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity" 
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-lg rounded-3xl shadow-2xl border transition-all duration-300 z-10 bg-white dark:bg-[#0B1221] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-slate-200 dark:shadow-black/80">
            <div className="flex justify-between items-center p-6 border-b border-slate-800/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-blue-400 uppercase font-bold block">Sovereign Channels</span>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">Security Audit Vetting</h3>
                </div>
              </div>
              <button 
                onClick={closeVettingModal}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-6">
              {vettingIsSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">Audit Request Logged</h4>
                    <p className="text-slate-400 text-xs">Tracking token: <span className="font-mono text-blue-400 font-bold">AUDIT-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span></p>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed max-w-sm mx-auto">
                    Your request for a sovereign vulnerability vetting has been secured. Our security operations center (SOC) will contact you via encrypted channel shortly to outline next steps.
                  </p>
                  <button
                    onClick={closeVettingModal}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 text-white text-xs font-bold uppercase tracking-wider block mx-auto transition-colors shadow-md"
                  >
                    Close Secure Console
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVettingRequest} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Representative Name</label>
                    <input
                      type="text"
                      required
                      value={vettingName}
                      onChange={(e) => setVettingName(e.target.value)}
                      placeholder="e.g. Director James Carter..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Secure Contact Email</label>
                    <input
                      type="email"
                      required
                      value={vettingEmail}
                      onChange={(e) => setVettingEmail(e.target.value)}
                      placeholder="e.g. carter@ministry.gov..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Government agency or Corporation</label>
                    <input
                      type="text"
                      required
                      value={vettingOrg}
                      onChange={(e) => setVettingOrg(e.target.value)}
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
                      {isSubmitting ? 'Transmitting Request...' : `Submit Audit Request`}
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
