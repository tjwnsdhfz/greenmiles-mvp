# MVP Limitations

GreenMiles is currently a startup-support and portfolio MVP. It is not a production carbon-credit product.

## Product Limitations

- No official legal carbon credits are issued.
- GreenMiles points are rewards, not securities or regulated offsets.
- Carbon contribution values are estimates for MVP validation.
- MRV and blockchain screens demonstrate the intended trust workflow, not a certified VCM integration.

## Technical Limitations

- Dashboard data is built-in demo data unless Supabase env vars and migrations are configured.
- Real POS API integration is replaced by a mock POS/QR flow.
- Receipt OCR is not automated; MVP assumes manual review first.
- Blockchain anchoring is represented as local/testnet-ready status only.
- Role-based route guards are not fully enforced at the UI route layer yet; RLS is the primary planned enforcement layer.

## Security Limitations

- No real PII should be entered in demo data.
- No service role keys, private keys, or wallet mnemonics should be committed.
- Supabase RLS policies must be tested in a real Supabase environment before pilot use.

## Pilot Readiness Gaps

- Seed data script for Supabase demo accounts is still needed.
- QR token claim should be made transactional before real pilot use.
- Receipt upload needs Supabase Storage integration.
- Admin approval and MRV state transition actions need implementation.
- Testnet anchoring contract/function is not implemented.
