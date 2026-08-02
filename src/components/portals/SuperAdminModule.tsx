import { apiClient } from '../../lib/apiClient';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  KeyRound,
  Terminal,
  Search,
  Plus,
  FileSpreadsheet,
  Trash2,
  RefreshCw,
  EyeOff,
  Check,
  Ban,
  Settings,
  Edit3,
  ArrowUpDown,
  BookOpen,
  Lock,
  Server,
  Sparkles,
  Database,
  FileText,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { ENTERPRISE_USERS, EnterpriseUser, EnterpriseApiKey, SystemAuditLog } from './portalData';
import CmsModule from './CmsModule';

interface SuperAdminModuleProps {
  isDarkMode: boolean;
  currentUserRole: string;
}

export default function SuperAdminModule({ isDarkMode, currentUserRole }: SuperAdminModuleProps) {
  // Navigation
  const [adminTab, setAdminTab] = useState<'users' | 'keys' | 'audit' | 'cms' | 'payments'>(
    'users'
  );

  // Stateful Admin parameters
  const [users, setUsers] = useState<any[]>([]);
  const [apiKeys, setApiKeys] = useState<EnterpriseApiKey[]>([]);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>([]);

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    id: '',
    provider: 'stripe',
    publicKey: '',
    secretKey: '',
    webhookSecret: '',
    isActive: true,
  });
  const [isSavingPayments, setIsSavingPayments] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('crm_token');
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [usersRes, keysRes, logsRes, paymentsRes] = await Promise.all([
          apiClient('/api/crm/users', { headers }),
          apiClient('/api/crm/apikeys', { headers }),
          apiClient('/api/crm/auditlogs', { headers }),
          apiClient('/api/crm/payment-settings', { headers }),
        ]);

        if (usersRes.ok) setUsers(await usersRes.json());
        if (keysRes.ok) setApiKeys(await keysRes.json());
        if (logsRes.ok) setAuditLogs(await logsRes.json());
        if (paymentsRes.ok) setPaymentSettings(await paymentsRes.json());
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      }
    };
    fetchData();
  }, []);

  // Form states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'INTERNAL_STAFF',
    department: '',
    clearance: 'None',
    sendEmailCredentials: false,
    requestId: undefined as string | undefined,
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyRole, setNewKeyRole] = useState<
    'GOVERNMENT_ADMIN' | 'ENTERPRISE_OPERATOR' | 'SYSTEM_AUDITOR' | 'ROOT_SUPERUSER'
  >('ENTERPRISE_OPERATOR');

  // CMS dynamic settings state
  const [governanceCenter, setGovernanceCenter] = useState('New York, USA');
  const [systemCodeName, setSystemCodeName] = useState('SOVEREIGN_SHIELD_V4');
  const [hsmFipsVersion, setHsmFipsVersion] = useState('FIPS 140-3 Level 4 certified');

  // Filters & Skeletons
  const [searchQuery, setSearchQuery] = useState('');
  const [logStatusFilter, setLogStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Revoke/Reactivate key
  const handleToggleKeyStatus = async (keyId: string) => {
    const k = apiKeys.find((key) => key.id === keyId);
    if (!k) return;

    try {
      const token = localStorage.getItem('crm_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await apiClient(`/api/crm/apikeys/${keyId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: k.status === 'Active' ? 'Revoked' : 'Active' }),
      });
      if (res.ok) {
        const updatedKey = await res.json();
        setApiKeys((prev) => prev.map((key) => (key.id === keyId ? updatedKey : key)));
        alert(`API key status updated inside active edge caching servers.`);
      }
    } catch (error) {
      console.error('Failed to toggle key status', error);
    }
  };

  // Generate new API key
  const handleGenerateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const tokenPart = Math.random().toString(16).substring(2, 6);
    const newKey = {
      name: newKeyName || 'Custom Operational Terminal Connection',
      tokenPreview: `fb_live_${newKeyRole.toLowerCase()}_${tokenPart}...9482`,
      role: newKeyRole,
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
      expiryDate: '2027-07-19',
      callsCount: 0,
    };

    try {
      const token = localStorage.getItem('crm_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const keyRes = await apiClient('/api/crm/apikeys', {
        method: 'POST',
        headers,
        body: JSON.stringify(newKey),
      });

      if (keyRes.ok) {
        const savedKey = await keyRes.json();
        setApiKeys([savedKey, ...apiKeys]);
        setShowAddKeyModal(false);
        setNewKeyName('');

        // Add audit log for generation
        const newLog = {
          timestamp: new Date().toISOString(),
          actor: 'root_superuser_admin',
          action: 'API_KEY_PROVISION',
          status: 'SUCCESS',
          payload: `Provisioned key identifier ${savedKey.id} named ${savedKey.name} under authority: ROLE_${savedKey.role}.`,
        };

        const logRes = await apiClient('/api/crm/auditlogs', {
          method: 'POST',
          headers,
          body: JSON.stringify(newLog),
        });

        if (logRes.ok) {
          const savedLog = await logRes.json();
          setAuditLogs([savedLog, ...auditLogs]);
        }

        alert(`Cryptographic API Access Token issued. Published to audit trail registers.`);
      }
    } catch (err) {
      console.error('Failed to generate API key', err);
    }
  };

  // Create new User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingUser(true);
    try {
      const token = localStorage.getItem('crm_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await apiClient('/api/crm/users', {
        method: 'POST',
        headers,
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        const savedUser = await res.json();
        setUsers([savedUser, ...users]);
        setShowAddUserModal(false);

        // If this was from a CRM request, mark the request as SUCCESS
        if (newUser.requestId) {
          await apiClient(`/api/crm/auditlogs/${newUser.requestId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ status: 'SUCCESS' }),
          });
        }

        setNewUser({
          name: '',
          email: '',
          password: '',
          role: 'INTERNAL_STAFF',
          department: '',
          clearance: 'None',
          sendEmailCredentials: false,
          requestId: undefined,
        });
        alert(`User provisioned successfully and added to identity registry.`);

        // Also fetch updated logs since backend creates an audit log
        const logsRes = await apiClient('/api/crm/auditlogs', { headers });
        if (logsRes.ok) setAuditLogs(await logsRes.json());
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || 'Failed to create user'}`);
      }
    } catch (err) {
      console.error('Failed to create user', err);
      alert('Failed to provision user due to network or server error.');
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to permanently revoke and delete this user?'))
      return;

    try {
      const token = localStorage.getItem('crm_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await apiClient(`/api/crm/users/${userId}`, {
        method: 'DELETE',
        headers,
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));

        // Also fetch updated logs
        const logsRes = await apiClient('/api/crm/auditlogs', { headers });
        if (logsRes.ok) setAuditLogs(await logsRes.json());
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || 'Failed to delete user'}`);
      }
    } catch (err) {
      console.error('Failed to delete user', err);
      alert('Failed to delete user due to network or server error.');
    }
  };

  // Save CMS changes
  const handleSaveCmsSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('crm_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const newLog = {
        timestamp: new Date().toISOString(),
        actor: 'root_superuser_admin',
        action: 'CMS_SYSTEM_SYNC',
        status: 'SUCCESS',
        payload: `Synchronized system variables. Operational Code Name changed to: ${systemCodeName}.`,
      };

      const logRes = await apiClient('/api/crm/auditlogs', {
        method: 'POST',
        headers,
        body: JSON.stringify(newLog),
      });

      if (logRes.ok) {
        const savedLog = await logRes.json();
        setAuditLogs([savedLog, ...auditLogs]);
      }

      alert(
        'System configuration values synced inside secure cloud environment. Operational templates updated.'
      );
    } catch (err) {
      console.error('Failed to save CMS settings log', err);
    }
  };

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPayments(true);
    try {
      const token = localStorage.getItem('crm_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await apiClient('/api/crm/payment-settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify(paymentSettings),
      });
      if (res.ok) {
        alert('Payment Gateway Credentials saved securely.');
      }
    } catch (err) {
      alert('Failed to save payment settings.');
    } finally {
      setIsSavingPayments(false);
    }
  };

  // Sort & Filter logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.payload.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = logStatusFilter === 'All' || log.status === logStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumbs Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/40">
        <div>
          <nav className="text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-slate-500 flex items-center gap-1.5 mb-1">
            <span>Sovereign Platform</span>
            <span>/</span>
            <span>Super Admin Operations</span>
            <span>/</span>
            <span className="text-blue-400">{adminTab}</span>
          </nav>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-500" />
            Super Administration Root
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
              Clearance: Root-Only
            </span>
          </h2>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800/60">
          <button
            onClick={() => {
              setAdminTab('users');
              triggerLoading();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              adminTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Access Roles
          </button>
          <button
            onClick={() => {
              setAdminTab('keys');
              triggerLoading();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              adminTab === 'keys'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            API Credentials
          </button>
          <button
            onClick={() => {
              setAdminTab('audit');
              triggerLoading();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              adminTab === 'audit'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Audit Trails
          </button>
          <button
            onClick={() => {
              setAdminTab('cms');
              triggerLoading();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              adminTab === 'cms'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            CMS Variables
          </button>
          <button
            onClick={() => {
              setAdminTab('payments');
              triggerLoading();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              adminTab === 'payments'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Payments
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-white dark:bg-slate-900/40 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
          <div className="h-48 bg-white dark:bg-slate-900/40 rounded-xl animate-pulse"></div>
        </div>
      ) : (
        <>
          {/* User Access & Roles panel */}
          {adminTab === 'users' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">
                  Bilateral Identity Access Control
                </h3>
                <p className="text-[10px] text-slate-600 dark:text-slate-500">
                  Managing global clearance limits, user registration profiles, and specific
                  operational directories
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-slate-500 font-mono">
                  {users.length} Active Personnel
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Provision User
                </button>
              </div>

              {/* CRM Provisioning Requests Queue */}
              {auditLogs.filter(
                (l) => l.action === 'PORTAL_PROVISION_REQUEST' && l.status === 'PENDING'
              ).length > 0 && (
                <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-500/20 space-y-3">
                  <h4 className="text-xs font-bold text-orange-800 dark:text-orange-400 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> CRM Provisioning Requests
                  </h4>
                  <div className="space-y-2">
                    {auditLogs
                      .filter(
                        (l) => l.action === 'PORTAL_PROVISION_REQUEST' && l.status === 'PENDING'
                      )
                      .map((reqLog: any) => (
                        <div
                          key={reqLog.id}
                          className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              Request for: {reqLog.payload}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              Requested by {reqLog.actor} •{' '}
                              {new Date(reqLog.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setNewUser({
                                name: '',
                                email: '',
                                password: '',
                                role: 'CORPORATE_CLIENT',
                                department: reqLog.payload,
                                clearance: 'Standard',
                                sendEmailCredentials: true,
                                requestId: reqLog.id,
                              });
                              setShowAddUserModal(true);
                            }}
                            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" /> Approve & Provision
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/20">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase text-[9px] tracking-wider">
                      <tr>
                        <th className="p-3">User</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Designated Role</th>
                        <th className="p-3">Security clearance</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Last login session</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-850">
                      {users.map((usr) => (
                        <tr
                          key={usr.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-900/10 transition-colors"
                        >
                          <td className="p-3 font-semibold text-slate-900 dark:text-slate-100 font-display">
                            <div>{usr.name}</div>
                            <span className="text-[10px] font-mono text-slate-600 dark:text-slate-500 font-normal">
                              {usr.email}
                            </span>
                          </td>
                          <td className="p-3 text-slate-700 dark:text-slate-300 font-sans">
                            {usr.department}
                          </td>
                          <td className="p-3">
                            <span className="text-[10px] font-mono font-bold text-blue-400">
                              {usr.role}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                                usr.clearance === 'Top Secret'
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/25'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}
                            >
                              {usr.clearance || 'Standard'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                              {usr.status}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono text-slate-600 dark:text-slate-500">
                            {usr.lastLogin ? new Date(usr.lastLogin).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="p-3 text-right">
                            {usr.role !== 'SUPER_ADMIN' ? (
                              <button
                                onClick={() => handleDeleteUser(usr.id)}
                                className="p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                title="Revoke and Delete User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span
                                className="text-[10px] text-slate-400 font-mono italic"
                                title="Protected Root User"
                              >
                                Protected
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Secure API Key & Token Credentials Management */}
          {adminTab === 'keys' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">
                    Gateway Access Token registries
                  </h3>
                  <p className="text-[10px] text-slate-600 dark:text-slate-500">
                    Issued API keys for boundary smart airport gates, diplomatic VPN tunnels, and
                    HSM test environments
                  </p>
                </div>
                <button
                  onClick={() => setShowAddKeyModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Generate API Key
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] text-blue-400 font-bold">
                          {key.id}
                        </span>
                        <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white">
                          {key.name}
                        </h4>
                        <span
                          className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                            key.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {key.status}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans space-y-0.5">
                        <p>
                          Credentials Secret:{' '}
                          <span className="font-mono text-[10px] text-blue-400 bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-800/50">
                            {key.tokenPreview}
                          </span>
                        </p>
                        <p>
                          Authorized Scope Role:{' '}
                          <strong className="text-slate-700 dark:text-slate-300 font-mono text-[9px]">
                            {key.role}
                          </strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <div className="font-mono text-[10px] text-slate-600 dark:text-slate-500">
                        Calls logged:{' '}
                        <strong className="text-slate-700 dark:text-slate-300">
                          {key.callsCount.toLocaleString()}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-600 dark:text-slate-500 font-mono">
                          Expires: {key.expiryDate}
                        </span>
                        <button
                          onClick={() => handleToggleKeyStatus(key.id)}
                          className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded cursor-pointer ${
                            key.status === 'Active'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/25'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                          }`}
                        >
                          {key.status === 'Active' ? 'Revoke Key' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Immutable Cryptographic Audit Trails */}
          {adminTab === 'audit' && (
            <div className="space-y-4 animate-fade-in">
              {/* Filter tools */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-600 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search logs, actor, action description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 placeholder-slate-500"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-500 uppercase">
                    Verification status:
                  </span>
                  <select
                    value={logStatusFilter}
                    onChange={(e) => setLogStatusFilter(e.target.value)}
                    className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
                  >
                    <option value="All">All Events</option>
                    <option value="SUCCESS">Success Log</option>
                    <option value="WARNING">Warning Alarm</option>
                    <option value="FAILED">Failed Block</option>
                  </select>
                </div>
              </div>

              {/* Console log layout */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#090D16] space-y-3 font-mono">
                <div className="flex justify-between items-center text-[10px] text-slate-600 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span>SYSTEM AUDIT LEDGER - BOUNDARY ACCESS CONTROL MONITOR</span>
                  <span className="text-emerald-400">● LIVE ENVELOPE SYNC</span>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="text-xs space-y-1 p-2.5 rounded bg-white dark:bg-slate-950/60 border border-slate-900"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-blue-400">[{log.timestamp}]</span>
                        <span className="text-slate-600 dark:text-slate-500">ID: {log.id}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                            log.status === 'SUCCESS'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : log.status === 'WARNING'
                                ? 'bg-amber-500/10 text-amber-500'
                                : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <div className="text-slate-700 dark:text-slate-300">
                        Actor:{' '}
                        <strong className="text-slate-900 dark:text-white">{log.actor}</strong> |
                        Action: <span className="text-amber-400">{log.action}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-500 text-[11px] font-sans italic">
                        {log.payload}
                      </p>
                    </div>
                  ))}
                  {filteredLogs.length === 0 && (
                    <p className="text-xs text-slate-600 dark:text-slate-500 text-center py-6">
                      No matching logs registered in current cache window.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CMS Settings Tab */}
          {adminTab === 'cms' && !isLoading && <CmsModule />}

          {/* Payment Gateway Settings Tab */}
          {adminTab === 'payments' && !isLoading && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1321] border border-slate-200 dark:border-slate-800/60 shadow-sm">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
                  Payment Gateway Configuration
                </h3>
                <form onSubmit={handleSavePaymentSettings} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                        Provider
                      </label>
                      <select
                        value={paymentSettings.provider}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, provider: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:border-blue-500"
                      >
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                        <option value="b2b_wire">B2B Wire Transfer / Manual</option>
                      </select>
                    </div>
                    <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                        Public Key
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.publicKey}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, publicKey: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:border-blue-500"
                        placeholder="pk_live_..."
                      />
                    </div>
                    <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                        Secret Key
                      </label>
                      <input
                        type="password"
                        value={paymentSettings.secretKey}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, secretKey: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:border-blue-500"
                        placeholder="sk_live_..."
                      />
                    </div>
                    <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                        Webhook Secret
                      </label>
                      <input
                        type="password"
                        value={paymentSettings.webhookSecret}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, webhookSecret: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:border-blue-500"
                        placeholder="whsec_..."
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingPayments}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {isSavingPayments ? 'Saving...' : 'Save Credentials'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* New api key creation modal */}
      {showAddKeyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex justify-center items-center">
          <div
            className="fixed inset-0 bg-white dark:bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowAddKeyModal(false)}
          />

          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1221] text-slate-900 dark:text-white p-6 z-10 shadow-2xl">
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-500" />
              Generate Secure REST Access Token
            </h3>

            <form onSubmit={handleGenerateApiKey} className="space-y-4">
              <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                <label className="text-[9px] font-mono text-slate-600 dark:text-slate-500 uppercase tracking-widest block font-bold">
                  Token Label Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. smart_gate_lax_terminal_4..."
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                <label className="text-[9px] font-mono text-slate-600 dark:text-slate-500 uppercase tracking-widest block font-bold">
                  Subnet Scope Authorization Role
                </label>
                <select
                  value={newKeyRole}
                  onChange={(e) => setNewKeyRole(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="GOVERNMENT_ADMIN">GOVERNMENT_ADMIN</option>
                  <option value="ENTERPRISE_OPERATOR">ENTERPRISE_OPERATOR</option>
                  <option value="SYSTEM_AUDITOR">SYSTEM_AUDITOR</option>
                  <option value="ROOT_SUPERUSER">ROOT_SUPERUSER</option>
                </select>
              </div>

              <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Tokens are logged in our append-only cryptographic log audit trail instantly upon
                allocation. Access is restricted to designated government subnets.
              </p>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/40 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddKeyModal(false)}
                  className="px-4 py-2 rounded-lg hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider"
                >
                  Generate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New User creation modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex justify-center items-center">
          <div
            className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowAddUserModal(false)}
          />

          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1221] text-slate-900 dark:text-white p-6 z-10 shadow-2xl">
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Provision New Platform User
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                  <label className="text-[9px] font-mono text-slate-600 dark:text-slate-500 uppercase tracking-widest block font-bold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                  <label className="text-[9px] font-mono text-slate-600 dark:text-slate-500 uppercase tracking-widest block font-bold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                  <label className="text-[9px] font-mono text-slate-600 dark:text-slate-500 uppercase tracking-widest block font-bold">
                    System Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                  <label className="text-[9px] font-mono text-slate-600 dark:text-slate-500 uppercase tracking-widest block font-bold">
                    Department / Organization Link
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google (Must match CRM Org Name for clients)"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                  <label className="text-[9px] font-mono text-slate-600 dark:text-slate-500 uppercase tracking-widest block font-bold">
                    Assigned Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="CRM_ADMIN">CRM_ADMIN</option>
                    <option value="INTERNAL_STAFF">INTERNAL_STAFF</option>
                    <option value="SALES_EXEC">SALES_EXEC</option>
                    <option value="OPERATIONS_OFFICER">OPERATIONS_OFFICER</option>
                    <option value="CORPORATE_CLIENT">CORPORATE_CLIENT</option>
                    <option value="CUSTOMER">CUSTOMER</option>
                  </select>
                </div>
                <div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                  <label className="text-[9px] font-mono text-slate-600 dark:text-slate-500 uppercase tracking-widest block font-bold">
                    Security Clearance
                  </label>
                  <select
                    value={newUser.clearance}
                    onChange={(e) => setNewUser({ ...newUser, clearance: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Confidential">Confidential</option>
                    <option value="Secret">Secret</option>
                    <option value="Top Secret">Top Secret</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="sendEmailCreds"
                  checked={newUser.sendEmailCredentials}
                  onChange={(e) =>
                    setNewUser({ ...newUser, sendEmailCredentials: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 dark:bg-slate-700 dark:border-slate-600"
                />
                <label
                  htmlFor="sendEmailCreds"
                  className="text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Email credentials to client
                </label>
              </div>

              <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans mt-4">
                Upon creation, the user will be instantly activated and logged into the system audit
                registry. The password will be cryptographically hashed via bcrypt prior to database
                insertion.
              </p>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/40 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  disabled={isCreatingUser}
                  className="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                >
                  {isCreatingUser ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Provisioning...
                    </>
                  ) : (
                    'Provision User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
