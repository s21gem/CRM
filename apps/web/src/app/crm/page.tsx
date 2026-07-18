import { AppLayout } from '@/components/layout/AppLayout';
import { SectionCard } from '@/components/ui/SectionCard';

export default function CRMPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground">Manage your customer relationships and pipelines.</p>
        </div>
        <SectionCard>
          <div className="flex h-[400px] items-center justify-center border-2 border-dashed rounded-md text-muted-foreground">
            [CRM Board / List Placeholder]
          </div>
        </SectionCard>
      </div>
    </AppLayout>
  );
}
