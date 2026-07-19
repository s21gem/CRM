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
      .then(data => {
        if (!data.error) setMetrics(data);
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
            title="Total Leads"
            value={metrics.totalLeads.toString()}
            icon={Users2}
            description="All-time leads generated"
          />
          <StatCard
            title="New Leads"
            value={metrics.newLeads.toString()}
            icon={Inbox}
            description="Pending contact"
            trend={{ value: 100, label: 'needs attention' }}
            trendUp={true}
          />
          <StatCard
            title="Converted Customers"
            value={metrics.convertedLeads.toString()}
            icon={CheckCircle2}
            description="Leads successfully converted"
            trend={{ value: Math.round((metrics.convertedLeads / (metrics.totalLeads || 1)) * 100), label: '% conversion rate' }}
            trendUp={true}
          />
        </div>
      </div>
    </AppLayout>
  );
}
