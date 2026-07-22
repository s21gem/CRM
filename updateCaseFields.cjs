const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'components', 'portals', 'CRMModule.tsx');
let data = fs.readFileSync(file, 'utf8');

// Update caseForm state
data = data.replace(
  "const [caseForm, setCaseForm] = useState({ title: '', orgName: '', severity: 'Medium', status: 'Open', assignedTo: 'Tech Support', category: 'Hardware', createdDate: new Date().toISOString().split('T')[0], updatedDate: new Date().toISOString().split('T')[0] });",
  "const [caseForm, setCaseForm] = useState({ title: '', orgName: '', description: '', severity: 'Medium', status: 'Open', assignedTo: 'Tech Support', category: 'Hardware', createdDate: new Date().toISOString().split('T')[0], updatedDate: new Date().toISOString().split('T')[0] });"
);

data = data.replace(
  "setCaseForm({ title: '', orgName: '', severity: 'Medium', status: 'Open', assignedTo: 'Tech Support', category: 'Hardware', createdDate: new Date().toISOString().split('T')[0], updatedDate: new Date().toISOString().split('T')[0] });",
  "setCaseForm({ title: '', orgName: '', description: '', severity: 'Medium', status: 'Open', assignedTo: 'Tech Support', category: 'Hardware', createdDate: new Date().toISOString().split('T')[0], updatedDate: new Date().toISOString().split('T')[0] });"
);

data = data.replace(
  "setCaseForm({ title: '', orgName: '', severity: 'Medium', status: 'Open', assignedTo: 'Tech Support', category: 'Hardware', createdDate: new Date().toISOString().split('T')[0], updatedDate: new Date().toISOString().split('T')[0] })",
  "setCaseForm({ title: '', orgName: '', description: '', severity: 'Medium', status: 'Open', assignedTo: 'Tech Support', category: 'Hardware', createdDate: new Date().toISOString().split('T')[0], updatedDate: new Date().toISOString().split('T')[0] })"
);

// Add description input to the form
const caseInputs = `<div className="space-y-1"><label className="text-xs text-slate-500">Case Title</label><input required value={caseForm.title} onChange={e=>setCaseForm({...caseForm, title: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Organization</label><input required value={caseForm.orgName} onChange={e=>setCaseForm({...caseForm, orgName: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Severity</label><select value={caseForm.severity} onChange={e=>setCaseForm({...caseForm, severity: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Status</label><select value={caseForm.status} onChange={e=>setCaseForm({...caseForm, status: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"><option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option></select></div>
          <div className="col-span-2 md:col-span-4 space-y-1"><label className="text-xs text-slate-500">Case Description</label><textarea value={caseForm.description || ''} onChange={e=>setCaseForm({...caseForm, description: e.target.value})} placeholder="Describe the issue or support request in detail..." className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 h-20" /></div>`;

data = data.replace(
  /<div className="space-y-1"><label className="text-xs text-slate-500">Case Title<\/label>[\s\S]*?Status[\s\S]*?<\/div>/,
  caseInputs
);

// Add description to UI card
data = data.replace(
  /<p className="text-xs text-slate-500 mt-1">Severity: <span className=\{\`font-bold \$\{c\.severity === 'Critical' \? 'text-red-500' : c\.severity === 'High' \? 'text-orange-500' : 'text-blue-500'\}\`\}>\{c\.severity\}<\/span> • Status: <span className="font-bold text-slate-700 dark:text-slate-300">\{c\.status\}<\/span><\/p>/,
  `<p className="text-xs text-slate-500 mt-1">Severity: <span className={\`font-bold \${c.severity === 'Critical' ? 'text-red-500' : c.severity === 'High' ? 'text-orange-500' : 'text-blue-500'}\`}>{c.severity}</span> • Status: <span className="font-bold text-slate-700 dark:text-slate-300">{c.status}</span></p>
              {c.description && <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{c.description}</p>}`
);

fs.writeFileSync(file, data);
console.log("Updated Case fields.");
