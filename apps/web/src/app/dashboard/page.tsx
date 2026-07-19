import { AppLayout } from '@/components/layout/AppLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { StatCard } from '@/components/ui/StatCard';
import { Users, Building, Briefcase, DollarSign, Activity } from 'lucide-react';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview Dashboard</h1>
          <p className="text-muted-foreground">High-level metrics for FoneBox Enterprise ICT Solutions.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Active Government Projects" value="14" icon={<Building />} trend={{ value: 12.5, isPositive: true }} description="from last quarter" />
          <StatCard title="Corporate Clients" value="285" icon={<Users />} trend={{ value: 4.1, isPositive: true }} description="from last month" />
          <StatCard title="Passport & ID Projects" value="9" icon={<Briefcase />} />
          <StatCard title="YTD Revenue" value="$42.5M" icon={<DollarSign />} trend={{ value: 18.2, isPositive: true }} description="vs previous year" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <SectionCard title="Revenue Overview" className="lg:col-span-4">
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md text-muted-foreground">
              [Chart Placeholder - Recharts]
            </div>
          </SectionCard>
          
          <SectionCard title="Recent Activity" className="lg:col-span-3">
             <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">New user registered</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                ))}
             </div>
          </SectionCard>
        </div>
      </div>
    </AppLayout>
  );
}
