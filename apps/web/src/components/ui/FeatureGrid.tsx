interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeatureGridProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
}

export function FeatureGrid({ features, title, subtitle }: FeatureGridProps) {
  return (
    <div className="py-12">
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && <h2 className="text-3xl font-extrabold text-foreground">{title}</h2>}
          {subtitle && <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center text-center p-6">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-6">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
