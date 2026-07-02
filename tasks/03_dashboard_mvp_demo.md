# 03 Dashboard MVP Demo

## Goal

Make GreenMiles presentable for startup-support review and GitHub portfolio use with a dashboard-first MVP.

## Scope

- Root route redirects to `/retailer/dashboard`.
- Dashboard renders meaningful demo data without external services.
- Dashboard shows purchase claims, reward points, estimated carbon contribution, local-food ratio, reward trend, MRV status, and approved SKU samples.
- Supporting route shells show the intended QR claim, wallet, farmer SKU, and admin MRV flow.

## Implemented Files

- `src/app/page.tsx`
- `src/app/retailer/dashboard/page.tsx`
- `src/app/retailer/pos/page.tsx`
- `src/app/claim/page.tsx`
- `src/app/consumer/wallet/page.tsx`
- `src/app/farmer/products/page.tsx`
- `src/app/admin/mrv/page.tsx`
- `src/app/globals.css`
- `src/features/dashboard/data.ts`
- `src/features/dashboard/metrics.ts`

## Verification

```powershell
npm run typecheck
npm run build
npm run test
npm audit --omit=dev
```
