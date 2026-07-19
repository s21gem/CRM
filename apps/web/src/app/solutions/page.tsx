import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Shield, CreditCard, Globe, Lock } from 'lucide-react';

const SOLUTIONS = [
  {
    title: 'E-Passports',
    description: 'End-to-end electronic passport personalization and issuance systems built on highly secure polycarbonate substrates. Compliant with all ICAO Document 9303 standards.',
    benefits: ['Enhanced Border Security', 'Anti-Counterfeiting Measures', 'Seamless International Travel'],
    features: ['Biometric Chip Integration', 'Laser Engraving', 'Public Key Infrastructure (PKI)'],
    icon: <Shield className="w-12 h-12 text-primary" />
  },
  {
    title: 'Bank Cards',
    description: 'Secure financial card personalization solutions for commercial and central banks. Supporting EMV chip, contactless, and magnetic stripe configurations.',
    benefits: ['Fraud Reduction', 'Rapid Issuance Capabilities', 'Local Sovereignty over Cryptography'],
    features: ['EMV Certified', 'Hardware Security Modules (HSM)', 'Pin Mailer Integration'],
    icon: <CreditCard className="w-12 h-12 text-primary" />
  },
  {
    title: 'E-Visa',
    description: 'Modernized electronic visa platforms to streamline traveler pre-authorization and immigration processing at border control points.',
    benefits: ['Reduced Queue Times', 'Advanced Threat Profiling', 'Increased Tourism Revenue'],
    features: ['Online Application Portal', 'Automated Background Checks', 'QR Code Verification'],
    icon: <Globe className="w-12 h-12 text-primary" />
  },
  {
    title: 'Cybersecurity',
    description: 'Military-grade infrastructure protection and Security Operations Center (SOC) deployment tailored for critical national assets.',
    benefits: ['Zero-Day Threat Mitigation', 'Data Sovereignty Compliance', '24/7 Threat Monitoring'],
    features: ['Penetration Testing', 'Identity & Access Management (IAM)', 'Incident Response'],
    icon: <Lock className="w-12 h-12 text-primary" />
  }
];

export default function SolutionsPage() {
  return (
    <AppLayout>
      <div className="py-20 px-6 max-w-7xl mx-auto w-full">
        <SectionHeader 
          title="Enterprise & Government Solutions" 
          subtitle="Comprehensive, secure, and scalable systems tailored for critical operations." 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
          {SOLUTIONS.map((solution, i) => (
            <div key={i} className="bg-muted/30 p-8 rounded-3xl border border-border">
              <div className="mb-6">{solution.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{solution.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{solution.description}</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm uppercase tracking-wider mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {solution.features.map((feature, j) => (
                      <li key={j} className="flex items-center text-sm">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm uppercase tracking-wider mb-3">Business Benefits</h4>
                  <ul className="space-y-2">
                    {solution.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-center text-sm">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
