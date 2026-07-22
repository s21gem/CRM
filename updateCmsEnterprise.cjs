const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'components', 'portals', 'CmsModule.tsx');
let data = fs.readFileSync(file, 'utf8');

// Add to state
data = data.replace(
  "const [activeTab, setActiveTab] = useState<'settings' | 'services' | 'testimonials' | 'featured'>('settings');",
  "const [activeTab, setActiveTab] = useState<'settings' | 'services' | 'testimonials' | 'featured' | 'enterprise'>('settings');"
);

const enterpriseState = `
  // Enterprise Solutions State
  const [enterpriseSolutions, setEnterpriseSolutions] = useState<any[]>([]);
  const [newEnterprise, setNewEnterprise] = useState({
    title: '', category: '', desc: '', useCases: '', benefits: '', industries: '', flow: ''
  });

`;
data = data.replace("// Featured Solutions State", enterpriseState + "// Featured Solutions State");

const fetchEnterprise = `
  const fetchEnterpriseSolutions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cms/enterprise-solutions');
      if (res.ok) setEnterpriseSolutions(await res.json());
    } catch (e) {}
  };
`;
data = data.replace("const fetchFeaturedSolutions = async () => {", fetchEnterprise + "\n  const fetchFeaturedSolutions = async () => {");

data = data.replace("fetchFeaturedSolutions();", "fetchFeaturedSolutions();\n    fetchEnterpriseSolutions();");

const enterpriseHandlers = `
  const handleAddEnterprise = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newEnterprise,
        useCases: JSON.stringify(newEnterprise.useCases.split('\\n').filter(s=>s.trim())),
        benefits: JSON.stringify(newEnterprise.benefits.split('\\n').filter(s=>s.trim())),
        industries: JSON.stringify(newEnterprise.industries.split('\\n').filter(s=>s.trim())),
        flow: JSON.stringify(newEnterprise.flow.split('\\n').filter(s=>s.trim()).map(step => {
          const [title, desc] = step.split('|');
          return { title: title?.trim() || 'Step', desc: desc?.trim() || '' };
        }))
      };

      const res = await fetch('http://localhost:5000/api/cms/enterprise-solutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewEnterprise({ title: '', category: '', desc: '', useCases: '', benefits: '', industries: '', flow: '' });
        fetchEnterpriseSolutions();
      }
    } catch (err) {}
  };

  const handleDeleteEnterprise = async (id: string) => {
    if (!confirm('Delete this enterprise solution?')) return;
    try {
      const res = await fetch(\`http://localhost:5000/api/cms/enterprise-solutions/\${id}\`, { method: 'DELETE' });
      if (res.ok) fetchEnterpriseSolutions();
    } catch (err) {}
  };
`;
data = data.replace("// Featured Solutions Handlers", enterpriseHandlers + "\n  // Featured Solutions Handlers");

if (!data.includes('handleAddEnterprise')) { // Fallback if comment is missing
  data = data.replace("const handleAddFeatured", enterpriseHandlers + "\n  const handleAddFeatured");
}

const tabButton = `        <button 
          onClick={() => setActiveTab('enterprise')}
          className={\`px-4 py-2 text-xs font-bold uppercase tracking-wider \${activeTab === 'enterprise' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-600 dark:text-slate-500'}\`}
        >
          Enterprise Solutions
        </button>
      </div>`;
data = data.replace("</div>\n\n      {/* Settings Tab */}", tabButton + "\n\n      {/* Settings Tab */}");

const tabContent = `
      {/* Enterprise Solutions Tab */}
      {activeTab === 'enterprise' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Manage Enterprise Solutions</h3>
          </div>
          
          <form onSubmit={handleAddEnterprise} className="space-y-4 p-4 bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Title</label>
                <input type="text" required value={newEnterprise.title} onChange={e => setNewEnterprise({...newEnterprise, title: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Category Tag</label>
                <input type="text" required value={newEnterprise.category} onChange={e => setNewEnterprise({...newEnterprise, category: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Description</label>
              <textarea required value={newEnterprise.desc} onChange={e => setNewEnterprise({...newEnterprise, desc: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white h-16" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Use Cases (1 per line)</label>
                <textarea required value={newEnterprise.useCases} onChange={e => setNewEnterprise({...newEnterprise, useCases: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white h-24" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Benefits (1 per line)</label>
                <textarea required value={newEnterprise.benefits} onChange={e => setNewEnterprise({...newEnterprise, benefits: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white h-24" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Industries (1 per line)</label>
                <textarea required value={newEnterprise.industries} onChange={e => setNewEnterprise({...newEnterprise, industries: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white h-24" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-500">Flowchart Steps (Format: Title | Description, 1 step per line)</label>
              <textarea required value={newEnterprise.flow} onChange={e => setNewEnterprise({...newEnterprise, flow: e.target.value})} placeholder="Biometric Enrollment | Face & fingerprints captured via ISO/IEC scanners." className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white h-24" />
            </div>

            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-bold flex items-center gap-1"><Plus className="w-4 h-4"/> Add Enterprise Solution</button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enterpriseSolutions.map(f => (
              <div key={f.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col gap-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{f.title} <span className="text-[10px] bg-blue-500/10 text-blue-500 ml-2 px-1 rounded">{f.category}</span></h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{f.desc}</p>
                <div className="text-[10px] text-slate-500 flex gap-2">
                  <span>{JSON.parse(f.useCases || '[]').length} Use Cases</span>
                  <span>{JSON.parse(f.flow || '[]').length} Flow Steps</span>
                </div>
                <button onClick={() => handleDeleteEnterprise(f.id)} className="self-end text-red-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>
              </div>
            ))}
          </div>
        </div>
      )}
`;

data = data.replace("{/* Featured Products Tab */}", tabContent + "\n\n      {/* Featured Products Tab */}");
fs.writeFileSync(file, data);
console.log("CmsModule.tsx updated.");
