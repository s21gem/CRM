'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { ArrowLeft, Package, History, ShoppingCart, Settings } from 'lucide-react';
import { toast } from 'sonner';

type TabType = 'overview' | 'movements' | 'reservations';

export default function InventoryItemPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    fetchItem();
  }, [params.id]);

  const fetchItem = async () => {
    try {
      const res = await fetch(`/api/v1/inventory/${params.id}`);
      const result = await res.json();
      if (result.success) {
        setItem(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch item');
      }
    } catch (e) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-muted-foreground">Loading inventory item...</div>
      </AppLayout>
    );
  }

  if (!item) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-red-500">Item not found.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="p-2 border border-input rounded-md hover:bg-muted/50 text-muted-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>{item.name}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ml-2 uppercase ${item.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                  {item.status}
                </span>
              </h1>
              <p className="text-muted-foreground text-sm flex items-center space-x-2">
                <span>SKU: {item.sku}</span>
                <span>•</span>
                <span>Part #: {item.partNumber}</span>
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
             <button className="px-4 py-2 border border-border bg-card rounded-md text-sm font-medium hover:bg-muted/50">Edit Item</button>
             <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">Adjust Stock</button>
          </div>
        </div>

        <div className="flex border-b border-border space-x-6 overflow-x-auto">
          <TabButton id="overview" icon={Settings} label="Overview" activeTab={activeTab} setActive={setActiveTab} />
          <TabButton id="movements" icon={History} label="Movements" activeTab={activeTab} setActive={setActiveTab} />
          <TabButton id="reservations" icon={ShoppingCart} label="Reservations" activeTab={activeTab} setActive={setActiveTab} />
        </div>

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SectionCard className="p-6 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Item Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-muted-foreground text-sm">Description:</span> <p className="font-medium">{item.description || 'N/A'}</p></div>
                  <div><span className="text-muted-foreground text-sm">Category:</span> <p className="font-medium">{item.category?.name || 'Uncategorized'}</p></div>
                  <div><span className="text-muted-foreground text-sm">Brand:</span> <p className="font-medium">{item.brand || 'N/A'}</p></div>
                  <div><span className="text-muted-foreground text-sm">Manufacturer:</span> <p className="font-medium">{item.manufacturer || 'N/A'}</p></div>
                  <div><span className="text-muted-foreground text-sm">Barcode:</span> <p className="font-medium">{item.barcode || 'N/A'}</p></div>
                  <div><span className="text-muted-foreground text-sm">Unit:</span> <p className="font-medium capitalize">{item.unit.toLowerCase()}</p></div>
                </div>
              </SectionCard>
              <div className="space-y-6">
                <SectionCard className="p-6 bg-primary/5 border-primary/20">
                  <h3 className="text-lg font-semibold mb-4 text-primary">Stock Levels</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm font-medium">Available</span>
                      <span className="text-2xl font-bold">{item.availableStock}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-primary/10 pt-3">
                      <span className="text-muted-foreground text-sm font-medium">Reserved</span>
                      <span className="text-lg font-bold text-warning">{item.reservedStock}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-primary/10 pt-3">
                      <span className="text-muted-foreground text-sm font-medium">Physical (Total)</span>
                      <span className="text-lg font-bold text-muted-foreground">{item.currentStock}</span>
                    </div>
                  </div>
                </SectionCard>
                <SectionCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Pricing & Reorder</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Default Cost:</span> <span className="font-medium">${item.defaultCost.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Default Price:</span> <span className="font-medium">${item.defaultPrice.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm pt-2 border-t"><span className="text-muted-foreground">Reorder Level:</span> <span className="font-medium">{item.reorderLevel}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Minimum Stock:</span> <span className="font-medium">{item.minimumStock}</span></div>
                  </div>
                </SectionCard>
              </div>
            </div>
          )}

          {activeTab === 'movements' && (
            <SectionCard className="p-6">
              <h3 className="text-lg font-semibold mb-6">Inventory Ledger</h3>
              <p className="text-muted-foreground">Movement history will be displayed here.</p>
            </SectionCard>
          )}

          {activeTab === 'reservations' && (
            <SectionCard className="p-6">
              <h3 className="text-lg font-semibold mb-6">Active Reservations</h3>
              <p className="text-muted-foreground">Reservations for this item will be displayed here.</p>
            </SectionCard>
          )}
        </div>
      </div>
    </AppLayout>
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
