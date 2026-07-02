import type { Metadata } from "next";
import Link from "next/link";

import { createTrip } from "./actions";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Add trip | GreenMiles",
};

export default async function NewTripPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  const configured = hasSupabaseEnv();
  const user = configured
    ? (await (await createClient()).auth.getUser()).data.user
    : null;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="auth-shell">
      <section className="auth-panel wide">
        <div>
          <p className="eyebrow">New trip</p>
          <h1>Add a GreenMiles trip</h1>
          <p className="summary">
            Saved trips are scoped to the signed-in user and appear on the
            dashboard through Supabase RLS policies.
          </p>
        </div>

        {!configured ? (
          <p className="dashboard-notice">
            Supabase env vars are not configured, so trip saving is disabled.
          </p>
        ) : null}

        {configured && !user ? (
          <p className="dashboard-notice">
            Sign in before adding live trip records.
          </p>
        ) : null}

        {message ? <p className="form-message">{message}</p> : null}

        <form className="mvp-form two-column" action={createTrip}>
          <label>
            Origin
            <input name="origin" type="text" placeholder="Home" required />
          </label>
          <label>
            Destination
            <input
              name="destination"
              type="text"
              placeholder="Startup incubator"
              required
            />
          </label>
          <label>
            Distance km
            <input
              name="distance_km"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="8.4"
              required
            />
          </label>
          <label>
            Date
            <input name="occurred_on" type="date" defaultValue={today} required />
          </label>
          <label>
            Travel mode
            <select name="travel_mode" defaultValue="transit" required>
              <option value="walk">Walk</option>
              <option value="bike">Bike</option>
              <option value="transit">Transit</option>
              <option value="carpool">Carpool</option>
              <option value="ev">EV</option>
              <option value="car">Car</option>
            </select>
          </label>
          <div className="form-actions full-row">
            <button type="submit" disabled={!configured || !user}>
              Save trip
            </button>
            <Link className="secondary-action" href="/dashboard">
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
