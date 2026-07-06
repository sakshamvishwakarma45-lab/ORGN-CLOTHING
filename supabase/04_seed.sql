-- ============================================================================
-- ORGN — Seed data
-- Placeholder catalog so the storefront isn't empty on first run. Replace via
-- the admin panel at /admin/products once real product photography is ready.
-- Image URLs point to placehold.co so nothing here depends on stock photos.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- CATEGORIES
-- ----------------------------------------------------------------------------
insert into categories (id, name, slug, banner_image, display_order) values
  ('a1000000-0000-4000-8000-000000000001', 'Oversized',   'oversized',   'https://placehold.co/1600x600/0A0A0A/F4F1EA?text=OVERSIZED', 1),
  ('a1000000-0000-4000-8000-000000000002', 'Hoodies',     'hoodies',     'https://placehold.co/1600x600/1C1B19/F4F1EA?text=HOODIES', 2),
  ('a1000000-0000-4000-8000-000000000003', 'Bottoms',     'bottoms',     'https://placehold.co/1600x600/0A0A0A/F4F1EA?text=BOTTOMS', 3),
  ('a1000000-0000-4000-8000-000000000004', 'Accessories', 'accessories', 'https://placehold.co/1600x600/1C1B19/F4F1EA?text=ACCESSORIES', 4)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- PRODUCTS
-- ----------------------------------------------------------------------------
insert into products (id, name, slug, sku, category_id, short_description, description, price, compare_at_price, status, is_featured, is_new_arrival, tags, meta_title, meta_description, weight_grams, total_stock, low_stock_threshold) values
  ('b1000000-0000-4000-8000-000000000001', 'Origin Oversized Tee — Black', 'origin-oversized-tee-black', 'ORGN-OT-BLK',
    'a1000000-0000-4000-8000-000000000001', 'Heavyweight 240gsm oversized tee in black.',
    'Cut from 240gsm combed cotton for a heavyweight drape that holds its shape wash after wash. Dropped shoulders, boxy oversized fit, and a ribbed crewneck built to stretch and recover. Finished with a subdued tonal ORGN hit at the chest.',
    1899, 2299, 'published', true, true, '{tee,oversized,black,bestseller}',
    'Origin Oversized Tee — Black | ORGN', 'Heavyweight 240gsm oversized tee in black. Boxy fit, dropped shoulders, built to last.',
    260, 53, 8),

  ('b1000000-0000-4000-8000-000000000002', 'Origin Oversized Tee — Beige', 'origin-oversized-tee-beige', 'ORGN-OT-BEI',
    'a1000000-0000-4000-8000-000000000001', 'Heavyweight 240gsm oversized tee in beige.',
    'Cut from 240gsm combed cotton for a heavyweight drape that holds its shape wash after wash. Dropped shoulders, boxy oversized fit, and a ribbed crewneck built to stretch and recover. Finished with a subdued tonal ORGN hit at the chest.',
    1899, null, 'published', false, true, '{tee,oversized,beige}',
    'Origin Oversized Tee — Beige | ORGN', 'Heavyweight 240gsm oversized tee in beige. Boxy fit, dropped shoulders, built to last.',
    260, 41, 8),

  ('b1000000-0000-4000-8000-000000000003', 'Drop Shoulder Tee — Charcoal', 'drop-shoulder-tee-charcoal', 'ORGN-DS-CHR',
    'a1000000-0000-4000-8000-000000000001', 'Relaxed drop-shoulder tee in charcoal.',
    'A quieter take on the oversized silhouette — relaxed through the body with an extended drop shoulder and a slightly cropped hem. 220gsm cotton jersey, garment-washed for a broken-in feel from day one.',
    1699, null, 'published', false, false, '{tee,oversized,charcoal}',
    'Drop Shoulder Tee — Charcoal | ORGN', 'Relaxed drop-shoulder tee in charcoal, garment-washed 220gsm cotton.',
    230, 34, 8),

  ('b1000000-0000-4000-8000-000000000004', 'Origin Heavyweight Hoodie — Black', 'origin-heavyweight-hoodie-black', 'ORGN-HH-BLK',
    'a1000000-0000-4000-8000-000000000002', '420gsm heavyweight hoodie in black.',
    'Our heaviest hoodie — 420gsm brushed-back fleece with a fixed hood, kangaroo pocket, and ribbed cuffs and hem reinforced with lycra for a fit that lasts seasons, not washes. Signature ORGN drop-shadow print at the chest.',
    3499, 3999, 'published', true, true, '{hoodie,black,bestseller}',
    'Origin Heavyweight Hoodie — Black | ORGN', '420gsm heavyweight fleece hoodie in black with signature ORGN print.',
    620, 47, 8),

  ('b1000000-0000-4000-8000-000000000005', 'Origin Heavyweight Hoodie — Beige', 'origin-heavyweight-hoodie-beige', 'ORGN-HH-BEI',
    'a1000000-0000-4000-8000-000000000002', '420gsm heavyweight hoodie in beige.',
    'Our heaviest hoodie — 420gsm brushed-back fleece with a fixed hood, kangaroo pocket, and ribbed cuffs and hem reinforced with lycra for a fit that lasts seasons, not washes. Signature ORGN drop-shadow print at the chest.',
    3499, null, 'published', true, false, '{hoodie,beige}',
    'Origin Heavyweight Hoodie — Beige | ORGN', '420gsm heavyweight fleece hoodie in beige with signature ORGN print.',
    620, 29, 8),

  ('b1000000-0000-4000-8000-000000000006', 'Shadow Zip Hoodie — Charcoal', 'shadow-zip-hoodie-charcoal', 'ORGN-SZ-CHR',
    'a1000000-0000-4000-8000-000000000002', 'Full-zip hoodie in charcoal with tonal branding.',
    'A full-zip cut of our signature hoodie in a mid-weight 360gsm fleece. Dual hand pockets, adjustable drawcord hood, and a tonal embroidered wordmark for anyone who wants the fit without the shout.',
    3299, null, 'published', false, true, '{hoodie,zip,charcoal}',
    'Shadow Zip Hoodie — Charcoal | ORGN', 'Full-zip 360gsm fleece hoodie in charcoal with tonal embroidery.',
    580, 22, 8),

  ('b1000000-0000-4000-8000-000000000007', 'Utility Cargo Pants — Black', 'utility-cargo-pants-black', 'ORGN-CP-BLK',
    'a1000000-0000-4000-8000-000000000003', 'Straight-fit cargo pants in ripstop black.',
    'Straight-leg cargos in a durable ripstop cotton blend. Six-pocket utility layout, adjustable waist tabs, and a tapered ankle with a hidden zip for wearing over boots. Built for movement, not just standing still.',
    2799, 3199, 'published', true, false, '{bottoms,cargo,black,bestseller}',
    'Utility Cargo Pants — Black | ORGN', 'Straight-fit ripstop cargo pants in black with a six-pocket utility layout.',
    480, 38, 8),

  ('b1000000-0000-4000-8000-000000000008', 'Origin Sweatpants — Charcoal', 'origin-sweatpants-charcoal', 'ORGN-SP-CHR',
    'a1000000-0000-4000-8000-000000000003', 'Tapered heavyweight sweatpants in charcoal.',
    'Matches the Heavyweight Hoodie gsm-for-gsm. Tapered leg, ribbed hem, and an internal drawcord waistband. The everyday pant for everything between workouts and errands.',
    2499, null, 'published', false, true, '{bottoms,sweatpants,charcoal}',
    'Origin Sweatpants — Charcoal | ORGN', 'Tapered heavyweight sweatpants in charcoal, matched to the Origin Hoodie.',
    430, 31, 8),

  ('b1000000-0000-4000-8000-000000000009', 'Wide Fit Denim — Washed Black', 'wide-fit-denim-washed-black', 'ORGN-WD-BLK',
    'a1000000-0000-4000-8000-000000000003', 'Wide-leg denim in a washed black rigid cotton.',
    'A wide, straight-through leg in 13oz rigid cotton denim, garment-dyed and stone-washed for depth. Slightly dropped rise, minimal branding, built to fade the way you want it to.',
    3199, null, 'published', false, false, '{bottoms,denim,black}',
    'Wide Fit Denim — Washed Black | ORGN', 'Wide-leg 13oz washed black rigid denim with a dropped rise.',
    650, 19, 8),

  ('b1000000-0000-4000-8000-000000000010', 'Origin Cap — Black/Orange', 'origin-cap-black-orange', 'ORGN-CAP-BLK',
    'a1000000-0000-4000-8000-000000000004', 'Structured 6-panel cap with orange under-brim.',
    'A structured 6-panel cap in brushed cotton twill with a contrast orange under-brim and an embroidered ORGN drop-shadow mark up front. Adjustable strap, one size fits most.',
    999, null, 'published', false, false, '{accessory,cap}',
    'Origin Cap — Black/Orange | ORGN', 'Structured 6-panel cap in black cotton twill with an orange under-brim.',
    120, 6, 8),

  ('b1000000-0000-4000-8000-000000000011', 'Canvas Tote — Beige', 'canvas-tote-beige', 'ORGN-TOTE-BEI',
    'a1000000-0000-4000-8000-000000000004', 'Heavy canvas tote with printed wordmark.',
    'A 14oz heavy canvas tote built to actually carry things — reinforced stitched handles, a flat base that stands on its own, and the ORGN wordmark printed in our signature drop-shadow.',
    899, null, 'published', false, true, '{accessory,tote,beige}',
    'Canvas Tote — Beige | ORGN', '14oz heavy canvas tote in beige with the ORGN drop-shadow wordmark.',
    280, 24, 8),

  ('b1000000-0000-4000-8000-000000000012', 'Origin Beanie — Black', 'origin-beanie-black', 'ORGN-BEA-BLK',
    'a1000000-0000-4000-8000-000000000004', 'Ribbed knit beanie with woven label.',
    'A close-fit ribbed knit beanie in a heavyweight acrylic-wool blend, finished with a woven ORGN label at the cuff. No logos shouting from across the room — just a clean fold and a warm head.',
    799, null, 'published', false, false, '{accessory,beanie}',
    'Origin Beanie — Black | ORGN', 'Ribbed knit beanie in black with a woven ORGN label.',
    90, 3, 8)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- PRODUCT IMAGES (2 per product: primary + one alternate)
-- ----------------------------------------------------------------------------
insert into product_images (product_id, url, position, is_primary) values
  ('b1000000-0000-4000-8000-000000000001', 'https://placehold.co/1000x1250/0A0A0A/F4F1EA?text=ORGN', 0, true),
  ('b1000000-0000-4000-8000-000000000001', 'https://placehold.co/1000x1250/1C1B19/F4F1EA?text=ORGN+Detail', 1, false),
  ('b1000000-0000-4000-8000-000000000002', 'https://placehold.co/1000x1250/F4F1EA/0A0A0A?text=ORGN', 0, true),
  ('b1000000-0000-4000-8000-000000000002', 'https://placehold.co/1000x1250/EDE8DD/0A0A0A?text=ORGN+Detail', 1, false),
  ('b1000000-0000-4000-8000-000000000003', 'https://placehold.co/1000x1250/2A2926/F4F1EA?text=ORGN', 0, true),
  ('b1000000-0000-4000-8000-000000000004', 'https://placehold.co/1000x1250/0A0A0A/F4F1EA?text=ORGN', 0, true),
  ('b1000000-0000-4000-8000-000000000004', 'https://placehold.co/1000x1250/1C1B19/F4F1EA?text=ORGN+Detail', 1, false),
  ('b1000000-0000-4000-8000-000000000005', 'https://placehold.co/1000x1250/F4F1EA/0A0A0A?text=ORGN', 0, true),
  ('b1000000-0000-4000-8000-000000000006', 'https://placehold.co/1000x1250/2A2926/F4F1EA?text=ORGN', 0, true),
  ('b1000000-0000-4000-8000-000000000007', 'https://placehold.co/1000x1250/0A0A0A/F4F1EA?text=ORGN', 0, true),
  ('b1000000-0000-4000-8000-000000000007', 'https://placehold.co/1000x1250/1C1B19/F4F1EA?text=ORGN+Detail', 1, false),
  ('b1000000-0000-4000-8000-000000000008', 'https://placehold.co/1000x1250/2A2926/F4F1EA?text=ORGN', 0, true),
  ('b1000000-0000-4000-8000-000000000009', 'https://placehold.co/1000x1250/0A0A0A/F4F1EA?text=ORGN', 0, true),
  ('b1000000-0000-4000-8000-000000000010', 'https://placehold.co/1000x1250/0A0A0A/FF4B1F?text=ORGN+Cap', 0, true),
  ('b1000000-0000-4000-8000-000000000011', 'https://placehold.co/1000x1250/F4F1EA/0A0A0A?text=ORGN+Tote', 0, true),
  ('b1000000-0000-4000-8000-000000000012', 'https://placehold.co/1000x1250/0A0A0A/F4F1EA?text=ORGN+Beanie', 0, true)
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- PRODUCT VARIANTS (sizes; accessories are one-size)
-- ----------------------------------------------------------------------------
insert into product_variants (product_id, size, color, stock, sku_suffix) values
  ('b1000000-0000-4000-8000-000000000001', 'S', 'Black', 12, 'S'), ('b1000000-0000-4000-8000-000000000001', 'M', 'Black', 18, 'M'),
  ('b1000000-0000-4000-8000-000000000001', 'L', 'Black', 15, 'L'), ('b1000000-0000-4000-8000-000000000001', 'XL', 'Black', 8, 'XL'),

  ('b1000000-0000-4000-8000-000000000002', 'S', 'Beige', 9, 'S'), ('b1000000-0000-4000-8000-000000000002', 'M', 'Beige', 14, 'M'),
  ('b1000000-0000-4000-8000-000000000002', 'L', 'Beige', 12, 'L'), ('b1000000-0000-4000-8000-000000000002', 'XL', 'Beige', 6, 'XL'),

  ('b1000000-0000-4000-8000-000000000003', 'S', 'Charcoal', 8, 'S'), ('b1000000-0000-4000-8000-000000000003', 'M', 'Charcoal', 12, 'M'),
  ('b1000000-0000-4000-8000-000000000003', 'L', 'Charcoal', 10, 'L'), ('b1000000-0000-4000-8000-000000000003', 'XL', 'Charcoal', 4, 'XL'),

  ('b1000000-0000-4000-8000-000000000004', 'S', 'Black', 10, 'S'), ('b1000000-0000-4000-8000-000000000004', 'M', 'Black', 16, 'M'),
  ('b1000000-0000-4000-8000-000000000004', 'L', 'Black', 14, 'L'), ('b1000000-0000-4000-8000-000000000004', 'XL', 'Black', 7, 'XL'),

  ('b1000000-0000-4000-8000-000000000005', 'S', 'Beige', 6, 'S'), ('b1000000-0000-4000-8000-000000000005', 'M', 'Beige', 10, 'M'),
  ('b1000000-0000-4000-8000-000000000005', 'L', 'Beige', 9, 'L'), ('b1000000-0000-4000-8000-000000000005', 'XL', 'Beige', 4, 'XL'),

  ('b1000000-0000-4000-8000-000000000006', 'S', 'Charcoal', 4, 'S'), ('b1000000-0000-4000-8000-000000000006', 'M', 'Charcoal', 8, 'M'),
  ('b1000000-0000-4000-8000-000000000006', 'L', 'Charcoal', 7, 'L'), ('b1000000-0000-4000-8000-000000000006', 'XL', 'Charcoal', 3, 'XL'),

  ('b1000000-0000-4000-8000-000000000007', '30', 'Black', 10, '30'), ('b1000000-0000-4000-8000-000000000007', '32', 'Black', 14, '32'),
  ('b1000000-0000-4000-8000-000000000007', '34', 'Black', 10, '34'), ('b1000000-0000-4000-8000-000000000007', '36', 'Black', 4, '36'),

  ('b1000000-0000-4000-8000-000000000008', 'S', 'Charcoal', 8, 'S'), ('b1000000-0000-4000-8000-000000000008', 'M', 'Charcoal', 11, 'M'),
  ('b1000000-0000-4000-8000-000000000008', 'L', 'Charcoal', 8, 'L'), ('b1000000-0000-4000-8000-000000000008', 'XL', 'Charcoal', 4, 'XL'),

  ('b1000000-0000-4000-8000-000000000009', '30', 'Washed Black', 5, '30'), ('b1000000-0000-4000-8000-000000000009', '32', 'Washed Black', 7, '32'),
  ('b1000000-0000-4000-8000-000000000009', '34', 'Washed Black', 5, '34'), ('b1000000-0000-4000-8000-000000000009', '36', 'Washed Black', 2, '36'),

  ('b1000000-0000-4000-8000-000000000010', 'One Size', 'Black/Orange', 6, 'OS'),
  ('b1000000-0000-4000-8000-000000000011', 'One Size', 'Beige', 24, 'OS'),
  ('b1000000-0000-4000-8000-000000000012', 'One Size', 'Black', 3, 'OS')
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- SITE SETTINGS (light CMS defaults)
-- ----------------------------------------------------------------------------
insert into site_settings (key, value) values
  ('hero', jsonb_build_object(
    'heading', 'ORGN',
    'subheading', 'Crafted from the origin. Built for everyday movement.',
    'primary_cta_label', 'Shop Collection',
    'primary_cta_href', '/shop',
    'secondary_cta_label', 'Explore',
    'secondary_cta_href', '#featured',
    'floating_image', 'https://placehold.co/900x1100/0A0A0A/F4F1EA?text=ORGN'
  )),
  ('why_orgn', jsonb_build_array(
    jsonb_build_object('icon', 'Shirt', 'title', 'Premium Cotton', 'description', 'Heavyweight 220–420gsm fabrics chosen for drape and durability.'),
    jsonb_build_object('icon', 'MapPin', 'title', 'Designed in India', 'description', 'Every piece designed and developed in-house, made to travel further.'),
    jsonb_build_object('icon', 'RotateCcw', 'title', 'Easy Returns', 'description', '7-day easy returns on unworn, tagged pieces.'),
    jsonb_build_object('icon', 'Truck', 'title', 'Fast Shipping', 'description', 'Dispatched within 24–48 hours from our Jagdalpur studio.'),
    jsonb_build_object('icon', 'Sparkles', 'title', 'Limited Drops', 'description', 'Small batch runs. Once a size sells out, it does not come back.')
  )),
  ('instagram', jsonb_build_object(
    'handle', '@orgnclothing.in',
    'url', 'https://www.instagram.com/orgnclothing.in/',
    'images', jsonb_build_array(
      'https://placehold.co/600x600/0A0A0A/F4F1EA?text=ORGN',
      'https://placehold.co/600x600/1C1B19/F4F1EA?text=ORGN',
      'https://placehold.co/600x600/F4F1EA/0A0A0A?text=ORGN',
      'https://placehold.co/600x600/2A2926/F4F1EA?text=ORGN',
      'https://placehold.co/600x600/0A0A0A/FF4B1F?text=ORGN',
      'https://placehold.co/600x600/EDE8DD/0A0A0A?text=ORGN'
    )
  )),
  ('about', jsonb_build_object(
    'heading', 'Built from the ground up.',
    'body', 'ORGN started as a rejection of disposable fashion — pieces that fade, fit wrong, and fall apart by the third wash. Every drop is designed in-house, cut in heavyweight fabric, and produced in small batches so quality never gets diluted for volume. No influencer campaigns, no filler collections. Just clothing built to be worn, not just bought.'
  ))
on conflict (key) do update set value = excluded.value;

-- ----------------------------------------------------------------------------
-- SAMPLE COUPON
-- ----------------------------------------------------------------------------
insert into coupons (code, type, value, expiry_date, usage_limit, is_active) values
  ('WELCOME10', 'percent', 10, (current_date + interval '90 days')::date, 500, true)
on conflict (code) do nothing;
