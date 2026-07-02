# GreenMiles MVP Demo Script

Use this script for startup-support review, investor conversations, or GitHub portfolio walkthroughs.

## 1. Open the Dashboard

Open:

```text
http://localhost:3000
```

The root route redirects to `/retailer/dashboard`.

Talking points:

- GreenMiles turns low-carbon/local agri-food purchases into GreenMiles points.
- The business customer is the retailer/food company that needs ESG and Scope 3 reference data.
- The dashboard is demo-data backed by default, so the review can run without external services.

## 2. Retailer ESG Dashboard

Show:

- purchase claim count
- reward points issued
- estimated carbon contribution
- local-food ratio
- reward trend
- SKU samples
- MRV status

Use careful wording: "estimated carbon contribution" and "GreenMiles points", not official carbon credits.

## 3. Mock POS / QR Event

Open `/retailer/pos`.

Explain:

- The retailer selects a SKU and creates a one-time QR token.
- This replaces real POS API integration in the MVP.
- Duplicate/expired QR claims are blocked by POS event status.

## 4. Consumer QR Claim

Open `/claim`.

Explain:

- The consumer scans the QR token.
- The system calculates points deterministically from purchase amount, food mileage, low-carbon certification, and local-food status.
- The event becomes wallet and MRV input data.

## 5. Consumer Wallet

Open `/consumer/wallet`.

Show:

- GreenMiles point balance
- estimated carbon contribution

## 6. Farmer SKU Screen

Open `/farmer/products`.

Explain:

- Producers register SKU, production method, certification, and distance data.
- Retailer/admin approval makes SKUs eligible for claims.

## 7. Admin MRV

Open `/admin/mrv`.

Explain:

- MRV batches group verified reward events.
- Only batch hashes are intended for testnet/local blockchain anchoring.
- No personal information or purchase detail is written on-chain.

## 8. Live Data Path

Explain:

- Supabase migrations define the real database model and RLS.
- Demo data can be replaced by Supabase queries after environment values are configured.
- MVP excludes production deployment, mainnet, and legal carbon-credit issuance.
