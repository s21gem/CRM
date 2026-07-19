'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/ui/StatCard';
import { Users2, CheckCircle2, Inbox } from 'lucide-react';

export default function CRMDashboardPage() {
  const [metrics, setMetrics] = useState({ totalLeads: 0, newLeads: 0, convertedLeads: 0 });

  useEffect(() => {
    fetch('/api/v1/crm/dashboard')
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setMetrics(resData.data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
          <p className="text-muted-foreground">High-level overview of sales and service operations.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Opportunities"
            value={metrics.totalLeads.toString()}
            icon={<Users2 className="w-4 h-4" />}
            description="All-time opportunities generated"
          />
          <StatCard
            title="New Inquiries"
            value={metrics.newLeads.toString()}
            icon={<Inbox className="w-4 h-4" />}
            description="Pending qualification"
            trend={{ value: 100, isPositive: true }}
          />
          <StatCard
            title="Converted Clients"
            value={metrics.convertedLeads.toString()}
            icon={<CheckCircle2 className="w-4 h-4" />}
            description="Opportunities successfully converted"
            trend={{ value: Math.round((metrics.convertedLeads / (metrics.totalLeads || 1)) * 100), isPositive: true }}
          />
        </div>
      </div>
    </AppLayout>
  );
}
