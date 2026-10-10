-- ====================================================================
-- TÀI LIỆU KHỞI TẠO CƠ SỞ DỮ LIỆU SUPABASE CHO ỨNG DỤNG SỔ TỪ TOEIC
-- Chạy script này trong Supabase Dashboard -> SQL Editor -> New query -> Run
-- ====================================================================

-- 1. BẢNG PROFILES (Lưu thông tin cài đặt & lịch sử học của người dùng)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text,                                -- Tên tài khoản hiển thị (ví dụ: Tấn Anh)
  email text,
  new_per_day integer default 15 not null check (new_per_day > 0 and new_per_day <= 200),
  log jsonb default '{}'::jsonb not null,        -- { "2026-10-10": 12 } số lượt ôn mỗi ngày
  new_log jsonb default '{}'::jsonb not null,    -- { "2026-10-10": 5 } số từ mới mỗi ngày
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Tự động thêm cột username nếu bảng profiles đã tồn tại từ trước
alter table public.profiles add column if not exists username text;

-- Kích hoạt Row Level Security (RLS) để bảo vệ dữ liệu riêng tư
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger tự động tạo profile khi người dùng đăng ký tài khoản Supabase
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ====================================================================
-- 2. BẢNG WORDS (Lưu danh sách từ vựng & thuật toán lặp lại Spaced Repetition)
-- ====================================================================
create table if not exists public.words (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  word text not null,
  pos text default '',
  ipa text default '',
  meaning text default '',
  example text default '',
  example_vi text default '',
  tag text default '',
  img text default '',
  created bigint default (extract(epoch from now()) * 1000)::bigint not null,
  reps integer default 0 not null,
  interval integer default 0 not null,
  ease numeric(4,2) default 2.50 not null,
  lapses integer default 0 not null,
  due bigint default 0 not null,
  last bigint default 0 not null
);

create index if not exists idx_words_user_due on public.words (user_id, due);
create index if not exists idx_words_user_tag on public.words (user_id, tag);

alter table public.words enable row level security;

create policy "Users manage own words"
  on public.words for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ====================================================================
-- 3. BẢNG PASSAGES (Lưu các bài đọc hiểu TOEIC Part 6 & Part 7)
-- ====================================================================
create table if not exists public.passages (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  title text default 'Bài đọc' not null,
  part text default '',
  tag text default '',
  status text default 'new' not null check (status in ('new', 'reading', 'done')),
  text text not null,
  created bigint default (extract(epoch from now()) * 1000)::bigint not null
);

create index if not exists idx_passages_user on public.passages (user_id, status);

alter table public.passages enable row level security;

create policy "Users manage own passages"
  on public.passages for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ====================================================================
-- 4. STORAGE BUCKET CHO ẢNH MINH HỌA (word-images)
-- ====================================================================
insert into storage.buckets (id, name, public) 
values ('word-images', 'word-images', true)
on conflict (id) do update set public = true;

create policy "Public view word images"
  on storage.objects for select
  using (bucket_id = 'word-images');

create policy "Users can upload word images"
  on storage.objects for insert
  with check (bucket_id = 'word-images' and auth.uid() is not null);

create policy "Users can update own word images"
  on storage.objects for update
  using (bucket_id = 'word-images' and auth.uid() is not null);

create policy "Users can delete own word images"
  on storage.objects for delete
  using (bucket_id = 'word-images' and auth.uid() is not null);
