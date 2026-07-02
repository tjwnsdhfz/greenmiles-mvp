# Git Workflow

Keep `main` runnable. Use short branches for each task.

## Branch Naming

```text
task/01-db-auth-rls
task/02-auth-ui
fix/rls-trip-owner-policy
```

## Daily Start

```powershell
git status --short --branch
git pull --ff-only
```

## Commit Rules

- Commit one task at a time.
- Keep generated dependency/build output out of Git.
- Update `.env.example` when new environment variables are required.
- Represent database changes as Supabase migrations.

## Before Merge

Run:

```powershell
npm run typecheck
npm run build
```

Then confirm:

- The change matches the task scope.
- No secrets are included.
- RLS changes are covered by migration SQL.
- README/docs reflect workflow changes.
