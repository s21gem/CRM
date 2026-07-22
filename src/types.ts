/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  payload: string;
}

export interface BusinessArea {
  id: string;
  name: string;
  category: 'Identity' | 'FinTech' | 'Security' | 'Government';
  description: string;
  targetAgencies: string[];
  keyModules: string[];
  securityLevel: 'Secret' | 'Top Secret' | 'Restricted' | 'Confidential';
  architecturalFlow: {
    step: number;
    title: string;
    description: string;
  }[];
  schemaSnippet: string;
}

export interface ArchitectureNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  description: string;
  ownerTeam: string;
  complianceChecked: boolean;
  contentSnippet?: string;
  children?: ArchitectureNode[];
}

export interface ApiEndpointSpec {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  requiredRole: 'GOVERNMENT_ADMIN' | 'ENTERPRISE_OPERATOR' | 'SYSTEM_AUDITOR' | 'ROOT_SUPERUSER';
  requestBody?: string;
  successResponse: string;
}

export interface SecurityControl {
  id: string;
  title: string;
  principle: string;
  standard: string; // ISO 27001, SOC 2, NIST, FIPS 140-3
  status: 'IMPLEMENTED' | 'ENFORCED' | 'AUDITED';
  description: string;
}

export interface DesignToken {
  name: string;
  value: string;
  type: 'color' | 'typography' | 'spacing' | 'shadow';
  usage: string;
}
