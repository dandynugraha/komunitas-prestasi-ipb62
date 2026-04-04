import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { supabase, uploadFile, getAllSiteContent, setSiteContent } from '../../services/supabase'
import { FileUpload, Modal } from '../../components/ui/index'
import toast from 'react-hot-toast'
import {
  Settings, FileText, Trophy, Calendar, Users, Image, BarChart2,
  Edit2, Trash2, Plus, Save, Eye, EyeOff, ChevronRight, Globe, Lock
} from 'lucide-react'

const SECTIONS = [
  { id: 'content', label: 'Konten Situs', icon: FileText },
  { id: 'achievements', label: 'Kelola Prestasi', icon: Trophy },
  { id: 'events', label: 'Kelola Event', icon: Calendar },
  { id: 'members', label: 'Kelola Anggota', icon: Users },
  { id: 'media', label: 'Kelola Media', icon: Image },
  { id: 'settings', label: 'Pengaturan', icon: Settings },
]

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('content')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <div style={{ paddingTop: 68, display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{
          width: sidebarOpen ? 260 : 72, flexShrink: 0,
          background: 'var(--color-primary)', minHeight: 'calc(100vh - 68px)',
          padding: '1.5rem 1rem', transition: 'width 0.25s ease',
          position: 'sticky', top: 68, alignSelf: 'flex-start',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            {sidebarOpen && <p style={{ color: 'white', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.1em' }}>CMS PANEL</p>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'white' }}>
              <ChevronRight size={16} style={{ transform: sidebarOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveSection(id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
                background: activeSection === id ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white', fontWeight: activeSection === id ? 700 : 400, fontSize: '0.875rem',
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => { if (activeSection !== id) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { if (activeSection !== id) e.currentTarget.style.background = 'transparent' }}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>}
              </button>
            ))}
          </nav>

          {sidebarOpen && (
            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: 12 }}>
              <p style={{ color: 'white', fontSize: '0.72rem', opacity: 0.7, lineHeight: 1.6 }}>
                Panel ini dikelola oleh <strong>Kadiv Web (MBD)</strong>.<br />Tidak perlu coding sama sekali.
              </p>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: '2rem', minWidth: 0 }}>
          <div style={{ maxWidth: 900 }}>
            {activeSection === 'content' && <ContentManager />}
            {activeSection === 'achievements' && <AchievementsManager />}
            {activeSection === 'events' && <EventsManager />}
            {activeSection === 'members' && <MembersManager />}
            {activeSection === 'media' && <MediaManager />}
            {activeSection === 'settings' && <SiteSettings />}
          </div>
        </main>
      </div>
    </div>
  )
}

// ─── Content Manager ──────────────────────────────────────────────────────────
function ContentManager() {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // { key, value }
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const PRESET_KEYS = [
    { key: 'vision', label: 'Visi', hint: 'Visi organisasi yang tampil di halaman Tentang Kami' },
    { key: 'mission', label: 'Misi', hint: 'Misi organisasi yang tampil di halaman Tentang Kami' },
    { key: 'hero_title', label: 'Judul Hero', hint: 'Judul besar di halaman beranda' },
    { key: 'hero_subtitle', label: 'Subtitle Hero', hint: 'Teks kecil di bawah judul beranda' },
    { key: 'whatsapp_link', label: 'Link WhatsApp', hint: 'Link grup WhatsApp komunitas' },
    { key: 'instagram_link', label: 'Link Instagram', hint: 'Link Instagram komunitas' },
    { key: 'cabinet_name', label: 'Nama Kabinet', hint: 'Nama kabinet tahun ini' },
    { key: 'announcement', label: 'Pengumuman Banner', hint: 'Teks pengumuman di atas website (kosongkan jika tidak ada)' },
  ]

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await getAllSiteContent()
    setContents(data || [])
    setLoading(false)
  }

  const handleSave = async (key, value) => {
    await setSiteContent(key, value)
    toast.success('Konten disimpan!')
    setEditing(null)
    load()
  }

  const handleAddCustom = async () => {
    if (!newKey || !newValue) { toast.error('Isi key dan nilai'); return }
    await setSiteContent(newKey, newValue)
    toast.success('Konten baru ditambahkan!')
    setNewKey(''); setNewValue(''); setShowAdd(false)
    load()
  }

  const getValue = (key) => contents.find(c => c.key === key)?.value || ''

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Konten Situs</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Edit teks dan konten yang tampil di website tanpa perlu coding.</p>
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {PRESET_KEYS.map(({ key, label, hint }) => {
              const current = getValue(key)
              const isEditing = editing?.key === key

              return (
                <div key={key} style={{ background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 2 }}>{label}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{hint}</p>
                    </div>
                    <button onClick={() => setEditing(isEditing ? null : { key, value: current })}
                      className={`btn btn-sm ${isEditing ? 'btn-primary' : 'btn-outline'}`}>
                      <Edit2 size={13} /> {isEditing ? 'Tutup' : 'Edit'}
                    </button>
                  </div>
                  {!isEditing && current && (
                    <div style={{ padding: '0 1.25rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                      {current}
                    </div>
                  )}
                  {isEditing && (
                    <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                      <textarea className="form-textarea" rows={3} value={editing.value}
                        onChange={e => setEditing(ed => ({ ...ed, value: e.target.value }))}
                        style={{ marginBottom: '0.75rem' }} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleSave(key, editing.value)} className="btn btn-primary btn-sm">
                          <Save size={13} /> Simpan
                        </button>
                        <button onClick={() => setEditing(null)} className="btn btn-ghost btn-sm">Batal</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Custom content */}
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '0.5rem' }}>Konten Kustom</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Tambah konten dinamis lainnya.</p>
            {contents.filter(c => !PRESET_KEYS.map(p => p.key).includes(c.key)).map(c => (
              <div key={c.key} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '10px 14px', background: 'white', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
                <code style={{ fontSize: '0.75rem', background: 'var(--color-surface-2)', padding: '2px 6px', borderRadius: 4 }}>{c.key}</code>
                <span style={{ flex: 1, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.value}</span>
                <button onClick={() => setEditing({ key: c.key, value: c.value })} className="btn btn-ghost btn-sm"><Edit2 size={13} /></button>
              </div>
            ))}
            {!showAdd ? (
              <button onClick={() => setShowAdd(true)} className="btn btn-outline btn-sm"><Plus size={13} /> Tambah Konten</button>
            ) : (
              <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1rem' }}>
                <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Key (nama unik)</label>
                    <input className="form-input" value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="contoh: tagline" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nilai</label>
                    <input className="form-input" value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="Isi konten..." />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleAddCustom} className="btn btn-primary btn-sm"><Save size={13} /> Simpan</button>
                  <button onClick={() => setShowAdd(false)} className="btn btn-ghost btn-sm">Batal</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Achievements Manager ─────────────────────────────────────────────────────
function AchievementsManager() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => {
    const { data } = await supabase.from('achievements').select('*, profiles(name, cluster)').order('created_at', { ascending: false })
    setAchievements(data || [])
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus prestasi ini?')) return
    await supabase.from('achievements').delete().eq('id', id)
    toast.success('Prestasi dihapus')
    setAchievements(a => a.filter(x => x.id !== id))
  }

  const handleToggleVisible = async (id, visible) => {
    await supabase.from('achievements').update({ visible: !visible }).eq('id', id)
    setAchievements(a => a.map(x => x.id === id ? { ...x, visible: !visible } : x))
    toast.success(visible ? 'Disembunyikan' : 'Ditampilkan')
  }

  const filtered = filter ? achievements.filter(a => a.cluster === filter || a.level === filter) : achievements

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>Kelola Prestasi</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{achievements.length} prestasi terdaftar</p>
        </div>
        <select className="form-select" style={{ width: 160 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">Semua</option>
          {['desain','olimpiade','penulisan','bisnis'].map(c => <option key={c} value={c}>{c}</option>)}
          {['universitas','kota','provinsi','nasional','internasional'].map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(a => (
            <div key={a.id} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--color-border)', overflow: 'hidden', display: 'flex', alignItems: 'stretch' }}>
              {a.image_url && <img src={a.image_url} alt="" style={{ width: 80, objectFit: 'cover', flexShrink: 0 }} />}
              <div style={{ flex: 1, padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{a.profiles?.name} · {a.cluster} · {a.level}</p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => handleToggleVisible(a.id, a.visible !== false)}
                    className="btn btn-ghost btn-sm" title={a.visible !== false ? 'Sembunyikan' : 'Tampilkan'}>
                    {a.visible !== false ? <Eye size={14} /> : <EyeOff size={14} style={{ color: '#DC2626' }} />}
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="btn btn-ghost btn-sm" style={{ color: '#DC2626' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Events Manager ───────────────────────────────────────────────────────────
function EventsManager() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [posterFile, setPosterFile] = useState(null)
  const [form, setForm] = useState({ title: '', caption: '', event_date: '', visibility: 'public', registration_link: '', guidebook_link: '', type: 'event' })
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => { load() }, [])
  const load = async () => {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false })
    setEvents(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let poster_url = null
    if (posterFile) {
      const { url } = await uploadFile('events', `events/${Date.now()}_${posterFile.name}`, posterFile)
      poster_url = url
    }
    await supabase.from('events').insert({ ...form, poster_url })
    toast.success('Event berhasil dibuat!')
    setShowModal(false)
    setPosterFile(null)
    setForm({ title: '', caption: '', event_date: '', visibility: 'public', registration_link: '', guidebook_link: '', type: 'event' })
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus event ini?')) return
    await supabase.from('events').delete().eq('id', id)
    toast.success('Event dihapus')
    setEvents(ev => ev.filter(x => x.id !== id))
  }

  const VISIBILITY_ICON = { public: <Globe size={12} />, community: <Users size={12} />, cluster: <Lock size={12} /> }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>Kelola Event</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{events.length} event terdaftar</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary"><Plus size={16} /> Buat Event</button>
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {events.map(ev => (
            <div key={ev.id} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>
              {ev.poster_url && <img src={ev.poster_url} alt="" style={{ width: 80, objectFit: 'cover', flexShrink: 0 }} />}
              <div style={{ flex: 1, padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{ev.event_date?.split('T')[0]}</p>
                </div>
                <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {VISIBILITY_ICON[ev.visibility]} {ev.visibility}
                </span>
                <button onClick={() => handleDelete(ev.id)} className="btn btn-ghost btn-sm" style={{ color: '#DC2626', flexShrink: 0 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Buat Event Baru" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FileUpload label="Poster" value={posterFile} onChange={setPosterFile} />
            <div className="form-group"><label className="form-label">Judul *</label><input className="form-input" value={form.title} onChange={e => setF('title', e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">Keterangan</label><textarea className="form-textarea" rows={2} value={form.caption} onChange={e => setF('caption', e.target.value)} /></div>
            <div className="grid-2" style={{ gap: '0.75rem' }}>
              <div className="form-group"><label className="form-label">Tanggal & Waktu</label><input type="datetime-local" className="form-input" value={form.event_date} onChange={e => setF('event_date', e.target.value)} /></div>
              <div className="form-group">
                <label className="form-label">Tipe</label>
                <select className="form-select" value={form.type} onChange={e => setF('type', e.target.value)}>
                  <option value="event">Event</option>
                  <option value="competition">Kompetisi</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Visibilitas</label>
              <select className="form-select" value={form.visibility} onChange={e => setF('visibility', e.target.value)}>
                <option value="public">Publik (tampil di beranda)</option>
                <option value="community">Komunitas (semua anggota)</option>
                <option value="cluster">Klaster tertentu</option>
              </select>
            </div>
            {form.visibility === 'public' && (
              <div className="form-group"><label className="form-label">Link Pendaftaran</label><input className="form-input" value={form.registration_link} onChange={e => setF('registration_link', e.target.value)} placeholder="https://forms.gle/..." /></div>
            )}
            {form.type === 'competition' && (
              <div className="form-group"><label className="form-label">Link Guidebook</label><input className="form-input" value={form.guidebook_link} onChange={e => setF('guidebook_link', e.target.value)} /></div>
            )}
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Simpan Event</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

// ─── Members Manager ──────────────────────────────────────────────────────────
function MembersManager() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingMember, setEditingMember] = useState(null)

  useEffect(() => { load() }, [])
  const load = async () => {
    const { data } = await supabase.from('profiles').select('*').order('name')
    setMembers(data || [])
    setLoading(false)
  }

  const handleUpdateMember = async (e) => {
    e.preventDefault()
    const { id, name, cluster, role, bio, division } = editingMember
    await supabase.from('profiles').update({ name, cluster, role, bio, division }).eq('id', id)
    toast.success('Data anggota diperbarui!')
    setEditingMember(null)
    load()
  }

  const filtered = members.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.cluster?.includes(search.toLowerCase()) ||
    m.role?.includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>Kelola Anggota</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{members.length} akun terdaftar</p>
        </div>
        <input className="form-input" style={{ width: 240 }} placeholder="Cari nama, klaster, role..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                {['Nama','Email','Klaster','Role','Poin','Aksi'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{m.name}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{m.email}</td>
                  <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>{m.cluster}</td>
                  <td style={{ padding: '10px 12px', textTransform: 'capitalize', fontSize: '0.8rem' }}>{m.role || 'member'}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700 }}>{m.points || 0}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <button onClick={() => setEditingMember({ ...m })} className="btn btn-outline btn-sm">
                      <Edit2 size={12} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingMember && (
        <Modal title={`Edit: ${editingMember.name}`} onClose={() => setEditingMember(null)}>
          <form onSubmit={handleUpdateMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Nama</label><input className="form-input" value={editingMember.name || ''} onChange={e => setEditingMember(m => ({ ...m, name: e.target.value }))} /></div>
            <div className="grid-2" style={{ gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Klaster</label>
                <select className="form-select" value={editingMember.cluster || ''} onChange={e => setEditingMember(m => ({ ...m, cluster: e.target.value }))}>
                  {['desain','olimpiade','penulisan','bisnis'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={editingMember.role || 'member'} onChange={e => setEditingMember(m => ({ ...m, role: e.target.value }))}>
                  <option value="member">Member</option>
                  <option value="bph">BPH</option>
                  <option value="heg">HEG</option>
                  <option value="cda">CDA</option>
                  <option value="cda (bisnis)">CDA (Bisnis)</option>
                  <option value="cda (desain)">CDA (Desain)</option>
                  <option value="cda (penulisan)">CDA (Penulisan)</option>
                  <option value="cda (olimpiade)">CDA (Olimpiade)</option>
                  <option value="mbd (ilustrator)">MBD (Ilustrator)</option>
                  <option value="mbd (desain grafis)">MBD (Desain Grafis)</option>
                  <option value="mbd (video editor)">MBD (Video Editor)</option>
                  <option value="mbd (multimedia)">MBD (Multimedia)</option>
                  <option value="mbd (web developer)">MBD (Web Developer / Kadiv Web)</option>
                  <option value="korvoks">KORVOKS</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Bio</label><textarea className="form-textarea" rows={2} value={editingMember.bio || ''} onChange={e => setEditingMember(m => ({ ...m, bio: e.target.value }))} /></div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}><Save size={14} /> Simpan Perubahan</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

// ─── Media Manager ────────────────────────────────────────────────────────────
function MediaManager() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadFile2, setUploadFile2] = useState(null)
  const [bucket, setBucket] = useState('achievements')

  useEffect(() => { load() }, [bucket])
  const load = async () => {
    setLoading(true)
    const { data } = await supabase.storage.from(bucket).list('', { limit: 50 })
    setFiles(data || [])
    setLoading(false)
  }

  const handleUpload = async () => {
    if (!uploadFile2) return
    setUploading(true)
    const path = `admin/${Date.now()}_${uploadFile2.name}`
    const { url } = await uploadFile(bucket, path, uploadFile2)
    if (url) toast.success('File terupload!')
    setUploadFile2(null)
    setUploading(false)
    load()
  }

  const handleDelete = async (name) => {
    if (!confirm('Hapus file ini?')) return
    await supabase.storage.from(bucket).remove([name])
    toast.success('File dihapus')
    load()
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>Kelola Media</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Upload dan kelola file gambar di Supabase Storage.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Bucket</label>
          <select className="form-select" value={bucket} onChange={e => setBucket(e.target.value)} style={{ width: 200 }}>
            <option value="achievements">Prestasi</option>
            <option value="events">Event</option>
            <option value="profiles">Foto Profil</option>
            <option value="site">Konten Situs</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="file" accept="image/*" onChange={e => setUploadFile2(e.target.files?.[0])} style={{ fontSize: '0.8rem' }} />
          <button onClick={handleUpload} className="btn btn-primary btn-sm" disabled={!uploadFile2 || uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
          {files.map(f => {
            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(f.name)
            return (
              <div key={f.name} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ height: 120, background: 'var(--color-surface-2)', overflow: 'hidden' }}>
                  <img src={publicUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <p style={{ fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text-muted)', marginBottom: 6 }}>{f.name}</p>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <a href={publicUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '0.72rem' }}>
                      <Eye size={11} /> Buka
                    </a>
                    <button onClick={() => handleDelete(f.name)} className="btn btn-ghost btn-sm" style={{ color: '#DC2626', padding: '6px 8px' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Site Settings ────────────────────────────────────────────────────────────
function SiteSettings() {
  const [form, setForm] = useState({ siteName: 'Aksara Karya 62', primaryColor: '#1B4332', accentColor: '#D4A017' })
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>Pengaturan Situs</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Konfigurasi tampilan dan identitas website.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 480 }}>
        <div className="card" style={{ cursor: 'default' }}>
          <div className="card-body">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1rem' }}>Identitas Situs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Nama Situs</label>
                <input className="form-input" value={form.siteName} onChange={e => setF('siteName', e.target.value)} />
              </div>
              <div className="grid-2" style={{ gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Warna Utama</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="color" value={form.primaryColor} onChange={e => setF('primaryColor', e.target.value)} style={{ width: 48, height: 36, border: 'none', cursor: 'pointer', borderRadius: 8 }} />
                    <input className="form-input" value={form.primaryColor} onChange={e => setF('primaryColor', e.target.value)} style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.85rem' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Warna Aksen</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="color" value={form.accentColor} onChange={e => setF('accentColor', e.target.value)} style={{ width: 48, height: 36, border: 'none', cursor: 'pointer', borderRadius: 8 }} />
                    <input className="form-input" value={form.accentColor} onChange={e => setF('accentColor', e.target.value)} style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>
            </div>
            <button onClick={async () => {
              await setSiteContent('primary_color', form.primaryColor)
              await setSiteContent('accent_color', form.accentColor)
              await setSiteContent('site_name', form.siteName)
              toast.success('Pengaturan disimpan!')
            }} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              <Save size={13} /> Simpan Pengaturan
            </button>
          </div>
        </div>

        <div style={{ padding: '1rem 1.25rem', background: 'var(--color-accent-light)', border: '1px solid var(--color-accent)', borderRadius: 12, fontSize: '0.875rem', lineHeight: 1.7 }}>
          <strong>Tips untuk Kadiv Web:</strong><br />
          Semua perubahan konten langsung tersimpan ke database Supabase dan tampil real-time di website. Tidak perlu deploy ulang atau coding.
        </div>
      </div>
    </div>
  )
}
