# Dashboard Plan

This document tracks the dashboard-first MVP implementation for the GreenMiles low-carbon/local agri-food reward platform.

## Dashboard Purpose

The retailer ESG dashboard should help a founder, reviewer, retailer, or ESG stakeholder answer:

- How many QR/receipt purchase claims have been captured?
- How many GreenMiles points have been issued?
- What is the estimated carbon contribution from low-carbon/local products?
- Which SKUs and stores are driving the pilot?
- What MRV status can be shown without claiming official carbon credits?

## Initial Data Sources

- `public.product_skus`
- `public.pos_events`
- `public.purchase_items`
- `public.reward_events`
- `public.retailer_dashboard_summary`
- Supabase Auth user session

The live dashboard must read only organization-scoped retailer rows visible through RLS. Demo mode uses built-in sample data.

## First Screen Scope

The first dashboard screen should include:

- Retailer summary metrics.
- Reward issue trend.
- Local-food vs long-distance SKU mix.
- MRV status breakdown.
- Approved SKU samples.
- Demo data fallback when Supabase env vars or user sessions are missing.
- Empty state when live user data has no purchase/reward events.

Out of scope for the first dashboard pass:

- Full date-range filtering.
- Real POS integration.
- Automated OCR.
- Mainnet blockchain anchoring.
- Legal carbon-credit issuance.

## Implementation Notes

- Keep dashboard demo/read-model data in `src/features/dashboard/data.ts`.
- Keep derived metrics in `src/features/dashboard/metrics.ts`.
- Keep Supabase table/view types in `src/lib/database.types.ts` until generated types are wired.
- Keep route shells aligned with PRD/TRD flows: POS, QR claim, wallet, farmer SKUs, admin MRV.
