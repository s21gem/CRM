import { SectionHeader } from '@/components/ui/SectionHeader';
import { FeatureGrid } from '@/components/ui/FeatureGrid';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { TESTIMONIALS } from '@/content';

export const metadata = {
  title: 'About Us | FoneBox',
  description: 'Learn about FoneBox, the leader in enterprise device repair and management.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="About FoneBox"
          subtitle="We are an industry leader in enterprise hardware repair, committed to secure, rapid, and professional IT solutions."
        />

        <div className="mt-20">
          <SectionHeader title="What Our Enterprise Clients Say" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
            {TESTIMONIALS.map(testimonial => (
              <TestimonialCard 
                key={testimonial.id}
                name={testimonial.name}
                role={testimonial.role}
                company={testimonial.company}
                quote={testimonial.quote}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
