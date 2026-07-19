import { SectionHeader } from '@/components/ui/SectionHeader';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { FAQS } from '@/content';

export const metadata = {
  title: 'FAQ | FoneBox',
  description: 'Frequently asked questions about our hardware repair and management services.',
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader 
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about our services, pricing, and enterprise solutions."
        />
        
        <div className="mt-12">
          <FAQAccordion faqs={FAQS} />
        </div>
      </div>
    </div>
  );
}
