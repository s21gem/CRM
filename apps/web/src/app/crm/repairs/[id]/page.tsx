'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SectionCard } from '@/components/ui/SectionCard';
import { Wrench, CheckCircle, Clock, AlertTriangle, ArrowLeft, User, Smartphone, Settings, History, ClipboardList, DollarSign, Package, Receipt } from 'lucide-react';
import { toast } from 'sonner';

type TabType = 'overview' | 'diagnosis' | 'checklist' | 'timeline' | 'costs' | 'parts' | 'billing';

export default function RepairWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [repair, setRepair] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchRepair();
    fetchTimeline();
  }, [params.id]);

  const fetchRepair = async () => {
    try {
      const res = await fetch(`/api/v1/repairs/${params.id}`);
      const result = await res.json();
      if (result.success) {
        setRepair(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch repair');
      }
    } catch (e) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async () => {
    try {
      const res = await fetch(`/api/v1/repairs/${params.id}/timeline`);
      const result = await res.json();
      if (result.success) {
        setTimeline(result.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading workspace...</div>;
  if (!repair) return <div className="p-8 text-center text-red-500">Repair not found.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 border border-input rounded-md hover:bg-muted/50 text-muted-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
              <Wrench className="w-5 h-5" />
              <span>{repair.repairNumber}</span>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium ml-2 uppercase">
                {repair.status}
              </span>
            </h1>
            <p className="text-muted-foreground text-sm flex items-center space-x-2">
              <span>Customer: {repair.customer?.firstName} {repair.customer?.lastName}</span>
              <span>•</span>
              <span>Device: {repair.device?.brand} {repair.device?.model}</span>
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
           <button className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted/50">Update Status</button>
        </div>
      </div>

      <div className="flex border-b border-border space-x-6 overflow-x-auto">
        <TabButton id="overview" icon={Settings} label="Overview" activeTab={activeTab} setActive={setActiveTab} />
        <TabButton id="diagnosis" icon={Wrench} label="Diagnosis" activeTab={activeTab} setActive={setActiveTab} />
        <TabButton id="checklist" icon={ClipboardList} label="Checklist" activeTab={activeTab} setActive={setActiveTab} />
        <TabButton id="parts" icon={Settings} label="Parts & Inventory" activeTab={activeTab} setActive={setActiveTab} />
        <TabButton id="timeline" icon={History} label="Merged Timeline" activeTab={activeTab} setActive={setActiveTab} />
        <TabButton id="costs" icon={DollarSign} label="Costs" activeTab={activeTab} setActive={setActiveTab} />
        <TabButton id="billing" icon={Receipt} label="Billing" activeTab={activeTab} setActive={setActiveTab} />
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Intake Details</h3>
              <div className="space-y-4">
                <div><span className="text-muted-foreground text-sm">Problem Description:</span> <p className="font-medium bg-muted/30 p-2 rounded">{repair.problemDescription}</p></div>
                <div><span className="text-muted-foreground text-sm">Customer Complaint:</span> <p className="font-medium">{repair.customerComplaint || 'N/A'}</p></div>
                <div><span className="text-muted-foreground text-sm">Intake Condition:</span> <p className="font-medium">{repair.intakeCondition || 'N/A'}</p></div>
                <div><span className="text-muted-foreground text-sm">Accessories Received:</span> <p className="font-medium">{repair.accessoriesReceived || 'None'}</p></div>
              </div>
            </SectionCard>
            <div className="space-y-6">
              <SectionCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Device Info</h3>
                <div className="space-y-2">
                  <p><span className="text-muted-foreground">Model:</span> {repair.device?.brand} {repair.device?.model}</p>
                  <p><span className="text-muted-foreground">IMEI:</span> {repair.device?.imei || 'N/A'}</p>
                  <p><span className="text-muted-foreground">S/N:</span> {repair.device?.serialNumber || 'N/A'}</p>
                </div>
              </SectionCard>
              <SectionCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Technician</h3>
                {repair.assignedTechnician ? (
                  <p className="font-medium flex items-center space-x-2">
                    <User className="w-4 h-4 text-primary" />
                    <span>{repair.assignedTechnician.firstName} {repair.assignedTechnician.lastName}</span>
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">Unassigned</p>
                )}
              </SectionCard>
            </div>
          </div>
        )}

        {activeTab === 'diagnosis' && (
          <SectionCard className="p-6">
            <h3 className="text-lg font-semibold mb-6">Technical Diagnosis</h3>
            {repair.diagnosis ? (
              <div className="space-y-4">
                <div><span className="text-muted-foreground text-sm">Repairability:</span> <p className="font-medium">{repair.diagnosis.repairability || 'Not specified'}</p></div>
                <div><span className="text-muted-foreground text-sm">Issue Found:</span> <p className="font-medium bg-muted/30 p-3 rounded mt-1">{repair.diagnosis.issueFound || 'N/A'}</p></div>
                <div><span className="text-muted-foreground text-sm">Root Cause:</span> <p className="font-medium">{repair.diagnosis.rootCause || 'N/A'}</p></div>
                <div><span className="text-muted-foreground text-sm">Recommended Parts:</span> <p className="font-medium">{repair.diagnosis.recommendedParts || 'N/A'}</p></div>
                <div><span className="text-muted-foreground text-sm">Technician Notes:</span> <p className="font-medium">{repair.diagnosis.technicianNotes || 'N/A'}</p></div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No diagnosis has been recorded yet.</p>
                <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Record Diagnosis</button>
              </div>
            )}
          </SectionCard>
        )}

        {activeTab === 'timeline' && (
          <SectionCard className="p-6">
            <h3 className="text-lg font-semibold mb-6">Repair Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {timeline.length === 0 ? (
                <p className="text-center text-muted-foreground relative z-10 bg-card py-2">No activity recorded yet.</p>
              ) : (
                timeline.map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-card shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow ${item.type === 'STATUS' ? 'bg-indigo-500 text-white' : 'bg-primary text-primary-foreground'}`}>
                      {item.type === 'STATUS' ? <CheckCircle className="w-4 h-4" /> : <History className="w-4 h-4" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-muted/20 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-foreground capitalize">
                          {item.type === 'STATUS' ? `Status: ${item.data.status}` : item.data.action.replace(/_/g, ' ')}
                        </div>
                        <time className="font-mono text-xs text-muted-foreground">{new Date(item.date).toLocaleString()}</time>
                      </div>
                      <div className="text-sm text-muted-foreground">{item.data.details || item.data.notes}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        )}

        {activeTab === 'checklist' && (
          <SectionCard className="p-6">
            <h3 className="text-lg font-semibold mb-6">Repair Checklist</h3>
            {repair.checklist?.length === 0 ? (
              <p className="text-muted-foreground">No checklist items defined.</p>
            ) : (
              <div className="space-y-3">
                {repair.checklist?.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 border border-border rounded hover:bg-muted/30">
                    <input type="checkbox" checked={item.isCompleted} readOnly className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className={item.isCompleted ? "line-through text-muted-foreground" : "text-foreground font-medium"}>{item.task}</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {activeTab === 'costs' && (
          <SectionCard className="p-6">
            <h3 className="text-lg font-semibold mb-6">Financial Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 border border-border rounded-lg bg-muted/20 text-center">
                <p className="text-sm text-muted-foreground mb-1 uppercase font-medium">Estimated Cost</p>
                <p className="text-3xl font-bold">${repair.estimatedCost?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="p-4 border border-border rounded-lg bg-muted/20 text-center">
                <p className="text-sm text-muted-foreground mb-1 uppercase font-medium">Approved Cost</p>
                <p className="text-3xl font-bold text-orange-500">${repair.approvedCost?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="p-4 border border-border rounded-lg bg-green-500/10 text-center border-green-500/20">
                <p className="text-sm text-green-600 mb-1 uppercase font-medium">Final Cost</p>
                <p className="text-3xl font-bold text-green-700">${repair.finalCost?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </SectionCard>
        )}

        {activeTab === 'parts' && (
          <SectionCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Reserved Parts</h3>
              <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90">
                Reserve Part
              </button>
            </div>
            {repair.reservations?.length === 0 || !repair.reservations ? (
              <div className="text-center py-8 text-muted-foreground bg-muted/20 border border-dashed rounded-lg">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No parts have been reserved for this repair yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Part Details</th>
                      <th className="px-4 py-3 font-medium">Qty</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Cost</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {repair.reservations.map((res: any) => (
                      <tr key={res.id}>
                        <td className="px-4 py-3 font-medium">{res.item?.name}</td>
                        <td className="px-4 py-3">{res.quantity}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${res.status === 'ACTIVE' ? 'bg-warning/20 text-warning' : (res.status === 'CONSUMED' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground')}`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">${(res.unitPriceSnapshot * res.quantity).toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">
                          {res.status === 'ACTIVE' && (
                            <div className="flex justify-end gap-2">
                              <button className="text-success hover:underline text-xs font-semibold">Consume</button>
                              <button className="text-destructive hover:underline text-xs font-semibold">Release</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        )}

        {activeTab === 'billing' && (
          <SectionCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Invoices</h3>
              <button 
                onClick={async () => {
                  try {
                    const res = await fetch('/api/v1/invoices/draft', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                      },
                      body: JSON.stringify({ repairOrderId: repair.id })
                    });
                    if (res.ok) {
                      const data = await res.json();
                      window.location.href = `/crm/invoices/${data.data.id}`;
                    } else {
                      alert('Failed to generate draft or invoice already exists.');
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90"
              >
                Generate Draft Invoice
              </button>
            </div>
            
            {repair.invoices?.length > 0 ? (
              <div className="space-y-4">
                {repair.invoices.map((inv: any) => (
                  <div key={inv.id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-muted/10">
                    <div>
                      <p className="font-semibold">{inv.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">{inv.status} - ${inv.grandTotal?.toFixed(2)}</p>
                    </div>
                    <a href={`/crm/invoices/${inv.id}`} className="text-blue-600 hover:underline text-sm">
                      View Invoice
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No invoices generated for this repair.</p>
            )}
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
