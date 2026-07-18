import { AppLayout } from '@/components/layout/AppLayout';
import { SectionCard } from '@/components/ui/SectionCard';

export default function AdminPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
          <p className="text-muted-foreground">Manage system configurations, RBAC, and access control.</p>
        </div>
        <SectionCard>
          <div className="flex h-[400px] items-center justify-center border-2 border-dashed rounded-md text-muted-foreground">
            [Admin Configuration Panel Placeholder]
          </div>
        </SectionCard>
      </div>
    </AppLayout>
  );
}
