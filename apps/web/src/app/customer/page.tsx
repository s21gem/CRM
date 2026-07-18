import { AppLayout } from '@/components/layout/AppLayout';
import { SectionCard } from '@/components/ui/SectionCard';

export default function CustomerPortalPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Portal</h1>
          <p className="text-muted-foreground">Client-facing interface for tickets and project status.</p>
        </div>
        <SectionCard>
          <div className="flex h-[400px] items-center justify-center border-2 border-dashed rounded-md text-muted-foreground">
            [Customer Portal Interface Placeholder]
          </div>
        </SectionCard>
      </div>
    </AppLayout>
  );
}
