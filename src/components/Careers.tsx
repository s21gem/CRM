/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, Users, Gift, HelpCircle, Briefcase, FileText, 
  Upload, CheckCircle, ArrowRight, X, Sparkles, Terminal, Loader2 
} from 'lucide-react';

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const openPositions = [
    {
      id: 'sec-arch',
      title: 'Senior Identity Security Architect',
      dept: 'Cryptographic Operations Command',
      location: 'Dhaka Headquarters',
      desc: 'Lead the architectural design and FIPS 140-3 Level 4 validation of country-level polycarbonate smart card chips, e-Passport structures, and national citizen registries.',
      reqs: ['10+ years high-assurance hardware security design', 'Expertise with PKCS#11, LDS2, and ICAO Doc 9303 specs', 'Ability to obtain National Top Secret clearance']
    },
    {
      id: 'hsm-eng',
      title: 'Hardware Security Module Software Engineer',
      dept: 'FinTech Engineering Division',
      location: 'London Financial Center',
      desc: 'Design, configure, and maintain local Derived EMV Key (MDK, UDK) injection software pipelines. Conduct security operations audits on dual-interface smartcard flash processes.',
      reqs: ['Mastery in C/C++, Rust or Go in low-level secure kernels', 'In-depth experience with HSM systems (Thales, Utimaco, Luna)', 'Knowledge of PCI-DSS 4.0 physical vault regulations']
    },
    {
      id: 'pki-ops',
      title: 'PKI Root Authority Operations Lead',
      dept: 'Sovereign Network Command',
      location: 'Tokyo Tech Laboratories',
      desc: 'Maintain and operate offline Master Root Certificate Authorities isolated inside physical Faraday cages. Coordinate dual-custody multi-signature security officer key ceremonies.',
      reqs: ['Comprehensive understanding of x.509, OCSP, CRLs, and LDAP directories', 'Experience configuring air-gapped secure Linux cells', 'Strong physical risk management discipline']
    }
  ];

  const benefits = [
    { title: 'Sovereign Healthcare', desc: 'Comprehensive premium health, dental, and vision insurance with 100% employer-funded plans.' },
    { title: 'Cryptographic Allowances', desc: 'Annual hardware tokens, FIDO2 security allowances, and sovereign home workstation setups.' },
    { title: 'Continuous Credentials', desc: '100% coverage for professional certifications (CISSP, CISM, Stanford Cryptography certification).' },
    { title: 'Executive Incomes', desc: 'Top-tier corporate compensation with generous matching 401(k) allocations.' }
  ];

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!resumeFile) {
      setErrorMsg('Please upload a resume file (PDF or DOCX).');
      return;
    }
    
    setIsApplying(true);
    const formData = new FormData();
    formData.append('name', applicantName);
    formData.append('email', applicantEmail);
    formData.append('role', openPositions.find(p => p.id === selectedJob)?.title || 'Unknown');
    formData.append('resume', resumeFile);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/crm/job-application`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setErrorMsg('Application failed to submit. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error during application submission.');
    } finally {
      setIsApplying(false);
    }
  };

  const resetForm = () => {
    setApplicantName('');
    setApplicantEmail('');
    setApplicantNote('');
    setResumeFile(null);
    setSelectedJob(null);
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-16 pt-28 pb-12">
      
      {/* Intro Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">Careers & Culture</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white">Join the Sovereign Vanguard</h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-3xl mx-auto">
          At FoneBox Global, we do not build simple widgets or software-as-a-service utilities. We engineer the physical and digital foundations of state-level sovereignty. Apply today.
        </p>
      </section>

      {/* Culture Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#0F172A]/30 border border-slate-200 dark:border-slate-800 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">Our Engineering Culture</h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            We foster a culture of rigorous scientific discipline and physical security focus. Our staff comprises mathematicians, hardware specialists, and security researchers who value clean code, peer validation, and operational precision over quick hacks or trends.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#0F172A]/30 border border-slate-200 dark:border-slate-800 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Gift className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">Elite Benefits</h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            FoneBox offers sovereign health coverages, dual-factor hardware allowances, 100% funded security certifications, and competitive corporate Salaries. We respect our engineers' families and offer flexible air-gapped work schedules.
          </p>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-slate-200 dark:border-slate-800/40 pb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Compensation</span>
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Comprehensive Engineering Benefits</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {benefits.map((ben, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 space-y-2">
              <h3 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200">{ben.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{ben.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Positions & Application Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="border-b border-slate-200 dark:border-slate-800/40 pb-6 text-center md:text-left">
          <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold font-bold">Open Vacancies</span>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">Sovereign Command Opportunities</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Job listings left */}
          <div className="lg:col-span-7 space-y-4">
            {openPositions.map((job) => (
              <button
                key={job.id}
                onClick={() => {
                  setSelectedJob(job.id);
                  setIsSubmitted(false);
                  setErrorMsg(null);
                }}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between items-start gap-3 cursor-pointer ${
                  selectedJob === job.id
                    ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-950/40'
                }`}
              >
                <div className="space-y-1 w-full flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest font-bold">{job.dept}</span>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white mt-0.5">{job.title}</h3>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase shrink-0">{job.location.split(' ')[0]}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">{job.desc}</p>
                
                {selectedJob === job.id && (
                  <div className="pt-4 mt-2 border-t border-blue-500/20 w-full space-y-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold">Required Qualifications</h4>
                    <ul className="space-y-1">
                      {job.reqs.map((req, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 pt-2 w-full justify-end">
                  {selectedJob === job.id ? 'Active Selection' : 'Review Qualifications'} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>

          {/* Dynamic Apply Form right */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#0B1321]/30 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            {selectedJob ? (
              <div>
                <div className="flex justify-between items-start pb-4 border-b border-slate-200 dark:border-slate-800/60 mb-6">
                  <div>
                    <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 uppercase font-bold">Application Console</span>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                      {openPositions.find(j => j.id === selectedJob)?.title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedJob(null)}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {isSubmitted ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Resume Received Successfully</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-xs">Application encrypted under transaction code: <span className="font-mono text-blue-600 dark:text-blue-400">FBX-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span></p>
                    </div>
                    <p className="text-[11px] text-slate-500">Our Security Operations and Talent Acquisition command will contact you via PGP email inside 48 hours.</p>
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Clear Console
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    
                    {errorMsg && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-600 dark:text-red-400 font-medium">
                        {errorMsg}
                      </div>
                    )}
                    
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Full Name</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="John Doe..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Secure Email</label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="john.doe@government.mil or custom..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Note */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Biographical Note (Optional)</label>
                      <textarea
                        value={applicantNote}
                        onChange={(e) => setApplicantNote(e.target.value)}
                        placeholder="Briefly state clearance status, key HSM systems handled..."
                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 h-20 resize-none"
                      />
                    </div>

                    {/* File Upload Drag & Drop Selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Sovereign Resume (PDF / DOCX)</label>
                      
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer relative ${
                          dragActive 
                            ? 'border-blue-500 bg-blue-500/5' 
                            : resumeFile 
                            ? 'border-emerald-500/50 bg-emerald-500/5' 
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/40'
                        }`}
                      >
                        <input
                          type="file"
                          id="file-resume-upload"
                          accept=".pdf,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label htmlFor="file-resume-upload" className="cursor-pointer space-y-2 block">
                          <div className={`p-2.5 rounded-full mx-auto w-10 h-10 flex items-center justify-center ${
                            resumeFile ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            <Upload className="w-5 h-5 animate-pulse" />
                          </div>
                          {resumeFile ? (
                            <div className="space-y-0.5">
                              <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold block truncate max-w-[200px] mx-auto">{resumeFile.name}</span>
                              <span className="text-[9px] font-mono text-slate-500">{(resumeFile.size / 1024).toFixed(1)} KB — Click to change</span>
                            </div>
                          ) : (
                            <div className="space-y-0.5">
                              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium block">Drag & Drop Resume here</span>
                              <span className="text-[10px] text-slate-500 block">or click to browse local files</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isApplying}
                      className="w-full py-3 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors cursor-pointer"
                    >
                      {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Encrypt & Submit Application'}
                    </button>

                  </form>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center p-8 space-y-4">
                <Briefcase className="w-12 h-12 text-slate-600 animate-bounce" />
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">No Position Selected</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">Please review the available sovereign opportunities on the left and select one to establish secure application routing.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
