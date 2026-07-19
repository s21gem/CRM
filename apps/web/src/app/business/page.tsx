import { SectionHeader } from '@/components/ui/SectionHeader';
import { LeadCaptureForm } from '@/components/ui/forms/LeadCaptureForm';
import { FeatureGrid } from '@/components/ui/FeatureGrid';
import { BUSINESS_SOLUTIONS } from '@/content';

export const metadata = {
  title: 'Enterprise Business Solutions | FoneBox',
  description: 'Scale your hardware management with our corporate repair solutions and SLAs.',
};

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Enterprise Business Solutions"
          subtitle="Keep your workforce operational with our SLA-backed hardware management programs."
        />
        
        <div className="mt-12 flex justify-center mb-16">
          <img 
            src="/images/business/corporate-support-v1.png" 
            alt="Corporate Support" 
            className="w-full max-w-4xl rounded-2xl shadow-xl border border-border"
          />
        </div>

        <div className="mt-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-8 border border-border mb-20">
          <FeatureGrid 
            features={BUSINESS_SOLUTIONS.map(sol => ({
              title: sol.title,
              description: sol.description,
              icon: <span className="text-2xl">🏢</span>
            }))}
          />
        </div>

        <div className="max-w-3xl mx-auto">
          <LeadCaptureForm 
            type="business" 
            title="Request Business Consultation" 
            subtitle="Speak with an enterprise account manager today."
          />
        </div>
      </div>
    </div>
  );
}
