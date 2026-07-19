'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DndContext, closestCorners, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { LeadDetailSlideOver } from '@/components/crm/LeadDetailSlideOver';
import { toast } from 'sonner';
import { LEAD_STATUS_LABELS } from '@/lib/constants';

const COLUMNS = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CONVERTED', 'LOST'];

function DroppableColumn({ id, title, leads, onLeadClick }: { id: string; title: string; leads: any[]; onLeadClick: (id: string) => void }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="flex-1 bg-muted/50 rounded-lg p-4 min-w-[300px] flex flex-col h-[calc(100vh-200px)]">
      <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider">{title} ({leads.length})</h3>
      <div className="flex-1 overflow-y-auto space-y-3">
        {leads.map(lead => (
          <DraggableCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead.id)} />
        ))}
      </div>
    </div>
  );
}

function DraggableCard({ lead, onClick }: { lead: any; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: lead.id,
    data: { ...lead }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-background p-4 rounded-md shadow-sm border cursor-grab active:cursor-grabbing hover:border-primary transition-colors"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-primary">{lead.referenceNumber}</span>
        <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{lead.priority}</span>
      </div>
      <p className="font-medium text-sm">{lead.firstName} {lead.lastName}</p>
      <p className="text-xs text-muted-foreground mt-1 truncate">{lead.company || lead.type}</p>
    </div>
  );
}

export default function SalesPipelinePage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Prevents dragging from instantly firing on click
      },
    })
  );

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/v1/crm/sales-pipeline');
      const json = await res.json();
      if (json.success && json.data?.leads) {
        setLeads(json.data.leads);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load sales pipeline');
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as string;
    const lead = leads.find(l => l.id === leadId);

    if (lead && lead.status !== newStatus) {
      const previousState = [...leads];
      // Optimistic update
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));

      try {
        const res = await fetch(`/api/v1/crm/leads/${leadId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        const json = await res.json();
        if (!json.success) {
          throw new Error('Failed to update status');
        }
        toast.success(`Lead status updated to ${newStatus}`);
      } catch (error) {
        // Revert on error synchronously without network flicker
        console.error(error);
        setLeads(previousState);
        toast.error('Failed to update status, reverting change.');
      }
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 h-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">Manage quotes and business consultations through the sales cycle.</p>
        </div>

        <div className="flex-1 overflow-x-auto pb-4">
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 h-full">
              {COLUMNS.map(col => (
                <DroppableColumn
                  key={col}
                  id={col}
                  title={LEAD_STATUS_LABELS[col] || col}
                  leads={leads.filter(l => l.status === col)}
                  onLeadClick={setSelectedLeadId}
                />
              ))}
            </div>
          </DndContext>
        </div>
      </div>

      <LeadDetailSlideOver
        leadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        onUpdate={fetchLeads}
      />
    </AppLayout>
  );
}
