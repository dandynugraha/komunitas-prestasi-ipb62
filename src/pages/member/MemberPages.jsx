// ─── Upload Project ───────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { MNAV } from './Dashboard'
import { useAuth } from '../../hooks/useAuth'
import { createProject, supabase } from '../../services/supabase'
import toast from 'react-hot-toast'
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react'

export function UploadProject() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [timelines, setTimelines] = useState([{ title: '', deadline: '', completed: false }])
  const [form, setForm] = useState({ title: '', description: '', output: '', benefits: '' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const addTimeline = () => setTimelines(t => [...t, { title: '', deadline: '', completed: false }])
  const removeTimeline = (i) => setTimelines(t => t.filter((_, idx) => idx !== i))
  const setTimeline = (i, k, v) => setTimelines(t => t.map((item, idx) => idx === i ? { ...item, [k]: v } : item))

  const progress = timelines.length > 0 ? Math.round((timelines.filter(t => t.completed).length / timelines.length) * 100) : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title) { toast.error('Isi judul proyek'); return }
    setLoading(true)
    try {
      const { data: project, error } = await createProject({
        ...form, leader_id: profile.id, leader_name: profile.name, user_id: profile.id,
      })
      if (error) throw error
      // Insert timelines
      if (timelines.length > 0 && project?.id) {
        await supabase.from('project_timelines').insert(
          timelines.map(t => ({ ...t, project_id: project.id }))
        )
      }
      toast.success('Proyek berhasil ditambahkan!')
      navigate('/dashboard')
    } catch (err) { toast.error('Gagal: ' + err.message) }
    setLoading(false)
  }

  return (
    <DashboardLayout links={MNAV} title="Tambah Proyek">
      <div style={{ maxWidth: 680 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Judul Proyek *</label>
            <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required placeholder="Nama proyek..." />
          </div>
          <div className="form-group">
            <label className="form-label">Deskripsi</label>
            <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Deskripsi singkat proyek..." />
          </div>
          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Output / Hasil</label>
              <input className="form-input" value={form.output} onChange={e => set('output', e.target.value)} placeholder="Produk, laporan, karya..." />
            </div>
            <div className="form-group">
              <label className="form-label">Manfaat</label>
              <input className="form-input" value={form.benefits} onChange={e => set('benefits', e.target.value)} placeholder="Manfaat proyek..." />
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Timeline / Tahapan</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--t3)' }}>Progress: {progress}%</span>
                <button type="button" onClick={addTimeline} className="btn btn-outline btn-sm"><Plus size={14} /> Tambah</button>
              </div>
            </div>
            <div className="progress" style={{ marginBottom: '1rem' }}>
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {timelines.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.75rem', background: 'var(--bg)', borderRadius: 10 }}>
                  <button type="button" onClick={() => setTimeline(i, 'completed', !t.completed)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.completed ? 'var(--brand)' : 'var(--t3)', flexShrink: 0 }}>
                    {t.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                  <input className="form-input" placeholder="Nama tahapan..." value={t.title} onChange={e => setTimeline(i, 'title', e.target.value)} style={{ flex: 1 }} />
                  <input type="date" className="form-input" value={t.deadline} onChange={e => setTimeline(i, 'deadline', e.target.value)} style={{ width: 160 }} />
                  <button type="button" onClick={() => removeTimeline(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', flexShrink: 0 }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 160, justifyContent: 'center' }}>
              {loading ? 'Menyimpan...' : 'Simpan Proyek'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Batal</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

// ─── My Events ────────────────────────────────────────────────────────────────
import { getEvents, markAttendance, supabase as sb } from '../../services/supabase'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Calendar } from 'lucide-react'
import { ClBadge, Empty } from '../../components/ui/index'

export function MyEvents() {
  const { profile } = useAuth()
  const [events, setEvents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const loadData = async () => {
      const clusterFilter = profile?.cluster
      const [pubRes, commRes, clRes] = await Promise.all([
        getEvents({ visibility: 'public' }),
        getEvents({ visibility: 'community' }),
        getEvents({ visibility: 'cluster', cluster: clusterFilter }),
      ])
      const all = [...(pubRes.data||[]), ...(commRes.data||[]), ...(clRes.data||[])]
      const unique = Array.from(new Map(all.map(e => [e.id, e])).values())
      setEvents(unique)
      // Load attendance
      const { data: att } = await sb.from('attendance').select('event_id,status,reason').eq('user_id', profile.id)
      const map = {}; (att||[]).forEach(a => map[a.event_id] = a)
      setAttendance(map)
      setLoading(false)
    }
    if (profile) loadData()
  }, [profile])

  const filteredEvents = events.filter(e => {
    if (activeTab === 'all') return true
    if (activeTab === 'public') return e.visibility === 'public'
    if (activeTab === 'community') return e.visibility === 'community'
    if (activeTab === 'cluster') return e.visibility === 'cluster'
    return true
  })

  const handleAttendance = async (eventId, status, reason = '') => {
    await markAttendance({ user_id: profile.id, event_id: eventId, status, reason })
    setAttendance(a => ({ ...a, [eventId]: { status, reason } }))
    toast.success('Kehadiran tercatat!')
  }

  return (
    <DashboardLayout links={MNAV} title="Event Saya">
      <div className="tabs" style={{ marginBottom: '1.5rem', maxWidth: 480 }}>
        {[['all','Semua'],['public','Publik'],['community','Komunitas'],['cluster','Klaster']].map(([v,l]) => (
          <button key={v} className={`tab${activeTab===v?' active':''}`} onClick={() => setActiveTab(v)} style={{ fontSize: '0.8rem' }}>{l}</button>
        ))}
      </div>
      {loading ? <div className="loading-center"><div className="spinner" /></div> :
        filteredEvents.length === 0 ? <Empty icon={Calendar} title="Belum ada event" description="Event akan muncul di sini setelah tersedia." /> :
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredEvents.map(ev => {
            const att = attendance[ev.id]
            return (
              <div key={ev.id} className="card" style={{ cursor: 'default' }}>
                <div className="card-body" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {ev.poster_url && <img src={ev.poster_url} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{ev.visibility}</span>
                      {ev.cluster && <ClBadge cluster={ev.cluster} />}
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontFamily: 'var(--font)', marginBottom: '0.25rem' }}>{ev.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--t3)' }}>
                      {ev.event_date ? format(new Date(ev.event_date), 'd MMMM yyyy', { locale: localeId }) : 'TBD'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => handleAttendance(ev.id, 'present')} className={`btn btn-sm ${att?.status === 'present' ? 'btn-primary' : 'btn-outline'}`}>
                      Hadir
                    </button>
                    <button onClick={() => { const reason = prompt('Alasan tidak hadir:'); if (reason !== null) handleAttendance(ev.id, 'absent', reason) }} className={`btn btn-sm ${att?.status === 'absent' ? 'btn-danger' : 'btn-outline'}`}>
                      Absen
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      }
    </DashboardLayout>
  )
}

// ─── My Competitions ─────────────────────────────────────────────────────────
export function MyCompetitions() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [comps, setComps] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', organizer: '', date: '', field: '', status: 'Peserta' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const load = () => {
    if (!profile) return
    import('../../services/supabase').then(({ getCompetitions }) => {
      getCompetitions(profile.id).then(r => { setComps(r.data || []); setLoading(false) })
    })
  }
  useEffect(load, [profile])

  const handleAdd = async (e) => {
    e.preventDefault()
    await supabase.from('competitions').insert({ ...form, user_id: profile.id, cluster: profile.cluster })
    toast.success('Kompetisi dicatat!')
    setShowForm(false)
    setForm({ title: '', organizer: '', date: '', field: '', status: 'Peserta' })
    load()
  }

  const STATUS_COLOR = { Peserta: '#6B7280', Semifinalis: '#457B9D', Finalis: '#D4A017', Juara: '#16A34A' }

  return (
    <DashboardLayout links={MNAV} title="Kompetisi Saya">
      <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ marginBottom: '1.5rem' }}>
        <Plus size={16} /> Catat Kompetisi
      </button>
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', cursor: 'default' }}>
          <div className="card-body">
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nama Kompetisi</label>
                  <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Penyelenggara</label>
                  <input className="form-input" value={form.organizer} onChange={e => set('organizer', e.target.value)} />
                </div>
              </div>
              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tanggal</label>
                  <input type="date" className="form-input" value={form.date} onChange={e => set('date', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bidang</label>
                  <input className="form-input" value={form.field} onChange={e => set('field', e.target.value)} placeholder="Desain, PKM, Bisnis..." />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                  {['Peserta','Semifinalis','Finalis','Juara'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Simpan</button>
            </form>
          </div>
        </div>
      )}
      {loading ? <div className="loading-center"><div className="spinner" /></div> :
        comps.length === 0 ? <Empty title="Belum ada kompetisi" description="Catat kompetisi yang kamu ikuti!" /> :
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {comps.map(c => (
            <div key={c.id} className="card" style={{ cursor: 'default' }}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700 }}>{c.title}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--t3)' }}>{c.organizer} · {c.field} · {c.date}</p>
                </div>
                <span className="badge" style={{ background: STATUS_COLOR[c.status] + '20', color: STATUS_COLOR[c.status] }}>{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      }
    </DashboardLayout>
  )
}

// ─── My Plan ──────────────────────────────────────────────────────────────────
import { getPlans, createPlan, deletePlan } from '../../services/supabase'
import { Trash2 as TrashIcon } from 'lucide-react'

export function MyPlan() {
  const { profile } = useAuth()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setFormPlan] = useState({ title: '', plan_date: '', note: '' })
  const setF = (k, v) => setFormPlan(f => ({ ...f, [k]: v }))

  const load = async () => {
    const r = await getPlans(profile.id)
    setPlans(r.data || [])
    setLoading(false)
  }
  useEffect(() => { if (profile) load() }, [profile])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.title || !form.plan_date) { toast.error('Isi judul dan tanggal'); return }
    await createPlan({ ...form, user_id: profile.id })
    toast.success('Rencana ditambahkan!')
    setFormPlan({ title: '', plan_date: '', note: '' })
    load()
  }

  const handleDelete = async (id) => {
    await deletePlan(id)
    setPlans(p => p.filter(x => x.id !== id))
    toast.success('Rencana dihapus')
  }

  const upcoming = plans.filter(p => new Date(p.plan_date) >= new Date())
  const past = plans.filter(p => new Date(p.plan_date) < new Date())

  return (
    <DashboardLayout links={MNAV} title="Rencana & Kalender">
      <div style={{ maxWidth: 640 }}>
        {/* Add plan form */}
        <div className="card" style={{ marginBottom: '2rem', cursor: 'default' }}>
          <div className="card-body">
            <h3 style={{ fontFamily: 'var(--font)', fontSize: '1rem', marginBottom: '1rem' }}>Tambah Rencana</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="grid-2" style={{ gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Judul *</label>
                  <input className="form-input" value={form.title} onChange={e => setF('title', e.target.value)} placeholder="Nama rencana..." required />
                </div>
                <div className="form-group">
                  <label className="form-label">Tanggal *</label>
                  <input type="date" className="form-input" value={form.plan_date} onChange={e => setF('plan_date', e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Catatan</label>
                <textarea className="form-textarea" rows={2} value={form.note} onChange={e => setF('note', e.target.value)} placeholder="Catatan opsional..." />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--t3)' }}>Kalender ini bersifat privat. Kamu akan mendapat notifikasi email H-1.</p>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                <Plus size={14} /> Tambah
              </button>
            </form>
          </div>
        </div>

        {/* Upcoming */}
        <h3 style={{ fontFamily: 'var(--font)', fontSize: '1rem', marginBottom: '0.75rem' }}>Mendatang</h3>
        {loading ? <div className="loading-center"><div className="spinner" /></div> :
          upcoming.length === 0 ? <p style={{ fontSize: '0.875rem', color: 'var(--t3)', marginBottom: '1.5rem' }}>Tidak ada rencana mendatang.</p> :
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {upcoming.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '12px 16px', background: 'white', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--t3)' }}>{format(new Date(p.plan_date), 'EEEE, d MMMM yyyy', { locale: localeId })}</p>
                  {p.note && <p style={{ fontSize: '0.75rem', color: 'var(--t3)', marginTop: 2 }}>{p.note}</p>}
                </div>
                <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}>
                  <TrashIcon size={15} />
                </button>
              </div>
            ))}
          </div>
        }

        {past.length > 0 && (
          <>
            <h3 style={{ fontFamily: 'var(--font)', fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--t3)' }}>Lewat</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {past.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '10px 16px', background: 'var(--bg)', borderRadius: 12, opacity: 0.6 }}>
                  <p style={{ flex: 1, fontSize: '0.85rem', textDecoration: 'line-through' }}>{p.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--t3)' }}>{format(new Date(p.plan_date), 'd MMM', { locale: localeId })}</p>
                  <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}>
                    <TrashIcon size={13} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}