# GitHub Portfolio Setup

GreenMiles is ready for GitHub portfolio publishing as a dashboard-first MVP.

## Recommended Repository

- Name: `greenmiles-mvp`
- Visibility: public for portfolio use, private if the startup-support application requires confidentiality
- Description: `Dashboard-first MVP for low-carbon local agri-food rewards with Supabase Auth and RLS`

## Publish Commands

From the `greenmiles/` repository root:

```powershell
gh repo create greenmiles-mvp --public --source . --remote origin --push
```

For a private repository:

```powershell
gh repo create greenmiles-mvp --private --source . --remote origin --push
```

If a remote repository already exists:

```powershell
git remote add origin https://github.com/<owner>/<repo>.git
git push -u origin main
```

## Portfolio Checklist

- README explains the MVP scope and dashboard demo.
- Root route opens the dashboard experience.
- Demo data works without Supabase credentials.
- Supabase migrations document the live-data path.
- `npm run typecheck`, `npm run build`, and `npm audit --omit=dev` pass.

## Suggested GitHub Topics

```text
nextjs
typescript
supabase
dashboard
mvp
sustainability
portfolio
startup
```
