import { SectionHeader } from '@/components/ui/SectionHeader';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { SERVICES } from '@/content';

export const metadata = {
  title: 'Hardware Repair Services | FoneBox',
  description: 'Professional hardware repair services for phones, tablets, laptops, and data recovery.',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Enterprise Hardware Services"
          subtitle="Precision repairs backed by enterprise SLAs."
        />
        
        <div className="mt-12 flex justify-center mb-16">
          <img 
            src="/images/services/phone-repair-v1.png" 
            alt="Hardware Repair" 
            className="w-full max-w-4xl rounded-2xl shadow-xl border border-border"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map(service => (
            <ServiceCard 
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              href={service.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
