import { SectionHeader } from '@/components/ui/SectionHeader';
import { PricingCard } from '@/components/ui/PricingCard';
import { PRICING_TIERS } from '@/content';

export const metadata = {
  title: 'Enterprise Pricing | FoneBox',
  description: 'Transparent pricing and SLA-backed maintenance contracts.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Transparent Enterprise Pricing"
          subtitle="From one-off executive repairs to full fleet Annual Maintenance Contracts."
        />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier, idx) => (
            <PricingCard 
              key={idx}
              title={tier.title}
              price={tier.price}
              features={tier.features}
              cta={tier.cta}
              href={tier.href}
              popular={tier.popular}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
