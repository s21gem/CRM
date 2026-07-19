import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
}

export function PricingCard({ title, price, features, cta, href, popular }: PricingCardProps) {
  return (
    <div className={`relative flex flex-col p-8 bg-white dark:bg-zinc-900 rounded-3xl border ${popular ? 'border-primary shadow-xl ring-1 ring-primary' : 'border-border shadow-sm'}`}>
      {popular && (
        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          Most Popular
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-foreground">{price}</span>
        </div>
      </div>
      
      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <svg className="h-6 w-6 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="ml-3 text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link href={href} className="mt-auto">
        <Button variant={popular ? 'default' : 'outline'} className="w-full h-12 text-lg">
          {cta}
        </Button>
      </Link>
    </div>
  );
}
