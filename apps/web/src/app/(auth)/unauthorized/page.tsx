import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <ShieldAlert className="mb-4 h-16 w-16 text-destructive" />
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Access Denied</h1>
        <p className="mb-8 text-muted-foreground">
          You do not have the required permissions or roles to access this page. Please contact your system administrator if you believe this is a mistake.
        </p>
        <div className="flex space-x-4">
          <Button asChild variant="default">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Switch Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
