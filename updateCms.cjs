const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'portals', 'CmsModule.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Add featured-solutions to state
content = content.replace(
  "const [activeTab, setActiveTab] = useState<'settings' | 'services' | 'testimonials'>('settings');",
  "const [activeTab, setActiveTab] = useState<'settings' | 'services' | 'testimonials' | 'featured'>('settings');"
);

content = content.replace(
  "// Services State",
  `// Featured Solutions State
  const [featuredSolutions, setFeaturedSolutions] = useState<any[]>([]);
  const [newFeatured, setNewFeatured] = useState({ title: '', category: '', desc: '', image: null as File | null });
  const [featuredPreview, setFeaturedPreview] = useState('');

  // Services State`
);

content = content.replace(
  "const fetchServices = async () => {",
  `const fetchFeaturedSolutions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cms/featured-solutions');
      if (res.ok) setFeaturedSolutions(await res.json());
    } catch (e) {}
  };

  const fetchServices = async () => {`
);

content = content.replace(
  "fetchSettings();\n    fetchServices();",
  "fetchSettings();\n    fetchServices();\n    fetchFeaturedSolutions();"
);

const featuredHandlers = `
  const handleAddFeatured = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatured.title || !newFeatured.desc || !newFeatured.category) {
      alert("Title, category, and description are required.");
      return;
    }

    const formData = new FormData();
    formData.append('title', newFeatured.title);
    formData.append('category', newFeatured.category);
    formData.append('desc', newFeatured.desc);
    if (newFeatured.image) formData.append('image', newFeatured.image);

    try {
      const res = await fetch('http://localhost:5000/api/cms/featured-solutions', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setNewFeatured({ title: '', category: '', desc: '', image: null });
        setFeaturedPreview('');
        fetchFeaturedSolutions();
      }
    } catch (err) {}
  };

  const handleDeleteFeatured = async (id: string) => {
    if (!confirm('Delete this featured product?')) return;
    try {
      const res = await fetch(\`http://localhost:5000/api/cms/featured-solutions/\${id}\`, { method: 'DELETE' });
      if (res.ok) fetchFeaturedSolutions();
    } catch (err) {}
  };
`;

content = content.replace("// Services Handlers", featuredHandlers + "\n  // Services Handlers");

const tabButtons = `        <button 
          onClick={() => setActiveTab('featured')}
          className={\`px-4 py-2 text-xs font-bold uppercase tracking-wider \${activeTab === 'featured' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 dark:text-slate-400'}\`}
        >
          Featured Products
        </button>
      </div>`;

content = content.replace("</div>\n\n      {/* Tab Content */}", tabButtons + "\n\n      {/* Tab Content */}");

const featuredTabContent = `
      {activeTab === 'featured' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Manage Featured Products</h3>
          </div>
          
          <form onSubmit={handleAddFeatured} className="space-y-4 p-4 bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-slate-400">Product Title</label>
                <input type="text" required value={newFeatured.title} onChange={e => setNewFeatured({...newFeatured, title: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-slate-400">Category Tag (e.g. FINTECH & BANKING)</label>
                <input type="text" required value={newFeatured.category} onChange={e => setNewFeatured({...newFeatured, category: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500 dark:text-slate-400">Description (Max 150 chars)</label>
              <textarea maxLength={150} required value={newFeatured.desc} onChange={e => setNewFeatured({...newFeatured, desc: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white h-20" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500 dark:text-slate-400">Thumbnail Image</label>
              <div className="flex items-center gap-4">
                <label className="px-4 py-2 rounded border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 cursor-pointer flex items-center gap-2">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">Upload Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewFeatured({...newFeatured, image: e.target.files[0]});
                      setFeaturedPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }} />
                </label>
                {featuredPreview && <img src={featuredPreview} alt="preview" className="h-12 w-12 object-cover rounded" />}
              </div>
            </div>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-bold flex items-center gap-1"><Plus className="w-4 h-4"/> Add Featured Product</button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredSolutions.map(f => (
              <div key={f.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col gap-3">
                <div className="h-32 bg-slate-100 dark:bg-slate-950 rounded-lg overflow-hidden relative">
                  {f.imageUrl ? <img src={\`http://localhost:5000\${f.imageUrl}\`} alt={f.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-8 h-8"/></div>}
                  <span className="absolute bottom-2 left-2 text-[8px] font-mono bg-blue-500/80 text-white px-1.5 py-0.5 rounded uppercase">{f.category}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{f.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{f.desc}</p>
                </div>
                <button onClick={() => handleDeleteFeatured(f.id)} className="self-end text-red-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>
              </div>
            ))}
          </div>
        </div>
      )}
`;

content = content.replace("{/* Tab Content */}", "{/* Tab Content */}\n" + featuredTabContent);

fs.writeFileSync(filePath, content);
console.log("CmsModule.tsx updated.");
