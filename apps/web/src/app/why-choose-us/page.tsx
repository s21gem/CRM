import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTABanner } from '@/components/ui/CTABanner';

export const metadata = {
  title: 'Why Choose Us | FoneBox',
  description: 'Why enterprises trust FoneBox with their hardware lifecycle management.',
};

export default function WhyChooseUsPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Why Choose FoneBox"
          subtitle="Uncompromising security, original parts, and unmatched enterprise SLA commitments."
        />
        
        <div className="mt-16 prose prose-lg dark:prose-invert max-w-4xl mx-auto mb-20">
          <h3>Data Security First</h3>
          <p>Unlike retail repair shops, FoneBox operates under strict ISO 27001 data security compliance. Your corporate data never leaves our secure environment, and all technicians undergo rigorous background checks.</p>
          
          <h3>Enterprise SLAs</h3>
          <p>We understand that a broken laptop isn&apos;t just an inconvenience&mdash;it&apos;s lost productivity. Our business clients benefit from guaranteed next-business-day turnaround on critical fleet repairs.</p>
        </div>

        <CTABanner 
          title="Switch to FoneBox Enterprise"
          description="Protect your hardware investments with a partner that understands business."
          ctaText="Contact Sales"
          href="/contact"
        />
      </div>
    </div>
  );
}
