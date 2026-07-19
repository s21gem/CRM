'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SectionCard } from '@/components/ui/SectionCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function InvoicesDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    fetchMetrics();
    fetchInvoices();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/v1/invoices/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const json = await res.json();
      if (json.success) setMetrics(json.data);
    } catch (e) {
      console.error('Failed to fetch metrics', e);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/v1/invoices', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const json = await res.json();
      if (json.success) setInvoices(json.data);
    } catch (e) {
      console.error('Failed to fetch invoices', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Invoices</h1>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <SectionCard>
            <div className="pb-2">
              <h3 className="text-sm text-gray-500 font-semibold">Drafts</h3>
            </div>
            <div>
              <p className="text-2xl font-bold">{metrics.draft}</p>
            </div>
          </SectionCard>
          <SectionCard>
            <div className="pb-2">
              <h3 className="text-sm text-gray-500 font-semibold">Pending</h3>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{metrics.pending}</p>
            </div>
          </SectionCard>
          <SectionCard>
            <div className="pb-2">
              <h3 className="text-sm text-gray-500 font-semibold">Issued</h3>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{metrics.issued}</p>
            </div>
          </SectionCard>
          <SectionCard>
            <div className="pb-2">
              <h3 className="text-sm text-gray-500 font-semibold">Overdue</h3>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{metrics.overdue}</p>
            </div>
          </SectionCard>
          <SectionCard>
            <div className="pb-2">
              <h3 className="text-sm text-gray-500 font-semibold">Paid</h3>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{metrics.paid}</p>
            </div>
          </SectionCard>
          <SectionCard>
            <div className="pb-2">
              <h3 className="text-sm text-gray-500 font-semibold">Balance</h3>
            </div>
            <div>
              <p className="text-2xl font-bold">${metrics.outstandingBalance.toFixed(2)}</p>
            </div>
          </SectionCard>
        </div>
      )}

      <SectionCard>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Recent Invoices</h2>
        </div>
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-sm font-medium">Invoice #</th>
                  <th className="px-4 py-3 text-sm font-medium">Customer</th>
                  <th className="px-4 py-3 text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-sm font-medium">Total</th>
                  <th className="px-4 py-3 text-sm font-medium">Balance</th>
                  <th className="px-4 py-3 text-sm font-medium">Created</th>
                  <th className="px-4 py-3 text-sm font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8">
                      <EmptyState 
                        icon={FileText} 
                        title="No invoices found" 
                        description="There are no draft or issued invoices available in the billing engine." 
                      />
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="py-3 px-4 font-medium">{invoice.invoiceNumber}</td>
                      <td className="py-3 px-4">
                        {invoice.customer.firstName} {invoice.customer.lastName}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          invoice.status === 'PAID' ? 'bg-success/10 text-success' :
                          invoice.status === 'DRAFT' ? 'bg-muted text-muted-foreground' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">${invoice.grandTotal.toFixed(2)}</td>
                      <td className="py-3 px-4">${invoice.balanceDue.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(invoice.createdAt), { addSuffix: true })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`/crm/invoices/${invoice.id}`} className="text-primary hover:underline font-medium text-sm">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
