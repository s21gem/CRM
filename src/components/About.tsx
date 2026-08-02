/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Target, Eye, Award, Globe, Clock, ChevronRight } from 'lucide-react';

export default function About() {
  const coreValues = [
    {
      title: 'Sovereignty & Trust',
      desc: 'We honor country-level data sovereignty. FoneBox architectures ensure complete user-authored data control and never compromise with third-party tracking.',
    },
    {
      title: 'Military-Grade Engineering',
      desc: 'Our smart cards, e-Passports, and networks are developed using certified FIPS 140-3 Level 4 hardware security frameworks.',
    },
    {
      title: 'Continuous Innovation',
      desc: 'We actively contribute to the formulating committee of global ICAO, ISO/IEC, and EMV payment standards.',
    },
    {
      title: 'Uncompromising Rigor',
      desc: 'Our code undergoes multi-tiered static verification and sovereign physical security audits.',
    },
  ];

  const leaders = [
    {
      name: 'Hon. Margaret Vance',
      role: 'Chief Executive Officer (CEO)',
      bio: 'Former Deputy Director of Information Systems at the Department of Homeland Security. 25+ years formulating national security architectures.',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Dr. Robert Chen, PhD',
      role: 'Chief Cryptographer & CTO',
      bio: 'Co-author of national ECDSA key exchange specifications. Holds a doctorate in Quantum Cryptography from MIT.',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Alena Rostova',
      role: 'VP of FinTech Systems Engineering',
      bio: 'Pioneered dual-interface contactless EMV authorization pipelines. 18 years coordinating payment personalization centers worldwide.',
      avatar:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Col. Marcus Vance, Ret.',
      role: 'Director of Government Relations',
      bio: 'Retired cryptographic operations officer. Directs sovereign border control collaborations and embassy-adjudication frameworks.',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    },
  ];

  const globalPresence = [
    {
      city: 'Dhaka Headquarters',
      scope: 'National & Diplomatic Operations Command',
      coords: '23.7771° N, 90.3994° E',
    },
    {
      city: 'London Financial Center',
      scope: 'FinTech & EMV Personalization Operations',
      coords: '51.5074° N, 0.1278° W',
    },
    {
      city: 'Tokyo Tech Laboratories',
      scope: 'Biometric R&D and Polycarbonate Engineering',
      coords: '35.6762° N, 139.6503° E',
    },
    {
      city: 'Geneva Global Office',
      scope: 'International Compliance & Standards Coordination',
      coords: '46.2044° N, 6.1432° E',
    },
  ];

  const timeline = [
    {
      year: '2008',
      title: 'Sovereign Inception',
      desc: 'FoneBox Global founded to supply high-security Smart Card ICs to national agencies.',
    },
    {
      year: '2012',
      title: 'e-Passport Integration',
      desc: 'Introduced the LDS1 cryptographic microchip, conforming to global ICAO standards.',
    },
    {
      year: '2016',
      title: 'FinTech Personalization Launch',
      desc: 'Built high-speed regional payment personalization hubs with Derived EMV Keys.',
    },
    {
      year: '2021',
      title: 'Zero Trust Gateway Deploy',
      desc: 'Introduced the micro-segmented security access gateways for military command structures.',
    },
    {
      year: '2026',
      title: 'Post-Quantum Transition',
      desc: 'Active deployment of lattice-based signature schemas on smartcard processors.',
    },
  ];

  return (
    <div className="space-y-24 pt-28 pb-12">
      {/* Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center lg:text-left">
        <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">
          About FoneBox Global
        </span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white">
          The Sovereign Core of Digital Trust
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-4xl mx-auto lg:mx-0">
          Founded in 2008, FoneBox Global Ltd. serves as a primary cryptographic architect for
          national departments, interior ministries, state-level border control units, and premier
          financial organizations across 142 countries. We engineer state-of-the-art secure
          electronic systems, polycarbonate passport data pages, central payment card engraving
          nodes, and PKI directory authorities.
        </p>
      </section>

      {/* Mission & Vision Bento */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#0F172A]/30 border border-slate-200 dark:border-slate-800 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-500 dark:text-blue-400">
            <Target className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            Our Mission
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            To provide national governments, central bank hierarchies, and defense agencies with
            absolute informational sovereignty. We achieve this by crafting highly secure,
            immutable, hardware-hardened identity personalization networks and payment pipelines
            from scratch—eliminating foreign vulnerabilities and establishing absolute domestic
            control.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#0F172A]/30 border border-slate-200 dark:border-slate-800 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
            <Eye className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            Our Vision
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            To create an interconnected global network of zero-trust high-security operations where
            biometric identification, smart payment systems, and consular adjudications execute in
            milliseconds under post-quantum cryptographic protection. We are transforming digital
            identity verification from a point of vulnerability into a pillar of national defense.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="border-b border-slate-200 dark:border-slate-800/40 pb-6">
          <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">
            Our Philosophy
          </span>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Foundational Corporate Values
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 space-y-3"
            >
              <span className="text-xs font-mono text-blue-500 font-bold">0{idx + 1}.</span>
              <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">
                {val.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">
            Executive Board
          </span>
          <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">
            Sovereign Command & Leadership
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            Our leadership team comprises former defense architects, quantum cryptographers, and
            smartcard engineers with lifetimes of high-assurance service.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaders.map((ldr, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]/40 overflow-hidden group shadow-sm dark:shadow-none"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={ldr.avatar}
                  alt={ldr.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0F172A] via-white/10 dark:via-[#0F172A]/10 to-transparent" />
              </div>
              <div className="p-5 space-y-2 relative">
                <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                  {ldr.name}
                </h3>
                <span className="text-[9px] font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest block font-bold">
                  {ldr.role}
                </span>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mt-1">
                  {ldr.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Presence */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">
            Strategic Geography
          </span>
          <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white leading-tight">
            Global Offices & Secure Facilities
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            FoneBox operates regional offices and certified HSM-vault facilities in primary
            administrative coordinates. All structures undergo physical threat vector audits yearly.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono text-blue-500 dark:text-blue-400 block font-bold">
              CENTRAL COMMUNIQUÉ NODE
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              Coordinates encrypted under dual-layer AES-256 routing tunnels.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {globalPresence.map((pres, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div>
                <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">
                  {pres.city}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{pres.scope}</p>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase shrink-0">
                {pres.coords}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="border-b border-slate-200 dark:border-slate-800/40 pb-6 text-center md:text-left">
          <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">
            Historical Record
          </span>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Evolution of Sovereign Identity
          </h2>
        </div>

        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-32 space-y-12 py-4">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative pl-6 sm:pl-8 group">
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-2 border-blue-500 group-hover:bg-blue-500 transition-colors" />

              {/* Year indicator left */}
              <span className="absolute -left-20 top-1 text-xs font-mono font-bold text-blue-500 dark:text-blue-400 hidden md:inline">
                {item.year}
              </span>

              <div className="space-y-1 max-w-3xl">
                <span className="text-xs font-mono text-blue-500 dark:text-blue-400 font-bold inline md:hidden">
                  [{item.year}]{' '}
                </span>
                <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Awards & Citations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none grid grid-cols-1 sm:grid-cols-3 gap-8 items-center">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">
              Peer Recognition
            </span>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Awards & Citations
            </h3>
            <p className="text-[11px] text-slate-500">
              Documented validations of sovereign cryptographic security performance.
            </p>
          </div>
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-start gap-3">
              <Award className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  National Security Innovator of the Year
                </h4>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tight mt-1">
                  Sovereign Aerospace Board — 2025
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-start gap-3">
              <Award className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  Global FinTech Trust Laureate
                </h4>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tight mt-1">
                  EMV Personalization Alliance — 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
