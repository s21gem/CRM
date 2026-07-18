import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <Link
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="/"
          >
            <ShieldCheck className="h-8 w-8 text-primary" />
            <span className="font-sans text-2xl font-bold tracking-tight text-secondary dark:text-white">FoneBox CRM</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center mt-24">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
          Enterprise Client Management
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Secure, scalable, and professional operations platform for FinTech, Cyber Security, and Enterprise ICT solutions.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/login"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
          >
            Sign In
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
            Go to Dashboard <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
