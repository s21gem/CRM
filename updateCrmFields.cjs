const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'components', 'portals', 'CRMModule.tsx');
let data = fs.readFileSync(file, 'utf8');

// 1. Add purpose to orgForm state
data = data.replace(
  "const [orgForm, setOrgForm] = useState({ name: '', sector: 'Government', country: 'Bangladesh', securityClearance: 'L1', status: 'Active', assignedManager: 'Zubair', contactCount: 1, totalDealValue: 0 });",
  "const [orgForm, setOrgForm] = useState({ name: '', sector: 'Government', country: 'Bangladesh', purpose: '', securityClearance: 'L1', status: 'Active', assignedManager: 'Zubair', contactCount: 1, totalDealValue: 0 });"
);

data = data.replace(
  "setOrgForm({ name: '', sector: 'Government', country: 'Bangladesh', securityClearance: 'L1', status: 'Active', assignedManager: 'Zubair', contactCount: 1, totalDealValue: 0 });",
  "setOrgForm({ name: '', sector: 'Government', country: 'Bangladesh', purpose: '', securityClearance: 'L1', status: 'Active', assignedManager: 'Zubair', contactCount: 1, totalDealValue: 0 });"
);

// Fallback for second setOrgForm reset inside cancel button
data = data.replace(
  "setOrgForm({ name: '', sector: 'Government', country: 'Bangladesh', securityClearance: 'L1', status: 'Active', assignedManager: 'Zubair', contactCount: 1, totalDealValue: 0 })",
  "setOrgForm({ name: '', sector: 'Government', country: 'Bangladesh', purpose: '', securityClearance: 'L1', status: 'Active', assignedManager: 'Zubair', contactCount: 1, totalDealValue: 0 })"
);

// 2. Add Purpose input to Org form
const orgInputs = `<div className="space-y-1"><label className="text-xs text-slate-500">Name</label><input required value={orgForm.name} onChange={e=>setOrgForm({...orgForm, name: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Sector</label><input required value={orgForm.sector} onChange={e=>setOrgForm({...orgForm, sector: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Status</label><select value={orgForm.status} onChange={e=>setOrgForm({...orgForm, status: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"><option>Active</option><option>Prospect</option><option>Inactive</option></select></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Deal Value (BDT)</label><input type="number" required value={orgForm.totalDealValue} onChange={e=>setOrgForm({...orgForm, totalDealValue: Number(e.target.value)})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="col-span-2 md:col-span-4 space-y-1"><label className="text-xs text-slate-500">Purpose / Description</label><textarea value={orgForm.purpose || ''} onChange={e=>setOrgForm({...orgForm, purpose: e.target.value})} placeholder="Why is this organization engaging with FoneBox?" className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 h-16" /></div>`;

data = data.replace(
  /<div className="space-y-1"><label className="text-xs text-slate-500">Name<\/label>[\s\S]*?Deal Value \(BDT\)[\s\S]*?<\/div>/,
  orgInputs
);

// Add Purpose to Org UI card
data = data.replace(
  /<p className="text-xs text-slate-500 mt-1">Status: <span className="font-bold">\{org\.status\}<\/span> • Deal Value: <span className="font-bold text-emerald-500">\{formatBDT\(org\.totalDealValue\)\}<\/span><\/p>/,
  `<p className="text-xs text-slate-500 mt-1">Status: <span className="font-bold">{org.status}</span> • Deal Value: <span className="font-bold text-emerald-500">{formatBDT(org.totalDealValue)}</span></p>
              {org.purpose && <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 italic">"{org.purpose}"</p>}`
);

// 3. Update Leads status dropdown
data = data.replace(
  /<option>New<\/option><option>Contacted<\/option><option>Negotiating<\/option><option>Closed<\/option>/,
  "<option>Discovery</option><option>Technical Vetting</option><option>HSM Demo</option><option>Contract Negotiation</option><option>Procurement</option><option>Signed</option>"
);

// Update Lead status default
data = data.replace(
  /status: 'New'/g,
  "status: 'Discovery'"
);

fs.writeFileSync(file, data);
console.log("Updated CRM fields.");
