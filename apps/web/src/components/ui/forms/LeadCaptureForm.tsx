'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Analytics } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';

const leadSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  company: z.string().optional(),
  phone: z.string().min(5, 'Required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message too short'),
  consentAccepted: z.boolean().refine(val => val === true, 'Required'),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadCaptureFormProps {
  type: 'inquiry' | 'quote' | 'repair' | 'business';
  title: string;
  subtitle?: string;
}

export function LeadCaptureForm({ type, title, subtitle }: LeadCaptureFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { consentAccepted: false }
  });

  const onSubmit = async (data: LeadFormValues) => {
    setStatus('loading');
    Analytics.trackEvent('FORM_START', { type });

    try {
      const response = await fetch(`http://localhost:4000/api/v1/leads/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'WEBSITE' }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit');
      }

      setStatus('success');
      Analytics.trackEvent('FORM_SUBMIT', { type, success: true });
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message);
      Analytics.trackEvent('FORM_SUBMIT', { type, success: false, error: error.message });
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center max-w-lg mx-auto">
        <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">Success!</h3>
        <p className="text-green-700 dark:text-green-500 text-lg">Your request has been successfully submitted. Our enterprise team will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-zinc-900/50 p-8 rounded-xl border border-border max-w-2xl mx-auto w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>
      
      {status === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-center">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">First Name *</label>
          <input 
            {...register('firstName')} 
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.firstName && <span className="text-xs text-red-500 mt-1 block">{errors.firstName.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Last Name *</label>
          <input 
            {...register('lastName')} 
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.lastName && <span className="text-xs text-red-500 mt-1 block">{errors.lastName.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Phone Number *</label>
          <input 
            {...register('phone')} 
            type="tel"
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.phone && <span className="text-xs text-red-500 mt-1 block">{errors.phone.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Email Address *</label>
          <input 
            {...register('email')} 
            type="email"
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
        </div>
      </div>

      {type === 'business' && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Company Name</label>
          <input 
            {...register('company')} 
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">How can we help? *</label>
        <textarea 
          {...register('message')} 
          rows={4}
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.message && <span className="text-xs text-red-500 mt-1 block">{errors.message.message}</span>}
      </div>

      <div className="flex items-start gap-3">
        <input 
          type="checkbox" 
          {...register('consentAccepted')} 
          className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label className="text-sm text-muted-foreground">
          I consent to FoneBox collecting my details for the purpose of this inquiry according to the <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
        </label>
      </div>
      {errors.consentAccepted && <span className="text-xs text-red-500 block">{errors.consentAccepted.message}</span>}

      <div className="pt-4">
        <Button type="submit" size="lg" className="w-full text-lg" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
}
