# Component Library

The UI components in `apps/web/src/components/ui` are built to be highly reusable, ensuring visual consistency across both the marketing website and the future CRM dashboard.

## 1. Core Primitives

### `Button`
- **Responsibilities**: Handles click events, form submissions, and loading states.
- **Variants**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`.
- **Props**: Inherits `React.ButtonHTMLAttributes`. Supports custom `size` and `asChild` for rendering as a different element (like `Link`).

## 2. Marketing Layouts

### `Hero`
- **Responsibilities**: Displays top-of-funnel messaging and primary CTA.
- **Usage**: Typically used once per page at the top.
- **Props**: `title`, `subtitle`, `primaryCta`, `secondaryCta`, `imageUrl`, `children` (for embedding forms).

### `SectionHeader`
- **Responsibilities**: Consistent titling for marketing sections.
- **Props**: `title`, `subtitle`, `centered`.

### `CTABanner`
- **Responsibilities**: High-conversion bottom-of-funnel component.
- **Props**: `title`, `description`, `ctaText`, `href`.

## 3. Cards

### `ServiceCard` / `FeatureGrid`
- **Responsibilities**: Displaying services and benefits clearly.
- **Props**: Include icons, titles, descriptions, and optional links.

### `PricingCard`
- **Responsibilities**: Tiered pricing display.
- **Props**: Highlights the `popular` tier visually using a primary color border and badge.

### `TestimonialCard`
- **Responsibilities**: Social proof display. Incorporates star ratings.
- **Props**: `name`, `role`, `company`, `quote`, `avatarUrl`.

## 4. Forms
Located in `components/ui/forms`. These abstract `react-hook-form` and `zod` logic for easy reuse.
- `QuickQuoteForm`: Simplified intake.
- `LeadCaptureForm`: Comprehensive intake with dynamic rendering based on the `type` prop (`inquiry` | `quote` | `business`).
