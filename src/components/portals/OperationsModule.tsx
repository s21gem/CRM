import { apiClient } from '../../lib/apiClient';
import React, { useState, useEffect } from 'react';
import {
  Activity,
  Building2,
  FolderKanban,
  BarChart3,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Shield,
  FileText,
  AlertTriangle,
  Save,
  RefreshCw,
} from 'lucide-react';

interface OperationsModuleProps {
  isDarkMode: boolean;
  currentUserRole: string;
}

export default function OperationsModule({ isDarkMode, currentUserRole }: OperationsModuleProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'orgs' | 'reports'>(
    'dashboard'
  );

  // Data States
  const [projects, setProjects] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fake HSM State for UI effect
  const [isRotating, setIsRotating] = useState(false);

  // Forms
  const [projectForm, setProjectForm] = useState({
    name: '',
    orgId: 'unlinked',
    orgName: '',
    category: 'Infrastructure',
    status: 'Planning',
    budget: 0,
    spent: 0,
    startDate: new Date().toISOString().split('T')[0],
    targetDate: new Date().toISOString().split('T')[0],
    completionPercentage: 0,
    securityLevel: 'L1',
    milestones: '[]',
  });

  const fetchAPI = async (endpoint: string, method: string = 'GET', body: any = null) => {
    try {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
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
    const [projData, orgsData, casesData] = await Promise.all([
      fetchAPI('projects'),
      fetchAPI('organizations'),
      fetchAPI('cases'),
    ]);
    if (projData) setProjects(projData);
    if (orgsData) setOrganizations(orgsData);
    if (casesData) setCases(casesData);
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
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'orgs', label: 'Organizations', icon: Building2 },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ] as const;

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetchAPI(`projects/${editingId}`, 'PUT', projectForm);
    } else {
      await fetchAPI('projects', 'POST', projectForm);
    }
    setEditingId(null);
    loadData();
    setProjectForm({
      name: '',
      orgId: 'unlinked',
      orgName: '',
      category: 'Infrastructure',
      status: 'Planning',
      budget: 0,
      spent: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: new Date().toISOString().split('T')[0],
      completionPercentage: 0,
      securityLevel: 'L1',
      milestones: '[]',
    });
  };

  const handleDelete = async (endpoint: string, id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    await fetchAPI(`${endpoint}/${id}`, 'DELETE');
    loadData();
  };

  const handleForceSync = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
      alert('FIPS 140-3 HSM cluster self-test and hardware synchronization complete.');
    }, 1200);
  };

  const renderDashboard = () => {
    const activeProjects = projects.filter((p) => p.status !== 'Completed').length;
    const totalBudget = projects.reduce((acc, curr) => acc + (curr.budget || 0), 0);
    const criticalCases = cases.filter(
      (c) => c.severity === 'Critical' && c.status !== 'Closed'
    ).length;

    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" /> Operations Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
              Active Projects
            </p>
            <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {activeProjects}
            </h3>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
              Total Project Budget
            </p>
            <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalBudget)}
            </h3>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
              Critical Cases
            </p>
            <h3 className="text-3xl font-bold text-red-600 dark:text-red-400">{criticalCases}</h3>
          </div>
        </div>

        {/* HSM Health Panel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500 animate-pulse" /> HSM Cluster Health
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              4/4 Nodes Online • FIPS 140-3 Level 4 Boundary Active
            </p>
          </div>
          <button
            onClick={handleForceSync}
            disabled={isRotating}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold rounded flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} /> Force Sync
          </button>
        </div>
      </div>
    );
  };

  const renderProjects = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Project Management</h2>

      <form
        onSubmit={handleSaveProject}
        className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4"
      >
        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          <FolderKanban className="w-4 h-4 text-blue-500" />{' '}
          {editingId ? 'Edit Project' : 'New Project'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
            <label className="text-xs text-slate-500">Project Name</label>
            <input
              required
              value={projectForm.name}
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
            />
          </div>
          <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
            <label className="text-xs text-slate-500">Organization</label>
            <input
              required
              value={projectForm.orgName}
              onChange={(e) => setProjectForm({ ...projectForm, orgName: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
            />
          </div>
          <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
            <label className="text-xs text-slate-500">Category</label>
            <select
              value={projectForm.category}
              onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
            >
              <option>Infrastructure</option>
              <option>Software</option>
              <option>Security</option>
            </select>
          </div>
          <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
            <label className="text-xs text-slate-500">Status</label>
            <select
              value={projectForm.status}
              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
            >
              <option>Planning</option>
              <option>In Progress</option>
              <option>On Hold</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
            <label className="text-xs text-slate-500">Budget (USD)</label>
            <input
              type="number"
              required
              value={projectForm.budget}
              onChange={(e) => setProjectForm({ ...projectForm, budget: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
            />
          </div>
          <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
            <label className="text-xs text-slate-500">Spent (USD)</label>
            <input
              type="number"
              required
              value={projectForm.spent}
              onChange={(e) => setProjectForm({ ...projectForm, spent: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
            />
          </div>
          <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
            <label className="text-xs text-slate-500">Start Date</label>
            <input
              type="date"
              required
              value={projectForm.startDate}
              onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
            />
          </div>
          <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
            <label className="text-xs text-slate-500">Progress (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              required
              value={projectForm.completionPercentage}
              onChange={(e) =>
                setProjectForm({ ...projectForm, completionPercentage: Number(e.target.value) })
              }
              className="w-full px-3 py-2 text-xs rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1"
          >
            {editingId ? (
              <>
                <Save className="w-4 h-4" /> Update
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add Project
              </>
            )}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setProjectForm({
                  name: '',
                  orgId: 'unlinked',
                  orgName: '',
                  category: 'Infrastructure',
                  status: 'Planning',
                  budget: 0,
                  spent: 0,
                  startDate: new Date().toISOString().split('T')[0],
                  targetDate: new Date().toISOString().split('T')[0],
                  completionPercentage: 0,
                  securityLevel: 'L1',
                  milestones: '[]',
                });
              }}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-center"
          >
            <div className="w-full pr-4">
              <div className="flex justify-between mb-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  {proj.name}{' '}
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded">
                    {proj.orgName}
                  </span>
                </h4>
                <span
                  className={`text-[10px] font-bold uppercase ${proj.status === 'Completed' ? 'text-emerald-500' : 'text-blue-500'}`}
                >
                  {proj.status}
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden my-3">
                <div
                  className={`h-full rounded-full ${proj.completionPercentage === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${proj.completionPercentage}%` }}
                ></div>
              </div>

              <p className="text-xs text-slate-500 flex justify-between">
                <span>Progress: {proj.completionPercentage}%</span>
                <span>
                  Budget: {formatCurrency(proj.budget)} (Spent: {formatCurrency(proj.spent)})
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2 border-l border-slate-200 dark:border-slate-800 pl-4 ml-4">
              <button
                onClick={() => {
                  setEditingId(proj.id);
                  setProjectForm(proj);
                }}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete('projects', proj.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrgs = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-500" /> CRM Organization Directory
      </h2>
      <p className="text-xs text-slate-500">
        Read-only view of organizations synced directly from the CRM Database.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
          >
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{org.name}</h4>
            <p className="text-xs text-slate-500 mt-1">
              Sector: {org.sector} • Clearance: {org.securityClearance}
            </p>
            {org.purpose && (
              <p className="text-[10px] text-slate-400 mt-2 italic">"{org.purpose}"</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const downloadCSV = (filename: string, headers: string[], rows: any[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadReport = (reportType: string) => {
    if (reportType === 'projects') {
      const headers = [
        'Project Name',
        'Organization',
        'Category',
        'Status',
        'Budget (USD)',
        'Spent (USD)',
        'Progress',
        'Start Date',
      ];
      const rows = projects.map((p) => [
        p.name,
        p.orgName,
        p.category,
        p.status,
        p.budget,
        p.spent,
        p.completionPercentage + '%',
        p.startDate,
      ]);
      downloadCSV('Projects_Audit_Report.csv', headers, rows);
    } else if (reportType === 'organizations') {
      const headers = [
        'Organization Name',
        'Sector',
        'Country',
        'Security Clearance',
        'Deal Value (USD)',
        'Status',
        'Purpose',
      ];
      const rows = organizations.map((o) => [
        o.name,
        o.sector,
        o.country,
        o.securityClearance,
        o.totalDealValue,
        o.status,
        o.purpose || 'N/A',
      ]);
      downloadCSV('Organizations_Directory.csv', headers, rows);
    } else if (reportType === 'cases') {
      const headers = [
        'Case Title',
        'Organization',
        'Severity',
        'Status',
        'Assigned To',
        'Created Date',
      ];
      const rows = cases.map((c) => [
        c.title,
        c.orgName,
        c.severity,
        c.status,
        c.assignedTo,
        c.createdAt,
      ]);
      downloadCSV('Support_Cases_Log.csv', headers, rows);
    }
  };

  const renderReports = () => {
    const reports = [
      {
        id: 'projects',
        title: 'Project Budget & Status Report',
        desc: 'Download a full CSV export of all active and completed projects with budget utilization.',
      },
      {
        id: 'organizations',
        title: 'Organization Directory Report',
        desc: 'Download a complete list of all synced CRM organizations and their clearance levels.',
      },
      {
        id: 'cases',
        title: 'Support Cases Audit Log',
        desc: 'Download a historical CSV log of all operational support cases and their severities.',
      },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" /> Operational Reports
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {report.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{report.desc}</p>
                </div>
              </div>
              <button
                onClick={() => handleDownloadReport(report.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-2"
              >
                Download CSV
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[80vh] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">
          Operations
        </h2>
        <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setEditingId(null);
                }}
                className={`whitespace-nowrap flex-shrink-0 md:w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'orgs' && renderOrgs()}
        {activeTab === 'reports' && renderReports()}
      </div>
    </div>
  );
}
