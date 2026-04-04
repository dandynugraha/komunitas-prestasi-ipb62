# Aksara Karya 62 — Web Platform

Platform prestasi komunitas IPB University. Dibangun dengan React + Vite + Supabase.

---

## Daftar Isi
1. [Yang Kamu Butuhkan](#1-yang-kamu-butuhkan)
2. [Langkah 1 — Setup Supabase](#2-langkah-1--setup-supabase)
3. [Langkah 2 — Download & Konfigurasi Project](#3-langkah-2--download--konfigurasi-project)
4. [Langkah 3 — Deploy ke GitHub Pages](#4-langkah-3--deploy-ke-github-pages)
5. [Langkah 4 — Import Akun Anggota](#5-langkah-4--import-akun-anggota)
6. [Langkah 5 — Buat Akun Kadiv Web](#6-langkah-5--buat-akun-kadiv-web)
7. [Struktur Folder](#7-struktur-folder)
8. [Fitur & Role](#8-fitur--role)
9. [FAQ Deploy](#9-faq-deploy)

---

## 1. Yang Kamu Butuhkan

Sebelum mulai, pastikan kamu sudah install:

| Tool | Download |
|------|----------|
| **Node.js** (v18+) | https://nodejs.org |
| **Git** | https://git-scm.com |
| **Akun GitHub** | https://github.com |
| **Akun Supabase** | https://supabase.com (gratis) |
| **API Key Gemini** | https://aistudio.google.com/apikey (gratis) |

---

## 2. Langkah 1 — Setup Supabase

### A. Buat Project Supabase
1. Buka https://supabase.com → Login
2. Klik **"New Project"**
3. Isi:
   - **Name**: `aksara-karya-62`
   - **Database Password**: buat password yang kuat (simpan!)
   - **Region**: Southeast Asia (Singapore)
4. Tunggu ~2 menit sampai project siap

### B. Ambil URL & API Key
1. Di sidebar kiri, klik **Settings** (ikon gear)
2. Klik **API**
3. Copy 2 nilai ini (akan dipakai nanti):
   - **Project URL** → contoh: `https://abcdefgh.supabase.co`
   - **anon public** (di bawah "Project API keys")

### C. Jalankan SQL Schema
1. Di sidebar kiri, klik **SQL Editor**
2. Klik **"New query"**
3. Buka file `supabase-schema.sql` dari folder project ini
4. Copy **semua isinya** → Paste ke SQL Editor
5. Klik tombol **"Run"** (▶ di kanan atas)
6. Pastikan muncul pesan **"Success. No rows returned"** atau "1 row affected"

### D. Buat Storage Buckets
1. Di sidebar kiri, klik **Storage**
2. Klik **"New bucket"** → buat 4 bucket berikut (centang **Public**):

| Nama Bucket | Public? |
|-------------|---------|
| `achievements` | ✅ Ya |
| `events` | ✅ Ya |
| `profiles` | ✅ Ya |
| `site` | ✅ Ya |

> Kalau sudah jalankan SQL schema di atas, bucket mungkin sudah terbuat otomatis. Cek dulu.

### E. Aktifkan Email Auth
1. Sidebar kiri → **Authentication** → **Providers**
2. Pastikan **Email** sudah **Enabled**
3. Di bagian **Email**, matikan "Confirm email" (agar anggota bisa langsung login)

---

## 3. Langkah 2 — Download & Konfigurasi Project

### A. Download / Clone Project
```bash
# Jika pakai Git:
git clone https://github.com/USERNAME/aksara-karya-62.git
cd aksara-karya-62

# Atau extract ZIP yang sudah didownload, lalu buka terminal di foldernya
```

### B. Install Dependencies
```bash
npm install
```
Tunggu beberapa menit sampai selesai.

### C. Buat File .env
Di folder project, buat file baru bernama **`.env`** (persis, titik di depan), isi:

```
VITE_SUPABASE_URL=https://XXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_GEMINI_API_KEY=AIzaSy...
```

Ganti nilainya:
- `VITE_SUPABASE_URL` → Project URL dari langkah 2B
- `VITE_SUPABASE_ANON_KEY` → anon public key dari langkah 2B
- `VITE_GEMINI_API_KEY` → API Key dari https://aistudio.google.com/apikey

> ⚠️ File `.env` TIDAK ikut ke GitHub (sudah ada di `.gitignore`). Jangan dibagikan.

### D. Test di Lokal (Opsional)
```bash
npm run dev
```
Buka browser ke http://localhost:5173 — website harusnya jalan.

---

## 4. Langkah 3 — Deploy ke GitHub Pages

### A. Buat Repository GitHub
1. Buka https://github.com → **New Repository**
2. Isi nama repo, contoh: `aksara-karya-62`
3. Set ke **Public**
4. Klik **Create repository**

### B. Sesuaikan nama repo di vite.config.js
Buka file `vite.config.js`, ubah baris `base`:

```js
// Jika nama repo kamu 'aksara-karya-62':
base: '/aksara-karya-62/',

// Jika nama repo kamu 'web-aksara':
base: '/web-aksara/',
```

### C. Set Secrets di GitHub
Ini penting agar Supabase bisa terhubung saat build di GitHub Actions.

1. Buka repo GitHub kamu
2. Klik **Settings** (tab paling kanan)
3. Sidebar kiri → **Secrets and variables** → **Actions**
4. Klik **"New repository secret"**, tambahkan 3 secret:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | URL Supabase kamu |
| `VITE_SUPABASE_ANON_KEY` | Anon key Supabase |
| `VITE_GEMINI_API_KEY` | API Key Gemini |

### D. Aktifkan GitHub Pages
1. Di repo GitHub → **Settings** → **Pages** (sidebar kiri)
2. Di bagian **Source**, pilih: **"GitHub Actions"**
3. Simpan

### E. Push Code ke GitHub
```bash
# Di folder project:
git init
git add .
git commit -m "Initial commit: Aksara Karya 62"
git branch -M main
git remote add origin https://github.com/USERNAME/aksara-karya-62.git
git push -u origin main
```

### F. Cek Deployment
1. Di repo GitHub → klik tab **Actions**
2. Lihat workflow **"Deploy to GitHub Pages"** berjalan
3. Tunggu ~2-3 menit sampai ada centang hijau ✅
4. Website live di: `https://USERNAME.github.io/aksara-karya-62/`

> Setiap kali kamu push ke branch `main`, website otomatis update!

---

## 5. Langkah 4 — Import Akun Anggota

Ada 2 cara:

### Cara A: Pakai Script Seeder (Semua Sekaligus)
1. Buka file `seed-users.js`
2. Isi `SUPABASE_URL` dan `SUPABASE_SERVICE_KEY`
   - Service key ada di: Supabase → Settings → API → **service_role** (bukan anon!)
3. Jalankan:
```bash
node seed-users.js
```

### Cara B: Manual Satu Per Satu (via Supabase Dashboard)
1. Supabase → **Authentication** → **Users** → **"Add user"**
2. Isi email + password sesuai CSV
3. Setelah akun dibuat, update profile di **Table Editor** → tabel `profiles`

---

## 6. Langkah 5 — Buat Akun Kadiv Web

Kadiv Web (MBD Web Developer) punya akses ke seluruh CMS panel.

### A. Buat akun
1. Supabase → Authentication → Users → Add user
2. Isi email dan password untuk Kadiv Web

### B. Set role
1. Supabase → Table Editor → tabel `profiles`
2. Cari row dengan email Kadiv Web
3. Ubah kolom `role` menjadi: `mbd (web developer)`

### C. Login ke CMS
- Login di website dengan akun Kadiv Web
- Klik foto profil → **"Kelola Konten"** atau langsung ke `/admin`
- Semua konten website bisa diedit tanpa coding!

---

## 7. Struktur Folder

```
aksara-karya-62/
├── public/
│   └── logo.png               ← Logo komunitas
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx     ← Navigasi atas
│   │   │   ├── Footer.jsx     ← Footer
│   │   │   └── DashboardLayout.jsx
│   │   └── ui/
│   │       └── index.jsx      ← Komponen reusable
│   ├── hooks/
│   │   └── useAuth.jsx        ← Auth context
│   ├── pages/
│   │   ├── Home.jsx           ← Halaman beranda
│   │   ├── About.jsx          ← Tentang Kami
│   │   ├── FAQ.jsx            ← FAQ + AI Gemini
│   │   ├── Events.jsx         ← Event, Fasilitas, Kompetisi
│   │   ├── auth/
│   │   │   └── Login.jsx
│   │   ├── member/            ← Dashboard anggota
│   │   ├── staff/             ← Dashboard HEG/CDA/BPH/KORVOKS
│   │   └── admin/
│   │       └── Dashboard.jsx  ← CMS Panel (Kadiv Web)
│   ├── services/
│   │   ├── supabase.js        ← Semua fungsi database
│   │   └── gemini.js          ← Integrasi AI Gemini
│   ├── styles/
│   │   └── global.css         ← Design system lengkap
│   ├── App.jsx                ← Router utama
│   └── main.jsx               ← Entry point
├── .env                       ← Env variables (JANGAN di-push!)
├── .env.example               ← Template env
├── supabase-schema.sql        ← SQL untuk setup database
├── seed-users.js              ← Script import akun
├── vite.config.js
└── package.json
```

---

## 8. Fitur & Role

### Role Sistem
| Role | Akses |
|------|-------|
| `member` | Upload prestasi, proyek, lihat event, kalender pribadi |
| `heg` | Semua member + kelola absensi, poin, Staff of Month |
| `cda` / `cda (bisnis)` dll | Semua member + lihat anggota klaster, buat event |
| `mbd (...)` | Semua member + fitur MBD |
| `mbd (web developer)` | **Full CMS Panel** — kelola semua konten |
| `korvoks` | Semua member + panel KORVOKS |
| `bph` | Akses semua panel + activity feed global |

### Poin Prestasi (Otomatis)
| Level | Poin |
|-------|------|
| Internasional | 100 |
| Nasional | 70 |
| Provinsi | 40 |
| Kota | 20 |
| Universitas | 10 |

---

## 9. FAQ Deploy

**Q: Website jalan tapi data tidak muncul?**
A: Cek apakah `.env` sudah diisi dan Secrets GitHub sudah benar. Coba buka Console browser (F12) untuk lihat error.

**Q: Halaman di-refresh jadi 404?**
A: Tambahkan file `404.html` di folder `public/` yang isinya sama dengan `index.html`. GitHub Pages memerlukan ini untuk React Router.

Buat file `public/404.html` dengan isi:
```html
<!DOCTYPE html>
<html>
<head>
  <script>
    const path = window.location.pathname;
    const query = window.location.search;
    window.location.replace('/aksara-karya-62/?p=' + encodeURIComponent(path + query));
  </script>
</head>
</html>
```

**Q: Gambar tidak muncul setelah upload?**
A: Pastikan Storage bucket sudah diset ke **Public** di Supabase.

**Q: Error "Invalid API Key" di FAQ AI?**
A: Cek `VITE_GEMINI_API_KEY` di `.env` dan di GitHub Secrets.

**Q: Gimana update website setelah perubahan kode?**
A: Cukup `git add . && git commit -m "update" && git push`. GitHub Actions otomatis deploy ulang.

**Q: Kadiv Web bisa edit apa saja tanpa coding?**
A: Via CMS Panel (`/admin`):
- Edit teks visi, misi, judul, subtitle
- Kelola dan hapus prestasi
- Buat, edit, hapus event & kompetisi
- Edit data anggota dan role
- Upload/kelola media di Storage
- Pengaturan warna dan nama situs

---

## Kontak

Komunitas Aksara Karya 62 · IPB University  
Instagram: [@aksarakarya62](https://www.instagram.com/aksarakarya62)  
Direktorat Kemahasiswaan IPB University
