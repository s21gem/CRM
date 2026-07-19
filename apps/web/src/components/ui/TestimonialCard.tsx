interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl?: string;
}

export function TestimonialCard({ name, role, company, quote, avatarUrl }: TestimonialCardProps) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-2xl border border-border">
      <div className="flex items-center gap-1 text-yellow-400 mb-6">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-lg text-foreground italic mb-6">&quot;{quote}&quot;</p>
      
      <div className="flex items-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-12 w-12 rounded-full mr-4" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg mr-4">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <h4 className="text-sm font-bold text-foreground">{name}</h4>
          <p className="text-xs text-muted-foreground">{role}{company ? `, ${company}` : ''}</p>
        </div>
      </div>
    </div>
  );
}
