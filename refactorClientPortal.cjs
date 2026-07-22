const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'components', 'portals', 'ClientPortalModule.tsx');

const content = `import React, { useState, useEffect } from "react";
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
      const res = await fetch(\`http://localhost:5000/api/crm/\${endpoint}\`, options);
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
      fetchAPI('cases')
    ]);
    
    // Filter data to only show what belongs to this specific client org (simulated auth)
    if (projData) setProjects(projData.filter((p: any) => p.orgName.includes(clientOrgName) || p.orgName === ''));
    if (invData) setInvoices(invData.filter((i: any) => i.orgName.includes(clientOrgName) || i.orgName === ''));
    if (casesData) setCases(casesData.filter((c: any) => c.orgName.includes(clientOrgName) || c.orgName === ''));
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatBDT = (amount: number) => {
    if (amount >= 10000000) return \`৳\${(amount / 10000000).toFixed(2)} Crore\`;
    if (amount >= 100000) return \`৳\${(amount / 100000).toFixed(2)} Lakh\`;
    return \`৳\${amount.toLocaleString()}\`;
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'projects', label: 'My Projects', icon: FolderGit2 },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
    { id: 'support', label: 'Support Cases', icon: HelpCircle },
  ] as const;

  const handlePayInvoice = async (invoiceId: string) => {
    if (!confirm('Proceed with secure payment simulation?')) return;
    await fetchAPI(\`invoices/\${invoiceId}\`, 'PUT', { status: 'Paid', paymentMethod: 'Bank Transfer' });
    alert('Payment successful!');
    loadData();
  };

  const handleSubmitCase = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchAPI('cases', 'POST', caseForm);
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
                <span className={\`text-[10px] font-bold uppercase \${proj.status === 'Completed' ? 'text-emerald-500' : 'text-blue-500'}\`}>{proj.status}</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">{proj.category} • Start Date: {proj.startDate}</p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className={\`h-full rounded-full \${proj.completionPercentage === 100 ? 'bg-emerald-500' : 'bg-blue-500'}\`} style={{ width: \`\${proj.completionPercentage}%\` }}></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 text-right">{proj.completionPercentage}% Complete</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><CreditCard className="w-5 h-5 text-blue-500"/> Billing & Invoices</h2>
      {invoices.length === 0 ? <p className="text-slate-500 text-sm">No invoices found.</p> : (
        <div className="grid grid-cols-1 gap-4">
          {invoices.map(inv => (
            <div key={inv.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{inv.projectName || 'General Service Invoice'}</h4>
                <p className="text-xs text-slate-500 mt-1">Amount: <span className="font-bold text-slate-700 dark:text-slate-300">{formatBDT(inv.amount)}</span> • Due: {inv.dueDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={\`text-[10px] font-bold uppercase px-2 py-1 rounded \${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}\`}>
                  {inv.status}
                </span>
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
                className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors \${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' 
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }\`}
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
    </div>
  );
}
`;
fs.writeFileSync(file, content);
console.log("ClientPortalModule completely refactored.");
