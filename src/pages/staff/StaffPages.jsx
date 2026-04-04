// ─── CDA Dashboard ────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { STAFF_SIDEBAR } from './Dashboard'
import { supabase, uploadFile } from '../../services/supabase'
import { ClusterBadge, LevelBadge, FileUpload, Modal, EmptyState } from '../../components/ui/index'
import { useAuth } from '../../hooks/useAuth'
import { Plus, Trophy } from 'lucide-react'
import toast from 'react-hot-toast'

export function CDADashboard() {
  const { profile } = useAuth()
  const [members, setMembers] = useState([])
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEventModal, setShowEventModal] = useState(false)
  const [posterFile, setPosterFile] = useState(null)
  const [eventForm, setEventForm] = useState({ title: '', caption: '', event_date: '', visibility: 'cluster', registration_link: '', type: 'event' })
  const setEF = (k, v) => setEventForm(f => ({ ...f, [k]: v }))

  // Get cluster from role: cda (bisnis) -> bisnis
  const getCluster = () => {
    const r = profile?.role || ''
    const match = r.match(/\(([^)]+)\)/)
    return match ? match[1] : profile?.cluster
  }
  const cluster = getCluster()

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*').eq('cluster', cluster).order('points', { ascending: false }),
      supabase.from('achievements').select('*, profiles(name)').eq('cluster', cluster).order('created_at', { ascending: false }).limit(20),
    ]).then(([m, a]) => { setMembers(m.data || []); setAchievements(a.data || []); setLoading(false) })
  }, [cluster])

  const handleAddEvent = async (e) => {
    e.preventDefault()
    let poster_url = null
    if (posterFile) {
      const { url } = await uploadFile('events', `events/${Date.now()}_${posterFile.name}`, posterFile)
      poster_url = url
    }
    await supabase.from('events').insert({ ...eventForm, poster_url, cluster, created_by: profile.id })
    toast.success('Event berhasil dibuat!')
    setShowEventModal(false)
    setPosterFile(null)
    setEventForm({ title: '', caption: '', event_date: '', visibility: 'cluster', registration_link: '', type: 'event' })
  }

  return (
    <DashboardLayout sidebarLinks={STAFF_SIDEBAR} title={`CDA – Klaster ${cluster?.charAt(0).toUpperCase() + cluster?.slice(1)}`}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setShowEventModal(true)} className="btn btn-primary"><Plus size={16} /> Buat Event</button>
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div className="grid-2" style={{ alignItems: 'start', gap: '2rem' }}>
          {/* Members */}
          <div className="card" style={{ cursor: 'default' }}>
            <div className="card-body">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1rem' }}>Anggota Klaster ({members.length})</h3>
              {members.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0 }}>
                    {m.name?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{m.name}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{m.role || 'member'}</p>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{m.points || 0} poin</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="card" style={{ cursor: 'default' }}>
            <div className="card-body">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1rem' }}>Prestasi Klaster</h3>
              {achievements.length === 0 ? <EmptyState title="Belum ada prestasi" /> :
                achievements.map(a => (
                  <div key={a.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{a.title}</p>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      <LevelBadge level={a.level} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{a.profiles?.name}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {showEventModal && (
        <Modal title="Buat Event Baru" onClose={() => setShowEventModal(false)}>
          <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FileUpload label="Poster Event" value={posterFile} onChange={setPosterFile} />
            <div className="form-group"><label className="form-label">Judul Event</label><input className="form-input" value={eventForm.title} onChange={e => setEF('title', e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">Keterangan</label><textarea className="form-textarea" rows={2} value={eventForm.caption} onChange={e => setEF('caption', e.target.value)} /></div>
            <div className="grid-2" style={{ gap: '0.75rem' }}>
              <div className="form-group"><label className="form-label">Tanggal</label><input type="datetime-local" className="form-input" value={eventForm.event_date} onChange={e => setEF('event_date', e.target.value)} /></div>
              <div className="form-group">
                <label className="form-label">Visibilitas</label>
                <select className="form-select" value={eventForm.visibility} onChange={e => setEF('visibility', e.target.value)}>
                  <option value="public">Publik</option>
                  <option value="community">Semua Anggota</option>
                  <option value="cluster">Klaster Saja</option>
                </select>
              </div>
            </div>
            {eventForm.visibility === 'public' && (
              <div className="form-group"><label className="form-label">Link Pendaftaran</label><input className="form-input" value={eventForm.registration_link} onChange={e => setEF('registration_link', e.target.value)} placeholder="https://forms.gle/..." /></div>
            )}
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Buat Event</button>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  )
}

// ─── BPH Dashboard ───────────────────────────────────────────────────────────
export function BPHDashboard() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})

  useEffect(() => {
    Promise.all([
      supabase.from('achievements').select('*, profiles(name, cluster)').order('created_at', { ascending: false }).limit(30),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('competitions').select('id', { count: 'exact', head: true }),
    ]).then(([ach, m, ev, comp]) => {
      setActivities(ach.data || [])
      setStats({ members: m.count, events: ev.count, competitions: comp.count, achievements: ach.data?.length || 0 })
      setLoading(false)
    })
  }, [])

  return (
    <DashboardLayout sidebarLinks={STAFF_SIDEBAR} title="BPH – Global Activity Feed">
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[['Anggota', stats.members, '#1B4332'],['Prestasi', stats.achievements, '#E63946'],['Event', stats.events, '#D4A017'],['Kompetisi', stats.competitions, '#457B9D']].map(([l,v,c]) => (
          <div key={l} style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: c }}>{v || 0}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{l}</p>
          </div>
        ))}
      </div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1rem' }}>Aktivitas Terbaru</h3>
      {loading ? <div className="loading-center"><div className="spinner" /></div> :
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {activities.map(a => (
            <div key={a.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '12px 16px', background: 'white', borderRadius: 10, border: '1px solid var(--color-border)' }}>
              <Trophy size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{a.title}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{a.profiles?.name} · {a.profiles?.cluster}</p>
              </div>
              <LevelBadge level={a.level} />
            </div>
          ))}
        </div>
      }
    </DashboardLayout>
  )
}

// ─── KORVOKS Dashboard ────────────────────────────────────────────────────────
export function KORVOKSDashboard() {
  const { profile } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('profiles').select('*').eq('cluster', profile?.cluster).then(r => {
      setMembers(r.data || [])
      setLoading(false)
    })
  }, [profile])

  return (
    <DashboardLayout sidebarLinks={STAFF_SIDEBAR} title="KORVOKS Dashboard">
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Koordinasi vokasi dan konten komunitas.</p>
      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div className="card" style={{ cursor: 'default' }}>
          <div className="card-body">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1rem' }}>Anggota Klaster Saya</h3>
            {members.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: 'var(--color-primary)' }}>
                  {m.name?.[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{m.name}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{m.role || 'member'}</p>
                </div>
                <ClusterBadge cluster={m.cluster} />
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default CDADashboard
