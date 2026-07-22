import { apiClient } from '../../lib/apiClient';
import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  FolderGit2, CreditCard, HelpCircle, Activity, CheckCircle, 
  AlertCircle, Building, Plus, Save
} from "lucide-react";

interface ClientPortalModuleProps {
  isDarkMode: boolean;
  currentUserRole: string;
}

export default function ClientPortalModule({ isDarkMode, currentUserRole }: ClientPortalModuleProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "projects" | "billing" | "support">("dashboard");

  // Since we don't have a real login system attached to specific orgs right now, 
  // we'll default the "logged in client org" to a dummy name or the first one they pick.
  const clientOrgName = currentUserRole === "Corporate Client" ? "Dutch-Bangla Bank PLC" : "Department of Immigration and Passports";

  const [projects, setProjects] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [printingInvoice, setPrintingInvoice] = useState<any>(null);
  
  // Case Form
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [caseForm, setCaseForm] = useState({
    title: '', orgName: clientOrgName, severity: 'Medium', status: 'New', 
    description: '', assignedTo: 'Unassigned', category: 'Technical Support',
    createdDate: new Date().toISOString().split('T')[0],
    updatedDate: new Date().toISOString().split('T')[0]
  });

  const fetchAPI = async (endpoint: string, method: string = 'GET', body: any = null) => {
    try {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (body) options.body = JSON.stringify(body);
      const res = await apiClient(`/api/crm/${endpoint}`, options);
      if (res.ok) return await res.json();
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const loadData = async () => {
    const [projData, invData, casesData] = await Promise.all([
      fetchAPI('projects'),
      fetchAPI('invoices'),
      fetchAPI('support-cases')
    ]);
    
    // Filter data to only show what belongs to this specific client org (simulated auth)
    if (projData) setProjects(projData.filter((p: any) => p.orgName.includes(clientOrgName) || p.orgName === ''));
    if (invData) setInvoices(invData.filter((i: any) => i.orgName.includes(clientOrgName) || i.orgName === ''));
    if (casesData) setCases(casesData.filter((c: any) => c.orgName.includes(clientOrgName) || c.orgName === ''));
  };

  useEffect(() => {
    loadData();
  }, []);

    const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return '$' + (amount / 1000000).toFixed(2) + 'M';
    if (amount >= 1000) return '$' + (amount / 1000).toFixed(1) + 'k';
    return '$' + amount.toLocaleString();
  };


  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'projects', label: 'My Projects', icon: FolderGit2 },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
    { id: 'support', label: 'Support Cases', icon: HelpCircle },
  ] as const;

  const handlePayInvoice = async (invoiceId: string) => {
    if (!confirm('Proceed with secure payment simulation?')) return;
    await fetchAPI(`invoices/${invoiceId}/pay`, 'POST');
    alert('Payment successful!');
    loadData();
  };

  const handleSubmitCase = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchAPI('support-cases', 'POST', caseForm);
    alert('Support case submitted successfully.');
    setShowCaseForm(false);
    setCaseForm({...caseForm, title: '', description: ''});
    loadData();
  };

  const renderDashboard = () => {
    const activeProjs = projects.filter(p => p.status !== 'Completed').length;
    const pendingInvoices = invoices.filter(i => i.status === 'Pending').length;
    const openCases = cases.filter(c => c.status !== 'Closed' && c.status !== 'Resolved').length;

  
  return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-500" /> Welcome, {clientOrgName}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Active Projects</p>
            <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{activeProjs}</h3>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Pending Invoices</p>
            <h3 className="text-3xl font-bold text-amber-600 dark:text-amber-400">{pendingInvoices}</h3>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Open Cases</p>
            <h3 className="text-3xl font-bold text-red-600 dark:text-red-400">{openCases}</h3>
          </div>
        </div>
      </div>
    );
  };

  const renderProjects = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><FolderGit2 className="w-5 h-5 text-blue-500"/> My Projects</h2>
      {projects.length === 0 ? <p className="text-slate-500 text-sm">No projects found for {clientOrgName}.</p> : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map(proj => (
            <div key={proj.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="flex justify-between mb-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{proj.name}</h4>
                <span className={`text-[10px] font-bold uppercase ${proj.status === 'Completed' ? 'text-emerald-500' : 'text-blue-500'}`}>{proj.status}</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">{proj.category} • Start Date: {proj.startDate}</p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${proj.completionPercentage === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${proj.completionPercentage}%` }}></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 text-right">{proj.completionPercentage}% Complete</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const handleDownloadInvoice = async (inv: any) => {
    setPrintingInvoice(inv);
    // Wait for state to update and DOM to render the hidden invoice
    setTimeout(async () => {
      const element = document.getElementById('invoice-print-template');
      if (!element) {
        alert("Template not found in DOM");
        setPrintingInvoice(null);
        return;
      }
      
      try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Fonebox_Invoice_${inv.id || 'Current'}.pdf`);
      } catch (err: any) {
        console.error("Error generating PDF", err);
        alert("Failed to generate PDF: " + (err?.message || err));
      } finally {
        setPrintingInvoice(null);
      }
    }, 500);
  };

  const renderBilling = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><CreditCard className="w-5 h-5 text-blue-500"/> Billing & Invoices</h2>
      {invoices.length === 0 ? <p className="text-slate-500 text-sm">No invoices found.</p> : (
        <div className="grid grid-cols-1 gap-4">
          {invoices.map(inv => (
            <div key={inv.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{inv.projectName || 'General Service Invoice'}</h4>
                <p className="text-xs text-slate-500 mt-1">Amount: <span className="font-bold text-slate-700 dark:text-slate-300">{formatCurrency(inv.amount)}</span> • Due: {inv.dueDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  {inv.status}
                </span>
                
                <button onClick={() => handleDownloadInvoice(inv)} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold rounded">
                  Download
                </button>

                {inv.status !== 'Paid' && (
                  <button onClick={() => handlePayInvoice(inv.id)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded">Pay Now</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><HelpCircle className="w-5 h-5 text-blue-500"/> Support Cases</h2>
        <button onClick={() => setShowCaseForm(!showCaseForm)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1">
          <Plus className="w-4 h-4"/> New Case
        </button>
      </div>

      {showCaseForm && (
        <form onSubmit={handleSubmitCase} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create New Support Case</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-xs text-slate-500">Subject / Title</label><input required value={caseForm.title} onChange={e=>setCaseForm({...caseForm, title: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
            <div className="space-y-1"><label className="text-xs text-slate-500">Severity</label><select value={caseForm.severity} onChange={e=>setCaseForm({...caseForm, severity: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div>
            <div className="space-y-1 md:col-span-2"><label className="text-xs text-slate-500">Description</label><textarea required rows={3} value={caseForm.description} onChange={e=>setCaseForm({...caseForm, description: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded flex items-center gap-1"><Save className="w-4 h-4"/> Submit</button>
            <button type="button" onClick={() => setShowCaseForm(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded">Cancel</button>
          </div>
        </form>
      )}

      {cases.length === 0 ? <p className="text-slate-500 text-sm">No support cases found.</p> : (
        <div className="grid grid-cols-1 gap-4">
          {cases.map(c => (
            <div key={c.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="flex justify-between mb-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  {c.severity === 'Critical' ? <AlertCircle className="w-4 h-4 text-red-500"/> : <CheckCircle className="w-4 h-4 text-emerald-500"/>}
                  {c.title}
                </h4>
                <span className="text-[10px] font-bold uppercase text-slate-500 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">{c.status}</span>
              </div>
              {c.description && <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 bg-slate-50 dark:bg-slate-950 p-2 rounded">{c.description}</p>}
              <p className="text-[10px] text-slate-500 flex justify-between">
                <span>Category: {c.category}</span>
                <span>Created: {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : c.createdDate}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-full min-h-[80vh] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Client Portal</h2>
        <div className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' 
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'billing' && renderBilling()}
        {activeTab === 'support' && renderSupport()}
      </div>

      {/* Hidden Invoice Template for PDF Generation */}
      {printingInvoice && (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '800px', padding: '40px', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'sans-serif' }} id="invoice-print-template">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: '32px', marginBottom: '32px' }}>
            <div>
              <img src="/logo.png" alt="Fonebox Logo" style={{ height: '48px', marginBottom: '16px' }} />
              <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>INVOICE</h1>
              <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Ref: INV-{String(printingInvoice.id).substring(0, 8).toUpperCase()}</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '14px', color: '#475569' }}>
              <p style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '16px', margin: 0 }}>Fonebox Enterprise ICT Solutions</p>
              <p style={{ margin: '2px 0' }}>Level 4, Fonebox Tower</p>
              <p style={{ margin: '2px 0' }}>Manhattan, New York 10001, USA</p>
              <p style={{ margin: '2px 0' }}>contact@foneboxglobal.com</p>
              <p style={{ margin: '2px 0' }}>+1 800 555 2222</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px' }}>Billed To</p>
              <p style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '18px', margin: 0 }}>{printingInvoice.orgName || clientOrgName}</p>
              <p style={{ fontSize: '14px', color: '#475569', margin: '2px 0' }}>IT Department</p>
              <p style={{ fontSize: '14px', color: '#475569', margin: '2px 0' }}>New York, USA</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px' }}>Invoice Details</p>
              <table style={{ fontSize: '14px', width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr><td style={{ paddingRight: '16px', color: '#64748b', padding: '4px 0' }}>Date Issued:</td><td style={{ fontWeight: 'bold', color: '#0f172a' }}>{printingInvoice.issuedDate || new Date().toISOString().split('T')[0]}</td></tr>
                  <tr><td style={{ paddingRight: '16px', color: '#64748b', padding: '4px 0' }}>Due Date:</td><td style={{ fontWeight: 'bold', color: '#0f172a' }}>{printingInvoice.dueDate}</td></tr>
                  <tr><td style={{ paddingRight: '16px', color: '#64748b', padding: '4px 0' }}>Payment Status:</td><td style={{ fontWeight: 'bold', color: printingInvoice.status === 'Paid' ? '#059669' : '#dc2626' }}>{printingInvoice.status.toUpperCase()}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <table style={{ width: '100%', marginBottom: '40px', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', fontWeight: 'bold', color: '#334155', fontSize: '14px' }}>Description</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold', color: '#334155', fontSize: '14px', width: '128px', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold', color: '#334155', fontSize: '14px', width: '160px', textAlign: 'right' }}>Total (USD)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{printingInvoice.projectName || 'Enterprise ICT Service Fees'}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#475569', textAlign: 'center' }}>1</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b', textAlign: 'right' }}>{formatCurrency(printingInvoice.amount)}</td>
              </tr>
            </tbody>
          </table>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '64px' }}>
            <div style={{ width: '50%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ color: '#475569' }}>Subtotal</span>
                <span style={{ color: '#0f172a', fontWeight: '500' }}>{formatCurrency(printingInvoice.amount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ color: '#475569' }}>VAT (15%)</span>
                <span style={{ color: '#0f172a', fontWeight: '500' }}>Included</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '2px solid #0f172a' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>Total Due</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>{formatCurrency(printingInvoice.amount)}</span>
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '80px', paddingTop: '32px', borderTop: '1px solid #e2e8f0' }}>
            <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '4px' }}>Thank you for your business.</p>
            <p style={{ margin: '2px 0' }}>Please make all cheques payable to Fonebox Enterprise ICT Solutions. Bank Transfer: Global Bank A/C 999.xxx.xxx</p>
            <p style={{ marginTop: '16px' }}>This is a system generated invoice and does not require a physical signature.</p>
          </div>
        </div>
      )}
    </div>
  );
}
 