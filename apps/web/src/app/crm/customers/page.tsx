'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SectionCard } from '@/components/ui/SectionCard';
import { Search, Plus, Filter, FileText, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface Customer {
  id: string;
  customerNumber: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  status: string;
  createdAt: string;
  devices: any[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const fetchCustomers = async (searchQuery: string = search) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/customers?page=${page}&limit=10&search=${searchQuery}`);
      const result = await res.json();
      
      if (result.success) {
        setCustomers(result.data.customers);
        setTotal(result.data.total);
      } else {
        toast.error(result.message || 'Failed to fetch customers');
      }
    } catch (error) {
      toast.error('Network error fetching customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers(search);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Client Workspace</h1>
          <p className="text-muted-foreground mt-1">Manage corporate clients and their systems.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Client</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SectionCard className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Clients</h3>
          <p className="text-3xl font-bold mt-2">{total}</p>
        </SectionCard>
        <SectionCard className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Active Systems</h3>
          <p className="text-3xl font-bold mt-2">-</p>
        </SectionCard>
        <SectionCard className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Onboardings</h3>
          <p className="text-3xl font-bold mt-2">-</p>
        </SectionCard>
      </div>

      <SectionCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
          <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name, phone, email, IMEI..."
              className="w-full bg-background border border-input rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <button className="ml-4 p-2 border border-input rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Systems</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                customers.map(customer => (
                  <tr key={customer.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{customer.firstName} {customer.lastName}</div>
                      <div className="text-xs text-muted-foreground">{customer.customerNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground">{customer.phone || 'No phone'}</div>
                      <div className="text-xs text-muted-foreground">{customer.email || 'No email'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Smartphone className="w-4 h-4" />
                        <span>{customer.devices?.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/crm/customers/${customer.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Simple Pagination */}
        <div className="p-4 border-t border-border flex justify-between items-center bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Showing {customers.length} of {total} customers
          </p>
          <div className="flex space-x-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 border border-input rounded-md text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              disabled={customers.length < 10}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border border-input rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
