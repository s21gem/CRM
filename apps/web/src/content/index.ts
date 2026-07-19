export const SERVICES = [
  {
    id: 'phone-repair',
    title: 'Phone Repair',
    description: 'Expert repair services for all major smartphone brands. Screen replacement, battery issues, and logic board micro-soldering.',
    icon: 'Smartphone',
    href: '/services/phone-repair'
  },
  {
    id: 'tablet-repair',
    title: 'Tablet Repair',
    description: 'Comprehensive repair solutions for iPads and Android tablets. Broken glass, charge port replacement, and data recovery.',
    icon: 'Tablet',
    href: '/services/tablet-repair'
  },
  {
    id: 'laptop-repair',
    title: 'Laptop Repair',
    description: 'Professional servicing for MacBooks and Windows laptops. Hardware upgrades, thermal maintenance, and OS recovery.',
    icon: 'Laptop',
    href: '/services/laptop-repair'
  },
  {
    id: 'data-recovery',
    title: 'Data Recovery',
    description: 'Advanced forensic data recovery for dead drives, liquid-damaged logic boards, and corrupted flash storage.',
    icon: 'Database',
    href: '/services/data-recovery'
  }
];

export const BUSINESS_SOLUTIONS = [
  {
    id: 'corporate',
    title: 'Corporate Repair',
    description: 'Dedicated account managers and priority turnaround for enterprise device fleets.',
  },
  {
    id: 'bulk-management',
    title: 'Bulk Device Management',
    description: 'Lifecycle management, MDM deployment, and secure wiping for retiring hardware.',
  },
  {
    id: 'amc',
    title: 'Annual Maintenance Contracts',
    description: 'Predictable IT maintenance costs with SLA-backed response times.',
  }
];

export const PRICING_TIERS = [
  {
    title: 'Standard Repair',
    price: 'Starting from $79',
    features: ['Diagnostic Service', 'OEM Parts', '90-Day Warranty', 'Standard Turnaround'],
    cta: 'Get a Quote',
    href: '/contact'
  },
  {
    title: 'Express Repair',
    price: 'Starting from $129',
    features: ['Skip the Line', 'OEM Parts', '1-Year Warranty', 'Same Day Turnaround'],
    cta: 'Book Express',
    href: '/contact',
    popular: true
  },
  {
    title: 'Business AMC',
    price: 'Custom Quote',
    features: ['Dedicated Account Manager', 'On-Site Service', 'Priority Parts Allocation', 'SLA Guarantees'],
    cta: 'Contact Sales',
    href: '/business'
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    company: 'TechFlow Inc.',
    role: 'IT Director',
    quote: 'FoneBox saved our quarterly deployment when 50 of our field iPads were damaged. Their bulk repair turnaround is unmatched in the industry.',
  },
  {
    id: 2,
    name: 'David Chen',
    company: '',
    role: 'Customer',
    quote: 'They recovered 10 years of family photos from my water-damaged iPhone after Apple told me it was completely impossible. Absolute lifesavers.',
  }
];

export const FAQS = [
  {
    question: 'How long does a standard screen repair take?',
    answer: 'Most standard smartphone screen repairs can be completed within 1-2 hours if the parts are in stock. For tablets and laptops, it generally takes 24-48 hours.'
  },
  {
    question: 'Do you offer a warranty on your repairs?',
    answer: 'Yes, we offer a standard 90-day warranty on all parts and labor. Express and Enterprise repairs come with an extended 1-year warranty.'
  },
  {
    question: 'Do you use original OEM parts?',
    answer: 'We offer both OEM (Original Equipment Manufacturer) and high-quality aftermarket parts depending on your budget. We will always clearly communicate which parts are being used for your repair.'
  },
  {
    question: 'How does your business bulk repair program work?',
    answer: 'Our business program offers discounted tiered pricing, priority SLAs, net-30 payment terms, and a dedicated account manager for fleets of 10+ devices.'
  }
];
