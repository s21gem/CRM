# Design System

The Enterprise Design System focuses on professionalism, clarity, and trust.

## Core Principles
1. **Security & Trust:** Conveyed through a strong color palette and solid layout.
2. **Readability:** High contrast, strictly structured typography.
3. **Consistency:** Reusable design tokens via Tailwind CSS.

## Color Palette
Defined as HSL CSS variables in `apps/web/src/styles/globals.css`.
- **Primary:** Primary Blue (`hsl(221 83% 53%)`)
- **Secondary:** Deep Navy (`hsl(217 32% 17%)`)
- **Muted/Borders:** Slate/Soft Gray variants
- **Status Alerts:**
  - Success Green
  - Warning Amber
  - Danger Red

## Typography
- **Sans-Serif:** `Inter` (Primary UI Font)
- **Monospace:** `JetBrains Mono` (Code/Data visualization)

## UI Components
Built on top of Radix UI and Tailwind CSS.
- **Buttons:** Clean, distinct state changes. No extravagant animations.
- **Cards (SectionCard, StatCard):** Soft shadows (`shadow-soft`), medium border radius.
- **Forms:** Using `react-hook-form` + `zod`. Standardized input heights and border states.
