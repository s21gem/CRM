/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Shield, Cpu, Landmark, Lock, CheckCircle, ArrowRight, Database, 
  Terminal, FileCode, Check, Server, Layers, HelpCircle, Image as ImageIcon
} from 'lucide-react';

interface ServicesProps {
  isDarkMode: boolean;
  onOpenConsultation: () => void;
}

export default function Services({ isDarkMode, onOpenConsultation }: ServicesProps) {
  const [activeTab, setActiveTab] = useState<'id-pers' | 'fintech' | 'digital-id' | 'cyber'>('id-pers');
  const [dynamicServices, setDynamicServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/cms/services');
        if (res.ok) {
          setDynamicServices(await res.json());
        }
      } catch (e) {
        console.error("Failed to fetch dynamic services", e);
      }
    };
    fetchServices();
  }, []);

  const servicesData = {
    'id-pers': {
      title: 'Identity Personalization',
      tagline: 'Precision E-Passports & E-Visas',
      overview: 'We personalize identity documents like e-passports and e-visas with precision. Conforming to global specifications, this service covers passport and visa lifecycle management.',
      benefits: [
        '99.999% smartcard chip electrical programming integrity.',
        'Advanced biometric data integration.',
        'High-security printing and personalization lines.'
      ],
      value: 'Reduces border clearance times while making national identity credentials immune to forgery.',
      technologies: ['Laser Engraving Engine', 'Biometric Matcher', 'ICAO Cryptographic Packager'],
      subservices: [
        { name: 'Global E-Passports', desc: 'Secure chip configuration, biometric vetting, and national ID mapping.' },
        { name: 'Global E-Visas', desc: 'Cryptographically signed visa digital portals with fast processing.' }
      ]
    },
    'fintech': {
      title: 'FinTech Solutions',
      tagline: 'Secure Bank Cards & Monetary Ecosystems',
      overview: 'Our fintech solutions power secure bank cards and monetary ecosystems. We design and configure complete payment card production lines for banks worldwide.',
      benefits: [
        'Direct HSM Derived EMV keys injection.',
        'Complete compliance with strict PCI-DSS regulations.',
        'Secure contactless banking infrastructure.'
      ],
      value: 'Empowers financial institutions to bring smartcard production in-house under physical defense-vault parameters.',
      technologies: ['EMV Profile Engine', 'Hardware Security Modules', 'derived keys protocol'],
      subservices: [
        { name: 'EMV Bank Cards', desc: 'Secure dual-interface smart chip configuration for central banking networks.' },
        { name: 'Payment Authorization Systems', desc: 'Sub-millisecond payment authorization pipelines for modern transactions.' }
      ]
    },
    'digital-id': {
      title: 'Identity Solutions',
      tagline: 'Crafted for Governments and Corporations',
      overview: 'Personalized identity solutions crafted for governments and corporations. We build custom sovereign registries and credential lifecycle managers.',
      benefits: [
        'Sovereign data storage with maximum privacy.',
        'Zero Physical Risk through distributed storage.',
        'Multi-factor digital verification portals.'
      ],
      value: 'Secures vital sovereign communications, rendering government databases impenetrable.',
      technologies: ['Identity Framework', 'Secure Access Portals'],
      subservices: [
        { name: 'Corporate IDs', desc: 'Secure ID card printing and access control systems for large enterprise and corporate entities.' },
        { name: 'Government Identity Frameworks', desc: 'National-scale citizen ID mapping and biometric databases.' }
      ]
    },
    'cyber': {
      title: 'Cybersecurity',
      tagline: 'Protecting Critical Infrastructures',
      overview: 'Robust cyber security integration protecting critical infrastructures. We construct Zero Trust networks and deploy micro-segmented gateways.',
      benefits: [
        'Offline Master Root CA established inside physical Faraday cages.',
        'Continuous context-aware threat vetting.',
        'Immutable audit trails logged onto an append-only ledger.'
      ],
      value: 'End-to-end protection of critical national and corporate infrastructure against state-sponsored operations.',
      technologies: ['Zero Trust Access Gateway', 'PKI Root CA Orchestrator', 'cryptographic ledger'],
      subservices: [
        { name: 'Identity Verification PKI', desc: 'Online Certificate Status (OCSP) query servers and CRL managers.' },
        { name: 'Micro-Segmented Access Gateway', desc: 'Contextual risk vetting engines and hardware security token verification.' }
      ]
    }
  };

  const current = servicesData[activeTab];

  return (
    <div className="space-y-16 pt-28 pb-12">
      
      {/* Intro Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">Services Directory</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white">Sovereign Enterprise Capabilities</h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-3xl mx-auto">
          FoneBox Global delivers three primary service clusters. Our engineers establish local production lines, configure hardware security networks, and deploy military-grade database architectures.
        </p>
      </section>

      {/* Navigation Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 gap-1 shadow-sm dark:shadow-none">
          {(['id-pers', 'fintech', 'digital-id', 'cyber'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/30'
              }`}
            >
              {servicesData[tab].title}
            </button>
          ))}
        </div>
      </section>

      {/* Active Service Showcase Bento */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Detailed Content left */}
          <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-slate-50 dark:bg-[#0B1321]/30 border border-slate-200 dark:border-slate-800 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[9px] font-mono tracking-widest uppercase text-blue-600 dark:text-blue-400 block font-bold">{current.tagline}</span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">{current.title}</h2>
              </div>

              <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">{current.overview}</p>

              {/* Bulleted Benefits list */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Engineered Advantages</h3>
                <ul className="space-y-2.5">
                  {current.benefits.map((ben, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <CheckCircle className="w-4.5 h-4.5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Business Value block */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Business Value Metric</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  "{current.value}"
                </p>
              </div>
            </div>

            {/* Technologies list */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800/60 flex flex-wrap gap-2 items-center">
              <span className="text-[9px] font-mono text-slate-500 uppercase font-bold mr-2">Governing Stack:</span>
              {current.technologies.map((tech, i) => (
                <span key={i} className="text-[9px] font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>

          </div>

          {/* Sub-services breakdown right */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            <div className="space-y-4 flex-1">
              {current.subservices.map((sub, i) => (
                <div key={i} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/20 space-y-1.5 group hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                  <h4 className="font-display font-bold text-xs text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {sub.name}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    {sub.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Call To Action Block */}
            <div className="p-6 rounded-2xl border border-blue-500/10 dark:border-blue-500/20 bg-gradient-to-br from-blue-50 dark:from-blue-950/20 to-indigo-50 dark:to-indigo-950/20 text-center space-y-4">
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Need a custom localized production layout?</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs">Our executive engineering board produces full mechanical and crypt-spec blueprints on request.</p>
              <button
                onClick={onOpenConsultation}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-xs font-bold uppercase tracking-wider block shadow-md hover:from-blue-700 transition-colors cursor-pointer"
              >
                Request Sovereign Consultation
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Dynamic Services Section */}
      {dynamicServices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">Additional Offerings</span>
            <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">Specialized Solutions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dynamicServices.map(service => (
              <div key={service.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm flex flex-col group">
                <div className="h-48 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 mb-4 flex items-center justify-center">
                  {service.imageUrl ? (
                    <img src={`http://localhost:5000${service.imageUrl}`} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                  )}
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trust & Certifications section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none text-center space-y-4">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">National Security Compliances</span>
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">Tested Under Sovereign Firewalls</h2>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <span className="text-[9px] font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded">FIPS 140-3 LEVEL 4 HSM</span>
            <span className="text-[9px] font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded">ICAO DOC 9303 CHIP SPEC</span>
            <span className="text-[9px] font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded">ISO 14443 CONTACTLESS TYPE A/B</span>
            <span className="text-[9px] font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded">PCI-DSS 4.0 CENTRAL VAULT</span>
          </div>
        </div>
      </section>

    </div>
  );
}
