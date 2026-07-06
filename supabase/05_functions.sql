-- ============================================================================
-- ORGN — Checkout functions
-- SECURITY DEFINER functions let unauthenticated shoppers place orders (no
-- customer login by design) while keeping direct table access locked down to
-- staff via RLS. Only these two functions are exposed to the anon role.
-- ============================================================================

create or replace function public.preview_coupon(p_code text, p_subtotal numeric)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_coupon coupons%rowtype;
  v_discount numeric;
begin
  select * into v_coupon from coupons where upper(code) = upper(p_code) and is_active = true;

  if not found then
    return jsonb_build_object('valid', false, 'reason', 'INVALID_COUPON');
  end if;
  if v_coupon.expiry_date is not null and v_coupon.expiry_date < current_date then
    return jsonb_build_object('valid', false, 'reason', 'COUPON_EXPIRED');
  end if;
  if v_coupon.usage_limit is not null and v_coupon.times_used >= v_coupon.usage_limit then
    return jsonb_build_object('valid', false, 'reason', 'COUPON_LIMIT_REACHED');
  end if;

  if v_coupon.type = 'percent' then
    v_discount := round(p_subtotal * (v_coupon.value / 100.0), 2);
  else
    v_discount := least(v_coupon.value, p_subtotal);
  end if;

  return jsonb_build_object('valid', true, 'type', v_coupon.type, 'value', v_coupon.value, 'discount', v_discount);
end;
$$;

create or replace function public.create_order(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_shipping_address jsonb,
  p_items jsonb,
  p_shipping_cost numeric,
  p_coupon_code text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric := 0;
  v_discount numeric := 0;
  v_total numeric;
  v_item jsonb;
  v_product products%rowtype;
  v_variant product_variants%rowtype;
  v_coupon coupons%rowtype;
  v_line_price numeric;
  v_qty int;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'EMPTY_CART';
  end if;

  select id into v_customer_id from customers where lower(email) = lower(p_customer_email) limit 1;
  if v_customer_id is null then
    insert into customers (name, email, phone) values (p_customer_name, p_customer_email, p_customer_phone)
    returning id into v_customer_id;
  else
    update customers set name = p_customer_name, phone = coalesce(p_customer_phone, phone) where id = v_customer_id;
  end if;

  if p_coupon_code is not null and length(trim(p_coupon_code)) > 0 then
    select * into v_coupon from coupons where upper(code) = upper(p_coupon_code) and is_active = true;
    if v_coupon.id is null then
      raise exception 'INVALID_COUPON';
    end if;
    if v_coupon.expiry_date is not null and v_coupon.expiry_date < current_date then
      raise exception 'COUPON_EXPIRED';
    end if;
    if v_coupon.usage_limit is not null and v_coupon.times_used >= v_coupon.usage_limit then
      raise exception 'COUPON_LIMIT_REACHED';
    end if;
  end if;

  v_order_number := 'ORGN-' || to_char(now(), 'YYMMDD') || '-' || lpad(floor(random() * 9000 + 1000)::text, 4, '0');

  insert into orders (
    order_number, customer_id, subtotal, shipping, discount, total, coupon_code,
    shipping_address, customer_name, customer_email, customer_phone,
    status, payment_status, payment_method
  ) values (
    v_order_number, v_customer_id, 0, p_shipping_cost, 0, 0, p_coupon_code,
    p_shipping_address, p_customer_name, p_customer_email, p_customer_phone,
    'pending', 'unpaid', 'cod'
  ) returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product from products where id = (v_item->>'product_id')::uuid and status = 'published';
    if not found then
      raise exception 'PRODUCT_UNAVAILABLE';
    end if;

    v_qty := (v_item->>'qty')::int;
    if v_qty is null or v_qty < 1 then
      raise exception 'INVALID_QTY';
    end if;

    select * into v_variant from product_variants
      where product_id = v_product.id
        and coalesce(size, '') = coalesce(v_item->>'size', '')
        and coalesce(color, '') = coalesce(v_item->>'color', '')
      limit 1;

    if not found then
      raise exception 'VARIANT_NOT_FOUND';
    end if;

    if v_variant.stock < v_qty then
      raise exception 'INSUFFICIENT_STOCK: %', v_product.name;
    end if;

    v_line_price := coalesce(v_variant.price_override, v_product.price);
    v_subtotal := v_subtotal + (v_line_price * v_qty);

    insert into order_items (order_id, product_id, product_name, product_image, size, color, qty, price)
    values (
      v_order_id, v_product.id, v_product.name,
      (select url from product_images where product_id = v_product.id order by is_primary desc, position asc limit 1),
      v_variant.size, v_variant.color, v_qty, v_line_price
    );

    update product_variants set stock = stock - v_qty where id = v_variant.id;
    update products set total_stock = greatest(total_stock - v_qty, 0) where id = v_product.id;
  end loop;

  if v_coupon.id is not null then
    if v_coupon.type = 'percent' then
      v_discount := round(v_subtotal * (v_coupon.value / 100.0), 2);
    else
      v_discount := least(v_coupon.value, v_subtotal);
    end if;
    update coupons set times_used = times_used + 1 where id = v_coupon.id;
  end if;

  v_total := greatest(v_subtotal - v_discount, 0) + p_shipping_cost;

  update orders set subtotal = v_subtotal, discount = v_discount, total = v_total where id = v_order_id;

  return jsonb_build_object('order_id', v_order_id, 'order_number', v_order_number, 'total', v_total);
end;
$$;

-- Expose only these two RPCs to unauthenticated shoppers.
grant execute on function public.preview_coupon(text, numeric) to anon, authenticated;
grant execute on function public.create_order(text, text, text, jsonb, jsonb, numeric, text) to anon, authenticated;
