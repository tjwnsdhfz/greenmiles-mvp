create or replace view public.trip_dashboard_summary
with (security_invoker = true)
as
select
  trips.user_id,
  count(*)::integer as trip_count,
  coalesce(sum(trips.distance_km), 0)::numeric(12, 2) as total_distance_km,
  coalesce(sum(trips.estimated_co2e_kg), 0)::numeric(12, 3) as estimated_co2e_kg,
  coalesce(sum(trips.avoided_co2e_kg), 0)::numeric(12, 3) as avoided_co2e_kg,
  max(trips.occurred_on) as last_trip_on
from public.trips
where trips.user_id = (select auth.uid())
group by trips.user_id;

grant select on public.trip_dashboard_summary to authenticated;

comment on view public.trip_dashboard_summary is
  'Current-user GreenMiles dashboard aggregate. Uses security_invoker and auth.uid() to preserve user isolation.';
