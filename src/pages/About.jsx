import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { getMembers, getStaffAwards, getSiteContent } from '../services/supabase'
import { Target, Eye, Award } from 'lucide-react'

const ORG_STRUCTURE = [
  { role: 'Supervisor', name: 'Dr. [Nama Supervisor]', desc: 'Pembina Komunitas' },
  { role: 'Ketua Umum', name: '[Nama Ketua]', desc: 'BPH' },
  { role: 'Wakil Ketua', name: '[Nama Wakil]', desc: 'BPH' },
  { role: 'Sekretaris', name: '[Nama Sekretaris]', desc: 'BPH' },
  { role: 'Bendahara', name: '[Nama Bendahara]', desc: 'BPH' },
]

const DIVISIONS = [
  { name: 'HEG', full: 'Human Empowerment & Growth', color: '#2A9D8F', desc: 'Mengelola anggota, absensi, poin aktivitas, dan pengembangan SDM komunitas.' },
  { name: 'CDA', full: 'Competition & Development Achievement', color: '#E63946', desc: 'Mendampingi anggota dalam kompetisi dan memantau perkembangan prestasi per klaster.' },
  { name: 'MBD', full: 'Media & Branding Division', color: '#D4A017', desc: 'Mengelola konten media sosial, desain grafis, video, dan website komunitas.' },
  { name: 'KORVOKS', full: 'Koordinasi Vokasi & Konten', color: '#1D3557', desc: 'Koordinasi lintas divisi dan pengelolaan konten vokasi komunitas.' },
]

export default function AboutPage() {
  const [members, setMembers] = useState([])
  const [awards, setAwards] = useState([])
  const [vision, setVision] = useState('')
  const [mission, setMission] = useState('')
  const [activeCluster, setActiveCluster] = useState('desain')

  useEffect(() => {
    getMembers().then(r => setMembers(r.data || []))
    getStaffAwards().then(r => setAwards(r.data || []))
    getSiteContent('vision').then(r => setVision(r.data?.value || 'Menjadi komunitas prestasi mahasiswa IPB yang terdepan, inklusif, dan berdampak nyata bagi bangsa.'))
    getSiteContent('mission').then(r => setMission(r.data?.value || 'Mendampingi, memfasilitasi, dan mengapresiasi setiap pencapaian mahasiswa IPB University.'))
  }, [])

  const clusterMembers = members.filter(m => m.cluster === activeCluster)

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>
        {/* Hero */}
        <section style={{ padding: '5rem 0 4rem', background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', color: 'white', textAlign: 'center' }}>
          <div className="container">
            <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
              KABINET AKSARA KARYA
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem', color: 'white' }}>Tentang Aksara Karya 62</h1>
            <p style={{ maxWidth: 560, margin: '0 auto', opacity: 0.8, fontSize: '1rem', lineHeight: 1.7 }}>
              Komunitas Prestasi Mahasiswa IPB University yang bernaung di bawah Direktorat Kemahasiswaan.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="section">
          <div className="container">
            <div className="grid-2" style={{ gap: '2rem', alignItems: 'stretch' }}>
              <div className="card" style={{ cursor: 'default' }}>
                <div className="card-body">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Eye size={22} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Visi</h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>{vision}</p>
                </div>
              </div>
              <div className="card" style={{ cursor: 'default' }}>
                <div className="card-body">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Target size={22} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Misi</h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>{mission}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Org Structure */}
        <section className="section" style={{ background: 'var(--color-surface-2)' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)' }}>Struktur Organisasi</h2>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Kabinet AKSARA KARYA</p>
            </div>
            {/* BPH */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
              {ORG_STRUCTURE.map((s, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '1.25rem 1.5rem', border: '1px solid var(--color-border)', textAlign: 'center', minWidth: 160 }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: 6 }}>{s.role}</p>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{s.desc}</p>
                </div>
              ))}
            </div>
            {/* Divisions */}
            <div className="grid-4" style={{ gap: '1rem' }}>
              {DIVISIONS.map(div => (
                <div key={div.name} style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: `2px solid ${div.color}22` }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: div.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.75rem', color: div.color }}>{div.name}</span>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{div.name}</p>
                  <p style={{ fontSize: '0.72rem', color: div.color, fontWeight: 600, marginBottom: '0.75rem' }}>{div.full}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{div.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Staff Awarding */}
        {awards.length > 0 && (
          <section className="section">
            <div className="container">
              <div className="text-center" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)' }}>Staff of the Month</h2>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Apresiasi pengurus terbaik setiap bulan</p>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {awards.slice(0, 4).map(a => (
                  <div key={a.id} style={{ background: 'var(--color-accent-light)', border: '1px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center', width: 200 }}>
                    <Award size={32} style={{ color: 'var(--color-accent)', margin: '0 auto 0.75rem' }} />
                    <div className="avatar avatar-lg" style={{ margin: '0 auto 0.75rem', background: 'var(--color-accent-light)', overflow: 'hidden' }}>
                      {a.profiles?.avatar_url ? <img src={a.profiles.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                        <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-accent)' }}>{a.profiles?.name?.[0]}</span>}
                    </div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{a.profiles?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{a.month}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Cluster Members */}
        <section className="section" style={{ background: 'var(--color-surface-2)' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)' }}>Anggota Klaster</h2>
            </div>
            <div className="tabs" style={{ maxWidth: 500, margin: '0 auto 2rem' }}>
              {['desain','olimpiade','penulisan','bisnis'].map(k => (
                <button key={k} className={`tab${activeCluster===k?' active':''}`} onClick={() => setActiveCluster(k)} style={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>{k}</button>
              ))}
            </div>
            {clusterMembers.length === 0 ? (
              <div className="empty-state"><p>Belum ada anggota di klaster ini</p></div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                {clusterMembers.map(m => (
                  <div key={m.id} style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <div className="avatar avatar-lg" style={{ margin: '0 auto 0.75rem', overflow: 'hidden', background: 'var(--color-primary-pale)' }}>
                      {m.avatar_url ? <img src={m.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                        <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primary)' }}>{m.name?.[0]}</span>}
                    </div>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{m.name}</p>
                    {m.bio && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.bio}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
