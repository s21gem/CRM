import Link from 'next/link';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  href: string;
}

export function ServiceCard({ title, description, icon, href }: ServiceCardProps) {
  return (
    <div className="group relative bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
      {icon && (
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground mb-6 line-clamp-3">{description}</p>
      
      <Link href={href} className="text-primary font-semibold text-sm hover:underline inline-flex items-center">
        Learn more
        <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
