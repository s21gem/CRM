import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOMetaProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

export default function SEOMeta({ title, description, url, image }: SEOMetaProps) {
  const siteName = 'FoneBox Global Enterprise';
  const fullTitle = `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Structured Data (JSON-LD) for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteName,
          url: url || 'https://foneboxglobal.com',
          logo: 'https://foneboxglobal.com/logo.png',
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-800-555-0199',
            contactType: 'customer service',
          },
        })}
      </script>
    </Helmet>
  );
}
