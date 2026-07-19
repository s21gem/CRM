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
        title="Secure Government ICT Solutions"
        subtitle="Delivering trusted identity, fintech, and cybersecurity integration for nations and enterprises worldwide."
        primaryCta={{ text: 'Explore Solutions', href: '/business' }}
        secondaryCta={{ text: 'Contact Sales', href: '/contact' }}
        imageUrl="/images/hero/hero-v1.png"
      >
        <div className="w-full max-w-md">
          <QuickQuoteForm />
        </div>
      </Hero>

      {/* Services Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <SectionHeader 
          title="Our Core Capabilities" 
          subtitle="Specialized technology solutions designed for scale, security, and national sovereignty." 
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
          title="Why Partner with FoneBox"
          subtitle="We deliver critical national infrastructure with uncompromising security and reliability."
          features={[
            {
              title: 'Global Standards',
              description: 'Strict adherence to ISO 27001, EMV, and ICAO standards across all deployments.',
              icon: 'ShieldCheck'
            },
            {
              title: 'Sovereign Control',
              description: 'On-premise deployments ensuring your national data never leaves your jurisdiction.',
              icon: 'Server'
            },
            {
              title: 'Turnkey Execution',
              description: 'End-to-end delivery from initial hardware procurement to final software integration.',
              icon: 'Settings'
            }
          ]}
        />
      </section>

      {/* Call to Action */}
      <section className="px-6 pb-20">
        <CTABanner 
          title="Ready to modernize your infrastructure?"
          description="Schedule a consultation with our specialized engineering team today."
          ctaText="Request a Proposal"
          href="/contact"
          secondaryCtaText="View Case Studies"
          secondaryHref="/business"
        />
      </section>
    </main>
  );
}
