'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Analytics } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';

const quoteSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(5, 'Valid phone is required'),
  email: z.string().email('Invalid email'),
  deviceType: z.string().min(1, 'Device type is required'),
  message: z.string().min(10, 'Please describe the issue (min 10 chars)'),
  consentAccepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export function QuickQuoteForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      consentAccepted: false,
    }
  });

  const onSubmit = async (data: QuoteFormValues) => {
    setStatus('loading');
    Analytics.trackEvent('FORM_START', { type: 'QuickQuote' });

    try {
      const response = await fetch('http://localhost:4000/api/v1/leads/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'WEBSITE' }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit quote');
      }

      setStatus('success');
      Analytics.trackEvent('QUOTE_REQUEST', { success: true });
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message);
      Analytics.trackEvent('QUOTE_REQUEST', { success: false, error: error.message });
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-green-800 dark:text-green-400 mb-2">Quote Request Received!</h3>
        <p className="text-green-700 dark:text-green-500">Our enterprise team will contact you shortly with an estimate.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-border">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Request a Quick Quote</h3>
      </div>
      
      {status === 'error' && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
          <input 
            {...register('firstName')} 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="John"
          />
          {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
          <input 
            {...register('lastName')} 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Doe"
          />
          {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
          <input 
            {...register('phone')} 
            type="tel"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="+1 (555) 000-0000"
          />
          {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Email</label>
          <input 
            {...register('email')} 
            type="email"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="john@company.com"
          />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Device Type</label>
        <select 
          {...register('deviceType')}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select Device...</option>
          <option value="Smartphone">Smartphone</option>
          <option value="Tablet">Tablet</option>
          <option value="Laptop">Laptop / Desktop</option>
          <option value="Other">Other Enterprise Hardware</option>
        </select>
        {errors.deviceType && <span className="text-xs text-red-500">{errors.deviceType.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Describe the Issue</label>
        <textarea 
          {...register('message')} 
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Screen is cracked, battery drains fast..."
        />
        {errors.message && <span className="text-xs text-red-500">{errors.message.message}</span>}
      </div>

      <div className="flex items-start gap-2 pt-2">
        <input 
          type="checkbox" 
          {...register('consentAccepted')} 
          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label className="text-xs text-muted-foreground">
          I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
        </label>
      </div>
      {errors.consentAccepted && <span className="text-xs text-red-500 block">{errors.consentAccepted.message}</span>}

      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting...' : 'Get Quick Quote'}
        </Button>
      </div>
    </form>
  );
}
