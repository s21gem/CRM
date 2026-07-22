/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Landmark, Globe, Lock, Cpu, Server, Users, Activity, GraduationCap } from 'lucide-react';

export default function Industries() {
  const industries = [
    {
      name: 'Government & State Sovereignty',
      icon: Shield,
      desc: 'National biometric citizen identification networks, offline Faraday-cage Root Certificate Authorities, and passport personalization center configurations.',
      standard: 'ICAO Doc 9303 Compliant'
    },
    {
      name: 'Central & Retail Banking',
      icon: Landmark,
      desc: 'Local high-throughput dual-interface EMV chip flasher pipelines, direct derived master key HSM installations, and PCI-DSS compliance vaults.',
      standard: 'PCI-DSS 4.0 Compliant'
    },
    {
      name: 'Defense & Secure Command',
      icon: Lock,
      desc: 'Isolated military-grade local local area networks, hardware security WebAuthn keys verification, and micro-segmented Zero Trust gateways.',
      standard: 'FedRAMP High / FIPS 140-3'
    },
    {
      name: 'Telecommunications & 5G',
      icon: Cpu,
      desc: 'Sovereign e-SIM profile configuration pipelines, high-density secure cellular subscription registries, and HSM encryption tunnels.',
      standard: 'GSMA SAS-UP Certified'
    },
    {
      name: 'Immigration & Borders',
      icon: Globe,
      desc: 'E-Gate biometric capture terminals, electronic visas with cryptographically signed JWS QR-code decals, and automated Interpol watch vetting.',
      standard: 'Border Force Command Spec'
    },
    {
      name: 'Public Healthcare Registries',
      icon: Activity,
      desc: 'Secure citizen medical records storage registries, encrypted dual-factor hospital staff credentials, and append-only ledger access audits.',
      standard: 'HIPAA & GDPR Standards'
    },
    {
      name: 'Public Transit & Smart Cities',
      icon: Server,
      desc: 'Ultra-fast sub-millisecond tap-to-ride payment chip programming, urban citizen multi-application smart cards, and central ticketing networks.',
      standard: 'Calypso & Mifare Compliant'
    },
    {
      name: 'National Education Registries',
      icon: GraduationCap,
      desc: 'Digital graduation registries, cryptographically verifiable degree credentials, and secure student smart cards with access controls.',
      standard: 'W3C Verifiable Credentials'
    },
    {
      name: 'Corporate Enterprise Platforms',
      icon: Users,
      desc: 'Zero Trust employee credentials, physical contactless facility access cards, secure single sign-on (SSO) and continuous risk audits.',
      standard: 'SOC 2 Type II Audited'
    }
  ];

  return (
    <div className="space-y-16 pt-28 pb-12">
      
      {/* Page Intro Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold font-bold">Global Sectors</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white">Sovereign Industries</h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-3xl mx-auto">
          FoneBox Global supplies specialized high-security technology configurations precisely customized for the risk classifications of nine major global industrial disciplines.
        </p>
      </section>

      {/* Grid Matrix of Industries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {industries.map((ind, i) => {
          const Icon = ind.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A]/20 hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {ind.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  {ind.desc}
                </p>
              </div>
              <div className="pt-5 border-t border-slate-200 dark:border-slate-800/60 mt-6 flex justify-between items-center text-[10px] font-mono text-slate-500 dark:text-slate-500">
                <span>Governing Spec</span>
                <span className="text-blue-600 dark:text-blue-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{ind.standard}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom Cert Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none text-center space-y-3">
          <span className="text-[10px] font-mono text-slate-500 uppercase">National Security Assurance</span>
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Full Regulatory Standardization</h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs max-w-2xl mx-auto">
            All industry configurations undergo yearly physical intrusion tests, cryptographic standard audits, and compliance reviews to guarantee pristine operational posture.
          </p>
        </div>
      </section>

    </div>
  );
}
