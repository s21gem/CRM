# Performance Review

This document outlines the performance strategy and current benchmarks for the FoneBox Enterprise CRM Monorepo.

## 1. Web Vitals Readiness
The marketing frontend is built using Next.js 15 App Router Server Components. This architecture inherently minimizes the client-side JavaScript bundle.
- **LCP (Largest Contentful Paint)**: Hero sections currently load extremely fast due to SSR.
- **FID (First Input Delay)**: Minimal client hydration ensures rapid interactivity.
- **CLS (Cumulative Layout Shift)**: Forms and grid layouts are dimension-locked to prevent reflows.

## 2. Image Optimization
- Images currently use standard `<img>` tags intentionally to support pure static exports and initial rapid prototyping without Vercel-specific image optimization dependencies.
- **Future Recommendation**: Transition `<img>` to Next.js `<Image />` component with a configured external image loader if hosting outside of Vercel to compress assets to WebP/AVIF formats automatically.

## 3. Bundle Organization
- The Tailwind configuration is highly optimized to purge unused styles.
- Common components (Button, Cards) are lazy-loaded where not required on initial paint, although Server Components currently handle most heavy lifting.
- Zod schemas are shared across boundaries efficiently.

## 4. API Performance
- The backend relies on Prisma, which currently connects directly to PostgreSQL.
- **Future Recommendation**: Implement a connection pooler (e.g., PgBouncer) or Prisma Accelerate for scale.
- Sequence generation is optimized using atomic `upsert` transactions, preventing table locks during high-concurrency lead submissions.
