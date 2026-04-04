import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { FileUpload } from '../../components/ui/index'
import { SIDEBAR } from './Dashboard'
import { useAuth } from '../../hooks/useAuth'
import { createAchievement, uploadFile } from '../../services/supabase'
import toast from 'react-hot-toast'
import { CheckCircle } from 'lucide-react'

const LEVELS = ['Universitas', 'Kota', 'Provinsi', 'Nasional', 'Internasional']
const CLUSTERS = ['Desain', 'Olimpiade', 'Penulisan', 'Bisnis']
const LOCATION_TYPES = ['Offline', 'Online', 'Hybrid']

export default function UploadAchievement() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [form, setForm] = useState({
    title: '', date: '', level: 'Nasional', rank: '', cluster: profile?.cluster || 'Desain',
    location_type: 'Offline', location_detail: '', storytelling: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.date || !form.storytelling) { toast.error('Isi semua field wajib'); return }
    setLoading(true)
    try {
      let image_url = null
      if (imageFile) {
        const path = `achievements/${profile.id}/${Date.now()}_${imageFile.name}`
        const { url, error } = await uploadFile('achievements', path, imageFile)
        if (error) throw error
        image_url = url
      }
      const { error } = await createAchievement({
        ...form, image_url, user_id: profile.id,
        level: form.level.toLowerCase(), cluster: form.cluster.toLowerCase(),
      })
      if (error) throw error
      toast.success('Prestasi berhasil diupload!')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Gagal upload: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <DashboardLayout sidebarLinks={SIDEBAR} title="Upload Prestasi">
      <div style={{ maxWidth: 640 }}>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Prestasi yang kamu upload akan otomatis muncul di halaman utama, leaderboard, dan statistik.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <FileUpload label="Foto / Bukti Prestasi" value={imageFile} onChange={setImageFile} hint="Format JPG, PNG. Maks 5MB" />

          <div className="form-group">
            <label className="form-label">Judul Prestasi *</label>
            <input className="form-input" placeholder="Juara 1 LKTIN Nasional 2024" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Tanggal *</label>
              <input type="date" className="form-input" value={form.date} onChange={e => set('date', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Klaster</label>
              <select className="form-select" value={form.cluster} onChange={e => set('cluster', e.target.value)}>
                {CLUSTERS.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Level</label>
              <select className="form-select" value={form.level} onChange={e => set('level', e.target.value)}>
                {LEVELS.map(l => <option key={l} value={l.toLowerCase()}>{l}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Peringkat / Pencapaian</label>
              <input className="form-input" placeholder="Juara 1, Best Paper, dll" value={form.rank} onChange={e => set('rank', e.target.value)} />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Jenis Lokasi</label>
              <select className="form-select" value={form.location_type} onChange={e => set('location_type', e.target.value)}>
                {LOCATION_TYPES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{form.location_type === 'Online' ? 'Platform' : 'Tempat'}</label>
              <input className="form-input" placeholder={form.location_type === 'Online' ? 'Zoom, Google Meet...' : 'Universitas Indonesia, Jakarta...'} value={form.location_detail} onChange={e => set('location_detail', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Storytelling / Cerita Prestasi *</label>
            <textarea className="form-textarea" rows={5} placeholder="Ceritakan perjalanan, perjuangan, dan makna prestasi ini buatmu..." value={form.storytelling} onChange={e => set('storytelling', e.target.value)} required style={{ minHeight: 140 }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 160, justifyContent: 'center' }}>
              {loading ? 'Mengupload...' : <><CheckCircle size={16} /> Upload Prestasi</>}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Batal</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
