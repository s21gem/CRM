'use client';

import { useState, useEffect, use } from 'react';
import { SectionCard } from '@/components/ui/SectionCard';
import { Button } from '@/components/ui/Button';

export default function PaymentDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Allocation form state
  const [allocateInvoiceId, setAllocateInvoiceId] = useState('');
  const [allocateAmount, setAllocateAmount] = useState('');

  useEffect(() => {
    async function fetchPayment() {
      try {
        const res = await fetch(`/api/v1/payments/${resolvedParams.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPayment(data.data);
        }
      } catch (error) {
        console.error('Error fetching payment:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPayment();
  }, [resolvedParams.id]);

  const handleAction = async (action: string, payload: any = {}) => {
    try {
      const res = await fetch(`/api/v1/payments/${payment.id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert(`Action ${action} successful`);
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert(`Failed: ${errorData.message}`);
      }
    } catch (e) {
      console.error(e);
      alert('Network error');
    }
  };

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocateInvoiceId || !allocateAmount) return;
    handleAction('allocate', { invoiceId: allocateInvoiceId, amount: allocateAmount });
  };

  if (loading) return <div className="p-8">Loading payment details...</div>;
  if (!payment) return <div className="p-8">Payment not found.</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center space-x-3">
            <span>{payment.paymentNumber}</span>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
              payment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
              payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              payment.status === 'REFUNDED' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {payment.status}
            </span>
          </h1>
          <p className="text-gray-500 mt-2">
            Received from {payment.customer?.firstName} {payment.customer?.lastName} on {new Date(payment.paymentDate).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          {payment.status === 'PENDING' && (
            <>
              <Button onClick={() => handleAction('confirm')}>Confirm Payment</Button>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleAction('cancel')}>Cancel</Button>
            </>
          )}
          {payment.status === 'CONFIRMED' && (
            <>
              <Button onClick={() => handleAction('receipt', { remarks: 'Standard Receipt' })}>Generate Receipt</Button>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleAction('refund', { notes: 'Customer requested refund' })}>Refund</Button>
            </>
          )}
        </div>
      </div>

      <div className="flex border-b space-x-6">
        {['overview', 'allocations', 'receipts', 'history'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-1 border-b-2 font-medium capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard className="p-6">
            <h2 className="text-lg font-bold mb-4">Payment Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Method</span>
                <span className="font-medium">{payment.method}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Amount Received</span>
                <span className="font-medium">${payment.amountReceived.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Amount Allocated</span>
                <span className="font-medium text-green-600">${payment.amountAllocated.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Unallocated Balance</span>
                <span className="font-medium font-bold text-yellow-600">${payment.unallocatedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Reference / Txn ID</span>
                <span className="font-medium">{payment.referenceNumber || payment.transactionId || 'N/A'}</span>
              </div>
            </div>
          </SectionCard>
          <SectionCard className="p-6">
            <h2 className="text-lg font-bold mb-4">Customer Info</h2>
            <div>
              <p className="font-medium">{payment.customer?.firstName} {payment.customer?.lastName}</p>
              <p className="text-sm text-gray-500">{payment.customer?.email}</p>
              <p className="text-sm text-gray-500">{payment.customer?.phone}</p>
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === 'allocations' && (
        <SectionCard className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-bold">Allocations</h2>
          </div>
          
          <table className="w-full text-left mb-8">
            <thead>
              <tr className="border-b">
                <th className="pb-2">Invoice #</th>
                <th className="pb-2">Date Allocated</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payment.allocations?.map((alloc: any) => (
                <tr key={alloc.id}>
                  <td className="py-2 text-blue-600 font-medium">
                    <a href={`/crm/invoices/${alloc.invoiceId}`}>{alloc.invoice?.invoiceNumber}</a>
                  </td>
                  <td className="py-2 text-gray-500">{new Date(alloc.createdAt).toLocaleString()}</td>
                  <td className="py-2 text-right font-medium">${alloc.allocatedAmount.toFixed(2)}</td>
                </tr>
              ))}
              {(!payment.allocations || payment.allocations.length === 0) && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500">No allocations yet.</td>
                </tr>
              )}
            </tbody>
          </table>

          {payment.status === 'CONFIRMED' && payment.unallocatedAmount > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Allocate Funds</h3>
              <form onSubmit={handleAllocate} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm text-gray-600">Invoice ID</label>
                  <input type="text" required className="w-full border p-2 rounded mt-1" value={allocateInvoiceId} onChange={e => setAllocateInvoiceId(e.target.value)} placeholder="e.g. uuid-of-invoice" />
                </div>
                <div className="w-32">
                  <label className="text-sm text-gray-600">Amount</label>
                  <input type="number" step="0.01" max={payment.unallocatedAmount} required className="w-full border p-2 rounded mt-1" value={allocateAmount} onChange={e => setAllocateAmount(e.target.value)} />
                </div>
                <Button type="submit">Allocate</Button>
              </form>
            </div>
          )}
        </SectionCard>
      )}

      {activeTab === 'receipts' && (
        <SectionCard className="p-6">
          <h2 className="text-lg font-bold mb-4">Generated Receipts</h2>
          <div className="space-y-4">
            {payment.receipts?.map((receipt: any) => (
              <div key={receipt.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{receipt.receiptNumber}</h3>
                  <span className="text-sm text-gray-500">{new Date(receipt.issuedAt).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Customer:</span> {receipt.customerNameSnapshot}</div>
                  <div><span className="text-gray-500">Amount:</span> ${receipt.amountSnapshot.toFixed(2)}</div>
                  <div><span className="text-gray-500">Invoices:</span> {receipt.invoiceNumbersSnapshot}</div>
                  <div><span className="text-gray-500">Method:</span> {receipt.paymentMethodSnapshot}</div>
                </div>
              </div>
            ))}
            {(!payment.receipts || payment.receipts.length === 0) && (
              <p className="text-gray-500 text-center py-4">No receipts generated.</p>
            )}
          </div>
        </SectionCard>
      )}

      {activeTab === 'history' && (
        <SectionCard className="p-6">
          <h2 className="text-lg font-bold mb-4">Activity Log</h2>
          <div className="space-y-4">
            {payment.activities?.map((activity: any) => (
              <div key={activity.id} className="border-b pb-2">
                <div className="flex justify-between">
                  <span className="font-medium text-sm">{activity.action.replace(/_/g, ' ')}</span>
                  <span className="text-xs text-gray-500">{new Date(activity.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
