interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({ title, subtitle, centered = true }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
      <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className={`mt-4 text-xl text-muted-foreground ${centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
