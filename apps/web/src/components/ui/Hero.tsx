import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface HeroProps {
  title: string;
  subtitle: string;
  primaryCta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  imageUrl?: string;
  children?: React.ReactNode;
}

export function Hero({ title, subtitle, primaryCta, secondaryCta, imageUrl, children }: HeroProps) {
  return (
    <div className="relative bg-background overflow-hidden border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-background sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl">
                <span className="block xl:inline">{title.split(' ')[0]} </span>
                <span className="block text-primary xl:inline">{title.substring(title.indexOf(' ') + 1)}</span>
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                {subtitle}
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-3">
                <div className="rounded-md shadow">
                  <Link href={primaryCta.href}>
                    <Button size="lg" className="w-full flex items-center justify-center px-8 py-3 text-base font-medium md:py-4 md:text-lg md:px-10">
                      {primaryCta.text}
                    </Button>
                  </Link>
                </div>
                {secondaryCta && (
                  <div className="mt-3 sm:mt-0">
                    <Link href={secondaryCta.href}>
                      <Button variant="outline" size="lg" className="w-full flex items-center justify-center px-8 py-3 text-base font-medium md:py-4 md:text-lg md:px-10 bg-transparent">
                        {secondaryCta.text}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Decorative Image or Form Area */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-6 lg:p-12">
        {imageUrl ? (
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full rounded-2xl shadow-xl"
            src={imageUrl}
            alt="Hero visualization"
          />
        ) : children}
      </div>
    </div>
  );
}
