'use client';

import { useState, useEffect, use } from 'react';
import { SectionCard } from '@/components/ui/SectionCard';
import { Button } from '@/components/ui/Button';

export default function InvoiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [invoice, setInvoice] = useState<any>(null);
  const [laborForm, setLaborForm] = useState({ description: '', quantity: 1, unitPrice: 0 });

  useEffect(() => {
    fetchInvoice();
  }, [resolvedParams.id]);

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/v1/invoices/${resolvedParams.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const json = await res.json();
      if (json.success) setInvoice(json.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = async (action: string) => {
    try {
      const res = await fetch(`/api/v1/invoices/${resolvedParams.id}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchInvoice();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddLabor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/v1/invoices/${resolvedParams.id}/labor`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(laborForm)
      });
      if (res.ok) {
        setLaborForm({ description: '', quantity: 1, unitPrice: 0 });
        fetchInvoice();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!invoice) return <div>Loading...</div>;

  const isEditable = invoice.status === 'DRAFT' || invoice.status === 'PENDING_REVIEW';
  const canApprove = invoice.status === 'DRAFT' || invoice.status === 'PENDING_REVIEW';
  const canIssue = invoice.status === 'APPROVED';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Invoice {invoice.invoiceNumber}</h1>
          <p className="text-gray-500">For Repair {invoice.repairOrder.repairNumber}</p>
        </div>
        <div className="space-x-2">
          {canApprove && (
            <Button onClick={() => handleAction('approve')}>Approve</Button>
          )}
          {canIssue && (
            <Button onClick={() => handleAction('issue')}>Issue Invoice</Button>
          )}
          {invoice.status !== 'PAID' && invoice.status !== 'VOID' && (
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleAction('void')}>
              Void
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <SectionCard className="p-6">
            <div className="flex flex-row justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Line Items</h2>
              {isEditable && (
                <Button variant="outline" size="sm" onClick={() => handleAction('refresh-parts')}>
                  Refresh Parts
                </Button>
              )}
            </div>
            <div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-right">Qty</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoice.items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-2">
                        <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">{item.type}</span>
                      </td>
                      <td className="py-2">{item.description}</td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-2 text-right">${item.lineTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {isEditable && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-4">Add Labor / Custom Charge</h4>
                  <form onSubmit={handleAddLabor} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="text-sm">Description</label>
                      <input 
                        type="text" 
                        required
                        className="w-full mt-1 border p-2 rounded"
                        value={laborForm.description}
                        onChange={(e) => setLaborForm({...laborForm, description: e.target.value})}
                      />
                    </div>
                    <div className="w-24">
                      <label className="text-sm">Qty</label>
                      <input 
                        type="number" 
                        min="1"
                        required
                        className="w-full mt-1 border p-2 rounded"
                        value={laborForm.quantity}
                        onChange={(e) => setLaborForm({...laborForm, quantity: Number(e.target.value)})}
                      />
                    </div>
                    <div className="w-32">
                      <label className="text-sm">Unit Price</label>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        required
                        className="w-full mt-1 border p-2 rounded"
                        value={laborForm.unitPrice}
                        onChange={(e) => setLaborForm({...laborForm, unitPrice: Number(e.target.value)})}
                      />
                    </div>
                    <Button type="submit">Add</Button>
                  </form>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Summary</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium">{invoice.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Parts Total</span>
                <span>${invoice.partsTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Labor Total</span>
                <span>${invoice.laborTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-lg">
                <span>Grand Total</span>
                <span>${invoice.grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Paid</span>
                <span>${invoice.paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-600 font-bold">
                <span>Balance Due</span>
                <span>${invoice.balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Customer Details</h2>
            </div>
            <div>
              <p className="font-medium">{invoice.customer.firstName} {invoice.customer.lastName}</p>
              <p className="text-sm text-gray-500">{invoice.customer.email}</p>
              <p className="text-sm text-gray-500">{invoice.customer.phone}</p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
