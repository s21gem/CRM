/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, Globe, Cpu, Terminal, FileText, ArrowRight, CheckCircle, 
  Users, Layers, Award, Landmark, RefreshCw, Zap, Lock, Database, Play, Star
} from 'lucide-react';
import SEOMeta from './SEOMeta';

interface HomeProps {
  isDarkMode: boolean;
  setActiveTab: (tab: any) => void;
  onOpenConsultation: () => void;
}

export default function Home({ isDarkMode, setActiveTab, onOpenConsultation }: HomeProps) {
  const [dynamicTestimonials, setDynamicTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/cms/testimonials');
        if (res.ok) {
          setDynamicTestimonials(await res.json());
        }
      } catch (e) {
        console.error("Failed to fetch testimonials", e);
      }
    };
    fetchTestimonials();
  }, []);
  // Animated Stats Counter State
  const [counters, setCounters] = useState({
    countries: 0,
    projects: 0,
    clients: 0,
    years: 0,
    transactions: '0',
    docs: 0
  });

  useEffect(() => {
    // Elegant incremental counter simulation
    const timer = setTimeout(() => {
      setCounters({
        countries: 142,
        projects: 88,
        clients: 230,
        years: 18,
        transactions: '4.2B+',
        docs: 75
      });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const services = [
    {
      id: 'id-pers',
      title: 'Identity Personalization',
      icon: Cpu,
      desc: 'ICAO Doc 9303 compliant national passports, e-Visas, laser engraving polycarbonate pages, and active RFID smart chip configurations.',
    },
    {
      id: 'fintech',
      title: 'FinTech Engineering',
      icon: Landmark,
      desc: 'Dual-interface smart card personalisation with derived EMV master keys and sub-millisecond payment authorization pipelines.',
    },
    {
      id: 'cyber',
      title: 'Sovereign Cyber Security',
      icon: Lock,
      desc: 'Sovereign client PKI Root CA setup, Zero Trust gateway micro-segmentation, and hardware cryptography integration.',
    },
    {
      id: 'digid',
      title: 'Digital Identity Frameworks',
      icon: Globe,
      desc: 'Biometric deduplication databases, national citizen identification registries, and decentralized ID wallets.',
    }
  ];

  const [featuredSolutions, setFeaturedSolutions] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeaturedSolutions = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/cms/featured-solutions');
        if (res.ok) {
          const data = await res.json();
          // Map backend field names (imageUrl, desc) to what the UI expects (img, desc)
          const mapped = data.map((d: any) => ({
            ...d,
            img: d.imageUrl?.startsWith('/uploads') ? `http://localhost:5000${d.imageUrl}` : d.imageUrl
          }));
          setFeaturedSolutions(mapped);
        }
      } catch (e) {
        console.error("Failed to fetch featured solutions", e);
      }
    };
    fetchFeaturedSolutions();
  }, []);

  const industries = [
    { name: 'National Government', count: '45+ Projects' },
    { name: 'Border Force & Immigration', count: '18 borders' },
    { name: 'Central Banks & retail finance', count: '110+ banks' },
    { name: 'Defense & Secure Facilities', count: 'Top Secret' },
    { name: 'Telecommunications', count: '5G Core Security' },
    { name: 'Public Healthcare Registries', count: '30M+ Records' },
    { name: 'Global Transits & Ports', count: 'Airport Hubs' },
    { name: 'Enterprise Identity & Access', count: 'Fortune 500' }
  ];

  const whyChooseUs = [
    { title: 'Security First Strategy', desc: 'Sovereign data stores and HSM-backed cryptographic operations complying with FIPS 140-3 Level 4.' },
    { title: 'Relentless Tech Innovation', desc: 'Deploying advanced deep learning biometrics, zero-knowledge credentials, and lightweight decentralized security.' },
    { title: 'Uncompromising Compliance', desc: 'Engineered from day one to conform with strict ISO/IEC 27001, SOC 2 Type II, and GDPR specifications.' },
    { title: 'Trusted Global Experts', desc: 'Over 18 years partnering with national defense departments, national immigration authorities, and central bank groups.' }
  ];

  const techStack = [
    { name: 'Artificial Intelligence', desc: 'Sub-millisecond biometric face & fingerprint 1:N matchmaking.', icon: Cpu },
    { name: 'Sovereign Cloud', desc: 'FedRAMP High compliant redundant isolated infrastructure.', icon: Database },
    { name: 'RSA & ECDSA Encryption', desc: 'Post-quantum ready high-assurance cryptographic primitives.', icon: Lock },
    { name: 'Public Key Infrastructure (PKI)', desc: 'National-level Root Certificate Authority setup and CRLs.', icon: Shield },
    { name: 'Multi-Modal Biometrics', desc: 'ISO/IEC 19794 compliant template encapsulation systems.', icon: Users },
    { name: 'Hardware Security Modules', desc: 'Direct secure hardware integrations via PKCS#11 standard.', icon: Terminal }
  ];

  const caseStudies = [
    {
      badge: 'GOVERNMENT IDENTITY',
      title: 'Sovereign National Citizen ID Card Rollout',
      client: 'Middle Eastern Ministry of Interior',
      challenge: 'Unify border, national health, and retail banking credentials onto a single polycarbonate secure contact smartcard.',
      solution: 'Designed and deployed a dual-interface smartcard architecture with high-security PKI chip applets, laser personalization lines, and central card personalization centers.',
      metrics: ['22M+ Citizen IDs Personalised', '99.999% Hardware Integrity Rate', 'Under 4 seconds border clearance time']
    },
    {
      badge: 'FINTECH CUSTOMIZATION',
      title: 'Multi-Bank Contactless EMV Personalization Hub',
      client: 'Consolidated Bank of Central Europe',
      challenge: 'Establish high-throughput local production lines capable of personalizing 100,000 dual-interface payment cards daily.',
      solution: 'Provided FoneBox HSM profile preparators and automated high-speed electrical flashing pipelines integrated directly with core banking CRM systems.',
      metrics: ['50M+ Active Bank Cards Produced', 'Zero security breaches over 8 years', 'PCI-DSS 4.0 compliant audits']
    }
  ];

  return (
    <div className="space-y-24 pb-12">
      <SEOMeta 
        title="Enterprise ICT Solutions & High Security Architecture" 
        description="Global leaders in sovereign identity, secure e-passports, FinTech payment solutions, and multi-modal biometrics infrastructure." 
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden">
        {/* Ambient Cosmic Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
          {/* Subtle Grid Dot Matrix overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Shield className="w-3.5 h-3.5 animate-pulse" /> Sovereign High-Security Tech
            </div>
            
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight text-slate-900 dark:text-white">
              Secure Digital Identity & <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-slate-900 dark:from-blue-400 dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">FinTech Personalization</span>
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
              FoneBox Global engineers and delivers defense-grade electronic passport chips, multi-application national citizen cards, high-security EMV card personalizations, and military-level Zero Trust PKI structures for governments, interior ministries, and premier financial institutions worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={onOpenConsultation}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer flex items-center justify-center gap-2"
              >
                Request Sovereign Consultation <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleNavClick('solutions')}
                className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Explore Solutions
              </button>
            </div>

            {/* Trusted partner logos */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800/40 space-y-3">
              <p className="text-[10px] font-mono tracking-widest uppercase text-slate-500">Trusted By Strategic Authorities</p>
              <div className="flex flex-wrap gap-x-6 gap-y-3 items-center justify-center lg:justify-start opacity-40 grayscale hover:opacity-75 transition-opacity">
                <span className="text-xs font-semibold tracking-wider font-display text-slate-900 dark:text-white">INTERPOL HQ</span>
                <span className="text-xs font-semibold tracking-wider font-display text-slate-900 dark:text-white">MINISTRY OF HOME AFFAIRS</span>
                <span className="text-xs font-semibold tracking-wider font-display text-slate-900 dark:text-white">WORLD TECH BANK</span>
                <span className="text-xs font-semibold tracking-wider font-display text-slate-900 dark:text-white">ICT DIVISION</span>
              </div>
            </div>

          </div>

          {/* Hero Right Interactive Illustration */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-blue-600/5 dark:from-blue-600/10 to-indigo-500/10 dark:to-indigo-950/40 border border-blue-500/10 dark:border-blue-500/20 flex items-center justify-center shadow-2xl">
              
              {/* Spinning Ring */}
              <div className="absolute inset-4 rounded-full border border-dashed border-indigo-500/30 animate-spin" style={{ animationDuration: '40s' }} />
              <div className="absolute inset-10 rounded-full border border-dashed border-blue-500/20 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />

              {/* Centered Hologram Core */}
              <div className="relative p-8 rounded-3xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center gap-3 w-64 text-center z-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400 animate-pulse" />
                </div>
                <div className="font-mono text-[9px] text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  FIPS 140-3 SECURITY SYSTEM
                </div>
                <span className="font-display font-bold text-sm tracking-wide text-slate-900 dark:text-white">Sovereign Core Live</span>
                <div className="w-full space-y-1">
                  <div className="h-1 w-full bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-pulse w-4/5" />
                  </div>
                  <span className="text-[8px] font-mono text-slate-500">PKI Signing Keys Active</span>
                </div>
              </div>

              {/* Floating tech badges */}
              <div className="absolute -top-4 -left-4 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono flex items-center gap-2 shadow-lg">
                <Globe className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span>ICAO DOC 9303</span>
              </div>
              <div className="absolute bottom-6 -right-6 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono flex items-center gap-2 shadow-lg">
                <Cpu className="w-4 h-4 text-indigo-500 dark:text-indigo-400 animate-spin" style={{ animationDuration: '5s' }} />
                <span>EMV PERSONALIZED</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Core Services Section */}
      <section className="tour-services max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">Comprehensive Capabilities</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Sovereign Technology Core Services
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Our platform supports global security infrastructures and retail bank issuers across four primary operational disciplines. Click to learn more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A]/40 hover:bg-slate-100 dark:hover:bg-[#0F172A] hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    {service.desc}
                  </p>
                </div>
                <button
                  onClick={() => handleNavClick('services')}
                  className="mt-6 flex items-center gap-1.5 text-xs font-mono text-blue-400 group-hover:text-blue-300 cursor-pointer text-left"
                >
                  Learn Core Capabilities <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Solutions (Interactive Premium Cards) */}
      <section className="tour-solutions max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 dark:border-slate-800/40 pb-6">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">Featured Products</span>
            <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white mt-1">High-Fidelity Enterprise Solutions</h2>
          </div>
          <button
            onClick={() => handleNavClick('solutions')}
            className="flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors"
          >
            Browse Solutions Catalog <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {featuredSolutions.map((sol, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B132B]/20 hover:border-blue-500/50 transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={sol.img}
                  alt={sol.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/20 dark:via-slate-950/20 to-transparent" />
                <span className="absolute bottom-4 left-4 text-[9px] font-mono uppercase bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                  {sol.category}
                </span>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {sol.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    {sol.desc}
                  </p>
                </div>
                <button
                  onClick={() => handleNavClick('solutions')}
                  className="pt-4 flex items-center gap-1 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer text-left"
                >
                  Request Technical Spec <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Testimonials Section */}
      {dynamicTestimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">Client Success</span>
            <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">Trusted Globally</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dynamicTestimonials.map(testi => (
              <div key={testi.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm flex flex-col justify-between group space-y-4">
                <div className="flex gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < testi.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm italic">"{testi.quote}"</p>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{testi.author}</h4>
                  <span className="text-xs text-slate-500">{testi.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-500/5 dark:from-blue-900/40 via-indigo-500/5 dark:via-indigo-950/30 to-blue-500/5 dark:to-blue-900/40 border border-blue-500/10 dark:border-blue-500/20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Shield className="w-64 h-64 text-blue-500 animate-pulse" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Ready to Design a Sovereign Secure Solution?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Contact our executive team of cyber defense engineers, PKI cryptographers, and smartcard personalization architects. Let's build the future together.
            </p>
            <button
              onClick={onOpenConsultation}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Request Sovereign Consultation
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
