/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Shield,
  Terminal,
  Code,
  Lock,
  Sliders,
  Folder,
  FolderOpen,
  FileCode,
  Play,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Activity,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import {
  BUSINESS_AREAS,
  ARCHITECTURE_TREE,
  API_ENDPOINTS,
  SECURITY_CONTROLS,
  DESIGN_TOKENS,
  INITIAL_AUDIT_LOGS,
} from '../data';
import {
  BusinessArea,
  ArchitectureNode,
  ApiEndpointSpec,
  SecurityControl,
  SystemAuditLog,
  DesignToken,
} from '../types';

interface DeveloperResourcesProps {
  isDarkMode: boolean;
}

export default function DeveloperResources({ isDarkMode }: DeveloperResourcesProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    'sandbox' | 'monorepo' | 'security-ctr' | 'tokens' | 'logs'
  >('sandbox');

  // Sandbox State
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointSpec>(API_ENDPOINTS[0]);
  const [sandboxRequest, setSandboxRequest] = useState<string>(API_ENDPOINTS[0].requestBody || '');
  const [sandboxResponse, setSandboxResponse] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedRole, setSimulatedRole] = useState<
    'GOVERNMENT_ADMIN' | 'ENTERPRISE_OPERATOR' | 'SYSTEM_AUDITOR' | 'ROOT_SUPERUSER'
  >('GOVERNMENT_ADMIN');
  const [hsmKeyStatus, setHsmKeyStatus] = useState<
    'ACTIVE' | 'TEMPORARILY_BLOCKED' | 'NEEDS_ROTATION'
  >('ACTIVE');

  // Monorepo State
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'fonebox-enterprise-monorepo': true,
    'fonebox-enterprise-monorepo/apps': true,
    'fonebox-enterprise-monorepo/packages': true,
  });
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);

  // Security controls State
  const [auditedControls, setAuditedControls] = useState<Record<string, boolean>>({
    'sc-01': true,
    'sc-02': true,
    'sc-03': true,
    'sc-04': true,
  });

  // System logs State
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [logsPaused, setLogsPaused] = useState<boolean>(false);

  // Copy helpers
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    if (selectedEndpoint) {
      setSandboxRequest(selectedEndpoint.requestBody || '');
      setSandboxResponse('');
    }
  }, [selectedEndpoint]);

  // Handle simulated API click
  const handleSimulateApi = () => {
    setIsSimulating(true);
    setSandboxResponse('');

    setTimeout(() => {
      // Access role check
      const requiredRole = selectedEndpoint.requiredRole;
      const rolesRank = {
        GOVERNMENT_ADMIN: 1,
        ENTERPRISE_OPERATOR: 2,
        SYSTEM_AUDITOR: 3,
        ROOT_SUPERUSER: 4,
      };

      const userRank = rolesRank[simulatedRole];
      const requiredRank = rolesRank[requiredRole];

      if (hsmKeyStatus === 'TEMPORARILY_BLOCKED') {
        setSandboxResponse(
          JSON.stringify(
            {
              error: 'HARDWARE_MODULE_EXCEPTION',
              message: 'Cryptographic Operations Blocked: Physical Tamper Sensor Tripped.',
              timestamp: new Date().toISOString(),
            },
            null,
            2
          )
        );
      } else if (userRank < requiredRank) {
        setSandboxResponse(
          JSON.stringify(
            {
              error: 'INSUFFICIENT_SECURITY_CLEARANCE',
              message: `Access Denied. Endpoint requires [${requiredRole}] authorization level. Simulated credentials: [${simulatedRole}]`,
              timestamp: new Date().toISOString(),
            },
            null,
            2
          )
        );
      } else {
        // Success payload
        setSandboxResponse(selectedEndpoint.successResponse);

        // Add dynamic log entry
        if (!logsPaused) {
          const newLog: SystemAuditLog = {
            id: `sys_aud_${Math.floor(Math.random() * 1000 + 100)}`,
            timestamp: new Date().toISOString(),
            actor: `simulated_actor_${simulatedRole.toLowerCase()}`,
            action: `SIMULATOR_API_${selectedEndpoint.id.toUpperCase()}`,
            status: 'SUCCESS',
            payload: `Invoked secure route: ${selectedEndpoint.path}. Clearance validated.`,
          };
          setAuditLogs((prev) => [newLog, ...prev.slice(0, 7)]);
        }
      }
      setIsSimulating(false);
    }, 800);
  };

  // Directory recursive renderer
  const toggleNode = (path: string) => {
    setExpandedNodes((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const renderDirectoryNode = (node: ArchitectureNode, depth: number = 0) => {
    const isExpanded = !!expandedNodes[node.path];
    const isSelected = selectedNode?.path === node.path;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.path} className="select-none">
        <div
          onClick={() => {
            if (node.type === 'directory') {
              toggleNode(node.path);
            }
            setSelectedNode(node);
          }}
          className={`group flex items-center justify-between py-1.5 px-2.5 rounded cursor-pointer transition-all duration-200 ${
            isSelected
              ? 'bg-blue-500/15 text-blue-400 border-l-2 border-blue-500 font-medium'
              : isDarkMode
                ? 'text-slate-300 hover:bg-slate-800/30'
                : 'text-slate-700 hover:bg-slate-100'
          }`}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
        >
          <div className="flex items-center gap-2 truncate">
            {node.type === 'directory' ? (
              isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-400 shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-slate-500 shrink-0" />
              )
            ) : (
              <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
            )}
            <span className="text-xs font-mono">{node.name}</span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <span
              className={`text-[8px] font-mono px-1 rounded ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}
            >
              {node.ownerTeam.split(' ')[0]}
            </span>
          </div>
        </div>

        {node.type === 'directory' && isExpanded && hasChildren && (
          <div
            className={`border-l ml-[18px] pl-1.5 my-0.5 space-y-0.5 ${isDarkMode ? 'border-slate-800/40' : 'border-slate-200'}`}
          >
            {node.children!.map((child) => renderDirectoryNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleCopyToken = (token: DesignToken) => {
    navigator.clipboard.writeText(token.value);
    setCopiedToken(token.name);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  const clearSandboxConsole = () => {
    setSandboxResponse('');
  };

  return (
    <div className="space-y-12 pt-28 pb-12">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <span className="text-[10px] font-mono tracking-widest uppercase text-blue-500 font-bold">
          Tech Resources Command
        </span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white">
          Interactive Developer Spec
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-3xl mx-auto">
          Explore and audit the core mechanical specifications, sandbox API pipelines, monorepo tree
          structures, security compliance audits, and corporate design tokens of FoneBox Global.
        </p>
      </section>

      {/* Resource sub-tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="inline-flex p-1 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none gap-1 overflow-x-auto max-w-full">
          {[
            { id: 'sandbox', label: 'API Sandbox', icon: Terminal },
            { id: 'monorepo', label: 'Monorepo Blueprint', icon: Code },
            { id: 'security-ctr', label: 'Sovereign Controls', icon: Lock },
            { id: 'tokens', label: 'Design Tokens', icon: Sliders },
            { id: 'logs', label: 'Audit Logs', icon: Activity },
          ].map((sub) => {
            const Icon = sub.icon;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id as any)}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeSubTab === sub.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Subtab Panel Display */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1321]/20 p-6 sm:p-8 min-h-[460px]">
          {/* API SANDBOX SIMULATOR */}
          {activeSubTab === 'sandbox' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Endpoint selection left */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
                    HSM Signer & Sandbox
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">
                    Simulate signed credentials requests and test endpoint clearance rules.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-mono uppercase text-slate-500 block font-bold">
                    Select Secured Route
                  </span>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto">
                    {API_ENDPOINTS.map((endpoint) => (
                      <button
                        key={endpoint.id}
                        onClick={() => setSelectedEndpoint(endpoint)}
                        className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          selectedEndpoint.id === endpoint.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="truncate">
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded mr-2 ${
                              endpoint.method === 'POST'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-blue-500/10 text-blue-400'
                            }`}
                          >
                            {endpoint.method}
                          </span>
                          <span className="font-mono text-slate-800 dark:text-slate-200">
                            {endpoint.path}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Configuration parameters */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800/40">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase text-slate-500 block font-bold">
                      Simulated Actor Level
                    </span>
                    <select
                      value={simulatedRole}
                      onChange={(e) => setSimulatedRole(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="GOVERNMENT_ADMIN">Gov Admin</option>
                      <option value="ENTERPRISE_OPERATOR">Enterprise Op</option>
                      <option value="SYSTEM_AUDITOR">System Auditor</option>
                      <option value="ROOT_SUPERUSER">Root SuperUser</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase text-slate-500 block font-bold">
                      HSM Hardware Status
                    </span>
                    <select
                      value={hsmKeyStatus}
                      onChange={(e) => setHsmKeyStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="ACTIVE">Active (FIPS)</option>
                      <option value="TEMPORARILY_BLOCKED">Tamper Sensor Tripped</option>
                      <option value="NEEDS_ROTATION">Needs Rotation</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Console Sandbox Workspace right */}
              <div className="lg:col-span-7 flex flex-col justify-between border border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-950 shadow-sm dark:shadow-none p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
                      FoneBox Sandbox API CLI
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">
                      Clearance required: {selectedEndpoint.requiredRole}
                    </span>
                    <button
                      onClick={clearSandboxConsole}
                      className="text-[10px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  {/* Request Payload block */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase text-slate-500 block font-bold">
                      Request Body JSON
                    </span>
                    <pre className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 overflow-x-auto max-h-[140px]">
                      {sandboxRequest || '// No request parameters required'}
                    </pre>
                  </div>

                  {/* Simulator Trigger */}
                  <button
                    onClick={handleSimulateApi}
                    disabled={isSimulating}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isSimulating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span>
                      {isSimulating
                        ? 'Simulating FIPS Verification...'
                        : 'Transmit Cryptographic request'}
                    </span>
                  </button>

                  {/* Response Payload Block */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase text-slate-500 block font-bold">
                      Response Stream Console
                    </span>
                    <pre
                      className={`p-4 rounded-lg border text-[10px] font-mono overflow-x-auto h-[160px] ${
                        sandboxResponse.includes('error')
                          ? 'bg-rose-500/5 border-rose-500/20 text-rose-400'
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {sandboxResponse || '// Initiate cryptographic transaction above...'}
                    </pre>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/40 text-[9px] font-mono text-slate-500 flex justify-between">
                  <span>Signatures formulated under ECDSA-SHA384</span>
                  <span>SSL/TLS active</span>
                </div>
              </div>
            </div>
          )}

          {/* MONOREPO DIRECTORY TREE */}
          {activeSubTab === 'monorepo' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Directory listings left */}
              <div className="lg:col-span-5 border border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-950 shadow-sm dark:shadow-none p-4 max-h-[440px] overflow-y-auto">
                <div className="pb-3 border-b border-slate-200 dark:border-slate-800/40 mb-4 flex justify-between items-center">
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                    Workspace Tree Directory
                  </span>
                  <span className="text-[8px] font-mono text-slate-500 uppercase">
                    Sovereign Repositories
                  </span>
                </div>
                <div className="space-y-1">{renderDirectoryNode(ARCHITECTURE_TREE)}</div>
              </div>

              {/* Node Detail Inspector right */}
              <div className="lg:col-span-7 flex flex-col justify-between border border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-950 shadow-sm dark:shadow-none p-5 space-y-4">
                {selectedNode ? (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start pb-3 border-b border-slate-200 dark:border-slate-800/40">
                        <div>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded mr-2 uppercase ${
                              selectedNode.type === 'directory'
                                ? 'bg-blue-500/10 text-blue-400'
                                : 'bg-indigo-500/10 text-indigo-400'
                            }`}
                          >
                            {selectedNode.type}
                          </span>
                          <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
                            {selectedNode.name}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500">
                          Owner: {selectedNode.ownerTeam}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {selectedNode.description}
                      </p>
                    </div>

                    {selectedNode.contentSnippet ? (
                      <div className="space-y-2 pt-2 flex-1 flex flex-col justify-end">
                        <span className="text-[9px] font-mono uppercase text-slate-500 block font-bold">
                          Secure Code Preview
                        </span>
                        <pre className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 overflow-x-auto max-h-[190px]">
                          {selectedNode.contentSnippet}
                        </pre>
                      </div>
                    ) : (
                      <div className="py-8 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-500">
                        Select a source file (e.g., server.ts, hsm-connector.ts) to view secure code
                        blocks.
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800/40 text-[9px] font-mono text-slate-500 flex justify-between">
                      <span>
                        Standards checked: {selectedNode.complianceChecked ? 'VERIFIED' : 'PENDING'}
                      </span>
                      <span>Owner Team: {selectedNode.ownerTeam}</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-center p-12 space-y-4">
                    <Folder className="w-12 h-12 text-slate-700 animate-bounce" />
                    <div className="space-y-1">
                      <h4 className="font-display font-semibold text-xs text-slate-700 dark:text-slate-300">
                        Workspace Node Empty
                      </h4>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Please select a folder node or file from the structural directory tree to
                        inspect owner scopes and secure implementations.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SYSTEM SECURITY CONTROLS */}
          {activeSubTab === 'security-ctr' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800/40 pb-4">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
                  Sovereign Compliance Audits
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  Acknowledge enforcement states of sovereign cybersecurity guidelines.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SECURITY_CONTROLS.map((control) => (
                  <div
                    key={control.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A]/20 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest block font-bold">
                          {control.id} // {control.standard}
                        </span>
                        <h4 className="font-display font-semibold text-xs text-slate-800 dark:text-slate-200 mt-1">
                          {control.title}
                        </h4>
                      </div>
                      <button
                        onClick={() =>
                          setAuditedControls((prev) => ({
                            ...prev,
                            [control.id]: !prev[control.id],
                          }))
                        }
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded cursor-pointer ${
                          auditedControls[control.id]
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {auditedControls[control.id] ? 'VERIFIED_AUDIT' : 'BYPASSED'}
                      </button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                      {control.description}
                    </p>
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800/40 flex justify-between text-[9px] font-mono text-slate-500 uppercase">
                      <span>Principle: {control.principle}</span>
                      <span>Enforce: {control.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CORPORATE DESIGN TOKENS */}
          {activeSubTab === 'tokens' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800/40 pb-4">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
                  Corporate Design Tokens
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  The brand atomic building blocks library formulated for the Sovereign FoneBox
                  Global aesthetic.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {DESIGN_TOKENS.map((token) => (
                  <div
                    key={token.name}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-xs text-blue-400">{token.name}</span>
                        <span
                          className={`text-[8px] font-mono uppercase px-1.5 rounded ${
                            token.type === 'color'
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}
                        >
                          {token.type}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        {token.usage}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800/40 flex justify-between items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-bold">
                        {token.value}
                      </span>
                      <button
                        onClick={() => handleCopyToken(token)}
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        title="Copy Token Value"
                      >
                        {copiedToken === token.name ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REAL TIME SYSTEM LOGS */}
          {activeSubTab === 'logs' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800/40 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
                    Live Sovereign Audit Logs
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">
                    Append-only audit ledger reflecting active system transaction hashes.
                  </p>
                </div>
                <button
                  onClick={() => setLogsPaused(!logsPaused)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase cursor-pointer ${
                    logsPaused
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {logsPaused ? 'LEDGER_PAUSED' : 'LEDGER_STREAMING'}
                </button>
              </div>

              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-[11px]"
                  >
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center truncate">
                      <span className="text-slate-500">
                        [{log.timestamp.split('T')[1].substring(0, 8)}]
                      </span>
                      <span className="text-blue-400 font-semibold uppercase">{log.action}</span>
                      <span className="text-slate-600 dark:text-slate-400 truncate">
                        Actor: {log.actor} — {log.payload}
                      </span>
                    </div>
                    <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 shrink-0 font-bold">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/40 text-[9px] font-mono text-slate-500 text-center flex justify-between">
                <span>Ledger signed with Root CA SHA-256 certificate</span>
                <span>Active thread: main_routing_node_A</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
