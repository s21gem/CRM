export const LEAD_TYPE_LABELS: Record<string, string> = {
  GENERAL_INQUIRY: 'General ICT Inquiry',
  QUOTE_REQUEST: 'Identity & E-Passport',
  REPAIR_REQUEST: 'E-Visa Systems',
  BUSINESS_CONSULTATION: 'Bank Card & Cybersecurity',
};

export const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: 'New Inquiry',
  CONTACTED: 'Qualification',
  IN_PROGRESS: 'Proposal & Evaluation',
  CONVERTED: 'Contract Awarded',
  LOST: 'Lost',
};

export const CUSTOMER_TYPE_LABELS: Record<string, string> = {
  INDIVIDUAL: 'Government / Institutional',
  BUSINESS: 'Corporate / Enterprise',
};

export const INQUIRY_CATEGORY_LABELS: Record<string, string> = {
  SALES: 'Passport Personalization',
  SUPPORT: 'Visa System',
  REPAIR: 'Card Issuance',
  CORPORATE: 'Cybersecurity',
  BILLING: 'Identity Management',
  OTHER: 'Other ICT Solutions',
};

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  NEW: 'Implementation Planning',
  INSPECTING: 'Requirements Gathering',
  DIAGNOSING: 'Design & Architecture',
  WAITING_APPROVAL: 'Awaiting Sign-off',
  APPROVED: 'Approved for Build',
  WAITING_PARTS: 'Awaiting Hardware',
  IN_REPAIR: 'Implementation',
  ON_HOLD: 'On Hold',
  QUALITY_CHECK: 'UAT / QA',
  READY_FOR_PICKUP: 'Go Live Readiness',
  DELIVERED: 'Go Live',
  CANCELLED: 'Cancelled',
  CLOSED: 'Closed',
};

export const BRANDING = {
  name: 'FoneBox',
  tagline: 'Secure Government ICT Solutions',
  description: 'Trusted ICT solutions for governments and corporations, specializing in secure identity, fintech systems, and cybersecurity integration worldwide.',
  email: 'enterprise@fonebox.us',
  phone: '+1 (800) SECURE-ICT'
};
