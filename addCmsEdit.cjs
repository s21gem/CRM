const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'components', 'portals', 'CmsModule.tsx');
let data = fs.readFileSync(file, 'utf8');

// 1. Imports
data = data.replace(
  "import { Upload, Plus, Trash2, Save, Image as ImageIcon, MessageSquare } from 'lucide-react';",
  "import { Upload, Plus, Trash2, Save, Image as ImageIcon, MessageSquare, Edit2, X } from 'lucide-react';"
);

// 2. States
data = data.replace(
  "const [newEnterprise, setNewEnterprise] = useState({",
  "const [editingEnterpriseId, setEditingEnterpriseId] = useState<string | null>(null);\n  const [newEnterprise, setNewEnterprise] = useState({"
);

data = data.replace(
  "const [newFeatured, setNewFeatured] = useState({ title: '', category: '', desc: '', image: null as File | null });",
  "const [editingFeaturedId, setEditingFeaturedId] = useState<string | null>(null);\n  const [newFeatured, setNewFeatured] = useState({ title: '', category: '', desc: '', image: null as File | null });"
);

data = data.replace(
  "const [newService, setNewService] = useState({ title: '', description: '', image: null as File | null });",
  "const [editingServiceId, setEditingServiceId] = useState<string | null>(null);\n  const [newService, setNewService] = useState({ title: '', description: '', image: null as File | null });"
);

data = data.replace(
  "const [newTestimonial, setNewTestimonial] = useState({ author: '', role: '', quote: '', rating: 5 });",
  "const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);\n  const [newTestimonial, setNewTestimonial] = useState({ author: '', role: '', quote: '', rating: 5 });"
);

// 3. Handlers
// Replace handleAddEnterprise
data = data.replace(
  /const handleAddEnterprise = async \(e: React\.FormEvent\) => \{[\s\S]*?catch \(err\) \{\}\n  \};/,
  `const handleAddEnterprise = async (e: React.FormEvent) => {
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

      const url = editingEnterpriseId ? \`http://localhost:5000/api/cms/enterprise-solutions/\${editingEnterpriseId}\` : 'http://localhost:5000/api/cms/enterprise-solutions';
      const method = editingEnterpriseId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewEnterprise({ title: '', category: '', desc: '', useCases: '', benefits: '', industries: '', flow: '' });
        setEditingEnterpriseId(null);
        fetchEnterpriseSolutions();
      }
    } catch (err) {}
  };
  
  const handleEditEnterprise = (item: any) => {
    setEditingEnterpriseId(item.id);
    setNewEnterprise({
      title: item.title,
      category: item.category,
      desc: item.desc,
      useCases: JSON.parse(item.useCases || '[]').join('\\n'),
      benefits: JSON.parse(item.benefits || '[]').join('\\n'),
      industries: JSON.parse(item.industries || '[]').join('\\n'),
      flow: JSON.parse(item.flow || '[]').map((f: any) => \`\${f.title} | \${f.desc}\`).join('\\n')
    });
  };`
);

// Replace handleAddFeatured
data = data.replace(
  /const handleAddFeatured = async \(e: React\.FormEvent\) => \{[\s\S]*?catch \(err\) \{\}\n  \};/,
  `const handleAddFeatured = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newFeatured.title);
    formData.append('category', newFeatured.category);
    formData.append('desc', newFeatured.desc);
    if (newFeatured.image) formData.append('image', newFeatured.image);

    try {
      const url = editingFeaturedId ? \`http://localhost:5000/api/cms/featured-solutions/\${editingFeaturedId}\` : 'http://localhost:5000/api/cms/featured-solutions';
      const method = editingFeaturedId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        setNewFeatured({ title: '', category: '', desc: '', image: null });
        setFeaturedPreview('');
        setEditingFeaturedId(null);
        fetchFeaturedSolutions();
      }
    } catch (err) {}
  };
  
  const handleEditFeatured = (item: any) => {
    setEditingFeaturedId(item.id);
    setNewFeatured({ title: item.title, category: item.category, desc: item.desc, image: null });
    setFeaturedPreview(item.imageUrl ? (item.imageUrl.startsWith('/uploads') ? \`http://localhost:5000\${item.imageUrl}\` : item.imageUrl) : '');
  };`
);

// Replace handleAddService
data = data.replace(
  /const handleAddService = async \(e: React\.FormEvent\) => \{[\s\S]*?catch \(err\) \{\}\n  \};/,
  `const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newService.title);
    formData.append('description', newService.description);
    if (newService.image) formData.append('image', newService.image);

    try {
      const url = editingServiceId ? \`http://localhost:5000/api/cms/services/\${editingServiceId}\` : 'http://localhost:5000/api/cms/services';
      const method = editingServiceId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        setNewService({ title: '', description: '', image: null });
        setServicePreview('');
        setEditingServiceId(null);
        fetchServices();
      }
    } catch (err) {}
  };
  
  const handleEditService = (item: any) => {
    setEditingServiceId(item.id);
    setNewService({ title: item.title, description: item.description, image: null });
    setServicePreview(item.imageUrl ? (item.imageUrl.startsWith('/uploads') ? \`http://localhost:5000\${item.imageUrl}\` : item.imageUrl) : '');
  };`
);

// Replace handleAddTestimonial
data = data.replace(
  /const handleAddTestimonial = async \(e: React\.FormEvent\) => \{[\s\S]*?catch \(err\) \{\}\n  \};/,
  `const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTestimonialId ? \`http://localhost:5000/api/cms/testimonials/\${editingTestimonialId}\` : 'http://localhost:5000/api/cms/testimonials';
      const method = editingTestimonialId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonial)
      });
      if (res.ok) {
        setNewTestimonial({ author: '', role: '', quote: '', rating: 5 });
        setEditingTestimonialId(null);
        fetchTestimonials();
      }
    } catch (err) {}
  };
  
  const handleEditTestimonial = (item: any) => {
    setEditingTestimonialId(item.id);
    setNewTestimonial({ author: item.author, role: item.role, quote: item.quote, rating: item.rating });
  };`
);

// 4. Update Form Buttons & List Items
// Enterprise Solutions Button
data = data.replace(
  /<button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-bold flex items-center gap-1"><Plus className="w-4 h-4"\/> Add Enterprise Solution<\/button>/,
  `<div className="flex gap-2">
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-bold flex items-center gap-1">{editingEnterpriseId ? <><Save className="w-4 h-4"/> Update Solution</> : <><Plus className="w-4 h-4"/> Add Enterprise Solution</>}</button>
              {editingEnterpriseId && <button type="button" onClick={() => { setEditingEnterpriseId(null); setNewEnterprise({ title: '', category: '', desc: '', useCases: '', benefits: '', industries: '', flow: '' }); }} className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1"><X className="w-4 h-4"/> Cancel</button>}
            </div>`
);
// Enterprise List Item
data = data.replace(
  /<button onClick=\{\(\) => handleDeleteEnterprise\(f.id\)\} className="self-end text-red-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4"\/><\/button>/g,
  `<div className="self-end flex gap-1">
                  <button onClick={() => handleEditEnterprise(f)} className="text-blue-500 hover:text-blue-400 p-2"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => handleDeleteEnterprise(f.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>
                </div>`
);


// Featured Solutions Button
data = data.replace(
  /<button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-bold flex items-center gap-1"><Plus className="w-4 h-4"\/> Add Featured Product<\/button>/,
  `<div className="flex gap-2">
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-bold flex items-center gap-1">{editingFeaturedId ? <><Save className="w-4 h-4"/> Update Product</> : <><Plus className="w-4 h-4"/> Add Featured Product</>}</button>
              {editingFeaturedId && <button type="button" onClick={() => { setEditingFeaturedId(null); setNewFeatured({ title: '', category: '', desc: '', image: null }); setFeaturedPreview(''); }} className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1"><X className="w-4 h-4"/> Cancel</button>}
            </div>`
);
// Featured List Item
data = data.replace(
  /<button onClick=\{\(\) => handleDeleteFeatured\(f.id\)\} className="self-end text-red-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4"\/><\/button>/g,
  `<div className="self-end flex gap-1 mt-2">
                  <button onClick={() => handleEditFeatured(f)} className="text-blue-500 hover:text-blue-400 p-2"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => handleDeleteFeatured(f.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>
                </div>`
);

// Services Button
data = data.replace(
  /<button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-bold flex items-center gap-1"><Plus className="w-4 h-4"\/> Add Service<\/button>/,
  `<div className="flex gap-2">
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-bold flex items-center gap-1">{editingServiceId ? <><Save className="w-4 h-4"/> Update Service</> : <><Plus className="w-4 h-4"/> Add Service</>}</button>
              {editingServiceId && <button type="button" onClick={() => { setEditingServiceId(null); setNewService({ title: '', description: '', image: null }); setServicePreview(''); }} className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1"><X className="w-4 h-4"/> Cancel</button>}
            </div>`
);
// Services List Item
data = data.replace(
  /<button onClick=\{\(\) => handleDeleteService\(s.id\)\} className="text-red-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4"\/><\/button>/g,
  `<div className="flex gap-1">
                  <button onClick={() => handleEditService(s)} className="text-blue-500 hover:text-blue-400 p-2"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => handleDeleteService(s.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>
                </div>`
);


// Testimonials Button
data = data.replace(
  /<button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-bold flex items-center gap-1"><Plus className="w-4 h-4"\/> Add Testimonial<\/button>/,
  `<div className="flex gap-2">
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-bold flex items-center gap-1">{editingTestimonialId ? <><Save className="w-4 h-4"/> Update Testimonial</> : <><Plus className="w-4 h-4"/> Add Testimonial</>}</button>
              {editingTestimonialId && <button type="button" onClick={() => { setEditingTestimonialId(null); setNewTestimonial({ author: '', role: '', quote: '', rating: 5 }); }} className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1"><X className="w-4 h-4"/> Cancel</button>}
            </div>`
);
// Testimonials List Item
data = data.replace(
  /<button onClick=\{\(\) => handleDeleteTestimonial\(t.id\)\} className="text-red-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4"\/><\/button>/g,
  `<div className="flex gap-1">
                  <button onClick={() => handleEditTestimonial(t)} className="text-blue-500 hover:text-blue-400 p-2"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => handleDeleteTestimonial(t.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>
                </div>`
);


fs.writeFileSync(file, data);
console.log("CmsModule updated successfully.");
