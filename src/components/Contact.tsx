/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, Mail, Phone, MapPin, Globe, CheckCircle, 
  ArrowRight, Landmark, Server, Lock, Send, RefreshCw 
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    org: '',
    inquiryType: 'government',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const offices = [
    { city: 'Dhaka', address: 'Agargaon ICT Tower, Dhaka 1207', phone: '+880 (2) 555-0192', email: 'national@fonebox.com.bd', scope: 'National Government & Diplomatic Relations' },
    { city: 'London', address: '30 St Mary Axe, London EC3A 8BF', phone: '+44 20 7946 0192', email: 'fintech@fonebox.com.bd', scope: 'FinTech & EMV Card Personalization' },
    { city: 'Tokyo', address: '1-2-1 Otemachi, Chiyoda-ku, Tokyo 100-0004', phone: '+81 3 5555 0192', email: 'labs@fonebox.com.bd', scope: 'Biometric R&D & Polycarbonate Engineering' },
    { city: 'Geneva', address: 'Rue de Lausanne 120, 1202 Genève', phone: '+41 22 555 0192', email: 'standards@fonebox.com.bd', scope: 'International Compliance Coordination' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-16 pt-28 pb-12">
      
      {/* Page Intro Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">Contact Command</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white">Establish Secure Communiqué</h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-3xl mx-auto">
          Contact our executive sales board, Technical Support commands, or compliance registries. All outbound submissions are encrypted via secure tunnels.
        </p>
      </section>

      {/* Main Grid: Form Left, Offices Right */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Contact Form Left */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#0B1321]/30 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          {isSubmitted ? (
            <div className="py-16 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">Inquiry Registered Successfully</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs">Communiqué routing code: <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">TX-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span></p>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto">
                Thank you. Your request has been securely parsed and routed to the corresponding department command. An officer will respond within 12 hours via encrypted channel.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Open New Communiqué
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="address@organization.com..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Org */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Organization / Department</label>
                  <input
                    type="text"
                    required
                    value={formData.org}
                    onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                    placeholder="Ministry of Foreign Affairs, etc..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Inquiry Type Routing */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold font-bold">Department Routing Command</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'government', label: 'Government Request', desc: 'Sovereign ID & Borders' },
                    { id: 'sales', label: 'Sales Inquiry', desc: 'Bank personalization & EMV' },
                    { id: 'support', label: 'Technical Support', desc: 'Secure facility support' },
                    { id: 'partnership', label: 'Partnership Inquiry', desc: 'Compliance relations' }
                  ].map((dept) => (
                    <button
                      type="button"
                      key={dept.id}
                      onClick={() => setFormData({ ...formData, inquiryType: dept.id })}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.inquiryType === dept.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[10px] font-display font-bold block text-slate-800 dark:text-slate-200">{dept.label}</span>
                      <span className="text-[8px] font-mono text-slate-500 block leading-tight mt-0.5">{dept.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Polycarbonate Passport personalisations..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Secured Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please state compliance specifications, required throughput, target dates..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 h-28 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 text-white text-xs font-bold uppercase tracking-wider block shadow-md transition-colors cursor-pointer"
              >
                Sign & Encrypt Communiqué
              </button>
            </form>
          )}
        </div>

        {/* Global Offices Right */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {offices.map((off, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/20 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
            >
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest block font-bold">{off.scope}</span>
                <span className="text-[10px] font-display font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{off.city}</span>
              </div>
              
              <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" /> {off.address}
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-600 shrink-0" /> {off.phone}
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-600 shrink-0" /> {off.email}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Interactive Canvas Placeholder Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800/40 pb-4 text-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Security Routing Infrastructure</span>
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Global Command Nodes</h2>
        </div>

        {/* Beautiful Map Graphic inside a container */}
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none relative h-64 flex flex-col items-center justify-center overflow-hidden">
          {/* Subtle spinning graphic overlay */}
          <div className="absolute inset-0 opacity-5">
            <Globe className="w-96 h-96 mx-auto animate-spin" style={{ animationDuration: '60s' }} />
          </div>
          
          <div className="relative z-10 text-center space-y-4 max-w-lg">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200">FoneBox Secure Communications Network Map</h4>
              <p className="text-slate-500 text-[10px] leading-relaxed">All operations centers are connected via dedicated end-to-end encrypted satellite lines. Ingress routes undergo physical Faraday shield audits daily.</p>
            </div>
            <div className="flex justify-center gap-3 text-[9px] font-mono text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> D.C. Command</span>
              <span>•</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> London Hub</span>
              <span>•</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Tokyo Labs</span>
              <span>•</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Geneva Center</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
