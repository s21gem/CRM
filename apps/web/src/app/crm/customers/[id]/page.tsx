'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SectionCard } from '@/components/ui/SectionCard';
import { User, Smartphone, History, StickyNote, Wrench, FileText, ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';

type TabType = 'profile' | 'devices' | 'timeline' | 'notes' | 'repairs' | 'invoices';

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [customer, setCustomer] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCustomer();
    fetchTimeline();
  }, [params.id]);

  const fetchCustomer = async () => {
    try {
      const res = await fetch(`/api/v1/customers/${params.id}`);
      const result = await res.json();
      if (result.success) {
        setCustomer(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch customer');
      }
    } catch (e) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async () => {
    try {
      const res = await fetch(`/api/v1/customers/${params.id}/timeline`);
      const result = await res.json();
      if (result.success) {
        setTimeline(result.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading workspace...</div>;
  if (!customer) return <div className="p-8 text-center text-red-500">Customer not found.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center space-x-4">
        <button onClick={() => router.back()} className="p-2 border border-input rounded-md hover:bg-muted/50 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <span>{customer.firstName} {customer.lastName}</span>
            {customer.type === 'BUSINESS' && (
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-xs rounded-full font-medium ml-2">Business</span>
            )}
          </h1>
          <p className="text-muted-foreground text-sm flex items-center space-x-2">
            <span>{customer.customerNumber}</span>
            <span>•</span>
            <span>{customer.email}</span>
            <span>•</span>
            <span>{customer.phone}</span>
          </p>
        </div>
      </div>

      <div className="flex border-b border-border space-x-6 overflow-x-auto">
        <TabButton id="profile" icon={User} label="Profile" activeTab={activeTab} setActive={setActiveTab} />
        <TabButton id="devices" icon={Smartphone} label="Devices" activeTab={activeTab} setActive={setActiveTab} />
        <TabButton id="timeline" icon={History} label="360° Timeline" activeTab={activeTab} setActive={setActiveTab} />
        <TabButton id="notes" icon={StickyNote} label="Notes" activeTab={activeTab} setActive={setActiveTab} />
        <TabButton id="repairs" icon={Wrench} label="Repairs Module" activeTab={activeTab} setActive={setActiveTab} />
        <TabButton id="invoices" icon={FileText} label="Invoices Module" activeTab={activeTab} setActive={setActiveTab} />
      </div>

      <div className="mt-6">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div><span className="text-muted-foreground text-sm">Email:</span> <p className="font-medium">{customer.email || 'N/A'}</p></div>
                <div><span className="text-muted-foreground text-sm">Phone:</span> <p className="font-medium">{customer.phone || 'N/A'}</p></div>
                <div><span className="text-muted-foreground text-sm">Company:</span> <p className="font-medium">{customer.company || 'N/A'}</p></div>
              </div>
            </SectionCard>
            <SectionCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Address Information</h3>
              <div className="space-y-4">
                <div><span className="text-muted-foreground text-sm">Address:</span> <p className="font-medium">{customer.address || 'N/A'}</p></div>
                <div><span className="text-muted-foreground text-sm">City / State:</span> <p className="font-medium">{customer.city || 'N/A'}, {customer.state || 'N/A'}</p></div>
                <div><span className="text-muted-foreground text-sm">Country:</span> <p className="font-medium">{customer.country || 'N/A'}</p></div>
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === 'devices' && (
          <SectionCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Registered Devices</h3>
              <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-sm font-medium flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Register Device</span>
              </button>
            </div>
            
            {customer.devices?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                No devices registered to this customer.
              </div>
            ) : (
              <div className="space-y-4">
                {customer.devices.map((device: any) => (
                  <div key={device.id} className="flex justify-between items-center p-4 border border-border rounded-lg bg-muted/20">
                    <div>
                      <h4 className="font-semibold text-foreground">{device.brand} {device.model}</h4>
                      <p className="text-xs text-muted-foreground">IMEI: {device.imei || 'N/A'} • SN: {device.serialNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-medium uppercase">
                        {device.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {activeTab === 'timeline' && (
          <SectionCard className="p-6">
            <h3 className="text-lg font-semibold mb-6">360° Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {timeline.length === 0 ? (
                <p className="text-center text-muted-foreground relative z-10 bg-card py-2">No activity recorded yet.</p>
              ) : (
                timeline.map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-card bg-primary text-primary-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      <History className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-muted/20 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-foreground capitalize">{item.action.replace(/_/g, ' ')}</div>
                        <time className="font-mono text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</time>
                      </div>
                      <div className="text-sm text-muted-foreground">{item.details || item.description}</div>
                      <div className="text-xs text-muted-foreground mt-2 font-medium">Source: {item.source} {item.user && `• By: ${item.user.firstName} ${item.user.lastName}`}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        )}

        {activeTab === 'notes' && (
          <SectionCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Notes</h3>
            <div className="space-y-4">
              {customer.customerNotes?.length === 0 ? (
                <p className="text-muted-foreground">No notes available.</p>
              ) : (
                customer.customerNotes?.map((note: any) => (
                  <div key={note.id} className="p-4 border border-border rounded-lg bg-muted/20">
                    <p className="text-foreground">{note.note}</p>
                    <p className="text-xs text-muted-foreground mt-2">Added by {note.user?.firstName || 'System'} on {new Date(note.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        )}

        {(activeTab === 'repairs' || activeTab === 'invoices') && (
          <SectionCard className="p-12 text-center border-dashed border-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              {activeTab === 'repairs' ? <Wrench className="w-6 h-6 text-primary" /> : <FileText className="w-6 h-6 text-primary" />}
            </div>
            <h3 className="text-xl font-bold mb-2">Reserved for {activeTab === 'repairs' ? 'Repairs' : 'Invoices'} Module</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This section is reserved for the upcoming FoneBox {activeTab === 'repairs' ? 'Repairs' : 'Invoices'} Module implementation, seamlessly linking into the customer domain.
            </p>
          </SectionCard>
        )}
      </div>
    </div>
  );
}

function TabButton({ id, icon: Icon, label, activeTab, setActive }: { id: TabType, icon: any, label: string, activeTab: TabType, setActive: (id: TabType) => void }) {
  const active = activeTab === id;
  return (
    <button
      onClick={() => setActive(id)}
      className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
