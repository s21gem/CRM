'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Clock, MessageSquare, Briefcase, Activity } from 'lucide-react';
import { classNames } from '@fonebox/utils';
import { format } from 'date-fns';

interface Lead {
  id: string;
  referenceNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string | null;
  status: string;
  type: string;
  priority: string;
  createdAt: string;
  activities: any[];
  notes: any[];
  assignee: { id: string; firstName: string; lastName: string } | null;
}

interface LeadDetailSlideOverProps {
  leadId: string | null;
  onClose: () => void;
  onUpdate?: () => void;
}

export const LeadDetailSlideOver: React.FC<LeadDetailSlideOverProps> = ({ leadId, onClose, onUpdate }) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (leadId) {
      fetchLead(leadId);
    }
  }, [leadId]);

  const fetchLead = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/crm/leads/${id}`);
      const json = await res.json();
      if (json.success) {
        setLead(json.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !leadId) return;

    try {
      const res = await fetch(`/api/v1/crm/leads/${leadId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      });
      const json = await res.json();
      if (json.success) {
        setNewNote('');
        fetchLead(leadId);
        onUpdate?.();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!leadId) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
        <div className="w-full h-full bg-background shadow-2xl flex flex-col animate-in slide-in-from-right">
          
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
            <div>
              <h2 className="text-lg font-semibold">{lead?.referenceNumber || 'Loading...'}</h2>
              <p className="text-sm text-muted-foreground">{lead?.type.replace('_', ' ')}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading && !lead ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ) : lead ? (
              <>
                {/* Contact Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Contact Details</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{lead.firstName} {lead.lastName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{lead.phone}</span>
                  </div>
                  {lead.company && (
                    <div className="flex items-center gap-3 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span>{lead.company}</span>
                    </div>
                  )}
                </div>

                <hr className="border-border" />

                {/* Status & Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Status</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {lead.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Priority</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {lead.priority}
                    </span>
                  </div>
                </div>

                <hr className="border-border" />

                {/* Notes Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Notes</h3>
                  
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Add a note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                      Add
                    </button>
                  </form>

                  <div className="space-y-3">
                    {lead.notes?.map((note: any) => (
                      <div key={note.id} className="bg-muted p-3 rounded-md text-sm">
                        <p>{note.content}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>{note.user?.firstName} {note.user?.lastName}</span>
                          <span>{format(new Date(note.createdAt), 'MMM d, h:mm a')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-border" />

                {/* Activity Timeline */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Activity History</h3>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {lead.activities?.map((activity: any) => (
                      <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border border-background bg-muted-foreground text-background shrink-0 z-10 ml-0.5 md:mx-auto">
                          <Activity className="w-3 h-3" />
                        </div>
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border bg-background shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{activity.action}</span>
                            <span className="text-xs text-muted-foreground">{format(new Date(activity.createdAt), 'MMM d, h:mm a')}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </>
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
};
