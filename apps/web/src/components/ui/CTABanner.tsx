import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface CTABannerProps {
  title: string;
  description: string;
  ctaText: string;
  href: string;
  secondaryCtaText?: string;
  secondaryHref?: string;
}

export function CTABanner({ title, description, ctaText, href, secondaryCtaText, secondaryHref }: CTABannerProps) {
  return (
    <div className="bg-primary text-white rounded-3xl overflow-hidden shadow-2xl">
      <div className="px-6 py-12 md:py-20 md:px-12 text-center lg:flex lg:items-center lg:justify-between lg:text-left">
        <div className="lg:w-2/3">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-foreground/90 max-w-2xl">
            {description}
          </p>
        </div>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 justify-center lg:justify-end gap-4">
          <Link href={href}>
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg bg-white text-primary hover:bg-zinc-100">
              {ctaText}
            </Button>
          </Link>
          {secondaryCtaText && secondaryHref && (
            <Link href={secondaryHref}>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
                {secondaryCtaText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
