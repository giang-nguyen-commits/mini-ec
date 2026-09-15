-- Mini EC: reserve stock on pending order, restore on cancel.
-- Run in Supabase SQL Editor or: supabase db query --linked --yes -f docs/order-stock-reservation.sql

delete from public.orders where user_id is null;

alter table public.orders
  drop constraint if exists orders_user_id_fkey;

alter table public.orders
  add constraint orders_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete restrict;

alter table public.orders
  alter column user_id set not null;

alter table public.orders
  add column if not exists stripe_session_id text;

create unique index if not exists orders_stripe_session_id_key
  on public.orders (stripe_session_id)
  where stripe_session_id is not null;

comment on column public.orders.stripe_session_id is
  'Stripe Checkout Session id. Set when the hosted Checkout URL is created.';

drop policy if exists "orders_insert_public" on public.orders;

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
on public.orders
for select
to authenticated
using (user_id = auth.uid());

revoke insert on table public.orders from anon, authenticated;
grant select on table public.orders to authenticated;

create or replace function public.reserve_stock_and_create_order(
  p_order_id uuid,
  p_user_id uuid,
  p_customer_name text,
  p_phone text,
  p_address text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_product_id uuid;
  v_qty integer;
  v_product record;
  v_snapshots jsonb := '[]'::jsonb;
  v_total integer := 0;
  v_line_qty integer;
begin
  if p_user_id is null then
    raise exception 'LOGIN_REQUIRED';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'EMPTY_CART';
  end if;

  perform p.id
  from public.products p
  where p.id in (
    select distinct (elem->>'productId')::uuid
    from jsonb_array_elements(p_items) elem
    where nullif(elem->>'productId', '') is not null
  )
  order by p.id
  for update;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    begin
      v_product_id := (v_item->>'productId')::uuid;
    exception
      when invalid_text_representation then
        raise exception 'PRODUCT_NOT_FOUND';
    end;

    v_qty := (v_item->>'quantity')::integer;
    if v_product_id is null or v_qty is null or v_qty < 1 then
      continue;
    end if;

    select * into v_product
    from public.products
    where id = v_product_id;

    if not found then
      raise exception 'PRODUCT_NOT_FOUND';
    end if;

    if v_product.stock <= 0 then
      continue;
    end if;

    v_line_qty := least(v_qty, v_product.stock);

    update public.products
    set stock = stock - v_line_qty
    where id = v_product_id;

    v_snapshots := v_snapshots || jsonb_build_array(
      jsonb_build_object(
        'product_id', v_product.id,
        'name', v_product.name,
        'price', v_product.price,
        'quantity', v_line_qty,
        'line_total', v_product.price * v_line_qty
      )
    );
    v_total := v_total + v_product.price * v_line_qty;
  end loop;

  if jsonb_array_length(v_snapshots) = 0 then
    raise exception 'NO_STOCK';
  end if;

  insert into public.orders (
    id, user_id, customer_name, phone, address, total, items, status
  ) values (
    p_order_id, p_user_id, p_customer_name, p_phone, p_address, v_total, v_snapshots, 'pending'
  );

  return jsonb_build_object(
    'ok', true,
    'orderId', p_order_id,
    'total', v_total,
    'items', v_snapshots
  );
end;
$$;

create or replace function public.mark_order_paid(
  p_order_id uuid,
  p_session_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
begin
  select * into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  if v_order.status = 'paid' then
    if p_session_id is not null and v_order.stripe_session_id is null then
      update public.orders
      set stripe_session_id = p_session_id
      where id = p_order_id;
    end if;
    return jsonb_build_object('ok', true, 'reason', 'already_paid');
  end if;

  if v_order.status <> 'pending' then
    return jsonb_build_object('ok', false, 'reason', v_order.status);
  end if;

  update public.orders
  set
    status = 'paid',
    stripe_session_id = coalesce(p_session_id, stripe_session_id)
  where id = p_order_id;

  return jsonb_build_object('ok', true, 'reason', 'paid');
end;
$$;

create or replace function public.cancel_pending_order(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_item jsonb;
  v_product_id uuid;
  v_qty integer;
begin
  select * into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  if v_order.status = 'canceled' then
    return jsonb_build_object('ok', true, 'reason', 'already_canceled');
  end if;

  if v_order.status <> 'pending' then
    return jsonb_build_object('ok', false, 'reason', v_order.status);
  end if;

  for v_item in select value from jsonb_array_elements(coalesce(v_order.items, '[]'::jsonb))
  loop
    begin
      v_product_id := (v_item->>'product_id')::uuid;
    exception
      when invalid_text_representation then
        continue;
    end;

    v_qty := coalesce((v_item->>'quantity')::integer, 0);
    if v_product_id is null or v_qty < 1 then
      continue;
    end if;

    update public.products
    set stock = stock + v_qty
    where id = v_product_id;
  end loop;

  update public.orders
  set status = 'canceled'
  where id = p_order_id;

  return jsonb_build_object('ok', true, 'reason', 'canceled');
end;
$$;

revoke all on function public.reserve_stock_and_create_order(uuid, uuid, text, text, text, jsonb) from public;
revoke all on function public.mark_order_paid(uuid, text) from public;
revoke all on function public.cancel_pending_order(uuid) from public;

grant execute on function public.reserve_stock_and_create_order(uuid, uuid, text, text, text, jsonb) to service_role;
grant execute on function public.mark_order_paid(uuid, text) to service_role;
grant execute on function public.cancel_pending_order(uuid) to service_role;

notify pgrst, 'reload schema';
