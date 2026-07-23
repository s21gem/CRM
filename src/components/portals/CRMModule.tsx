import { apiClient } from '../../lib/apiClient';
import React, { useState, useEffect } from "react";
import {
  Building2, Users, Target, Search, Filter, Plus, Trash2, Edit2, CheckCircle, 
  Clock, AlertTriangle, ShieldAlert, Check, Calendar, Activity, X, Save, TrendingUp,
  MessageSquare, Receipt
} from "lucide-react";
import LiveChatsTab from "./LiveChatsTab";

interface CRMModuleProps {
  isDarkMode: boolean;
  currentUserRole: string;
}

export default function CRMModule({ isDarkMode, currentUserRole }: CRMModuleProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "orgs" | "leads" | "meetings" | "cases" | "chats" | "invoices">("overview");

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isRequestingPortal, setIsRequestingPortal] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

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

  const handleRequestPortal = async (orgName: string) => {
    setIsRequestingPortal(orgName);
    try {
      const token = localStorage.getItem('crm_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
      const res = await apiClient('/api/crm/auditlogs', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'PORTAL_PROVISION_REQUEST',
          status: 'PENDING',
          payload: orgName,
          actor: currentUserRole,
          timestamp: new Date().toISOString()
        })
      });
      if (res.ok) {
        alert(`Successfully requested Super Admin to provision a portal account for ${orgName}.`);
      } else {
        alert('Failed to send request.');
      }
    } catch (e) {
      console.error(e);
      alert('Error sending request.');
    } finally {
      setIsRequestingPortal(null);
    }
  };

  const loadData = async () => {
    const [orgsData, leadsData, meetingsData, casesData, invoicesData, usersData] = await Promise.all([
      fetchAPI('organizations'),
      fetchAPI('leads'),
      fetchAPI('meetings'),
      fetchAPI('cases'),
      fetchAPI('invoices'),
      fetchAPI('users')
    ]);
    if (orgsData) setOrganizations(orgsData);
    if (leadsData) setLeads(leadsData);
    if (meetingsData) setMeetings(meetingsData);
    if (casesData) setCases(casesData);
    if (invoicesData) setInvoices(invoicesData);
    if (usersData) setUsers(usersData);
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
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'chats', label: 'Live Support', icon: MessageSquare },
    { id: 'orgs', label: 'Organizations', icon: Building2 },
    { id: 'leads', label: 'Leads & Deals', icon: Target },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'cases', label: 'Support Cases', icon: AlertTriangle },
    { id: 'invoices', label: 'Finance & Billing', icon: Receipt },
  ] as const;

  // Generic Edit States
  const [editingId, setEditingId] = useState<string | null>(null);

  // Forms
  const [orgForm, setOrgForm] = useState({ name: '', sector: 'Government', country: 'United States', purpose: '', securityClearance: 'L1', status: 'Active', assignedManager: 'Zubair', contactCount: 1, totalDealValue: 0 });
  const [leadForm, setLeadForm] = useState({ companyName: '', sector: 'Government', country: 'United States', contactPerson: '', email: '', value: 0, status: 'Discovery', confidence: 50, source: 'Direct', createdDate: new Date().toISOString().split('T')[0] });
  const [meetingForm, setMeetingForm] = useState({ title: '', date: '', time: '', orgName: '', location: '', status: 'Scheduled', attendees: '' });
  const [caseForm, setCaseForm] = useState({ title: '', orgName: '', description: '', severity: 'Medium', status: 'Open', assignedTo: 'Tech Support', category: 'Hardware', createdDate: new Date().toISOString().split('T')[0], updatedDate: new Date().toISOString().split('T')[0] });
  const [invoiceForm, setInvoiceForm] = useState({ projectName: '', orgName: '', amount: 0, dueDate: '', status: 'Pending', issuedDate: new Date().toISOString().split('T')[0], clientEmail: '' });

  // Generic Handlers
  const handleSaveOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetchAPI(`organizations/${editingId}`, 'PUT', orgForm);
    } else {
      await fetchAPI('organizations', 'POST', orgForm);
    }
    setEditingId(null);
    loadData();
    setOrgForm({ name: '', sector: 'Government', country: 'United States', purpose: '', securityClearance: 'L1', status: 'Active', assignedManager: 'Zubair', contactCount: 1, totalDealValue: 0 });
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetchAPI(`leads/${editingId}`, 'PUT', leadForm);
    } else {
      await fetchAPI('leads', 'POST', leadForm);
    }
    setEditingId(null);
    loadData();
    setLeadForm({ companyName: '', sector: 'Government', country: 'United States', contactPerson: '', email: '', value: 0, status: 'Discovery', confidence: 50, source: 'Direct', createdDate: new Date().toISOString().split('T')[0] });
  };

  const handleSaveMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetchAPI(`meetings/${editingId}`, 'PUT', meetingForm);
    } else {
      await fetchAPI('meetings', 'POST', meetingForm);
    }
    setEditingId(null);
    loadData();
    setMeetingForm({ title: '', date: '', time: '', orgName: '', location: '', status: 'Scheduled', attendees: '' });
  };

  const handleSaveCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetchAPI(`cases/${editingId}`, 'PUT', caseForm);
    } else {
      await fetchAPI('cases', 'POST', caseForm);
    }
    setEditingId(null);
    loadData();
    setCaseForm({ title: '', orgName: '', description: '', severity: 'Medium', status: 'Open', assignedTo: 'Tech Support', category: 'Hardware', createdDate: new Date().toISOString().split('T')[0], updatedDate: new Date().toISOString().split('T')[0] });
  };

  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetchAPI(`invoices/${editingId}`, 'PUT', invoiceForm);
    } else {
      await fetchAPI('invoices', 'POST', invoiceForm);
    }
    setEditingId(null);
    loadData();
    setInvoiceForm({ projectName: '', orgName: '', amount: 0, dueDate: '', status: 'Pending', issuedDate: new Date().toISOString().split('T')[0], clientEmail: '' });
  };

  const handleDelete = async (endpoint: string, id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    await fetchAPI(`${endpoint}/${id}`, 'DELETE');
    loadData();
  };

  const renderOverview = () => {
    const totalPipeline = leads.reduce((acc, curr) => acc + (curr.value || 0), 0);
    const totalOrgs = organizations.length;
    const openCases = cases.filter(c => c.status !== 'Closed').length;

    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Workspace Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total Pipeline</p>
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalPipeline)}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500"><TrendingUp className="w-6 h-6"/></div>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Active Organizations</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalOrgs}</h3>
            </div>
            <div className="p-3 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500"><Building2 className="w-6 h-6"/></div>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Open Support Cases</p>
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">{openCases}</h3>
            </div>
            <div className="p-3 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500"><ShieldAlert className="w-6 h-6"/></div>
          </div>
        </div>
      </div>
    );
  };

  const renderOrganizations = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Organizations Directory</h2>
      </div>

      <form onSubmit={handleSaveOrg} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white"><Building2 className="w-4 h-4 text-blue-500"/> {editingId ? 'Edit Organization' : 'Add New Organization'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1"><label className="text-xs text-slate-500">Name</label><input required value={orgForm.name} onChange={e=>setOrgForm({...orgForm, name: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Sector</label><input required value={orgForm.sector} onChange={e=>setOrgForm({...orgForm, sector: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Status</label><select value={orgForm.status} onChange={e=>setOrgForm({...orgForm, status: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"><option>Active</option><option>Prospect</option><option>Inactive</option></select></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Deal Value (USD)</label><input type="number" required value={orgForm.totalDealValue} onChange={e=>setOrgForm({...orgForm, totalDealValue: Number(e.target.value)})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="col-span-2 md:col-span-4 space-y-1"><label className="text-xs text-slate-500">Purpose / Description</label><textarea value={orgForm.purpose || ''} onChange={e=>setOrgForm({...orgForm, purpose: e.target.value})} placeholder="Why is this organization engaging with FoneBox?" className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 h-16" /></div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1">{editingId ? <><Save className="w-4 h-4"/> Update</> : <><Plus className="w-4 h-4"/> Add</>}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setOrgForm({ name: '', sector: 'Government', country: 'United States', purpose: '', securityClearance: 'L1', status: 'Active', assignedManager: 'Zubair', contactCount: 1, totalDealValue: 0 }) }} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded">Cancel</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {organizations.map(org => (
          <div key={org.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">{org.name} <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded">{org.sector}</span></h4>
              <p className="text-xs text-slate-500 mt-1">Status: <span className="font-bold">{org.status}</span> • Deal Value: <span className="font-bold text-emerald-500">{formatCurrency(org.totalDealValue)}</span></p>
              {org.purpose && <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 italic">"{org.purpose}"</p>}
            </div>
            <div className="flex gap-2">
              {users.some(u => u.role === 'CORPORATE_CLIENT' && u.department === org.name) ? (
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Portal Active
                </span>
              ) : (
                <button 
                  onClick={() => handleRequestPortal(org.name)}
                  disabled={isRequestingPortal === org.name}
                  title="Request Client Portal Account from Super Admin"
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded flex items-center gap-1 disabled:opacity-50"
                >
                  {isRequestingPortal === org.name ? 'Sending...' : 'Request Portal'}
                </button>
              )}
              <button onClick={() => { setEditingId(org.id); setOrgForm(org); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4"/></button>
              <button onClick={() => handleDelete('organizations', org.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLeads = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Leads & Pipeline</h2>
      </div>

      <form onSubmit={handleSaveLead} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white"><Target className="w-4 h-4 text-blue-500"/> {editingId ? 'Edit Lead' : 'Add New Lead'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1"><label className="text-xs text-slate-500">Company</label><input required value={leadForm.companyName} onChange={e=>setLeadForm({...leadForm, companyName: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Contact Person</label><input required value={leadForm.contactPerson} onChange={e=>setLeadForm({...leadForm, contactPerson: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Status</label><select value={leadForm.status} onChange={e=>setLeadForm({...leadForm, status: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"><option>New</option><option>Contacted</option><option>Qualified</option><option>Proposal Sent</option><option>Discovery</option><option>Technical Vetting</option><option>HSM Demo</option><option>Contract Negotiation</option><option>Negotiating</option><option>Procurement</option><option>Signed</option><option>Closed</option></select></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Est. Value (USD)</label><input type="number" required value={leadForm.value} onChange={e=>setLeadForm({...leadForm, value: Number(e.target.value)})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1">{editingId ? <><Save className="w-4 h-4"/> Update</> : <><Plus className="w-4 h-4"/> Add</>}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setLeadForm({ companyName: '', sector: 'Government', country: 'United States', contactPerson: '', email: '', value: 0, status: 'Discovery', confidence: 50, source: 'Direct', createdDate: new Date().toISOString().split('T')[0] }) }} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded">Cancel</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {leads.map(lead => (
          <div key={lead.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">{lead.companyName}</h4>
              <p className="text-xs text-slate-500 mt-1">Contact: {lead.contactPerson} • Status: <span className="font-bold text-blue-500">{lead.status}</span> • Value: <span className="font-bold text-emerald-500">{formatCurrency(lead.value)}</span></p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingId(lead.id); setLeadForm(lead); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4"/></button>
              <button onClick={() => handleDelete('leads', lead.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMeetings = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Meetings & Schedule</h2>
      </div>

      <form onSubmit={handleSaveMeeting} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white"><Calendar className="w-4 h-4 text-blue-500"/> {editingId ? 'Edit Meeting' : 'Schedule Meeting'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1"><label className="text-xs text-slate-500">Title</label><input required value={meetingForm.title} onChange={e=>setMeetingForm({...meetingForm, title: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Organization</label><input required value={meetingForm.orgName} onChange={e=>setMeetingForm({...meetingForm, orgName: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Date</label><input type="date" required value={meetingForm.date} onChange={e=>setMeetingForm({...meetingForm, date: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Time</label><input type="time" required value={meetingForm.time} onChange={e=>setMeetingForm({...meetingForm, time: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1">{editingId ? <><Save className="w-4 h-4"/> Update</> : <><Plus className="w-4 h-4"/> Schedule</>}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setMeetingForm({ title: '', date: '', time: '', orgName: '', location: '', status: 'Scheduled', attendees: '' }) }} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded">Cancel</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {meetings.map(meeting => (
          <div key={meeting.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">{meeting.title} <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded">{meeting.orgName}</span></h4>
              <p className="text-xs text-slate-500 mt-1">Date: <span className="font-bold">{meeting.date}</span> at <span className="font-bold">{meeting.time}</span></p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingId(meeting.id); setMeetingForm(meeting); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4"/></button>
              <button onClick={() => handleDelete('meetings', meeting.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCases = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Support Cases</h2>
      </div>

      <form onSubmit={handleSaveCase} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white"><AlertTriangle className="w-4 h-4 text-blue-500"/> {editingId ? 'Edit Case' : 'Log New Case'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1"><label className="text-xs text-slate-500">Case Title</label><input required value={caseForm.title} onChange={e=>setCaseForm({...caseForm, title: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Organization</label><input required value={caseForm.orgName} onChange={e=>setCaseForm({...caseForm, orgName: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Severity</label><select value={caseForm.severity} onChange={e=>setCaseForm({...caseForm, severity: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Status</label><select value={caseForm.status} onChange={e=>setCaseForm({...caseForm, status: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"><option>New</option><option>Open</option><option>In Progress</option><option>On Hold</option><option>Awaiting Client Response</option><option>Escalated</option><option>Resolved</option><option>Closed</option></select></div>
          <div className="col-span-2 md:col-span-4 space-y-1"><label className="text-xs text-slate-500">Case Description</label><textarea value={caseForm.description || ''} onChange={e=>setCaseForm({...caseForm, description: e.target.value})} placeholder="Describe the issue or support request in detail..." className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 h-20" /></div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1">{editingId ? <><Save className="w-4 h-4"/> Update</> : <><Plus className="w-4 h-4"/> Log Case</>}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setCaseForm({ title: '', orgName: '', description: '', severity: 'Medium', status: 'Open', assignedTo: 'Tech Support', category: 'Hardware', createdDate: new Date().toISOString().split('T')[0], updatedDate: new Date().toISOString().split('T')[0] }) }} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded">Cancel</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {cases.map(c => (
          <div key={c.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">{c.title} <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded">{c.orgName}</span></h4>
              <p className="text-xs text-slate-500 mt-1">Severity: <span className={`font-bold ${c.severity === 'Critical' ? 'text-red-500' : c.severity === 'High' ? 'text-orange-500' : 'text-blue-500'}`}>{c.severity}</span> • Status: <span className="font-bold text-slate-700 dark:text-slate-300">{c.status}</span></p>
              {c.description && <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{c.description}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingId(c.id); setCaseForm(c); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4"/></button>
              <button onClick={() => handleDelete('cases', c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Finance & Billing</h2>
      </div>

      <form onSubmit={handleSaveInvoice} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white"><Receipt className="w-4 h-4 text-blue-500"/> {editingId ? 'Edit Invoice' : 'Issue New Invoice'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1"><label className="text-xs text-slate-500">Project / Description</label><input required value={invoiceForm.projectName} onChange={e=>setInvoiceForm({...invoiceForm, projectName: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" placeholder="e.g. Server Maintenance" /></div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Client Org</label>
            <select required value={invoiceForm.orgName} onChange={e=>setInvoiceForm({...invoiceForm, orgName: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <option value="" disabled>Select an Organization</option>
              {organizations.map(org => (
                <option key={org.id} value={org.name}>{org.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Amount (USD)</label><input type="number" required value={invoiceForm.amount} onChange={e=>setInvoiceForm({...invoiceForm, amount: Number(e.target.value)})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Due Date</label><input type="date" required value={invoiceForm.dueDate} onChange={e=>setInvoiceForm({...invoiceForm, dueDate: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" /></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Status</label><select value={invoiceForm.status} onChange={e=>setInvoiceForm({...invoiceForm, status: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"><option>Pending</option><option>Paid</option><option>Overdue</option></select></div>
          <div className="space-y-1"><label className="text-xs text-slate-500">Client Email (Optional)</label><input type="email" value={invoiceForm.clientEmail} onChange={e=>setInvoiceForm({...invoiceForm, clientEmail: e.target.value})} className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" placeholder="Notification recipient" /></div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1">{editingId ? <><Save className="w-4 h-4"/> Update</> : <><Plus className="w-4 h-4"/> Issue Invoice</>}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setInvoiceForm({ projectName: '', orgName: '', amount: 0, dueDate: '', status: 'Pending', issuedDate: new Date().toISOString().split('T')[0], clientEmail: '' }) }} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded">Cancel</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {invoices.map(inv => (
          <div key={inv.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">{inv.projectName || 'Service Invoice'} <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded">{inv.orgName}</span></h4>
              <p className="text-xs text-slate-500 mt-1">Amount: <span className="font-bold text-emerald-500">{formatCurrency(inv.amount)}</span> • Due: {inv.dueDate}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : inv.status === 'Overdue' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                {inv.status}
              </span>
              <div className="flex gap-2">
                <button onClick={() => { setEditingId(inv.id); setInvoiceForm({...inv, clientEmail: ''}); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4"/></button>
                <button onClick={() => handleDelete('invoices', inv.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-[80vh] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">CRM Modules</h2>
        <div className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setEditingId(null); }}
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'chats' && <LiveChatsTab onDataRefresh={loadData} />}
        {activeTab === 'orgs' && renderOrganizations()}
        {activeTab === 'leads' && renderLeads()}
        {activeTab === 'meetings' && renderMeetings()}
        {activeTab === 'cases' && renderCases()}
        {activeTab === 'invoices' && renderInvoices()}
      </div>
    </div>
  );
}
 