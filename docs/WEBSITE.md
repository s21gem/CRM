# Website Architecture

## Overview
The FoneBox Enterprise CRM website serves as the primary acquisition channel and marketing front-end. It is completely data-driven, built using Next.js 15 App Router, and integrates deeply with the CRM backend for lead generation.

## SEO Strategy
- **Sitemap**: `/sitemap.xml` automatically generated for all critical pages.
- **Robots.txt**: Explicit allow directives.
- **Metadata**: Next.js metadata API utilized on every page for title and description tags.

## Analytics Strategy
An abstract analytics layer (`lib/analytics.ts`) tracks:
- `PAGE_VIEW`
- `CTA_CLICK`
- `FORM_START`
- `FORM_SUBMIT`
- `QUOTE_REQUEST`
- `REPAIR_REQUEST`

## Lead Capture Flow
All forms submit to the backend API (`/api/v1/leads/*`). 
Leads are generated sequentially with a unique reference number (e.g. `FBX-2026-000001`) avoiding memory concurrency issues using a database-level upsert sequence strategy.

## Future Plans
- **CMS Integration**: Future iteration will introduce dynamic content fetching for Services and Articles.
- **Multilingual Support**: Next.js Internationalization (i18n) planned for Latin American expansion.
