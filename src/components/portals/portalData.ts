// ENTERPRISE DATASETS LOCALIZED FOR GLOBAL PLATFORM
export interface Organization {
  id: string;
  name: string;
  sector: string;
  country: string;
  securityClearance: string;
  status: string;
  assignedManager: string;
  contactCount: number;
  totalDealValue: number;
}
export interface Contact {
  id: string;
  name: string;
  title: string;
  organizationId: string;
  orgName: string;
  email: string;
  phone: string;
  clearanceLevel: string;
  status: string;
}
export interface Lead {
  id: string;
  companyName: string;
  sector: string;
  country: string;
  contactPerson: string;
  email: string;
  value: number;
  status: string;
  confidence: number;
  source: string;
  createdDate: string;
}
export interface Opportunity {
  id: string;
  title: string;
  orgId: string;
  orgName: string;
  value: number;
  stage: string;
  probability: number;
  closeDate: string;
  leadSource: string;
  lastUpdated: string;
}
export interface Project {
  id: string;
  name: string;
  orgId: string;
  orgName: string;
  category: string;
  status: string;
  budget: number;
  spent: number;
  startDate: string;
  targetDate: string;
  completionPercentage: number;
  securityLevel: string;
  milestones: any[];
}
export interface SupportCase {
  id: string;
  title: string;
  orgName: string;
  severity: string;
  status: string;
  assignedTo: string;
  createdDate: string;
  updatedDate: string;
  category: string;
}
export interface Invoice {
  id: string;
  orgName: string;
  projectName: string;
  amount: number;
  issuedDate: string;
  dueDate: string;
  status: string;
  paymentMethod: string;
  transactionHash: string;
}

export const ORGANIZATIONS: Organization[] = [
  {
    id: 'org_001',
    name: 'Global Finance Corp',
    sector: 'Financial',
    country: 'United States',
    securityClearance: 'Top Secret',
    status: 'Active',
    assignedManager: 'Michael Chang',
    contactCount: 14,
    totalDealValue: 4800000,
  },
  {
    id: 'org_002',
    name: 'International Ministry of Interior',
    sector: 'Government',
    country: 'United Kingdom',
    securityClearance: 'Top Secret',
    status: 'Active',
    assignedManager: 'Sarah Jenkins',
    contactCount: 19,
    totalDealValue: 9500000,
  },
  {
    id: 'org_003',
    name: 'World Tech Bank',
    sector: 'Financial',
    country: 'Switzerland',
    securityClearance: 'Top Secret',
    status: 'Active',
    assignedManager: 'Sarah Jenkins',
    contactCount: 11,
    totalDealValue: 6200000,
  },
  {
    id: 'org_004',
    name: 'Global ICT Division',
    sector: 'Government',
    country: 'Singapore',
    securityClearance: 'Top Secret',
    status: 'Active',
    assignedManager: 'Michael Chang',
    contactCount: 8,
    totalDealValue: 3500000,
  },
  {
    id: 'org_005',
    name: 'NEXUS Global Airlines',
    sector: 'Corporate',
    country: 'Germany',
    securityClearance: 'Secret',
    status: 'Active',
    assignedManager: 'Robert Williams',
    contactCount: 15,
    totalDealValue: 2800000,
  },
];

export const CONTACTS: Contact[] = [
  {
    id: 'con_001',
    name: 'General Arthur Pendelton',
    title: 'Director, Border Security',
    organizationId: 'org_002',
    orgName: 'International Ministry of Interior',
    email: 'arthur.p@interior.gov.uk',
    phone: '+44 20 7946 0958',
    clearanceLevel: 'Top Secret',
    status: 'Active',
  },
  {
    id: 'con_002',
    name: 'Dr. Elizabeth Chen',
    title: 'Executive Director, Payments',
    organizationId: 'org_003',
    orgName: 'World Tech Bank',
    email: 'e.chen@worldtechbank.ch',
    phone: '+41 44 213 4567',
    clearanceLevel: 'Top Secret',
    status: 'Active',
  },
  {
    id: 'con_003',
    name: 'William Foster',
    title: 'Chief Information Security Officer',
    organizationId: 'org_001',
    orgName: 'Global Finance Corp',
    email: 'wfoster@globalfinance.com',
    phone: '+1 212 555 0198',
    clearanceLevel: 'Top Secret',
    status: 'Active',
  },
  {
    id: 'con_004',
    name: 'David Schmidt',
    title: 'Head of IT Infrastructure',
    organizationId: 'org_005',
    orgName: 'NEXUS Global Airlines',
    email: 'd.schmidt@nexus.de',
    phone: '+49 69 1234 5678',
    clearanceLevel: 'Secret',
    status: 'Active',
  },
];

export const LEADS: Lead[] = [
  {
    id: 'lead_001',
    companyName: 'EuroBank Group',
    sector: 'Financial',
    country: 'France',
    contactPerson: 'Jean-Paul Dubois',
    email: 'jdubois@eurobank.fr',
    value: 1850000,
    status: 'Proposal Sent',
    confidence: 75,
    source: 'Global FinTech Summit',
    createdDate: '2026-05-12',
  },
  {
    id: 'lead_002',
    companyName: 'Oceanic Transport Authority',
    sector: 'Government',
    country: 'Australia',
    contactPerson: 'Emma Watson',
    email: 'ewatson@ota.gov.au',
    value: 4200000,
    status: 'Qualified',
    confidence: 60,
    source: 'Gov Data Center RFP',
    createdDate: '2026-06-02',
  },
];

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp_001',
    title: 'Global E-Passport Core Implementation',
    orgId: 'org_002',
    orgName: 'International Ministry of Interior',
    value: 9500000,
    stage: 'Negotiation',
    probability: 80,
    closeDate: '2026-09-30',
    leadSource: 'B2B Tender',
    lastUpdated: '2026-07-20',
  },
  {
    id: 'opp_002',
    title: 'Cloud HSM Infrastructure Upgrade',
    orgId: 'org_003',
    orgName: 'World Tech Bank',
    value: 6200000,
    stage: 'Procurement',
    probability: 95,
    closeDate: '2026-08-01',
    leadSource: 'Compliance Directive',
    lastUpdated: '2026-07-17',
  },
];

export const CRM_MEETINGS = [
  {
    id: 'meet_001',
    title: 'ICAO Laser Personalization Vetting Review',
    date: '2026-07-20',
    time: '10:30 AM',
    orgName: 'International Ministry of Interior',
    location: 'London HQ, Level 6',
    status: 'Scheduled',
    attendees: ['General Arthur Pendelton', 'Sarah Jenkins'],
  },
  {
    id: 'meet_002',
    title: 'PKI HSM Core Key Ceremony Prep',
    date: '2026-07-22',
    time: '02:00 PM',
    orgName: 'World Tech Bank',
    location: 'Geneva Datacenter Room B',
    status: 'Scheduled',
    attendees: ['Dr. Elizabeth Chen', 'Robert Williams'],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'proj_001',
    name: 'Global e-Passport Personalization Line Overhaul',
    orgId: 'org_002',
    orgName: 'International Ministry of Interior',
    category: 'Border Security & Identity',
    status: 'In Progress',
    budget: 9500000,
    spent: 4100000,
    startDate: '2025-06-01',
    targetDate: '2027-01-15',
    completionPercentage: 65,
    securityLevel: 'Top Secret (Level 4)',
    milestones: [
      {
        id: 'ms_101',
        title: 'Offline PKI Root key ceremony',
        dueDate: '2025-08-15',
        status: 'Completed',
      },
      {
        id: 'ms_102',
        title: 'Hardware production line installation',
        dueDate: '2026-02-10',
        status: 'Completed',
      },
      {
        id: 'ms_103',
        title: 'Live testing of chip personalization',
        dueDate: '2026-08-01',
        status: 'In Progress',
      },
    ],
  },
  {
    id: 'proj_002',
    name: 'Federal Reserve PKI Infrastructure',
    orgId: 'org_001',
    orgName: 'Global Finance Corp',
    category: 'Financial Security',
    status: 'In Progress',
    budget: 4800000,
    spent: 3000000,
    startDate: '2025-09-01',
    targetDate: '2026-11-30',
    completionPercentage: 70,
    securityLevel: 'Top Secret (Level 4)',
    milestones: [],
  },
];

export const SUPPORT_CASES: SupportCase[] = [
  {
    id: 'cas_001',
    title: 'FIPS 140-3 HSM pool sync drift alarm',
    orgName: 'World Tech Bank',
    severity: 'CRITICAL',
    status: 'Investigating',
    assignedTo: 'Chief Operator Robert',
    createdDate: '2026-07-19 14:22',
    updatedDate: '2026-07-19 17:15',
    category: 'Hardware Security Module',
  },
  {
    id: 'cas_002',
    title: 'Smart gate 1:N biometric matcher lookup delay',
    orgName: 'International Ministry of Interior',
    severity: 'High',
    status: 'HSM Verification',
    assignedTo: 'Sarah Jenkins',
    createdDate: '2026-07-18 09:12',
    updatedDate: '2026-07-19 11:30',
    category: 'Biometric Matcher',
  },
];

export const INVOICES: Invoice[] = [
  {
    id: 'inv_001',
    orgName: 'World Tech Bank',
    projectName: 'National Smart Cryptographic Infrastructure',
    amount: 4500000,
    issuedDate: '2026-06-15',
    dueDate: '2026-07-15',
    status: 'Paid',
    paymentMethod: 'SWIFT Transfer',
    transactionHash: '0x8f2d9c44bb...',
  },
  {
    id: 'inv_002',
    orgName: 'Global Finance Corp',
    projectName: 'Cyber Defense Architecture',
    amount: 2800000,
    issuedDate: '2026-07-01',
    dueDate: '2026-07-30',
    status: 'Pending',
    paymentMethod: 'Pending',
    transactionHash: '',
  },
];

export const API_KEYS = [
  {
    id: 'key_001',
    name: 'Production e-Visa Gateway',
    tokenPreview: 'fn_live_8x99a...',
    role: 'Read/Write',
    status: 'Active',
    createdDate: '2026-01-15',
    expiryDate: '2027-01-15',
    callsCount: 14509200,
  },
  {
    id: 'key_002',
    name: 'Biometric Matcher Sync API',
    tokenPreview: 'fn_live_3b41c...',
    role: 'Admin',
    status: 'Active',
    createdDate: '2025-11-10',
    expiryDate: '2026-11-10',
    callsCount: 8904500,
  },
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log_001',
    timestamp: '2026-07-20 08:14:02',
    actor: 'SysAdmin (Michael)',
    action: 'HSM Node Reboot',
    status: 'SUCCESS',
    payload: 'Node: NY-DC-04',
  },
  {
    id: 'log_002',
    timestamp: '2026-07-20 09:30:15',
    actor: 'Sarah Jenkins',
    action: 'Update Project SLA',
    status: 'SUCCESS',
    payload: 'Project: proj_001, Target Date adjusted',
  },
];

export const ANNOUNCEMENTS = [
  {
    id: 'ann_001',
    title: 'System Maintenance: New York Datacenter',
    date: '2026-07-25',
    category: 'Maintenance',
    content:
      'We will be performing scheduled firmware upgrades on our primary FIPS 140-3 HSM clusters in the New York region.',
  },
  {
    id: 'ann_002',
    title: 'ISO 27001 Re-certification Successful',
    date: '2026-07-10',
    category: 'Compliance',
    content:
      'FoneBox Global has successfully renewed its ISO 27001 and SOC 2 Type II certifications for all global operations.',
  },
];

export const KNOWLEDGE_BASE_ARTICLES = [
  {
    id: 'kb_001',
    title: 'How to rotate your API Keys securely',
    category: 'Security',
    rating: 4.8,
    views: 1240,
  },
  {
    id: 'kb_002',
    title: 'Understanding HSM Sync Drift Alerts',
    category: 'Troubleshooting',
    rating: 4.5,
    views: 890,
  },
];

export interface EnterpriseUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}
export interface EnterpriseApiKey {
  id: string;
  name: string;
  tokenPreview: string;
  role: string;
  status: string;
  createdDate: string;
  expiryDate: string;
  callsCount: number;
}
export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  status: string;
  payload: string;
}

export const ENTERPRISE_USERS: EnterpriseUser[] = [
  {
    id: 'usr_001',
    name: 'Super Admin',
    email: 'admin@foneboxglobal.com',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: '2026-07-21',
  },
];
