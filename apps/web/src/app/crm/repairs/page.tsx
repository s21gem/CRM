'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SectionCard } from '@/components/ui/SectionCard';
import { Wrench, CheckCircle, Clock, AlertTriangle, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function RepairsDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, repairsRes] = await Promise.all([
        fetch('/api/v1/repairs/dashboard'),
        fetch('/api/v1/repairs')
      ]);
      const s = await statsRes.json();
      const r = await repairsRes.json();
      
      if (s.success) setStats(s.data);
      if (r.success) setRepairs(r.data);
    } catch (e) {
      toast.error('Failed to load repairs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading workspace...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
          <Wrench className="w-6 h-6 text-primary" />
          <span>Repair Operations</span>
        </h1>
        <p className="text-muted-foreground text-sm">Manage device repairs and assignments.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="My Repairs" value={stats.myRepairs} icon={Wrench} color="text-blue-500" bg="bg-blue-500/10" />
          <StatCard title="In Repair" value={stats.inRepair} icon={PlayCircle} color="text-indigo-500" bg="bg-indigo-500/10" />
          <StatCard title="Waiting Approval" value={stats.waitingApproval} icon={Clock} color="text-orange-500" bg="bg-orange-500/10" />
          <StatCard title="Waiting Parts" value={stats.waitingParts} icon={AlertTriangle} color="text-amber-500" bg="bg-amber-500/10" />
          <StatCard title="Ready Today" value={stats.readyToday} icon={CheckCircle} color="text-green-500" bg="bg-green-500/10" />
          <StatCard title="Total Active" value={stats.total} icon={Wrench} color="text-primary" bg="bg-primary/10" />
        </div>
      )}

      <SectionCard className="p-6">
        <h3 className="text-lg font-semibold mb-4">All Repairs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium rounded-tl-lg">Repair #</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Device</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Assigned</th>
                <th className="px-4 py-3 font-medium rounded-tr-lg text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {repairs.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground border-b">No repairs found</td></tr>
              ) : (
                repairs.map((r) => (
                  <tr key={r.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium">{r.repairNumber}</td>
                    <td className="px-4 py-3">{r.customer?.firstName} {r.customer?.lastName}</td>
                    <td className="px-4 py-3">{r.device?.brand} {r.device?.model}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium uppercase">{r.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${r.priority === 'URGENT' ? 'bg-red-500/10 text-red-500' : 'bg-muted text-muted-foreground'}`}>{r.priority}</span>
                    </td>
                    <td className="px-4 py-3">{r.assignedTechnician ? `${r.assignedTechnician.firstName} ${r.assignedTechnician.lastName}` : 'Unassigned'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/crm/repairs/${r.id}`} className="text-primary hover:underline font-medium text-xs">
                        View Workspace
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: { title: string, value: number, icon: any, color: string, bg: string }) {
  return (
    <div className="border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${bg}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground font-medium uppercase mt-1">{title}</p>
    </div>
  );
}
