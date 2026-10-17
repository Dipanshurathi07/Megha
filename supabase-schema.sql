create table if not exists public.album_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  created_at timestamptz not null default now()
);

create table if not exists public.album_memories (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  media_type text not null check (media_type in ('image', 'video')),
  caption text not null default '' check (char_length(caption) <= 180),
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'album_memories'
  ) then
    alter publication supabase_realtime add table public.album_memories;
  end if;
end
$$;

alter table public.album_members enable row level security;
alter table public.album_memories enable row level security;

drop policy if exists "Album members can see their membership" on public.album_members;
create policy "Album members can see their membership"
  on public.album_members for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Album members can see memories" on public.album_memories;
create policy "Album members can see memories"
  on public.album_memories for select to authenticated
  using (
    exists (
      select 1 from public.album_members
      where album_members.user_id = (select auth.uid())
    )
  );

drop policy if exists "Album members can add memories as themselves" on public.album_memories;
create policy "Album members can add memories as themselves"
  on public.album_memories for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and exists (
      select 1 from public.album_members
      where album_members.user_id = (select auth.uid())
    )
  );

drop policy if exists "Album members can delete shared memories" on public.album_memories;
create policy "Album members can delete shared memories"
  on public.album_memories for delete to authenticated
  using (
    exists (
      select 1 from public.album_members
      where album_members.user_id = (select auth.uid())
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'couple-album',
  'couple-album',
  false,
  26214400,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Album members can view shared media" on storage.objects;
create policy "Album members can view shared media"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'couple-album'
    and exists (
      select 1 from public.album_members
      where album_members.user_id = (select auth.uid())
    )
  );

drop policy if exists "Album members can upload shared media" on storage.objects;
create policy "Album members can upload shared media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'couple-album'
    and exists (
      select 1 from public.album_members
      where album_members.user_id = (select auth.uid())
    )
  );

drop policy if exists "Album members can delete shared media" on storage.objects;
create policy "Album members can delete shared media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'couple-album'
    and exists (
      select 1 from public.album_members
      where album_members.user_id = (select auth.uid())
    )
  );
