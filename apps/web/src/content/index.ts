export const SERVICES = [
  {
    id: 'e-passport',
    title: 'E-Passport Personalization',
    description: 'End-to-end secure electronic passport solutions adhering to ICAO standards, featuring advanced biometric integration and high-security polycarbonate data pages.',
    icon: 'Shield',
    href: '/services/e-passport'
  },
  {
    id: 'e-visa',
    title: 'E-Visa Systems',
    description: 'Modern, highly scalable electronic visa systems designed for immigration authorities to streamline traveler processing and enhance border security.',
    icon: 'Globe',
    href: '/services/e-visa'
  },
  {
    id: 'bank-card',
    title: 'Secure Bank Card Issuance',
    description: 'EMV-certified smart card personalization systems for financial institutions, ensuring secure cryptographic key management and rapid issuance.',
    icon: 'CreditCard',
    href: '/services/bank-card'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Integration',
    description: 'Military-grade infrastructure protection, SOC (Security Operations Center) deployment, and compliance with international data sovereignty laws.',
    icon: 'Lock',
    href: '/services/cybersecurity'
  }
];

export const BUSINESS_SOLUTIONS = [
  {
    id: 'government',
    title: 'Government Identity & Citizen Management',
    description: 'National ID systems, driver\'s licenses, and centralized identity registries with robust deduplication capabilities.',
  },
  {
    id: 'financial',
    title: 'Fintech Infrastructure',
    description: 'Deploying secure transaction switching, payment gateways, and banking core integrations for central banks and commercial institutions.',
  },
  {
    id: 'consulting',
    title: 'Strategic Security Consulting',
    description: 'Enterprise architecture design, penetration testing, and IT modernization for highly regulated industries.',
  }
];

export const PRICING_TIERS = [
  {
    title: 'Pilot Deployment',
    price: 'Custom Scope',
    features: ['Requirements Analysis', 'Proof of Concept (PoC)', 'Security Audit', 'Initial Hardware Setup'],
    cta: 'Request Consultation',
    href: '/contact'
  },
  {
    title: 'Enterprise Rollout',
    price: 'Contract Based',
    features: ['Full System Integration', 'Custom Software Dev', 'ISO-Certified Security', 'Turnkey Implementation'],
    cta: 'Speak to Sales',
    href: '/contact',
    popular: true
  },
  {
    title: 'Managed Services & Support',
    price: 'Annual Contract',
    features: ['24/7 Priority SLA', 'On-Site Engineering', 'Hardware Lifecycle Management', 'Continuous Updates'],
    cta: 'View SLAs',
    href: '/business'
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ministry of Interior',
    company: 'National Government',
    role: 'Director of Immigration',
    quote: 'FoneBox revolutionized our national border control systems. The E-Visa integration reduced processing times by 40% while significantly elevating our security posture.',
  },
  {
    id: 2,
    name: 'Dr. James Okafor',
    company: 'Pan-African Commercial Bank',
    role: 'Chief Technology Officer',
    quote: 'The EMV card personalization center deployed by FoneBox achieved 99.99% uptime in its first year, enabling us to securely issue millions of cards locally.',
  }
];

export const FAQS = [
  {
    question: 'Are your Identity Solutions compliant with international standards?',
    answer: 'Yes, all FoneBox identity solutions, including E-Passports and National IDs, strictly adhere to ICAO (International Civil Aviation Organization) Document 9303 standards and ISO/IEC 14443 for secure documents.'
  },
  {
    question: 'What is the typical deployment timeline for a national E-Visa system?',
    answer: 'A standard deployment ranges from 6 to 12 months depending on existing infrastructure, data migration requirements, and legislative frameworks. We provide a detailed roadmap during the initial discovery phase.'
  },
  {
    question: 'Do you provide local capacity building and training?',
    answer: 'Absolutely. We believe in knowledge transfer. Every enterprise deployment includes comprehensive training programs for local engineers, administrators, and operators to ensure self-sufficiency.'
  },
  {
    question: 'How do you handle data sovereignty and localization?',
    answer: 'FoneBox designs solutions that keep sovereign data within national borders. We build on-premise data centers and secure private clouds that comply with your country\'s specific data privacy regulations.'
  }
];
