/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusinessArea, ArchitectureNode, ApiEndpointSpec, SecurityControl, DesignToken, SystemAuditLog } from './types';

export const BUSINESS_AREAS: BusinessArea[] = [
  {
    id: 'epassport',
    name: 'Electronic Passport Solutions',
    category: 'Identity',
    description: 'National scale identity personalization and high-security chip programming conforming to ICAO Doc 9303 standard. Handles biometric registration, laser engraving schemas, and Active Authentication (AA) / Passive Authentication (PA) chip configurations.',
    targetAgencies: ['Ministries of Foreign Affairs', 'Immigration Departments', 'National Security Agencies'],
    keyModules: ['Biometric Matcher', 'ICAO Cryptographic Packager', 'Laser Engraving Pipeline', 'LDS2 Data Structure'],
    securityLevel: 'Top Secret',
    architecturalFlow: [
      { step: 1, title: 'Biometric Enrollment', description: 'Capture high-resolution ISO/IEC 19794 compliant face images and fingerprints.' },
      { step: 2, title: 'Identity De-duplication', description: 'Cross-reference biometric signatures via highly fast 1:N AFIS search systems.' },
      { step: 3, title: 'LDS Cryptography', description: 'Sign Logical Data Structure (LDS) with country-signing private key (CSCA) using HSM.' },
      { step: 4, title: 'Laser Personalization', description: 'Secure laser etching of polycarbonate data-pages and simultaneous smartcard RF-chip flash programming.' }
    ],
    schemaSnippet: `// Passport Personalization Request Schema
export const PassportPersonalizationSchema = z.object({
  passportNumber: z.string().regex(/^[A-Z][0-9]{8}$/),
  holderName: z.object({
    givenNames: z.string().max(80),
    surname: z.string().max(80)
  }),
  biometrics: z.object({
    faceJpgB64: z.string(),
    fingerprintWsqB64: z.array(z.string()).length(2)
  }),
  dgSigningProtocol: z.enum(["ECDSA-SHA256", "ECDSA-SHA384", "RSA-4096"]),
  hsmKeyId: z.string().uuid()
});`
  },
  {
    id: 'evisa',
    name: 'Electronic Visa Systems',
    category: 'Government',
    description: 'End-to-end digital visa application, adjudication workflow, and real-time border control integration. Leverages automated security vetting against Interpol and local watchlists with cryptographic QR-code generation.',
    targetAgencies: ['Ministries of Interior', 'Border Force Command', 'Embassies and Consulates'],
    keyModules: ['Adjudication Portal', 'Vetting Orchestrator', 'Secure QR Generator', 'Border API Gateway'],
    securityLevel: 'Secret',
    architecturalFlow: [
      { step: 1, title: 'Secure Application Portal', description: 'Submit digital visa applications with multi-factor document fraud checks.' },
      { step: 2, title: 'Automated Threat Screening', description: 'Query watchlist engines via secure message bus within milliseconds.' },
      { step: 3, title: 'Consular Adjudication', description: 'Multi-tiered electronic workflow for visa officers with full auditable notes.' },
      { step: 4, title: 'Visa Cryptographic Issuance', description: 'Generate digitally signed high-density QR code for passport insertion or mobile wallets.' }
    ],
    schemaSnippet: `// Cryptographic Visa Verification Token Structure (JSON Web Signature)
export interface SecureVisaToken {
  header: { alg: "ES256"; typ: "JWS" };
  payload: {
    vNo: string;       // Visa Number
    pNo: string;       // Passport Number
    exp: number;       // Expiry timestamp
    iss: "BD-FONEBOX"; // Issuing Authority
    scopes: string[];  // Permitted entry points
  };
  signature: string;   // Cryptographic signature from Border CA
}`
  },
  {
    id: 'fintech-personalization',
    name: 'Bank Card Personalization',
    category: 'FinTech',
    description: 'High-speed payment card (EMV) customization. Features secure key exchange, contact and contactless chip profile preparation, magnetic stripe coding, and EMV 3D-secure setup in fully PCI-DSS certified environments.',
    targetAgencies: ['Central Banks', 'Commercial Retail Banks', 'Digital Challenger Banks'],
    keyModules: ['Key Management System', 'EMV Profile Engine', 'PCI Compliance Log', 'Smart Card Flasher'],
    securityLevel: 'Secret',
    architecturalFlow: [
      { step: 1, title: 'Data Encryption', description: 'Bank cardholder data received over dedicated IPSec VPN tunnel, encrypted with PGP keys.' },
      { step: 2, title: 'Key Generation', description: 'HSM derives unique EMV keys (MDK, UDK) based on proprietary master bank parameters.' },
      { step: 3, title: 'Electrical Personalization', description: 'Inject keys and program card-specific applications onto dual-interface smart chips.' },
      { step: 4, title: 'Visual Embossing', description: 'Physical printing, embossing, and laser marking of safety numbers and metallic layers.' }
    ],
    schemaSnippet: `// EMV Key Exchange Protocol (NIST SP 800-108 Derived)
export interface EMVKeyDerivation {
  masterDerivationKeyId: string;
  pan: string;
  panSequenceNumber: string;
  derivationMode: "EMV_CSN" | "EMV_NO_CSN";
  sessionEntropy: string;
}`
  },
  {
    id: 'pki-infrastructure',
    name: 'Secure PKI & Smart Card Solutions',
    category: 'Security',
    description: 'Enterprise Public Key Infrastructure (PKI) designed for national-scale digital identity cards. Operates ROOT Certificate Authority (CA) pipelines, registration databases, certificate revocation lists (CRLs), and hardware tokens.',
    targetAgencies: ['Digital Ministry Authorities', 'National ID Registries', 'National Telecommunications Commissions'],
    keyModules: ['Root CA Orchestrator', 'Online Certificate Status (OCSP)', 'Hardware Security Module integration', 'Smart Card Applet'],
    securityLevel: 'Top Secret',
    architecturalFlow: [
      { step: 1, title: 'Root CA Setup', description: 'Establish high-security offline Master Root CA inside physical Faraday cages.' },
      { step: 2, title: 'Sub-CA Issuance', description: 'Delegate online certificate issuance capabilities to specialized subordinate CAs.' },
      { step: 3, title: 'National ID Issuance', description: 'Provision citizens with multi-application smart cards supporting PKI-based electronic signatures.' },
      { step: 4, title: 'Dynamic Revocation', description: 'Run highly fast sub-millisecond OCSP query endpoints for validation servers.' }
    ],
    schemaSnippet: `// PKI Certificate Signing Request Validator (ASN.1 Structure Analogy)
export const CertSigningRequestSchema = z.object({
  commonName: z.string().min(3).max(100),
  organizationName: z.string().default("FoneBox Global Government Client"),
  subjectPublicKeyInfo: z.object({
    algorithm: z.enum(["RSA-4096", "ECDSA-P256", "ECDSA-P384"]),
    publicKeyHex: z.string().regex(/^[0-9a-fA-F]+$/)
  }),
  validityDays: z.number().int().min(365).max(3650),
  keyUsage: z.array(z.enum(["DigitalSignature", "NonRepudiation", "KeyEncipherment", "DataEncipherment"]))
});`
  },
  {
    id: 'cyber-defense',
    name: 'Enterprise Cyber Security & Zero Trust',
    category: 'Security',
    description: 'Defense-grade secure gateway architecture, secure single sign-on (SSO), and continuous contextual risk analysis. Uses PKI client certificate validation, automated network micro-segmentation, and deep audit telemetry.',
    targetAgencies: ['Defense Ministries', 'Financial Infrastructure Providers', 'Sovereign Wealth Funds'],
    keyModules: ['Zero Trust Access Gateway', 'Contextual Threat Vetting', 'Audit Logging Engine', 'Biometric SSO'],
    securityLevel: 'Top Secret',
    architecturalFlow: [
      { step: 1, title: 'Access Request Vetting', description: 'Intercept connection requests on secure gateways, checking device health and client-side certificates.' },
      { step: 2, title: 'Multi-Factor Biometrics', description: 'Require Hardware FIDO2 WebAuthn keys and facial scanning verify.' },
      { step: 3, title: 'Micro-Segmentation', description: 'Dynamically grant limited database row and endpoint permissions matching requested workflows.' },
      { step: 4, title: 'Immutable Audit Logging', description: 'Stream system action hashes to an append-only cryptographic ledger instantly.' }
    ],
    schemaSnippet: `// Immutable Audit Log Ledger Representation
export interface ImmutableLedgerBlock {
  blockNumber: number;
  timestamp: string;
  transactionHash: string; // SHA-256 of payload + previous block hash
  previousHash: string;
  payload: {
    actor: string;
    action: string;
    resource: string;
    riskScore: number;
    decision: "ALLOW" | "DENY";
  };
}`
  }
];

export const ARCHITECTURE_TREE: ArchitectureNode = {
  path: 'fonebox-enterprise-monorepo',
  name: 'fonebox-enterprise-monorepo',
  type: 'directory',
  description: 'Sovereign monorepo structure separating core services, identity-applications, shared cryptographic packages, and secure admin interfaces.',
  ownerTeam: 'Platform Architecture Board',
  complianceChecked: true,
  children: [
    {
      path: 'fonebox-enterprise-monorepo/apps',
      name: 'apps',
      type: 'directory',
      description: 'Host directory for sovereign micro-frontend dashboards and secure API gateways.',
      ownerTeam: 'Platform Engineering Team',
      complianceChecked: true,
      children: [
        {
          path: 'fonebox-enterprise-monorepo/apps/government-portal',
          name: 'government-portal',
          type: 'directory',
          description: 'Client dashboard for immigration, passport authorities, and sovereign ID management. Built on React/NextJS with client certificate authorization.',
          ownerTeam: 'Government UI Team',
          complianceChecked: true,
          children: [
            {
              path: 'fonebox-enterprise-monorepo/apps/government-portal/src',
              name: 'src',
              type: 'directory',
              description: 'Frontend modules, responsive page layouts, state managers, and biometric capture controllers.',
              ownerTeam: 'Government UI Team',
              complianceChecked: true,
            }
          ]
        },
        {
          path: 'fonebox-enterprise-monorepo/apps/secure-gateway-api',
          name: 'secure-gateway-api',
          type: 'directory',
          description: 'Main Node.js/Express full-stack proxy routing client requests to secure Core Banking and Identity registries.',
          ownerTeam: 'Security Backend Team',
          complianceChecked: true,
          children: [
            {
              path: 'fonebox-enterprise-monorepo/apps/secure-gateway-api/server.ts',
              name: 'server.ts',
              type: 'file',
              description: 'The secure server entry point enforcing IP-whitelisting, rate-limiting, CSP headers, and token evaluation.',
              ownerTeam: 'Security Backend Team',
              complianceChecked: true,
              contentSnippet: `import express from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

const app = express();
app.use(helmet()); // Set standard secure headers
app.use(express.json({ limit: "2mb" })); // Avoid large payload flood attacks

// Strict government IP subnet checking middleware
app.use((req, res, next) => {
  const sourceIp = req.ip || req.socket.remoteAddress;
  if (!isWhitelistedSubnet(sourceIp)) {
    auditLog("UNAUTHORIZED_IP_ACCESS_ATTEMPT", sourceIp);
    return res.status(403).json({ error: "Access Denied: Non-Authorized Subnet" });
  }
  next();
});`
            }
          ]
        }
      ]
    },
    {
      path: 'fonebox-enterprise-monorepo/packages',
      name: 'packages',
      type: 'directory',
      description: 'Internal shared packages compiled and versioned with strict semantic compliance.',
      ownerTeam: 'Core Architecture Board',
      complianceChecked: true,
      children: [
        {
          path: 'fonebox-enterprise-monorepo/packages/crypto-core',
          name: 'crypto-core',
          type: 'directory',
          description: 'Cryptographic primitive wraps for envelope encryption, SHA-384 message digests, and HSM communication hooks using PKCS#11 protocols.',
          ownerTeam: 'Cryptographic Security Team',
          complianceChecked: true,
          children: [
            {
              path: 'fonebox-enterprise-monorepo/packages/crypto-core/hsm-connector.ts',
              name: 'hsm-connector.ts',
              type: 'file',
              description: 'High performance integration client managing PKCS#11 sessions with hardware HSM clusters.',
              ownerTeam: 'Cryptographic Security Team',
              complianceChecked: true,
              contentSnippet: `import { PKCS11Session } from "hsm-pkcs11-interface";

export class HsmConnector {
  private sessionPool: PKCS11Session[] = [];
  
  public async executeDigitalSignature(keyLabel: string, rawData: Buffer): Promise<Buffer> {
    const session = await this.acquireSession();
    try {
      const privateKeyHandle = await session.findPrivateKey(keyLabel);
      const signature = await session.signData("ECDSA-SHA384", privateKeyHandle, rawData);
      return signature;
    } finally {
      this.releaseSession(session);
    }
  }
}`
            }
          ]
        },
        {
          path: 'fonebox-enterprise-monorepo/packages/validation-schemas',
          name: 'validation-schemas',
          type: 'directory',
          description: 'Single source of truth for Zod schemas representing government metadata, biometric records, and API inputs.',
          ownerTeam: 'Data Compliance Board',
          complianceChecked: true,
        }
      ]
    },
    {
      path: 'fonebox-enterprise-monorepo/shared',
      name: 'shared',
      type: 'directory',
      description: 'Shared constants, international standards codes, and environment checks.',
      ownerTeam: 'Platform Team',
      complianceChecked: true,
    }
  ]
};

export const API_ENDPOINTS: ApiEndpointSpec[] = [
  {
    id: 'enroll-passport',
    method: 'POST',
    path: '/api/v1/identity/passport/enroll',
    summary: 'Sovereign Passport Enrollment',
    description: 'Submits biometrics and demographic information to begin the cryptographicLogical Data Structure preparation pipeline. Invokes immediate HSM signing verification.',
    requiredRole: 'GOVERNMENT_ADMIN',
    requestBody: `{
  "citizenNationalId": "NID-948576839",
  "fullName": "Jane Doe",
  "birthCountry": "BGD",
  "biometricPayload": {
    "faceJpgB64": "...",
    "fingerprints": ["...", "..."]
  }
}`,
    successResponse: `{
  "status": "QUEUED_FOR_PERSONALIZATION",
  "enrollmentToken": "tok_ep_948a73bc6",
  "icaoHashDigest": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
  "timestamp": "2026-07-19T18:00:48Z"
}`
  },
  {
    id: 'sign-lds',
    method: 'POST',
    path: '/api/v1/crypto/hsm/sign-lds',
    summary: 'Hardware Security Module LDS Sign',
    description: 'Transfers derived document logical data blocks to the FIPS 140-3 HSM cluster to apply the official Country-Signing CA signature.',
    requiredRole: 'SYSTEM_AUDITOR',
    requestBody: `{
  "documentHash": "4fa83cb20e6a1d8487...",
  "targetKeyLabel": "csca_rsa_4096_key_2026",
  "integrityDigestAlg": "SHA-384"
}`,
    successResponse: `{
  "signatureAlgorithm": "RSA-SHA384",
  "cryptographicSignature": "a3b90f427cd...",
  "hsmHardwareSerial": "HSM-NIST-9485",
  "auditLogId": "log_aud_091b7e"
}`
  },
  {
    id: 'verify-visa',
    method: 'GET',
    path: '/api/v1/border/visa/verify/:visaNumber',
    summary: 'Real-Time Border Visa Check',
    description: 'Instant validation of a issued electronic visa signature. Called by terminal checkpoint gate servers globally.',
    requiredRole: 'ENTERPRISE_OPERATOR',
    successResponse: `{
  "isValid": true,
  "visaNumber": "V-9048512",
  "holderPassport": "A94827163",
  "allowedEntryBefore": "2027-01-01T23:59:59Z",
  "visaClass": "D-CLASS-DIPLOMATIC",
  "pkiVerificationStatus": "CSCA_VALIDATED"
}`
  },
  {
    id: 'hsm-key-rotation',
    method: 'POST',
    path: '/api/v1/crypto/hsm/key-rotation',
    summary: 'Force Cryptographic Root Key Rotation',
    description: 'Requires multi-signature physical card verification to rotate operational sub-CA signing profiles inside HSM pools.',
    requiredRole: 'ROOT_SUPERUSER',
    requestBody: `{
  "initiatorKeyId": "root_ops_01",
  "witnessMultiSigIds": ["witness_ops_04", "witness_ops_09"],
  "authorizedTokenHex": "0efd84b2c1..."
}`,
    successResponse: `{
  "rotationStatus": "COMPLETED",
  "activeKeyAlias": "csca_rsa_4096_key_2027",
  "retiredKeyAlias": "csca_rsa_4096_key_2026",
  "revocationPublished": true,
  "mfaTokensChecked": 3
}`
  }
];

export const SECURITY_CONTROLS: SecurityControl[] = [
  {
    id: 'sc-01',
    title: 'Hardware Security Modules (HSM)',
    principle: 'Root of Trust Key Isolation',
    standard: 'FIPS 140-3 Level 4',
    status: 'ENFORCED',
    description: 'All cryptographic keys used for passport document signing, national ID certification, and bank EMV profile derivations reside exclusively within physical Hardware Security Modules. Keys can never be extracted into software memory pools.'
  },
  {
    id: 'sc-02',
    title: 'Zero Trust Authorization Pipelines',
    principle: 'Context-Aware Network Segmentation',
    standard: 'NIST SP 800-207',
    status: 'IMPLEMENTED',
    description: 'User access is determined by contextual signals: verified IP CIDR blocks, client-side TLS certificates (mTLS), active hardware FIDO2 credentials, and dynamic risk scoring before any gateway executes queries.'
  },
  {
    id: 'sc-03',
    title: 'PCI-DSS Compliant EMV Personalization',
    principle: 'Sensitive Payment Data Protection',
    standard: 'PCI-DSS v4.0 Level 1',
    status: 'AUDITED',
    description: 'Customer credit and debit primary account numbers (PAN) are encrypted both in-transit and at-rest using AES-GCM-256 envelope encryption, with key access partitioned exclusively to secure EMV profile prep runtimes.'
  },
  {
    id: 'sc-04',
    title: 'Cryptographic Audit Trails',
    principle: 'Non-Repudiation Logging',
    standard: 'ISO/IEC 27001:2022',
    status: 'ENFORCED',
    description: 'Every critical system event, administrative access, API call, and key authorization generates an entry in an append-only transaction ledger signed with the system CA private key, establishing mathematical non-repudiation.'
  }
];

export const DESIGN_TOKENS: DesignToken[] = [
  { name: '--color-brand-deep', value: '#0B132B', type: 'color', usage: 'Primary background for dark mode, headers, and supreme priority banners.' },
  { name: '--color-brand-royal', value: '#1C3144', type: 'color', usage: 'Primary color tone for corporate surfaces, panel titles, and structural side rails.' },
  { name: '--color-brand-indigo', value: '#3F88C5', type: 'color', usage: 'Interactive state outlines, secondary badges, and selection highlighters.' },
  { name: '--color-brand-electric', value: '#0076FF', type: 'color', usage: 'Action highlights, button fills, and primary interactive typography accents.' },
  { name: '--font-sans', value: '"Inter", sans-serif', type: 'typography', usage: 'General reading UI, inputs, structural metadata tables, and system forms.' },
  { name: '--font-display', value: '"Space Grotesk", sans-serif', type: 'typography', usage: 'Executive dashboard numbers, high-level screen titles, and enterprise branding.' },
  { name: '--font-mono', value: '"JetBrains Mono", monospace', type: 'typography', usage: 'Raw API responses, database schemas, cryptographic signatures, and audit timestamps.' }
];

export const INITIAL_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'sys_aud_001',
    timestamp: '2026-07-19T17:54:12Z',
    actor: 'system-gateway-01',
    action: 'HSM_INTEGRITY_CHECK',
    status: 'SUCCESS',
    payload: 'All 4 secure modules reported online. Latency < 1.2ms. Session pools primed.'
  },
  {
    id: 'sys_aud_002',
    timestamp: '2026-07-19T17:55:01Z',
    actor: 'admin_officer_maddox',
    action: 'CSCA_KEY_VERIFICATION',
    status: 'SUCCESS',
    payload: 'Validated certificate signature path for root authority of passport chip generation.'
  },
  {
    id: 'sys_aud_003',
    timestamp: '2026-07-19T17:56:45Z',
    actor: 'api_client_border_check',
    action: 'VISA_CHECK_REQUEST',
    status: 'SUCCESS',
    payload: 'Visa Verification: V-9048512 verified successfully. Gateway signature checked.'
  },
  {
    id: 'sys_aud_004',
    timestamp: '2026-07-19T17:59:18Z',
    actor: 'hsm_auth_pipeline',
    action: 'KEY_ROTATION_TEST_DRY_RUN',
    status: 'SUCCESS',
    payload: 'Dry run completed successfully. Subordinated CAs are synchronized with FIPS boundaries.'
  }
];
