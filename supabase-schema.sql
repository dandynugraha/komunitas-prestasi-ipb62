-- =============================================================================
-- AKSARA KARYA 62 – SUPABASE DATABASE SCHEMA
-- Jalankan seluruh script ini di Supabase > SQL Editor
-- =============================================================================

-- ─── 1. PROFILES (data anggota, extend tabel auth.users) ─────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT,
  cluster     TEXT CHECK (cluster IN ('desain','olimpiade','penulisan','bisnis')),
  role        TEXT DEFAULT 'member',  -- member | bph | heg | cda | mbd (...) | korvoks
  division    TEXT,
  bio         TEXT,
  avatar_url  TEXT,
  points      INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. ACHIEVEMENTS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  date            DATE,
  level           TEXT CHECK (level IN ('universitas','kota','provinsi','nasional','internasional')),
  rank            TEXT,
  cluster         TEXT,
  location_type   TEXT CHECK (location_type IN ('Offline','Online','Hybrid')),
  location_detail TEXT,
  storytelling    TEXT,
  image_url       TEXT,
  visible         BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. PROJECTS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  leader_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  leader_name  TEXT,
  title        TEXT NOT NULL,
  description  TEXT,
  output       TEXT,
  benefits     TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_timelines (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  deadline    DATE,
  completed   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- ─── 4. EVENTS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title               TEXT NOT NULL,
  caption             TEXT,
  event_date          TIMESTAMPTZ,
  poster_url          TEXT,
  visibility          TEXT DEFAULT 'public' CHECK (visibility IN ('public','community','cluster')),
  cluster             TEXT,  -- diisi jika visibility = 'cluster'
  registration_link   TEXT,
  guidebook_link      TEXT,
  type                TEXT DEFAULT 'event' CHECK (type IN ('event','competition')),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. ATTENDANCE ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.attendance (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id   UUID REFERENCES public.events(id) ON DELETE CASCADE,
  status     TEXT CHECK (status IN ('present','absent')),
  reason     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- ─── 6. COMPETITIONS (input pribadi anggota) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.competitions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  cluster    TEXT,
  title      TEXT NOT NULL,
  organizer  TEXT,
  date       DATE,
  field      TEXT,
  status     TEXT DEFAULT 'Peserta' CHECK (status IN ('Peserta','Semifinalis','Finalis','Juara')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 7. PLANS (kalender pribadi anggota) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plans (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  plan_date  DATE NOT NULL,
  note       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 8. STAFF AWARDS (Staff of the Month) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.staff_awards (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  month      TEXT NOT NULL,  -- format: YYYY-MM
  note       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 9. SITE CONTENT (CMS untuk Kadiv Web) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_content (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  type       TEXT DEFAULT 'text',  -- text | html | url | color
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default content
INSERT INTO public.site_content (key, value) VALUES
  ('vision',       'Menjadi komunitas prestasi mahasiswa IPB yang terdepan, inklusif, dan berdampak nyata bagi bangsa.'),
  ('mission',      'Mendampingi, memfasilitasi, dan mengapresiasi setiap pencapaian mahasiswa IPB University.'),
  ('cabinet_name', 'AKSARA KARYA'),
  ('whatsapp_link','https://wa.me/6281234567890'),
  ('instagram_link','https://www.instagram.com/aksarakarya62'),
  ('announcement', '')
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_awards   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content   ENABLE ROW LEVEL SECURITY;

-- ─── PROFILES ────────────────────────────────────────────────────────────────
CREATE POLICY "profiles_read_all"   ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_write_own"  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
CREATE POLICY "achievements_read_all"     ON public.achievements FOR SELECT USING (visible = true OR auth.uid() = user_id);
CREATE POLICY "achievements_insert_own"   ON public.achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "achievements_update_own"   ON public.achievements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "achievements_delete_staff" ON public.achievements FOR DELETE USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('bph','mbd (web developer)'))
);

-- ─── PROJECTS ────────────────────────────────────────────────────────────────
CREATE POLICY "projects_read_all"   ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects_insert_own" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_update_own" ON public.projects FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = leader_id);

CREATE POLICY "timelines_read_all"   ON public.project_timelines FOR SELECT USING (true);
CREATE POLICY "timelines_insert_own" ON public.project_timelines FOR INSERT WITH CHECK (true);
CREATE POLICY "timelines_update_own" ON public.project_timelines FOR UPDATE USING (true);

CREATE POLICY "project_members_read" ON public.project_members FOR SELECT USING (true);
CREATE POLICY "project_members_insert" ON public.project_members FOR INSERT WITH CHECK (true);

-- ─── EVENTS ──────────────────────────────────────────────────────────────────
CREATE POLICY "events_read_public"    ON public.events FOR SELECT USING (
  visibility = 'public' OR
  (visibility = 'community' AND auth.uid() IS NOT NULL) OR
  (visibility = 'cluster' AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND cluster = events.cluster
  ))
);
CREATE POLICY "events_insert_staff"   ON public.events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role != 'member')
);
CREATE POLICY "events_update_creator" ON public.events FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "events_delete_staff"   ON public.events FOR DELETE USING (
  auth.uid() = created_by OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('bph','mbd (web developer)'))
);

-- ─── ATTENDANCE ───────────────────────────────────────────────────────────────
CREATE POLICY "attendance_read_own_or_staff" ON public.attendance FOR SELECT USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('heg','bph','mbd (web developer)'))
);
CREATE POLICY "attendance_insert_own" ON public.attendance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "attendance_update_own" ON public.attendance FOR UPDATE USING (auth.uid() = user_id);

-- ─── COMPETITIONS ─────────────────────────────────────────────────────────────
CREATE POLICY "competitions_read_own_or_cda" ON public.competitions FOR SELECT USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role LIKE 'cda%' OR role = 'bph'))
);
CREATE POLICY "competitions_insert_own" ON public.competitions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "competitions_update_own" ON public.competitions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "competitions_delete_own" ON public.competitions FOR DELETE USING (auth.uid() = user_id);

-- ─── PLANS (kalender pribadi) ─────────────────────────────────────────────────
CREATE POLICY "plans_read_own"   ON public.plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "plans_insert_own" ON public.plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "plans_update_own" ON public.plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "plans_delete_own" ON public.plans FOR DELETE USING (auth.uid() = user_id);

-- ─── STAFF AWARDS ─────────────────────────────────────────────────────────────
CREATE POLICY "awards_read_all"       ON public.staff_awards FOR SELECT USING (true);
CREATE POLICY "awards_insert_heg"     ON public.staff_awards FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('heg','bph'))
);
CREATE POLICY "awards_delete_heg"     ON public.staff_awards FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('heg','bph'))
);

-- ─── SITE CONTENT ─────────────────────────────────────────────────────────────
CREATE POLICY "site_content_read_all"    ON public.site_content FOR SELECT USING (true);
CREATE POLICY "site_content_write_admin" ON public.site_content FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('bph','mbd (web developer)'))
);

-- =============================================================================
-- STORAGE BUCKETS (buat ini juga di Supabase Storage)
-- =============================================================================
-- Buka Supabase > Storage > New Bucket, buat 4 bucket ini:
-- 1. achievements  → Public
-- 2. events        → Public
-- 3. profiles      → Public
-- 4. site          → Public
--
-- Atau jalankan query ini:

INSERT INTO storage.buckets (id, name, public) VALUES
  ('achievements', 'achievements', true),
  ('events', 'events', true),
  ('profiles', 'profiles', true),
  ('site', 'site', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "storage_read_all"
  ON storage.objects FOR SELECT USING (true);

CREATE POLICY "storage_insert_auth"
  ON storage.objects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "storage_delete_own"
  ON storage.objects FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================================================
-- FUNCTION: Auto-create profile on signup
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- FUNCTION: Auto-update points when achievement inserted
-- =============================================================================
CREATE OR REPLACE FUNCTION public.update_points_on_achievement()
RETURNS TRIGGER AS $$
DECLARE
  point_value INTEGER;
BEGIN
  point_value := CASE NEW.level
    WHEN 'internasional' THEN 100
    WHEN 'nasional'      THEN 70
    WHEN 'provinsi'      THEN 40
    WHEN 'kota'          THEN 20
    WHEN 'universitas'   THEN 10
    ELSE 10
  END;

  UPDATE public.profiles
  SET points = points + point_value
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_achievement_insert ON public.achievements;
CREATE TRIGGER on_achievement_insert
  AFTER INSERT ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION public.update_points_on_achievement();

-- =============================================================================
-- SEED: Import akun dari CSV dummy_accounts_random_cluster.csv
-- Jalankan SETELAH membuat akun di Supabase Auth (gunakan script seeder)
-- Atau gunakan Supabase Dashboard > Authentication > Add User manual
-- =============================================================================
