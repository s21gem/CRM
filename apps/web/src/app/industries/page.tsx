import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Building2, Landmark, Briefcase, Network, HardHat, FileCheck } from 'lucide-react';

const INDUSTRIES = [
  {
    title: 'Government',
    description: 'National-level identity, security, and digital transformation infrastructure.',
    icon: <Landmark className="w-8 h-8" />
  },
  {
    title: 'Immigration & Border Control',
    description: 'E-Visa and automated biometric gate systems for seamless traveler processing.',
    icon: <FileCheck className="w-8 h-8" />
  },
  {
    title: 'Financial Institutions',
    description: 'Secure payment gateways and EMV card issuance for commercial banks.',
    icon: <Building2 className="w-8 h-8" />
  },
  {
    title: 'Central Banks',
    description: 'National transaction switching and sovereign cryptographic management.',
    icon: <Briefcase className="w-8 h-8" />
  },
  {
    title: 'National ID Authorities',
    description: 'Centralized biometric registries and deduplication infrastructure.',
    icon: <Network className="w-8 h-8" />
  },
  {
    title: 'Large Enterprises',
    description: 'Cybersecurity integration and secure identity access management (IAM).',
    icon: <HardHat className="w-8 h-8" />
  }
];

export default function IndustriesPage() {
  return (
    <AppLayout>
      <div className="py-20 px-6 max-w-7xl mx-auto w-full">
        <SectionHeader 
          title="Industries We Serve" 
          subtitle="Empowering critical sectors with secure, scalable, and sovereign technology solutions." 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {INDUSTRIES.map((industry, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-background border border-border hover:border-primary transition-colors cursor-default shadow-sm hover:shadow-md">
              <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {industry.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{industry.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{industry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
