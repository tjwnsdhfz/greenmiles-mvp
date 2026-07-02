import type { Metadata } from "next";

import { getDashboardData } from "@/features/dashboard/data";
import { demoDashboardData } from "@/features/dashboard/demo-data";
import {
  formatNumber,
  getDistanceTrend,
  getImpactStats,
  getModeBreakdown,
  travelModeLabels,
} from "@/features/dashboard/metrics";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GreenMiles MVP Dashboard",
  description: "Portfolio-ready GreenMiles MVP dashboard demo.",
};

type DashboardMode = "demo" | "live";

export default async function DashboardPage() {
  const { data, mode, notice } = await loadDashboard();
  const modeBreakdown = getModeBreakdown(data.recentTrips);
  const trend = getDistanceTrend(data.recentTrips);
  const impact = getImpactStats(data);
  const maxTrendDistance = Math.max(...trend.map((item) => item.distanceKm), 1);

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">GreenMiles MVP</p>
          <h1>Personal mobility impact dashboard</h1>
          <p className="summary">
            Track trips, green mileage, and avoided emissions in a founder demo
            that can run with sample data or Supabase-backed user data.
          </p>
        </div>
        <div className={`source-badge ${mode}`}>
          <span>{mode === "live" ? "Supabase live" : "Demo data"}</span>
          <strong>{mode === "live" ? "RLS scoped" : "Portfolio preview"}</strong>
        </div>
      </section>

      {notice ? <p className="dashboard-notice">{notice}</p> : null}

      <section className="metric-grid" aria-label="GreenMiles summary">
        <Metric label="Trips logged" value={formatNumber(data.summary.trip_count)} />
        <Metric
          label="Green distance"
          value={`${formatNumber(data.summary.total_distance_km, 1)} km`}
        />
        <Metric
          label="CO2e avoided"
          value={`${formatNumber(data.summary.avoided_co2e_kg, 1)} kg`}
        />
        <Metric
          label="Avg trip"
          value={`${formatNumber(impact.averageDistance, 1)} km`}
        />
      </section>

      <section className="dashboard-grid" aria-label="Dashboard analysis">
        <section className="dashboard-panel trend-panel">
          <div className="section-heading">
            <span>Recent distance</span>
            <strong>{data.summary.last_trip_on ?? "No trips"}</strong>
          </div>
          <div className="trend-chart" aria-label="Recent trip distance bars">
            {trend.map((item) => (
              <div className="trend-item" key={item.label}>
                <div className="trend-bar-wrap">
                  <div
                    className="trend-bar"
                    style={{
                      height: `${Math.max((item.distanceKm / maxTrendDistance) * 100, 8)}%`,
                    }}
                  />
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="section-heading">
            <span>Travel mix</span>
            <strong>{data.recentTrips.length} recent</strong>
          </div>
          <div className="mode-list">
            {modeBreakdown.map((item) => (
              <div className="mode-row" key={item.mode}>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.count} trips</span>
                </div>
                <div className="mode-meter" aria-hidden="true">
                  <span style={{ width: `${item.percent}%` }} />
                </div>
                <em>{item.percent}%</em>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="section-heading">
            <span>Impact proxy</span>
            <strong>MVP estimate</strong>
          </div>
          <div className="impact-list">
            <p>
              <strong>{formatNumber(impact.carKmAvoided, 0)} km</strong>
              comparable solo car distance avoided
            </p>
            <p>
              <strong>{formatNumber(impact.treeDaysEquivalent, 0)}</strong>
              tree-days of carbon absorption proxy
            </p>
          </div>
        </section>

        <section className="dashboard-panel readiness-panel">
          <div className="section-heading">
            <span>MVP readiness</span>
            <strong>Demo path</strong>
          </div>
          <ul className="readiness-list">
            <li>Dashboard preview works without external services</li>
            <li>Supabase Auth and RLS schema are migration-backed</li>
            <li>Portfolio route starts at the dashboard</li>
          </ul>
        </section>
      </section>

      <section className="trip-panel" aria-label="Recent trips">
        <div className="section-heading">
          <span>Recent trips</span>
          <strong>{data.recentTrips.length} shown</strong>
        </div>

        {data.recentTrips.length === 0 ? (
          <p className="empty-state">
            No trips are visible for this account yet. New user-owned rows will
            appear here after trip creation is implemented.
          </p>
        ) : (
          <div className="trip-list">
            {data.recentTrips.map((trip) => (
              <article className="trip-row" key={trip.id}>
                <div>
                  <h2>
                    {trip.origin} to {trip.destination}
                  </h2>
                  <p>
                    {travelModeLabels[trip.travel_mode]} / {trip.occurred_on}
                  </p>
                </div>
                <div className="trip-metrics">
                  <strong>{formatNumber(trip.distance_km, 1)} km</strong>
                  <span>
                    {formatNumber(trip.avoided_co2e_kg ?? 0, 1)} kg CO2e saved
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

async function loadDashboard(): Promise<{
  data: typeof demoDashboardData;
  mode: DashboardMode;
  notice?: string;
}> {
  if (!hasSupabaseEnv()) {
    return {
      data: demoDashboardData,
      mode: "demo",
      notice:
        "Supabase env vars are not configured, so this portfolio build is showing demo data.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      data: demoDashboardData,
      mode: "demo",
      notice:
        "No active user session was found. The live dashboard will use RLS-scoped rows after sign-in is added.",
    };
  }

  try {
    return {
      data: await getDashboardData(supabase, user.id),
      mode: "live",
    };
  } catch (error) {
    return {
      data: demoDashboardData,
      mode: "demo",
      notice:
        error instanceof Error
          ? `Live data failed to load: ${error.message}`
          : "Live data failed to load. Demo data is shown instead.",
    };
  }
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
