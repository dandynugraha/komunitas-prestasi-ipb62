// seed-users.js  ← VERSI BARU pakai data_login_kompres.csv
//
// Cara pakai:
// 1. Isi SUPABASE_URL dan SUPABASE_SERVICE_KEY di bawah
// 2. Jalankan: node seed-users.js
//
// Butuh Node.js v18+ dan package sudah terinstall (npm install)

import { createClient } from '@supabase/supabase-js'

// ============================================================
// ⚠️  WAJIB DIISI — ambil dari Supabase > Settings > API
// ============================================================
const SUPABASE_URL         = 'https://lflmkmflgnvuvjztozyk.supabase.co'   // ← ganti
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbG1rbWZsZ252dXZqenRvenlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTI0NDIzOSwiZXhwIjoyMDkwODIwMjM5fQ.2HPg2icDIhLNpVaxvHWMb2SIQcaQeYvYTYae0bklasM'   // ← ganti (service_role, BUKAN anon!)
// ============================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// Mapping nama klaster panjang CSV -> slug di database
const CLUSTER_MAP = {
  'Bisnis dan Analisis Strategi'          : 'bisnis',
  'Desain dan Visual Kreatif'             : 'desain',
  'Penulisan Ilmiah dan Olimpiade Sains'  : 'penulisan',
}

const users = [
  // ── MEMBER - Bisnis dan Analisis Strategi ──────────────────
  { name:'Ervina Tri Hendrawati',           email:'ervinahendrwt@gmail.com',             password:'RONA622501', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Muhammad Ibadurrahman',           email:'mibad2005@gmail.com',                 password:'RONA622502', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Muhammad Ihsan Athallah Shidiq',  email:'ihsan.athallah@apps.ipb.ac.id',       password:'RONA622503', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Nazara Zafira Yunus',             email:'nazara.zy.75@gmail.com',              password:'RONA622504', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Sipa Rahayu',                     email:'siparahayu@apps.ipb.ac.id',           password:'RONA622505', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Faris Yakhzaan Jamaludin',        email:'farisyakhzaan@apps.ipb.ac.id',        password:'RONA622506', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Ilham Holik',                     email:'ilhamkholik2408@gmail.com',           password:'RONA622507', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Najwa Azzahra',                   email:'zhrnazwa69@gmail.com',                password:'RONA622508', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Najmah Mahmudah Kahhar',          email:'najmahkahhar@apps.ipb.ac.id',         password:'RONA622509', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Muhammad Arkana Habibilah',       email:'arkanahabibilah@apps.ipb.ac.id',      password:'RONA622510', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Azzahro Nur Salsabila',           email:'salsabilaazzahro@apps.ipb.ac.id',     password:'RONA622511', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Muhammad Arsyal Fauzan',          email:'arsyalfauzan@apps.ipb.ac.id',         password:'RONA622512', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Sekar Dewi Palupi',               email:'dewiplp12sekar@apps.ipb.ac.id',       password:'RONA622513', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Yusuf Ahsan Faris',               email:'yusuffaris0812@gmail.com',            password:'RONA622514', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Belfa Fahrefi',                   email:'belfafahrefi@gmail.com',              password:'RONA622515', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Firyal Naura Rafanda',            email:'rafanda21aura@gmail.com',             password:'RONA622516', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Hani Azalia Khairunnisa',         email:'hanizlia384@gmail.com',               password:'RONA622517', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Muhammad Rafi Alfariza',          email:'rafiialfariza@apps.ipb.ac.id',        password:'RONA622518', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Namira Nurfayza Winanda',         email:'namiranurfayza@apps.ipb.ac.id',       password:'RONA622519', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Naura Ansya Liady Surya',         email:'nauraansya@gmail.com',                password:'RONA622520', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Selvi Ferawati',                  email:'selviferawati@apps.ipb.ac.id',        password:'RONA622521', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Ni Wayan Puty Diva Sattvika',     email:'divasattvika@apps.ipb.ac.id',         password:'RONA622522', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Hilda Melani',                    email:'hildamelani133@gmail.com',            password:'RONA622523', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Fadhilah Nur Wahyuni',            email:'fadhilahnwynur@apps.ipb.ac.id',       password:'RONA622524', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  { name:'Salsa Putri Azzahra',             email:'saputazzahra@apps.ipb.ac.id',         password:'RONA622525', cluster:'Bisnis dan Analisis Strategi',         role:'member' },
  // ── MEMBER - Desain dan Visual Kreatif ─────────────────────
  { name:'Fatima Tuzahro',                  email:'fatimatuzahro22062006@gmail.com',     password:'RONA622526', cluster:'Desain dan Visual Kreatif',            role:'member' },
  { name:'Natasya Irvani Khoerunnisa',      email:'natasya09irvani@apps.ipb.ac.id',      password:'RONA622527', cluster:'Desain dan Visual Kreatif',            role:'member' },
  { name:'Citra Putri Marlin',              email:'putrimarlinc@gmail.com',              password:'RONA622528', cluster:'Desain dan Visual Kreatif',            role:'member' },
  { name:'Luthfiyah Mahfuzhah',             email:'luthfiyahmahfuzhah@apps.ipb.ac.id',   password:'RONA622529', cluster:'Desain dan Visual Kreatif',            role:'member' },
  { name:'Hanisa Ramania',                  email:'hanisaramania@apps.ipb.ac.id',        password:'RONA622530', cluster:'Desain dan Visual Kreatif',            role:'member' },
  { name:'Purnasri',                        email:'prnaa.sriipurnasri@apps.ipb.ac.id',   password:'RONA622531', cluster:'Desain dan Visual Kreatif',            role:'member' },
  { name:'Elfarash Pradhikta Artha Damara', email:'elfarashpradhiktaa@gmail.com',        password:'RONA622532', cluster:'Desain dan Visual Kreatif',            role:'member' },
  { name:'Hanin Shafiyyurrahman',           email:'2006hnhanin@apps.ipb.ac.id',          password:'RONA622533', cluster:'Desain dan Visual Kreatif',            role:'member' },
  { name:'Siti Nurmalasari',                email:'sytheanurmalasari@apps.ipb.ac.id',    password:'RONA622534', cluster:'Desain dan Visual Kreatif',            role:'member' },
  { name:'Desta Restiani Anwar',            email:'destarestiani11@gmail.com',           password:'RONA622535', cluster:'Desain dan Visual Kreatif',            role:'member' },
  // ── MEMBER - Penulisan Ilmiah dan Olimpiade Sains ──────────
  { name:'Ananda Syifa Azzahrah',           email:'syifaazzahrah@apps.ipb.ac.id',        password:'RONA622536', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Cesya Adinda Putri',              email:'shroud.ctseacesya@apps.ipb.ac.id',    password:'RONA622537', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Ekha Khoerunisa',                 email:'Ekhanisa167@gmail.com',               password:'RONA622538', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:"Nur Sa'diah",                     email:'nuursadiah@apps.ipb.ac.id',           password:'RONA622539', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Himeriko Awahita',                email:'hime.rikoo@gmail.com',                password:'RONA622540', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Jihandra Lecy Pramudya',          email:'jhndrlecy@apps.ipb.ac.id',            password:'RONA622541', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Meisya Salsa Zhafira',            email:'meisyasalsa@apps.ipb.ac.id',          password:'RONA622542', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Muhammad Alfa Ridho',             email:'alfharidho@apps.ipb.ac.id',           password:'RONA622543', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Nanda Putri Bachtiar',            email:'nandabachtiar62@gmail.com',           password:'RONA622544', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Naswa Kartika Nurhasanah',        email:'kartikanaswa@apps.ipb.ac.id',         password:'RONA622545', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Ni Dea Yekti Utami',              email:'iamdeyyekti@apps.ipb.ac.id',          password:'RONA622546', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Nicky Chandra Juniversaria',      email:'nckyfcrzy_ahmad@apps.ipb.ac.id',      password:'RONA622547', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Nur Fauzia Ramadhani',            email:'nurfauziaptn@gmail.com',              password:'RONA622548', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Nur Halimah',                     email:'halimahnur3306@gmail.com',            password:'RONA622549', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Putri Lira Savira Hilmansyah',    email:'savirahilmansyah@gmail.com',          password:'RONA622550', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Ranthy Vitria Wijaksana',         email:'rvitriawijaksana@apps.ipb.ac.id',     password:'RONA622551', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Shabrina Nur Syafitri',           email:'shabrinanrsyafitri@apps.ipb.ac.id',   password:'RONA622552', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Muhammad Edo Aditya',             email:'medoaditya27@gmail.com',              password:'RONA622553', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Junior Ariel',                    email:'juniorariel@apps.ipb.ac.id',          password:'RONA622554', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Cepi Agustian',                   email:'cepiagustian@apps.ipb.ac.id',         password:'RONA622555', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Putri Nasyifah Aprillianty',      email:'nasyifahputri@apps.ipb.ac.id',        password:'RONA622556', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Nayla Azzahra',                   email:'azzahranayla@apps.ipb.ac.id',         password:'RONA622557', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Rahmi Fadhilah Ramadani',         email:'rf9471841@gmail.com',                 password:'RONA622558', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Agni Meidinna',                   email:'meidinna766@gmail.com',               password:'RONA622559', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  // ⚠️ PERINGATAN: email Aisha di CSV sama dengan Agni (meidinna766@gmail.com)
  // Sudah diubah agar tidak duplikat — konfirmasi email Aisha yang benar ke admin
  { name:'Aisha Rachmania',                 email:'aisharachmania@apps.ipb.ac.id',       password:'RONA622560', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Cantika Ghaitsaa Putri Az Zahra', email:'cantikaghaitsaa@apps.ipb.ac.id',      password:'RONA622561', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Keyla Nusyifa Tazril',            email:'keyla.nsyfaaa@gmail.com',             password:'RONA622562', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Pratama Fahriel Sanjaya',         email:'pratamasanjaya@apps.ipb.ac.id',       password:'RONA622563', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Ghina Nur Azizah',                email:'ghinanurazizah@apps.ipb.ac.id',       password:'RONA622564', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Nayla Shafira',                   email:'naysfraa@gmail.com',                  password:'RONA622565', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Amalia Habibatul Hasan',          email:'amal14hasanah@gmail.com',             password:'RONA622566', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Nisrina Nailis Solahia',          email:'nailisnisrina@apps.ipb.ac.id',        password:'RONA622567', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Hilya Muhammad',                  email:'hilihmuh@gmail.com',                  password:'RONA622568', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Julayka Nurul Annisa',            email:'julaykanurul@apps.ipb.ac.id',         password:'RONA622569', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Kristian Aga Yudustira Laru',     email:'kristianaga0@gmail.com',              password:'RONA622570', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Mariam Evita Anggun',             email:'mariamevitaanggun@apps.ipb.ac.id',    password:'RONA622571', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Muhammad Fakhriy Annas',          email:'fakhriyannas@apps.ipb.ac.id',         password:'RONA622572', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Nurwahyu Burlian Dana',           email:'ipbburliandana@apps.ipb.ac.id',       password:'RONA622573', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Olivia Dwi Zadri',                email:'oliviadwizdr@gmail.com',              password:'RONA622574', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Shofa Nurchotima',                email:'shofanurchotima@apps.ipb.ac.id',      password:'RONA622575', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Siti Anisa Rahman',               email:'anisarahman@apps.ipb.ac.id',          password:'RONA622576', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Siti Luthfiyah',                  email:'tekpangsiti@apps.ipb.ac.id',          password:'RONA622577', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Muhammad Baqir',                  email:'muhammadbaqir@apps.ipb.ac.id',        password:'RONA622578', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Oktaviani Eka Putri',             email:'ekaputrii_oktaviani@apps.ipb.ac.id',  password:'RONA622579', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  { name:'Xaviera Lupita Neema',            email:'rara_18xaviera@apps.ipb.ac.id',       password:'RONA622580', cluster:'Penulisan Ilmiah dan Olimpiade Sains',  role:'member' },
  // ── STAFF ────────────────────────────────────────────────────
  { name:'Audia Maharani',                  email:'audiamaharani@apps.ipb.ac.id',        password:'AKSARA6281',  cluster:'bisnis',    role:'cda (bisnis)'      },
  { name:'Humaira Radhwa',                  email:'humaihumaira@apps.ipb.ac.id',         password:'AKSARA6282',  cluster:'desain',    role:'cda (desain)'      },
  { name:'Nurul Fathin Fawwazah',           email:'nf21307nurul@apps.ipb.ac.id',         password:'AKSARA6283',  cluster:'penulisan', role:'cda (penulisan)'   },
  { name:'Reisya Aprilian',                 email:'work1aprilian@apps.ipb.ac.id',        password:'AKSARA6284',  cluster:'penulisan', role:'cda (olimpiade)'   },
  { name:'Finastika Khoirunisa',            email:'khoirunisafinastika@apps.ipb.ac.id',  password:'AKSARA6285',  cluster:'bisnis',    role:'cda'               },
  { name:'Raffa Adzkia At-Tariq',           email:'raffaadzkiaattariq@apps.ipb.ac.id',   password:'AKSARA6286',  cluster:'bisnis',    role:'cda'               },
  { name:'Naila Nabila',                    email:'naila007nabila@apps.ipb.ac.id',       password:'AKSARA6287',  cluster:'desain',    role:'mbd (ilustrator)'  },
  { name:'Sarah Fahima Mumtaza',            email:'sarahmumtaza@apps.ipb.ac.id',         password:'AKSARA6288',  cluster:'desain',    role:'mbd (desain grafis)'},
  { name:'Anisa Faradiba Maulidia',         email:'dipsiimaulidia@apps.ipb.ac.id',       password:'AKSARA6289',  cluster:'bisnis',    role:'mbd (video editor)'},
  { name:'Umar Sadaad',                     email:'detectivesadaad@apps.ipb.ac.id',      password:'AKSARA6290',  cluster:'bisnis',    role:'mbd (multimedia)'  },
  { name:'Muhammad Dandy Nugraha',          email:'muhammad_dandy@apps.ipb.ac.id',       password:'AKSARA6291',  cluster:'bisnis',    role:'mbd'               },
  { name:'Hasna Diva Salsabilla',           email:'hasnasalsabilla@apps.ipb.ac.id',      password:'AKSARA6292',  cluster:'bisnis',    role:'heg'               },
  { name:'Rafi Muhammad Nuuro Tamaam',      email:'rftamaam@apps.ipb.ac.id',             password:'AKSARA6293',  cluster:'bisnis',    role:'heg'               },
  { name:'Khornellio Eka Saputra',          email:'khornellioekasaputra@apps.ipb.ac.id', password:'AKSARA6294',  cluster:'bisnis',    role:'heg'               },
  { name:'Ajeng Khoerunisa',                email:'ajengkhrsn621ajeng@apps.ipb.ac.id',   password:'AKSARA6295',  cluster:'penulisan', role:'heg'               },
  { name:'Arsya Ahmad Rifaindika',          email:'arsyarifaindika@apps.ipb.ac.id',      password:'AKSARA6296',  cluster:'penulisan', role:'heg'               },
  { name:'Muhammad Fadhli Ramadhan',        email:'muhammadfadhli@apps.ipb.ac.id',       password:'AKSARA6297',  cluster:'bisnis',    role:'korvoks'           },
  { name:'Muhamad Fadhly Fathurrahman',     email:'fadhlyy_fathurrahman@apps.ipb.ac.id', password:'AKSARA6298',  cluster:'penulisan', role:'korvoks'           },
  { name:'Ahmad Abel Rabbani',              email:'ahmadrabbani@apps.ipb.ac.id',         password:'AKSARA6299',  cluster:'bisnis',    role:'korvoks'           },
  { name:'Rabiatul Adawiyah',              email:'rabiaaadawiyah@apps.ipb.ac.id',         password:'AKSARA62100', cluster:'penulisan', role:'korvoks'           },
  { name:'Muhammad Ihsan Ali Fauzi',        email:'ihsanalifauzi@apps.ipb.ac.id',        password:'AKSARA62101', cluster:'penulisan', role:'korvoks'           },
  { name:'Brawijaya Mahdi Pratama',         email:'brawijayapratama@apps.ipb.ac.id',     password:'AKSARA62102', cluster:'bisnis',    role:'bph'               },
  { name:'Imanuel Kristian Sugiono',        email:'imanuelkskristian@apps.ipb.ac.id',    password:'AKSARA62103', cluster:'bisnis',    role:'bph'               },
  { name:'Andien Aulia',                    email:'andienaulia@apps.ipb.ac.id',           password:'AKSARA62104', cluster:'bisnis',    role:'bph'               },
  { name:'Adela Anur Faindah',              email:'faindahadela@apps.ipb.ac.id',          password:'AKSARA62105', cluster:'bisnis',    role:'bph'               },
]

async function seedUsers() {
  console.log('\n🌱 Aksara Karya 62 — User Seeder (data_login_kompres.csv)')
  console.log(`📋 Total akun: ${users.length}\n`)

  let success = 0, skipped = 0, failed = 0
  const errors = []

  for (const user of users) {
    const clusterSlug = CLUSTER_MAP[user.cluster] || user.cluster

    try {
      const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email: user.email.trim(),
        password: user.password,
        email_confirm: true,
        user_metadata: { name: user.name.trim() }
      })

      if (authErr) {
        if (authErr.message.includes('already') || authErr.message.includes('exists')) {
          console.log(`⚠️  Skip: ${user.email}`)
          skipped++
          continue
        }
        throw authErr
      }

      const { error: profileErr } = await supabase.from('profiles').upsert({
        id:      authData.user.id,
        name:    user.name.trim(),
        email:   user.email.trim(),
        cluster: clusterSlug,
        role:    user.role,
        points:  0,
      })

      if (profileErr) throw profileErr

      const roleLabel = user.role.padEnd(20)
      const clusterLabel = clusterSlug.padEnd(12)
      console.log(`✅ [${roleLabel}] [${clusterLabel}] ${user.name}`)
      success++

    } catch (err) {
      console.error(`❌ GAGAL: ${user.name} — ${err.message}`)
      errors.push({ name: user.name, email: user.email, error: err.message })
      failed++
    }

    await new Promise(r => setTimeout(r, 200))
  }

  console.log('\n' + '─'.repeat(60))
  console.log(`✅ Berhasil  : ${success}`)
  console.log(`⚠️  Dilewati  : ${skipped}`)
  console.log(`❌ Gagal     : ${failed}`)

  if (errors.length > 0) {
    console.log('\n📋 Yang gagal:')
    errors.forEach(e => console.log(`   - ${e.name} (${e.email})\n     → ${e.error}`))
  }

  console.log('\n⚠️  PERHATIAN: Email Aisha Rachmania di CSV duplikat dengan Agni Meidinna')
  console.log('   Email Aisha sudah diubah ke: aisharachmania@apps.ipb.ac.id')
  console.log('   Konfirmasi email aslinya ke yang bersangkutan!\n')
}

seedUsers()