create or replace view public.retailer_dashboard_summary
with (security_invoker = true)
as
select
  stores.organization_id,
  count(distinct stores.id)::integer as store_count,
  count(distinct product_skus.id) filter (where product_skus.status = 'approved')::integer as approved_sku_count,
  count(distinct purchase_items.id)::integer as purchase_count,
  coalesce(sum(reward_events.reward_points), 0)::numeric(14, 2) as reward_points_issued,
  coalesce(sum(reward_events.estimated_carbon_contribution), 0)::numeric(14, 3) as estimated_carbon_contribution,
  count(distinct purchase_items.consumer_id)::integer as unique_consumers
from public.stores
left join public.product_skus on product_skus.store_id = stores.id
left join public.purchase_items on purchase_items.sku_id = product_skus.id
left join public.reward_events on reward_events.purchase_item_id = purchase_items.id
where public.is_admin() or public.is_org_member(stores.organization_id)
group by stores.organization_id;

grant select on public.retailer_dashboard_summary to authenticated;

comment on view public.retailer_dashboard_summary is
  'RLS-scoped retailer ESG dashboard aggregate for GreenMiles MVP.';
