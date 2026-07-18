import * as React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-soft">
        <div className="flex flex-col items-center space-y-2 text-center">
          <ShieldCheck className="h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Sign in to FoneBox CRM</h1>
          <p className="text-sm text-muted-foreground">Enter your enterprise credentials to access the platform</p>
        </div>
        
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
              Work Email
            </label>
            <input
              type="email"
              id="email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="name@enterprise.com"
              required
            />
          </div>
          <div className="space-y-2">
             <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                  Password
                </label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
             </div>
            <input
              type="password"
              id="password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
          <Button type="button" className="w-full">
            <Link href="/dashboard" className="w-full">Sign In</Link>
          </Button>
        </form>
        
        <div className="text-center text-xs text-muted-foreground">
          Protected by Enterprise SSO
        </div>
      </div>
    </main>
  );
}
