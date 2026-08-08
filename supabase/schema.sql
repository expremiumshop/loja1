-- Execute este ficheiro no Supabase: SQL Editor > New query > Run.
-- Antes de publicar, substitua o email abaixo pelo email da sua conta de administrador.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2) not null check (price > 0),
  compare_at_price numeric(10, 2),
  category text,
  category_id uuid references public.categories(id) on delete set null,
  brand text,
  sku text,
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Depois de criar a sua conta em /register, troque o email e execute esta linha.
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'SEU_EMAIL_DE_ADMIN@EXEMPLO.COM';

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.admins enable row level security;

drop policy if exists "Categorias visíveis para todos" on public.categories;
drop policy if exists "Produtos visíveis para todos" on public.products;
drop policy if exists "Inserir categorias" on public.categories;
drop policy if exists "Atualizar categorias" on public.categories;
drop policy if exists "Eliminar categorias" on public.categories;
drop policy if exists "Inserir produtos" on public.products;
drop policy if exists "Atualizar produtos" on public.products;
drop policy if exists "Eliminar produtos" on public.products;
drop policy if exists "public categories read" on public.categories;
drop policy if exists "public products read" on public.products;
drop policy if exists "admins manage categories" on public.categories;
drop policy if exists "admins manage products" on public.products;
drop policy if exists "admins read own membership" on public.admins;

create policy "public categories read" on public.categories for select using (true);
create policy "public products read" on public.products for select using (active = true or exists (select 1 from public.admins where user_id = auth.uid()));
create policy "admins manage categories" on public.categories for all to authenticated using (exists (select 1 from public.admins where user_id = auth.uid())) with check (exists (select 1 from public.admins where user_id = auth.uid()));
create policy "admins manage products" on public.products for all to authenticated using (exists (select 1 from public.admins where user_id = auth.uid())) with check (exists (select 1 from public.admins where user_id = auth.uid()));
create policy "admins read own membership" on public.admins for select to authenticated using (user_id = auth.uid());

insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict (id) do update set public = true;
drop policy if exists "product images public read" on storage.objects;
drop policy if exists "admins upload product images" on storage.objects;
drop policy if exists "admins update product images" on storage.objects;
drop policy if exists "admins delete product images" on storage.objects;
create policy "product images public read" on storage.objects for select using (bucket_id = 'products');
create policy "admins upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'products' and exists (select 1 from public.admins where user_id = auth.uid()));
create policy "admins update product images" on storage.objects for update to authenticated using (bucket_id = 'products' and exists (select 1 from public.admins where user_id = auth.uid()));
create policy "admins delete product images" on storage.objects for delete to authenticated using (bucket_id = 'products' and exists (select 1 from public.admins where user_id = auth.uid()));

-- Opções/variantes normalizadas. Não altera a estrutura de public.products.
create table if not exists public.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  value text not null check (char_length(trim(value)) > 0),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_options_product_id_position_idx on public.product_options (product_id, position);
alter table public.product_options enable row level security;
drop policy if exists "public product options read" on public.product_options;
drop policy if exists "admins manage product options" on public.product_options;
create policy "public product options read" on public.product_options for select using (exists (select 1 from public.products where products.id = product_options.product_id and (products.active = true or exists (select 1 from public.admins where user_id = auth.uid()))));
create policy "admins manage product options" on public.product_options for all to authenticated using (exists (select 1 from public.admins where user_id = auth.uid())) with check (exists (select 1 from public.admins where user_id = auth.uid()));
