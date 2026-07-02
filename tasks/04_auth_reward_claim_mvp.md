# 04 Auth and Reward Claim MVP

## Goal

Add the minimum live MVP workflow around the dashboard: sign in, generate a mock POS/QR event, claim a purchase, calculate GreenMiles points, and show wallet/MRV states.

## Scope

- Add Supabase email/password auth route.
- Add server actions for sign-in, sign-up, and sign-out.
- Add mock POS, QR claim, consumer wallet, farmer SKU, and admin MRV route shells.
- Add deterministic GreenMiles reward calculation with food-mileage and low-carbon certification inputs.
- Keep dashboard demo mode available when Supabase is not configured.

## Implemented Files

- `src/app/auth/page.tsx`
- `src/app/auth/actions.ts`
- `src/app/retailer/pos/page.tsx`
- `src/app/claim/page.tsx`
- `src/app/consumer/wallet/page.tsx`
- `src/app/farmer/products/page.tsx`
- `src/app/admin/mrv/page.tsx`
- `src/features/rewards/calculate.ts`
- `src/features/rewards/calculate.test.ts`

## Verification

- `/retailer/dashboard` renders demo dashboard.
- `/retailer/pos` renders mock QR event.
- `/claim` renders deterministic reward claim result.
- `/consumer/wallet` renders point balance.
- `/admin/mrv` renders MRV status.
