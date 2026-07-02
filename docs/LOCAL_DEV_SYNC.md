# Local Development Sync

Use the `greenmiles/` directory as the actual app repository. Keep laptop and desktop development synchronized through Git, not through OneDrive folder sync.

## What Belongs In Git

- Source files under `src/`.
- Supabase migrations and config under `supabase/`.
- Docs and task files.
- Package manifests and lockfiles.
- Tests.

## What Stays Local

- `.env.local` and real secrets.
- `node_modules/`.
- `.next/`.
- `.supabase/` runtime state.
- Local database files and logs.

## Machine Handoff

Before switching machines:

```powershell
git status --short
git add .
git commit -m "Complete current GreenMiles task"
git push
```

On the other machine:

```powershell
git pull --ff-only
npm install
```

If Supabase migrations changed, reset or push the database state according to the task.
