'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Package, AlertCircle, ShoppingCart, Activity, Plus } from 'lucide-react';
import Link from 'next/link';
import { classNames } from '@fonebox/utils';

export default function InventoryDashboardPage() {
  const [metrics, setMetrics] = useState<any>({
    totalItems: 0,
    outOfStock: 0,
    lowStock: 0,
    activeReservations: 0,
    movementsToday: 0,
    recentMovements: [],
  });
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/inventory/dashboard').then(res => res.json()),
      fetch('/api/v1/inventory?limit=10').then(res => res.json())
    ]).then(([dashboardRes, itemsRes]) => {
      if (dashboardRes.success) {
        setMetrics(dashboardRes.data);
      }
      if (itemsRes.success) {
        setItems(itemsRes.data);
      }
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory & Parts</h1>
            <p className="text-muted-foreground">Manage stock levels, reservations, and movements.</p>
          </div>
          <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Items"
            value={metrics.totalItems.toString()}
            icon={<Package className="h-4 w-4" />}
            description="Active parts and items"
          />
          <StatCard
            title="Low Stock"
            value={metrics.lowStock.toString()}
            icon={<AlertCircle className="h-4 w-4" />}
            description="Items below reorder level"
            trend={{ value: metrics.outOfStock, isPositive: false }} // Show out of stock as trend
          />
          <StatCard
            title="Active Reservations"
            value={metrics.activeReservations.toString()}
            icon={<ShoppingCart className="h-4 w-4" />}
            description="Parts reserved for repairs"
          />
          <StatCard
            title="Movements Today"
            value={metrics.movementsToday.toString()}
            icon={<Activity className="h-4 w-4" />}
            description="Total inventory transactions"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-lg border bg-card shadow-sm">
            <div className="p-6 border-b">
              <h3 className="font-semibold leading-none tracking-tight">Recent Items</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">SKU / Name</th>
                    <th className="px-6 py-3 font-medium">Stock</th>
                    <th className="px-6 py-3 font-medium">Reserved</th>
                    <th className="px-6 py-3 font-medium">Available</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.sku}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">{item.currentStock}</td>
                      <td className="px-6 py-4 text-warning font-medium">{item.reservedStock}</td>
                      <td className={classNames(
                        "px-6 py-4 font-medium",
                        item.availableStock > item.reorderLevel ? "text-success" : (item.availableStock > 0 ? "text-warning" : "text-destructive")
                      )}>
                        {item.availableStock}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/crm/inventory/${item.id}`} className="text-primary hover:underline font-medium text-sm">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="p-8">
                        <EmptyState 
                          icon={Package} 
                          title="No inventory items" 
                          description="Get started by adding your first hardware or software asset to the ledger." 
                          action={
                            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                              Add Item
                            </button>
                          }
                        />
                      </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                          <p className="text-sm text-muted-foreground">Loading ledger...</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-6 border-b">
              <h3 className="font-semibold leading-none tracking-tight">Recent Movements</h3>
            </div>
            <div className="p-4 flex flex-col gap-4">
              {metrics.recentMovements.length === 0 ? (
                <EmptyState 
                  icon={Activity} 
                  title="No recent movements" 
                  description="Transactions will appear here once inventory is adjusted or consumed." 
                />
              ) : (
                metrics.recentMovements.map((movement: any) => (
                  <div key={movement.id} className="flex items-start justify-between pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={classNames(
                          "px-2 py-0.5 rounded text-xs font-semibold",
                          ['IN', 'RELEASE'].includes(movement.movementType) ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                        )}>
                          {movement.movementType}
                        </span>
                        <span className="text-sm font-medium">{movement.item.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {movement.reason} by {movement.createdBy.firstName} {movement.createdBy.lastName}
                      </span>
                    </div>
                    <div className="text-sm font-bold">
                      {['IN', 'RELEASE'].includes(movement.movementType) ? '+' : '-'}{movement.quantity}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
