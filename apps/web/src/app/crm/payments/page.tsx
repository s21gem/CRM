'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SectionCard } from '@/components/ui/SectionCard';
import { formatDistanceToNow } from 'date-fns';

export default function PaymentsDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashRes, listRes] = await Promise.all([
          fetch('/api/v1/payments/dashboard', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch('/api/v1/payments', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        if (dashRes.ok) {
          const dashData = await dashRes.json();
          setMetrics(dashData.data);
        }
        if (listRes.ok) {
          const listData = await listRes.json();
          setPayments(listData.data);
        }
      } catch (error) {
        console.error('Error fetching payments data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading payments dashboard...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Payments</h1>
          <p className="text-gray-500 mt-1">Manage receivables, allocations, and receipts.</p>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <SectionCard>
            <div className="pb-2">
              <h3 className="text-sm text-gray-500 font-semibold">Today&apos;s Collection</h3>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">${metrics.todayCollection.toFixed(2)}</p>
            </div>
          </SectionCard>
          <SectionCard>
            <div className="pb-2">
              <h3 className="text-sm text-gray-500 font-semibold">Outstanding</h3>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">${metrics.outstandingBalance.toFixed(2)}</p>
            </div>
          </SectionCard>
          <SectionCard>
            <div className="pb-2">
              <h3 className="text-sm text-gray-500 font-semibold">Partial Invoices</h3>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{metrics.partialPayments}</p>
            </div>
          </SectionCard>
          <SectionCard>
            <div className="pb-2">
              <h3 className="text-sm text-gray-500 font-semibold">Failed</h3>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{metrics.failedPayments}</p>
            </div>
          </SectionCard>
          <SectionCard>
            <div className="pb-2">
              <h3 className="text-sm text-gray-500 font-semibold">Refunded</h3>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{metrics.refundedPayments}</p>
            </div>
          </SectionCard>
        </div>
      )}

      <SectionCard>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Recent Payments</h2>
        </div>
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 font-medium">Payment No.</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Method</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Amount</th>
                  <th className="pb-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium">{payment.paymentNumber}</td>
                    <td className="py-3">{payment.customer?.firstName} {payment.customer?.lastName}</td>
                    <td className="py-3">{formatDistanceToNow(new Date(payment.paymentDate), { addSuffix: true })}</td>
                    <td className="py-3">{payment.method}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        payment.status === 'REFUNDED' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium">${payment.amountReceived.toFixed(2)}</td>
                    <td className="py-3 text-right">
                      <Link href={`/crm/payments/${payment.id}`} className="text-blue-600 hover:underline text-sm font-medium">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">No payments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
