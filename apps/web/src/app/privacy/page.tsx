export const metadata = {
  title: 'Privacy Policy | FoneBox',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: January 2026</p>
        
        <h2>1. Information We Collect</h2>
        <p>At FoneBox Enterprise, we collect your contact details, enterprise metadata, and device diagnostics strictly for the purpose of providing repair services.</p>
        
        <h2>2. How We Use Information</h2>
        <p>We use your data to generate quotes, process repairs, and update you on service SLAs. We do not sell data to third parties.</p>

        <h2>3. ISO 27001 Compliance</h2>
        <p>Your hardware is processed in a secure facility. We do not access customer storage unless explicitly authorized for data recovery services.</p>
      </div>
    </div>
  );
}
