import { SectionHeader } from '@/components/ui/SectionHeader';
import { LeadCaptureForm } from '@/components/ui/forms/LeadCaptureForm';

export const metadata = {
  title: 'Contact Us | FoneBox Enterprise',
  description: 'Get in touch with our enterprise hardware repair team.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Get in Touch"
          subtitle="Our enterprise support team is ready to assist you with any inquiries."
        />
        
        <div className="mt-12 flex flex-col lg:flex-row gap-12">
          {/* Contact Information */}
          <div className="lg:w-1/3 space-y-8">
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">Corporate Office</h3>
              <p className="text-muted-foreground mb-1">123 Enterprise Way, Suite 400</p>
              <p className="text-muted-foreground mb-1">Tech District, NY 10001</p>
              <p className="text-muted-foreground">United States</p>
            </div>
            
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">Direct Lines</h3>
              <p className="text-muted-foreground mb-2 flex items-center gap-2">
                <span className="font-semibold text-foreground">Sales:</span> +1 (555) 123-4567
              </p>
              <p className="text-muted-foreground mb-2 flex items-center gap-2">
                <span className="font-semibold text-foreground">Support:</span> +1 (555) 987-6543
              </p>
              <p className="text-muted-foreground flex items-center gap-2">
                <span className="font-semibold text-foreground">Email:</span> enterprise@foneboxusa.com
              </p>
            </div>
          </div>
          
          {/* Lead Capture Form */}
          <div className="lg:w-2/3">
            <LeadCaptureForm 
              type="inquiry" 
              title="General Inquiry" 
              subtitle="Fill out the form below and we'll get back to you within 1 business day."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
