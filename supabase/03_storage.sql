-- ============================================================================
-- ORGN — Storage bucket + policies
-- Run after 01/02. Creates a single public bucket used for product photos,
-- category banners, and general media-library uploads.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('orgn-media', 'orgn-media', true)
on conflict (id) do nothing;

-- Public can view/download anything in the bucket (product photos need to
-- render on the storefront for anonymous visitors).
create policy "public read orgn-media"
  on storage.objects for select
  using (bucket_id = 'orgn-media');

-- Only staff (admin/staff profiles) can upload/replace/delete files.
create policy "staff upload orgn-media"
  on storage.objects for insert
  with check (bucket_id = 'orgn-media' and public.is_staff());

create policy "staff update orgn-media"
  on storage.objects for update
  using (bucket_id = 'orgn-media' and public.is_staff());

create policy "staff delete orgn-media"
  on storage.objects for delete
  using (bucket_id = 'orgn-media' and public.is_staff());
