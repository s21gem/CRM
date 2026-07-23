import { apiClient } from '../../lib/apiClient';
import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, Save, Image as ImageIcon, MessageSquare, Edit2, X } from 'lucide-react';

export default function CmsModule() {
  const [activeTab, setActiveTab] = useState<'settings' | 'services' | 'testimonials' | 'featured' | 'enterprise'>('settings');

  // Settings State
  const [logoPreview, setLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');
  // System Settings State
  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    twitter: '',
    website: '',
    email: ''
  });

  // Enterprise Solutions State
  const [enterpriseSolutions, setEnterpriseSolutions] = useState<any[]>([]);
  const [editingEnterpriseId, setEditingEnterpriseId] = useState<string | null>(null);
  const [newEnterprise, setNewEnterprise] = useState({
    title: '', category: '', desc: '', useCases: '', benefits: '', industries: '', flow: ''
  });

// Featured Solutions State
  const [featuredSolutions, setFeaturedSolutions] = useState<any[]>([]);
  const [editingFeaturedId, setEditingFeaturedId] = useState<string | null>(null);
  const [newFeatured, setNewFeatured] = useState({ title: '', category: '', desc: '', image: null as File | null });
  const [featuredPreview, setFeaturedPreview] = useState('');

  // Services State
  const [services, setServices] = useState<any[]>([]);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newService, setNewService] = useState({ title: '', description: '', image: null as File | null });
  const [servicePreview, setServicePreview] = useState('');

  // Testimonials State
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [newTestimonial, setNewTestimonial] = useState({ author: '', role: '', quote: '', rating: 5 });

  const fetchSettings = async () => {
    try {
      const res = await apiClient('/api/cms/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.logoUrl) setLogoPreview(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}${data.logoUrl}`);
        if (data.faviconUrl) setFaviconPreview(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}${data.faviconUrl}`);
      }
    } catch (e) {}
  };

  const fetchSystemSettings = async () => {
    try {
      const res = await apiClient('/api/cms/system-settings');
      if (res.ok) {
        const data = await res.json();
        setSocialLinks({
          linkedin: data.linkedin_url || '',
          twitter: data.twitter_url || '',
          website: data.website_url || '',
          email: data.email_address || ''
        });
      }
    } catch (e) {}
  };

  const fetchEnterpriseSolutions = async () => {
    try {
      const res = await apiClient('/api/cms/enterprise-solutions');
      if (res.ok) setEnterpriseSolutions(await res.json());
    } catch (e) {}
  };

  const fetchFeaturedSolutions = async () => {
    try {
      const res = await apiClient('/api/cms/featured-solutions');
      if (res.ok) setFeaturedSolutions(await res.json());
    } catch (e) {}
  };

  const fetchServices = async () => {
    try {
      const res = await apiClient('/api/cms/services');
      if (res.ok) setServices(await res.json());
    } catch (e) {}
  };

  const fetchTestimonials = async () => {
    try {
      const res = await apiClient('/api/cms/testimonials');
      if (res.ok) setTestimonials(await res.json());
    } catch (e) {}
  };

  useEffect(() => {
    fetchSettings();
    fetchSystemSettings();
    fetchServices();
    fetchFeaturedSolutions();
    fetchEnterpriseSolutions();
    fetchTestimonials();
  }, []);

  // Settings Handlers
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData();
    const logoFile = (form.elements.namedItem('logo') as HTMLInputElement)?.files?.[0];
    const faviconFile = (form.elements.namedItem('favicon') as HTMLInputElement)?.files?.[0];
    
    if (logoFile) formData.append('logo', logoFile);
    if (faviconFile) formData.append('favicon', faviconFile);

    if (!logoFile && !faviconFile) {
      alert("Please select an image to upload.");
      return;
    }

    try {
      const res = await apiClient('/api/cms/settings', {
        method: 'PUT',
        body: formData
      });
      if (res.ok) {
        alert("Site settings updated successfully. Reload to see changes.");
        fetchSettings();
      }
    } catch (err) {
      alert("Failed to update settings.");
    }
  };

  const handleSaveSocialLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient('/api/cms/system-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedin_url: socialLinks.linkedin,
          twitter_url: socialLinks.twitter,
          website_url: socialLinks.website,
          email_address: socialLinks.email
        })
      });
      if (res.ok) alert('Social links updated successfully');
      else alert('Failed to update social links');
    } catch (e) {
      alert('Error updating social links');
    }
  };

  const handleAddEnterprise = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newEnterprise,
        useCases: JSON.stringify(newEnterprise.useCases.split('\n').filter(s=>s.trim())),
        benefits: JSON.stringify(newEnterprise.benefits.split('\n').filter(s=>s.trim())),
        industries: JSON.stringify(newEnterprise.industries.split('\n').filter(s=>s.trim())),
        flow: JSON.stringify(newEnterprise.flow.split('\n').filter(s=>s.trim()).map(step => {
          const [title, desc] = step.split('|');
          return { title: title?.trim() || 'Step', desc: desc?.trim() || '' };
        }))
      };

      const url = editingEnterpriseId ? `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/cms/enterprise-solutions/${editingEnterpriseId}` : `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/cms/enterprise-solutions`;
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
      useCases: JSON.parse(item.useCases || '[]').join('\n'),
      benefits: JSON.parse(item.benefits || '[]').join('\n'),
      industries: JSON.parse(item.industries || '[]').join('\n'),
      flow: JSON.parse(item.flow || '[]').map((f: any) => `${f.title} | ${f.desc}`).join('\n')
    });
  };

  const handleDeleteEnterprise = async (id: string) => {
    if (!confirm('Delete this enterprise solution?')) return;
    try {
      const res = await apiClient(`/api/cms/enterprise-solutions/${id}`, { method: 'DELETE' });
      if (res.ok) fetchEnterpriseSolutions();
    } catch (err) {}
  };

  const handleAddFeatured = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newFeatured.title);
    formData.append('category', newFeatured.category);
    formData.append('desc', newFeatured.desc);
    if (newFeatured.image) formData.append('image', newFeatured.image);

    try {
      const url = editingFeaturedId ? `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/cms/featured-solutions/${editingFeaturedId}` : `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/cms/featured-solutions`;
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
    setFeaturedPreview(item.imageUrl ? (item.imageUrl.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}${item.imageUrl}` : item.imageUrl) : '');
  };

  const handleDeleteFeatured = async (id: string) => {
    if (!confirm('Delete this featured product?')) return;
    try {
      const res = await apiClient(`/api/cms/featured-solutions/${id}`, { method: 'DELETE' });
      if (res.ok) fetchFeaturedSolutions();
    } catch (err) {}
  };

  // Services Handlers
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newService.title);
    formData.append('description', newService.description);
    if (newService.image) formData.append('image', newService.image);

    try {
      const url = editingServiceId ? `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/cms/services/${editingServiceId}` : `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/cms/services`;
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
    setServicePreview(item.imageUrl ? (item.imageUrl.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}${item.imageUrl}` : item.imageUrl) : '');
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      const res = await apiClient(`/api/cms/services/${id}`, { method: 'DELETE' });
      if (res.ok) fetchServices();
    } catch (err) {}
  };

  // Testimonial Handlers
  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTestimonialId ? `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/cms/testimonials/${editingTestimonialId}` : `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}/api/cms/testimonials`;
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
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await apiClient(`/api/cms/testimonials/${id}`, { method: 'DELETE' });
      fetchTestimonials();
    } catch (err) {}
  };

  return (
    <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 space-y-6">
      
      {/* CMS Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${activeTab === 'settings' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-600 dark:text-slate-500'}`}
        >
          Site Settings
        </button>
        <button 
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${activeTab === 'services' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-600 dark:text-slate-500'}`}
        >
          Services
        </button>
        <button 
          onClick={() => setActiveTab('testimonials')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${activeTab === 'testimonials' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-600 dark:text-slate-500'}`}
        >
          Testimonials
        </button>
        <button 
          onClick={() => setActiveTab('featured')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${activeTab === 'featured' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-600 dark:text-slate-500'}`}
        >
          Featured Products
        </button>
              <button 
          onClick={() => setActiveTab('enterprise')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${activeTab === 'enterprise' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-600 dark:text-slate-500'}`}
        >
          Enterprise Solutions
        </button>
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-10 animate-fade-in">
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">Branding Assets</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Site Logo</label>
              <p className="text-[10px] text-slate-600 dark:text-slate-500">Optimal size 256x64px (4:1 ratio), Max 2MB. Updates main navigation.</p>
              <div className="flex items-center gap-4">
                <input type="file" name="logo" accept="image/*" className="text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {logoPreview && <img src={logoPreview} alt="Logo Preview" className="h-10 object-contain bg-white rounded p-1" />}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Favicon</label>
              <p className="text-[10px] text-slate-600 dark:text-slate-500">Optimal size 32x32px (1:1 ratio), Max 1MB. Updates browser tab icon.</p>
              <div className="flex items-center gap-4">
                <input type="file" name="favicon" accept="image/png, image/x-icon" className="text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {faviconPreview && <img src={faviconPreview} alt="Favicon Preview" className="w-8 h-8 object-contain bg-white rounded p-1" />}
              </div>
            </div>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Branding
            </button>
          </form>

          <form onSubmit={handleSaveSocialLinks} className="space-y-6 max-w-xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">Social & External Links</h3>
            <div className="space-y-4">
              <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                <label className="text-xs text-slate-500">LinkedIn URL</label>
                <input type="url" value={socialLinks.linkedin} onChange={e => setSocialLinks({...socialLinks, linkedin: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" placeholder="https://linkedin.com/company/fonebox" />
              </div>
              <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                <label className="text-xs text-slate-500">Twitter (X) URL</label>
                <input type="url" value={socialLinks.twitter} onChange={e => setSocialLinks({...socialLinks, twitter: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" placeholder="https://twitter.com/fonebox" />
              </div>
              <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                <label className="text-xs text-slate-500">Website URL</label>
                <input type="url" value={socialLinks.website} onChange={e => setSocialLinks({...socialLinks, website: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" placeholder="https://fonebox.com" />
              </div>
              <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                <label className="text-xs text-slate-500">Contact Email</label>
                <input type="email" value={socialLinks.email} onChange={e => setSocialLinks({...socialLinks, email: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" placeholder="contact@fonebox.com" />
              </div>
            </div>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Links
            </button>
          </form>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-8 animate-fade-in">
          {/* Add Form */}
          <form onSubmit={handleAddService} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Add New Service Card</h4>
            <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
              <label className="text-xs text-slate-500 dark:text-slate-400">Title (Max 50 chars)</label>
              <input type="text" maxLength={50} required value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
            </div>
            <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
              <label className="text-xs text-slate-500 dark:text-slate-400">Description (Max 150 chars)</label>
              <textarea maxLength={150} required value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white h-20" />
            </div>
            <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
              <label className="text-xs text-slate-500 dark:text-slate-400">Service Image</label>
              <p className="text-[10px] text-slate-600 dark:text-slate-500 mb-1">Optimal size 400x300px (4:3 ratio), Max 2MB.</p>
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  setNewService({...newService, image: file});
                  setServicePreview(URL.createObjectURL(file));
                }
              }} className="text-xs text-slate-500 dark:text-slate-400" />
              {servicePreview && <img src={servicePreview} alt="Preview" className="h-20 mt-2 object-cover rounded" />}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-bold flex items-center gap-1">{editingServiceId ? <><Save className="w-4 h-4"/> Update Service</> : <><Plus className="w-4 h-4"/> Add Service</>}</button>
              {editingServiceId && <button type="button" onClick={() => { setEditingServiceId(null); setNewService({ title: '', description: '', image: null }); setServicePreview(''); }} className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1"><X className="w-4 h-4"/> Cancel</button>}
            </div>
          </form>

          {/* List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(s => (
              <div key={s.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 relative">
                <button onClick={() => handleDeleteService(s.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4"/></button>
                <div className="h-32 bg-slate-100 dark:bg-slate-950 rounded-lg overflow-hidden relative">
                  {s.imageUrl ? <img src={s.imageUrl.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}${s.imageUrl}` : s.imageUrl} alt={s.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-8 h-8"/></div>}
                </div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100">{s.title}</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {/* Enterprise Solutions Tab */}
      {activeTab === 'enterprise' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Manage Enterprise Solutions</h3>
          </div>
          
          <form onSubmit={handleAddEnterprise} className="space-y-4 p-4 bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                <label className="text-xs text-slate-500">Title</label>
                <input type="text" required value={newEnterprise.title} onChange={e => setNewEnterprise({...newEnterprise, title: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
              <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                <label className="text-xs text-slate-500">Category Tag</label>
                <input type="text" required value={newEnterprise.category} onChange={e => setNewEnterprise({...newEnterprise, category: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
            </div>
            <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
              <label className="text-xs text-slate-500">Description</label>
              <textarea required value={newEnterprise.desc} onChange={e => setNewEnterprise({...newEnterprise, desc: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white h-16" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                <label className="text-xs text-slate-500">Use Cases (1 per line)</label>
                <textarea required value={newEnterprise.useCases} onChange={e => setNewEnterprise({...newEnterprise, useCases: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white h-24" />
              </div>
              <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                <label className="text-xs text-slate-500">Benefits (1 per line)</label>
                <textarea required value={newEnterprise.benefits} onChange={e => setNewEnterprise({...newEnterprise, benefits: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white h-24" />
              </div>
              <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                <label className="text-xs text-slate-500">Industries (1 per line)</label>
                <textarea required value={newEnterprise.industries} onChange={e => setNewEnterprise({...newEnterprise, industries: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white h-24" />
              </div>
            </div>

            <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
              <label className="text-xs text-slate-500">Flowchart Steps (Format: Title | Description, 1 step per line)</label>
              <textarea required value={newEnterprise.flow} onChange={e => setNewEnterprise({...newEnterprise, flow: e.target.value})} placeholder="Biometric Enrollment | Face & fingerprints captured via ISO/IEC scanners." className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white h-24" />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-bold flex items-center gap-1">{editingEnterpriseId ? <><Save className="w-4 h-4"/> Update Solution</> : <><Plus className="w-4 h-4"/> Add Enterprise Solution</>}</button>
              {editingEnterpriseId && <button type="button" onClick={() => { setEditingEnterpriseId(null); setNewEnterprise({ title: '', category: '', desc: '', useCases: '', benefits: '', industries: '', flow: '' }); }} className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1"><X className="w-4 h-4"/> Cancel</button>}
            </div>
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
                <div className="self-end flex gap-1">
                  <button onClick={() => handleEditEnterprise(f)} className="text-blue-500 hover:text-blue-400 p-2"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => handleDeleteEnterprise(f.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Featured Products Tab */}
      {activeTab === 'featured' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Manage Featured Products</h3>
          </div>
          
          <form onSubmit={handleAddFeatured} className="space-y-4 p-4 bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                <label className="text-xs text-slate-500 dark:text-slate-400">Product Title</label>
                <input type="text" required value={newFeatured.title} onChange={e => setNewFeatured({...newFeatured, title: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
              <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                <label className="text-xs text-slate-500 dark:text-slate-400">Category Tag (e.g. FINTECH & BANKING)</label>
                <input type="text" required value={newFeatured.category} onChange={e => setNewFeatured({...newFeatured, category: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
            </div>
            <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
              <label className="text-xs text-slate-500 dark:text-slate-400">Description (Max 150 chars)</label>
              <textarea maxLength={150} required value={newFeatured.desc} onChange={e => setNewFeatured({...newFeatured, desc: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white h-20" />
            </div>
            <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
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
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-bold flex items-center gap-1">{editingFeaturedId ? <><Save className="w-4 h-4"/> Update Product</> : <><Plus className="w-4 h-4"/> Add Featured Product</>}</button>
              {editingFeaturedId && <button type="button" onClick={() => { setEditingFeaturedId(null); setNewFeatured({ title: '', category: '', desc: '', image: null }); setFeaturedPreview(''); }} className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1"><X className="w-4 h-4"/> Cancel</button>}
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredSolutions.map(f => (
              <div key={f.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col gap-3">
                <div className="h-32 bg-slate-100 dark:bg-slate-950 rounded-lg overflow-hidden relative">
                  {f.imageUrl ? <img src={f.imageUrl.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')))}${f.imageUrl}` : f.imageUrl} alt={f.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-8 h-8"/></div>}
                  <span className="absolute bottom-2 left-2 text-[8px] font-mono bg-blue-500/80 text-white px-1.5 py-0.5 rounded uppercase">{f.category}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{f.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{f.desc}</p>
                </div>
                <div className="self-end flex gap-1 mt-2">
                  <button onClick={() => handleEditFeatured(f)} className="text-blue-500 hover:text-blue-400 p-2"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => handleDeleteFeatured(f.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonials' && (
        <div className="space-y-8 animate-fade-in">
          <form onSubmit={handleAddTestimonial} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Add Testimonial</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                <label className="text-xs text-slate-500 dark:text-slate-400">Author (Max 30 chars)</label>
                <input type="text" maxLength={30} required value={newTestimonial.author} onChange={e => setNewTestimonial({...newTestimonial, author: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
              <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                <label className="text-xs text-slate-500 dark:text-slate-400">Role/Company (Max 50 chars)</label>
                <input type="text" maxLength={50} required value={newTestimonial.role} onChange={e => setNewTestimonial({...newTestimonial, role: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
            </div>
            <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
              <label className="text-xs text-slate-500 dark:text-slate-400">Quote (Max 200 chars)</label>
              <textarea maxLength={200} required value={newTestimonial.quote} onChange={e => setNewTestimonial({...newTestimonial, quote: e.target.value})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white h-20" />
            </div>
            <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
              <label className="text-xs text-slate-500 dark:text-slate-400">Rating (1-5)</label>
              <input type="number" min="1" max="5" required value={newTestimonial.rating} onChange={e => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-bold flex items-center gap-1">{editingTestimonialId ? <><Save className="w-4 h-4"/> Update Testimonial</> : <><Plus className="w-4 h-4"/> Add Testimonial</>}</button>
              {editingTestimonialId && <button type="button" onClick={() => { setEditingTestimonialId(null); setNewTestimonial({ author: '', role: '', quote: '', rating: 5 }); }} className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1"><X className="w-4 h-4"/> Cancel</button>}
            </div>
          </form>

          <div className="space-y-2">
            {testimonials.map(t => (
              <div key={t.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-center">
                <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.author} - <span className="text-slate-500 dark:text-slate-400 font-normal">{t.role}</span></div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 italic">"{t.quote}"</div>
                  <div className="text-[10px] text-yellow-500">{'★'.repeat(t.rating)}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEditTestimonial(t)} className="text-blue-500 hover:text-blue-400 p-2"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => handleDeleteTestimonial(t.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
