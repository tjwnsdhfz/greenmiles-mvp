import type { Metadata } from "next";
import Link from "next/link";

import { signIn, signUp } from "./actions";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Sign in | GreenMiles",
};

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  const configured = hasSupabaseEnv();

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">GreenMiles account</p>
          <h1>Sign in for live dashboard data</h1>
          <p className="summary">
            Demo mode works without an account. Supabase sign-in enables
            user-owned wallet and purchase reward data protected by row-level security.
          </p>
        </div>

        {!configured ? (
          <p className="dashboard-notice">
            Supabase env vars are not configured. The dashboard remains
            available in demo mode.
          </p>
        ) : null}

        {message ? <p className="form-message">{message}</p> : null}

        <form className="mvp-form" action={signIn}>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={6}
              required
            />
          </label>
          <div className="form-actions">
            <button type="submit">Sign in</button>
            <button type="submit" formAction={signUp}>
              Create account
            </button>
          </div>
        </form>

        <Link className="text-link" href="/dashboard">
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
