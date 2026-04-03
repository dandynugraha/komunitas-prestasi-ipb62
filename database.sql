-- ============================================
-- AKSARA KARYA 62 — DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. PROFILES (user accounts)
-- Jika tabel profiles sudah ada, skip bagian ini
CREATE TABLE IF NOT EXISTS profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    cluster TEXT,
    role TEXT DEFAULT 'member',
    points INTEGER DEFAULT 0,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRESTASI (achievement uploads)
CREATE TABLE IF NOT EXISTS prestasi (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    tingkat TEXT,
    cluster TEXT,
    lokasi TEXT,
    metode TEXT,
    story TEXT,
    tanggal DATE,
    foto_url TEXT,
    email_user TEXT REFERENCES profiles(email),
    member_name TEXT,
    points_given INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS (kolaborasi)
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    structure TEXT,
    leader_name TEXT,
    leader_email TEXT,
    total_milestones INTEGER DEFAULT 1,
    completed_milestones INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LOMBA TRACKING
CREATE TABLE IF NOT EXISTS lomba_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_lomba TEXT NOT NULL,
    penyelenggara TEXT,
    bidang TEXT,
    tanggal_daftar DATE,
    status TEXT DEFAULT 'Peserta',
    email TEXT,
    member_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EVENTS
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    date TEXT,
    time TEXT,
    platform TEXT,
    location TEXT,
    type TEXT DEFAULT 'Mentoring',
    registration_link TEXT,
    visibility TEXT DEFAULT 'all',
    cluster TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EVENT ATTENDANCE
CREATE TABLE IF NOT EXISTS event_attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT,
    email TEXT,
    member_name TEXT,
    status TEXT,
    alasan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. USER PLANS (calendar)
CREATE TABLE IF NOT EXISTS user_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT,
    tanggal DATE,
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DESIGN ORDERS (CDA/HEG/Korvoks -> MBD)
CREATE TABLE IF NOT EXISTS design_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_name TEXT NOT NULL,
    design_type TEXT,
    photo_link TEXT,
    brief TEXT,
    ordered_by TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INFO LOMBA (managed by MBD Web Dev)
CREATE TABLE IF NOT EXISTS info_lomba (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    poster_url TEXT,
    registration_link TEXT,
    guidebook_link TEXT,
    published_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. FASILITAS (managed by MBD Web Dev)
CREATE TABLE IF NOT EXISTS fasilitas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    link TEXT,
    image_url TEXT,
    published_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS tapi allow anon read/write 
-- (karena pakai anon key & custom auth)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE lomba_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE info_lomba ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasilitas ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all for anon (sesuai current setup)
-- CATATAN: Untuk production, sebaiknya gunakan Supabase Auth + proper RLS

CREATE POLICY "Allow all for anon" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON prestasi FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON lomba_tracking FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON event_attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON user_plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON design_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON info_lomba FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON fasilitas FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Buat bucket "prestasi-images" di Supabase Dashboard > Storage
-- Set ke PUBLIC agar gambar bisa diakses tanpa auth

-- ============================================
-- SEED DATA: Import profiles dari CSV
-- ============================================
-- Upload file dummy_accounts_random_cluster.csv 
-- ke tabel profiles via Supabase Dashboard > Table Editor > Import CSV
