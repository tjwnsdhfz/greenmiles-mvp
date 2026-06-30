# CODEX_ENV_AND_SECRETS — GreenMiles Environment Guide

## Required `.env.example` keys

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
ENABLE_RECEIPT_OCR=false
OPENAI_API_KEY=
POLYGON_AMOY_RPC_URL=
POLYGON_AMOY_PRIVATE_KEY=
GREENMILES_ANCHOR_CONTRACT_ADDRESS=
```

## Rules for Codex

- Never commit `.env.local`.
- Never commit real Supabase service-role keys.
- Never commit wallet private keys.
- Never add mainnet env names unless explicitly instructed.
- Keep OCR disabled by default.
- Use local mocks when keys are absent.
- Use Polygon Amoy or local Hardhat only for blockchain.

## When real keys are eventually needed

Use staging-only keys first:

1. Supabase staging project URL and anon key
2. Supabase staging service role key only in server runtime
3. Polygon Amoy test wallet with limited test funds
4. OpenAI API key only for optional receipt OCR after manual review flow works

## Forbidden

- Mainnet private keys
- Production secrets in repo
- Hardcoded API keys
- Sending real consumer PII to OCR or blockchain
- On-chain storage of emails, phone numbers, receipt images, product-level purchase details
