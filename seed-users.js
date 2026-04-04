// seed-users.js
// Jalankan SEKALI untuk import akun dari CSV ke Supabase Auth + profiles
// Cara: node seed-users.js (di folder root project)
//
// Install dulu: npm install @supabase/supabase-js
// Isi SUPABASE_URL dan SUPABASE_SERVICE_KEY di bawah

import { createClient } from '@supabase/supabase-js'

// ⚠️ GANTI dengan nilai dari Supabase Dashboard > Settings > API
const SUPABASE_URL = 'https://your-project.supabase.co'
const SUPABASE_SERVICE_KEY = 'your-service-role-key' // bukan anon key!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// Data dari dummy_accounts_random_cluster.csv
const users = [
  { name: 'Farhan Akbar', email: 'user1@example.com', password: 'RONA622501', cluster: 'penulisan', role: 'member', points: 0 },
  { name: 'Raka Pratama', email: 'user2@example.com', password: 'RONA622502', cluster: 'bisnis', role: 'member', points: 0 },
  { name: 'Naufal Ramadhan', email: 'user3@example.com', password: 'RONA622503', cluster: 'bisnis', role: 'member', points: 0 },
  { name: 'Yoga Pratama', email: 'user4@example.com', password: 'RONA622504', cluster: 'desain', role: 'member', points: 0 },
  { name: 'Rendy Utama', email: 'user5@example.com', password: 'RONA622505', cluster: 'bisnis', role: 'member', points: 0 },
  { name: 'Ilham Saputra', email: 'user6@example.com', password: 'RONA622506', cluster: 'bisnis', role: 'member', points: 0 },
  { name: 'Bagas Firmansyah', email: 'user7@example.com', password: 'RONA622507', cluster: 'desain', role: 'member', points: 0 },
  { name: 'Kevin Pratama', email: 'user8@example.com', password: 'RONA622508', cluster: 'bisnis', role: 'member', points: 0 },
  { name: 'Kevin Pratama', email: 'user9@example.com', password: 'RONA622509', cluster: 'penulisan', role: 'member', points: 0 },
  { name: 'Galang Prasetyo', email: 'user10@example.com', password: 'RONA622510', cluster: 'penulisan', role: 'member', points: 0 },
  // Staff
  { name: 'Ilham Saputra', email: 'user81@example.com', password: 'AKSARA6281', cluster: 'bisnis', role: 'cda (bisnis)', points: 0 },
  { name: 'Arga Wijaya', email: 'user82@example.com', password: 'AKSARA6282', cluster: 'bisnis', role: 'cda (desain)', points: 0 },
  { name: 'Kevin Pratama', email: 'user83@example.com', password: 'AKSARA6283', cluster: 'penulisan', role: 'cda (penulisan)', points: 0 },
  { name: 'Iqbal Saputra', email: 'user84@example.com', password: 'AKSARA6284', cluster: 'olimpiade', role: 'cda (olimpiade)', points: 0 },
  { name: 'Reza Maulana', email: 'user87@example.com', password: 'AKSARA6287', cluster: 'olimpiade', role: 'mbd (ilustrator)', points: 0 },
  { name: 'Andi Saputra', email: 'user88@example.com', password: 'AKSARA6288', cluster: 'bisnis', role: 'mbd (desain grafis)', points: 0 },
  { name: 'Farhan Akbar', email: 'user89@example.com', password: 'AKSARA6289', cluster: 'bisnis', role: 'mbd (video editor)', points: 0 },
  { name: 'Galang Prasetyo', email: 'user90@example.com', password: 'AKSARA6290', cluster: 'penulisan', role: 'mbd (multimedia)', points: 0 },
  { name: 'Agung Nugroho', email: 'user92@example.com', password: 'AKSARA6292', cluster: 'bisnis', role: 'heg', points: 0 },
  { name: 'Fajar Nugroho', email: 'user93@example.com', password: 'AKSARA6293', cluster: 'bisnis', role: 'heg', points: 0 },
  { name: 'Rama Saputra', email: 'user97@example.com', password: 'AKSARA6297', cluster: 'desain', role: 'korvoks', points: 0 },
  { name: 'Agung Nugroho', email: 'user102@example.com', password: 'AKSARA62102', cluster: 'bisnis', role: 'bph', points: 0 },
  { name: 'Kevin Pratama', email: 'user103@example.com', password: 'AKSARA62103', cluster: 'penulisan', role: 'bph', points: 0 },
]

async function seedUsers() {
  console.log(`\n🌱 Mulai import ${users.length} akun...\n`)
  let success = 0, failed = 0

  for (const user of users) {
    try {
      // 1. Buat akun di Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { name: user.name }
      })

      if (authError) {
        if (authError.message.includes('already been registered')) {
          console.log(`⚠️  ${user.email} sudah ada, skip`)
        } else {
          console.error(`❌ ${user.email}: ${authError.message}`)
          failed++
        }
        continue
      }

      // 2. Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          name: user.name,
          email: user.email,
          cluster: user.cluster,
          role: user.role,
          points: user.points,
        })

      if (profileError) {
        console.error(`❌ Profile ${user.name}: ${profileError.message}`)
        failed++
      } else {
        console.log(`✅ ${user.name} (${user.role}) — ${user.email}`)
        success++
      }

      // Delay kecil biar ga rate limited
      await new Promise(r => setTimeout(r, 150))

    } catch (err) {
      console.error(`❌ Error: ${err.message}`)
      failed++
    }
  }

  console.log(`\n✅ Selesai! Berhasil: ${success}, Gagal: ${failed}`)
  console.log('\n💡 Jangan lupa buat 1 akun Kadiv Web (MBD Web Developer) di Supabase Dashboard!')
}

seedUsers()
