import { Hero } from '@/components/ui/Hero';
import { QuickQuoteForm } from '@/components/ui/forms/QuickQuoteForm';
import { FeatureGrid } from '@/components/ui/FeatureGrid';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { CTABanner } from '@/components/ui/CTABanner';
import { SERVICES } from '@/content';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <Hero 
        title="Enterprise-Grade Device Operations"
        subtitle="Secure, scalable, and professional repair operations platform for FinTech, Cyber Security, and Enterprise ICT fleets."
        primaryCta={{ text: 'Explore Solutions', href: '/business' }}
        secondaryCta={{ text: 'Partner with Us', href: '/contact' }}
        imageUrl="/images/hero/hero-v1.png"
      >
        <div className="w-full max-w-md">
          <QuickQuoteForm />
        </div>
      </Hero>

      {/* Services Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <SectionHeader 
          title="Professional Services" 
          subtitle="Precision repairs backed by enterprise SLAs and dedicated account management." 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
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
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl mb-20 border border-border">
        <FeatureGrid 
          title="Why Choose FoneBox"
          subtitle="We don't just repair devices. We manage your entire hardware lifecycle."
          features={[
            {
              title: 'Data Privacy First',
              description: 'ISO 27001 compliant workflows ensuring your sensitive corporate data never leaves our secure facility.',
              icon: <span className="text-3xl">🔒</span>
            },
            {
              title: 'Rapid Turnaround',
              description: 'SLA-backed repairs ensuring your workforce minimizes downtime. Express service available.',
              icon: <span className="text-3xl">⚡</span>
            },
            {
              title: 'OEM Certified',
              description: 'Genuine components and certified technicians for uncompromising reliability.',
              icon: <span className="text-3xl">🏅</span>
            }
          ]}
        />
      </section>

      {/* CTA Banner */}
      <section className="px-6 pb-20 max-w-7xl mx-auto w-full">
        <CTABanner 
          title="Ready to transform your hardware management?"
          description="Join 500+ enterprises who trust FoneBox with their critical device infrastructure."
          ctaText="Contact Sales"
          href="/contact"
          secondaryCtaText="View Pricing"
          secondaryHref="/pricing"
        />
      </section>
    </main>
  );
}
