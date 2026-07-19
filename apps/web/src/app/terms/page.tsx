export const metadata = {
  title: 'Terms and Conditions | FoneBox',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
        <h1>Terms and Conditions</h1>
        <p className="text-muted-foreground">Last updated: January 2026</p>
        
        <h2>1. Repair Agreements</h2>
        <p>By submitting a device to FoneBox, you agree to our standard SLA and repair terms. Liquid damaged devices carry inherent risks during the repair process.</p>
        
        <h2>2. Warranty</h2>
        <p>All standard repairs carry a 90-day warranty covering the replaced parts. Enterprise AMC clients receive a 1-year extended warranty.</p>

        <h2>3. Abandoned Devices</h2>
        <p>Devices left for over 90 days after repair completion notification will be recycled according to local e-waste regulations.</p>
      </div>
    </div>
  );
}
