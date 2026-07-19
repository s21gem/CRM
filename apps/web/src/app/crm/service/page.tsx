'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { LeadDetailSlideOver } from '@/components/crm/LeadDetailSlideOver';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { LEAD_TYPE_LABELS, LEAD_STATUS_LABELS } from '@/lib/constants';

export default function ServiceQueuePage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/v1/crm/service-queue');
      const json = await res.json();
      if (json.success && json.data?.leads) {
        setLeads(json.data.leads);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load service queue');
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operations Queue</h1>
          <p className="text-muted-foreground">Manage incoming enterprise implementation requests and support tickets.</p>
        </div>

        <SectionCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-muted-foreground">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                <tr>
                  <th scope="col" className="px-6 py-3 rounded-tl-lg">Reference</th>
                  <th scope="col" className="px-6 py-3">Customer</th>
                  <th scope="col" className="px-6 py-3">Type</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Priority</th>
                  <th scope="col" className="px-6 py-3">Assignee</th>
                  <th scope="col" className="px-6 py-3 rounded-tr-lg">Created</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="bg-background border-b hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setSelectedLeadId(lead.id)}
                  >
                    <th scope="row" className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                      {lead.referenceNumber}
                    </th>
                    <td className="px-6 py-4">
                      {lead.firstName} {lead.lastName}
                    </td>
                    <td className="px-6 py-4">
                      {LEAD_TYPE_LABELS[lead.type] || lead.type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {LEAD_STATUS_LABELS[lead.status] || lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {lead.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {lead.assignee ? `${lead.assignee.firstName} ${lead.assignee.lastName}` : 'Unassigned'}
                    </td>
                    <td className="px-6 py-4">
                      {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      No service requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <LeadDetailSlideOver
        leadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        onUpdate={fetchLeads}
      />
    </AppLayout>
  );
}
