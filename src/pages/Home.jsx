import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { getAchievements, getLeaderboard, getEvents, getProjects, getAchievementStats } from '../services/supabase'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Trophy, Star, Calendar, Folder, ArrowRight, Medal, ChevronRight } from 'lucide-react'
import { ClusterBadge, LevelBadge } from '../components/ui/index'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const CLUSTER_COLORS = { desain: '#E63946', olimpiade: '#1D3557', penulisan: '#457B9D', bisnis: '#2A9D8F' }

export default function Home() {
  const [achievements, setAchievements] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [events, setEvents] = useState([])
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState([])
  const [activeTab, setActiveTab] = useState('overall')
  const [selectedCluster, setSelectedCluster] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAchievements({ limit: 10 }),
      getLeaderboard(),
      getEvents({ visibility: 'public' }),
      getProjects(),
      getAchievementStats(),
    ]).then(([ach, lb, ev, proj, st]) => {
      setAchievements(ach.data || [])
      setLeaderboard(lb.data || [])
      setEvents((ev.data || []).slice(0, 4))
      setProjects((proj.data || []).slice(0, 3))
      // Process stats for pie chart
      const grouped = {}
      ;(st.data || []).forEach(r => {
        grouped[r.cluster] = (grouped[r.cluster] || 0) + 1
      })
      setStats(Object.entries(grouped).map(([name, value]) => ({ name, value })))
      setLoading(false)
    })
  }, [])

  const filteredLB = activeTab === 'overall'
    ? leaderboard
    : leaderboard.filter(m => m.cluster === activeTab)

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section style={{
          padding: '5rem 0 4rem',
          background: 'linear-gradient(135deg, #F4F3EF 0%, #FFFFFF 60%, #D8F3DC 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(27,67,50,0.06) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(45,106,79,0.06) 0%, transparent 50%)' }} />
          <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--color-primary-pale)', color: 'var(--color-primary)', padding: '6px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
              <Star size={13} fill="currentColor" /> KABINET AKSARA KARYA · IPB UNIVERSITY
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', maxWidth: 700, margin: '0 auto 1.5rem', lineHeight: 1.1 }}>
              Komunitas Prestasi<br />
              <em style={{ color: 'var(--color-primary)' }}>Aksara Karya 62</em>
            </h1>
            <p style={{ maxWidth: 520, margin: '0 auto 2.5rem', color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Platform pencatatan, pemantauan, dan apresiasi prestasi anggota IPB University. Dari olimpiade hingga karya desain.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/login" className="btn btn-primary btn-lg">Masuk ke Akun</Link>
              <Link to="/about" className="btn btn-outline btn-lg">Tentang Kami</Link>
            </div>

            {/* Cluster pills */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
              {Object.entries(CLUSTER_COLORS).map(([k, c]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 20, background: 'white', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
                  {k.charAt(0).toUpperCase() + k.slice(1)}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Achievement Feed ──────────────────────────────────────── */}
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 8, textTransform: 'uppercase' }}>Prestasi Terbaru</p>
                <h2 className="section-title">Pencapaian Anggota</h2>
              </div>
              <Link to="/achievements" className="btn btn-outline btn-sm" style={{ gap: 6 }}>
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : achievements.length === 0 ? (
              <div className="empty-state"><Trophy size={48} /><p>Belum ada prestasi</p></div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {achievements.map(a => (
                  <div key={a.id} className="card" style={{ cursor: 'default' }}>
                    {a.image_url && (
                      <div style={{ height: 200, overflow: 'hidden' }}>
                        <img src={a.image_url} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.4s ease' }}
                          onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                          onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                      </div>
                    )}
                    <div className="card-body">
                      <div style={{ display: 'flex', gap: 6, marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                        <ClusterBadge cluster={a.cluster} />
                        <LevelBadge level={a.level} />
                      </div>
                      <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>{a.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {a.storytelling}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar avatar-sm" style={{ background: 'var(--color-primary-pale)', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {a.profiles?.name?.[0] || 'A'}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{a.profiles?.name}</p>
                          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                            {a.date ? format(new Date(a.date), 'd MMM yyyy', { locale: id }) : ''}
                          </p>
                        </div>
                        {a.rank && (
                          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: 700 }}>
                            <Medal size={14} /> {a.rank}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Stats + Leaderboard ───────────────────────────────────── */}
        <section className="section" style={{ background: 'var(--color-surface-2)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
              {/* Pie Chart */}
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 8, textTransform: 'uppercase' }}>Distribusi</p>
                <h2 className="section-title" style={{ marginBottom: '2rem' }}>Statistik Klaster</h2>
                {stats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={stats} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={3} dataKey="value"
                        onClick={d => setSelectedCluster(d.name === selectedCluster ? null : d.name)}>
                        {stats.map(entry => (
                          <Cell key={entry.name} fill={CLUSTER_COLORS[entry.name] || '#ccc'}
                            opacity={selectedCluster && selectedCluster !== entry.name ? 0.4 : 1} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v, n) => [v + ' prestasi', n]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="loading-center"><div className="spinner" /></div>
                )}
                {selectedCluster && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: 12, border: '1px solid var(--color-border)' }}>
                    <p style={{ fontWeight: 700, marginBottom: '0.75rem', textTransform: 'capitalize' }}>Klaster {selectedCluster}</p>
                    {leaderboard.filter(m => m.cluster === selectedCluster).map(m => (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div className="avatar avatar-sm" style={{ background: CLUSTER_COLORS[selectedCluster] + '20', color: CLUSTER_COLORS[selectedCluster], fontWeight: 700, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {m.name?.[0]}
                        </div>
                        <span style={{ fontSize: '0.875rem' }}>{m.name}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{m.points} poin</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Leaderboard */}
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 8, textTransform: 'uppercase' }}>Peringkat</p>
                <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Leaderboard</h2>
                <div className="tabs" style={{ marginBottom: '1.5rem' }}>
                  {[['overall','Keseluruhan'],['desain','Desain'],['olimpiade','Olimpiade'],['penulisan','Penulisan'],['bisnis','Bisnis']].map(([v,l]) => (
                    <button key={v} className={`tab${activeTab===v?' active':''}`} onClick={() => setActiveTab(v)}
                      style={{ fontSize: '0.75rem', padding: '7px 10px' }}>{l}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filteredLB.slice(0, 8).map((m, i) => (
                    <div key={m.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                      background: i < 3 ? 'white' : 'transparent', borderRadius: 12,
                      border: i < 3 ? '1px solid var(--color-border)' : 'none',
                    }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem', fontWeight: 800,
                        background: i === 0 ? '#FFF3CD' : i === 1 ? '#F3F4F6' : i === 2 ? '#FDE8D8' : 'transparent',
                        color: i === 0 ? '#92670A' : i === 1 ? '#6B7280' : i === 2 ? '#9A3412' : 'var(--color-text-muted)',
                      }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                      </span>
                      <div className="avatar avatar-sm" style={{ background: CLUSTER_COLORS[m.cluster] + '20', color: CLUSTER_COLORS[m.cluster], fontWeight: 700, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {m.name?.[0]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{m.cluster}</p>
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)' }}>{m.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Upcoming Events ───────────────────────────────────────── */}
        {events.length > 0 && (
          <section className="section">
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 8, textTransform: 'uppercase' }}>Jadwal</p>
                  <h2 className="section-title">Event Mendatang</h2>
                </div>
                <Link to="/events" className="btn btn-outline btn-sm">Lihat Semua <ArrowRight size={14} /></Link>
              </div>
              <div className="grid-3">
                {events.map(ev => (
                  <div key={ev.id} className="card">
                    {ev.poster_url && <div style={{ height: 180, overflow: 'hidden' }}>
                      <img src={ev.poster_url} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>}
                    <div className="card-body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        <Calendar size={12} />
                        {ev.event_date ? format(new Date(ev.event_date), 'd MMMM yyyy', { locale: id }) : 'TBD'}
                      </div>
                      <h3 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>{ev.title}</h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ev.caption}</p>
                      {ev.registration_link && (
                        <a href={ev.registration_link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                          Daftar Sekarang
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Ongoing Projects ─────────────────────────────────────── */}
        <section className="section" style={{ background: 'var(--color-primary)', color: 'white' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.6, marginBottom: 8, textTransform: 'uppercase' }}>Sedang Berjalan</p>
                <h2 className="section-title" style={{ color: 'white' }}>Proyek Aktif</h2>
              </div>
            </div>
            {projects.length === 0 ? (
              <div className="empty-state" style={{ color: 'rgba(255,255,255,0.5)' }}><Folder size={48} /><p>Belum ada proyek aktif</p></div>
            ) : (
              <div className="grid-3">
                {projects.map(p => {
                  const timelines = p.project_timelines || []
                  const completed = timelines.filter(t => t.completed).length
                  const progress = timelines.length > 0 ? Math.round((completed / timelines.length) * 100) : 0
                  return (
                    <div key={p.id} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem' }}>Leader: {p.leader_name}</p>
                      <h3 style={{ fontSize: '1rem', color: 'white', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>{p.title}</h3>
                      <p style={{ fontSize: '0.82rem', opacity: 0.75, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', opacity: 0.7, marginBottom: 6 }}>
                          <span>Progress</span><span>{progress}%</span>
                        </div>
                        <div className="progress">
                          <div className="progress-bar" style={{ width: `${progress}%`, background: 'var(--color-accent)' }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
