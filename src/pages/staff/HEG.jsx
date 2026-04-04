import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { STAFF_SIDEBAR } from './Dashboard'
import { supabase } from '../../services/supabase'
import { ClusterBadge, EmptyState, Modal } from '../../components/ui/index'
import { Users, Trophy, Plus, Award } from 'lucide-react'
import toast from 'react-hot-toast'

export default function HEGDashboard() {
  const [members, setMembers] = useState([])
  const [attendance, setAttendance] = useState([])
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('members')
  const [showAwardModal, setShowAwardModal] = useState(false)
  const [awardForm, setAwardForm] = useState({ user_id: '', month: '', note: '' })
  const setAF = (k, v) => setAwardForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*').order('points', { ascending: false }),
      supabase.from('attendance').select('*, events(title, event_date), profiles(name, cluster)').order('created_at', { ascending: false }).limit(50),
      supabase.from('staff_awards').select('*, profiles(name, avatar_url, cluster)').order('month', { ascending: false }),
    ]).then(([m, att, aw]) => {
      setMembers(m.data || [])
      setAttendance(att.data || [])
      setAwards(aw.data || [])
      setLoading(false)
    })
  }, [])

  const updatePoints = async (userId, delta) => {
    const member = members.find(m => m.id === userId)
    if (!member) return
    const newPoints = Math.max(0, (member.points || 0) + delta)
    await supabase.from('profiles').update({ points: newPoints }).eq('id', userId)
    setMembers(prev => prev.map(m => m.id === userId ? { ...m, points: newPoints } : m))
    toast.success('Poin diperbarui')
  }

  const handleAddAward = async (e) => {
    e.preventDefault()
    await supabase.from('staff_awards').insert(awardForm)
    toast.success('Penghargaan ditambahkan!')
    setShowAwardModal(false)
    const r = await supabase.from('staff_awards').select('*, profiles(name, avatar_url, cluster)').order('month', { ascending: false })
    setAwards(r.data || [])
  }

  return (
    <DashboardLayout sidebarLinks={STAFF_SIDEBAR} title="HEG – Human Empowerment & Growth">
      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        {[['members','Data Anggota'],['attendance','Kehadiran'],['awards','Staff of Month']].map(([v,l]) => (
          <button key={v} className={`tab${activeTab===v?' active':''}`} onClick={() => setActiveTab(v)}>{l}</button>
        ))}
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <>
          {activeTab === 'members' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    {['Nama','Klaster','Divisi','Poin','Kelola'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{m.name}</td>
                      <td style={{ padding: '10px 12px' }}><ClusterBadge cluster={m.cluster} /></td>
                      <td style={{ padding: '10px 12px', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{m.role || 'member'}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700 }}>{m.points || 0}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => updatePoints(m.id, 10)} className="btn btn-primary btn-sm" style={{ padding: '4px 10px' }}>+10</button>
                          <button onClick={() => updatePoints(m.id, -10)} className="btn btn-outline btn-sm" style={{ padding: '4px 10px' }}>-10</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'attendance' && (
            attendance.length === 0 ? <EmptyState title="Belum ada data kehadiran" /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {attendance.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '10px 14px', background: 'white', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: a.status === 'present' ? '#16A34A' : '#DC2626', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{a.profiles?.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{a.events?.title}</p>
                    </div>
                    <span className={`badge ${a.status === 'present' ? 'badge-primary' : ''}`} style={{ background: a.status === 'present' ? '#D1FAE5' : '#FEE2E2', color: a.status === 'present' ? '#065F46' : '#991B1B' }}>
                      {a.status === 'present' ? 'Hadir' : 'Absen'}
                    </span>
                    {a.reason && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{a.reason}</span>}
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'awards' && (
            <>
              <button onClick={() => setShowAwardModal(true)} className="btn btn-primary" style={{ marginBottom: '1.5rem' }}>
                <Plus size={16} /> Tambah Penghargaan
              </button>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {awards.map(a => (
                  <div key={a.id} style={{ background: 'var(--color-accent-light)', border: '1px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: '1.25rem', textAlign: 'center' }}>
                    <Award size={28} style={{ color: 'var(--color-accent)', margin: '0 auto 0.5rem' }} />
                    <p style={{ fontWeight: 700 }}>{a.profiles?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{a.month}</p>
                    {a.note && <p style={{ fontSize: '0.75rem', marginTop: 4 }}>{a.note}</p>}
                  </div>
                ))}
              </div>
              {showAwardModal && (
                <Modal title="Tambah Staff of the Month" onClose={() => setShowAwardModal(false)}>
                  <form onSubmit={handleAddAward} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Anggota</label>
                      <select className="form-select" value={awardForm.user_id} onChange={e => setAF('user_id', e.target.value)} required>
                        <option value="">Pilih anggota</option>
                        {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bulan</label>
                      <input type="month" className="form-input" value={awardForm.month} onChange={e => setAF('month', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Catatan</label>
                      <textarea className="form-textarea" rows={2} value={awardForm.note} onChange={e => setAF('note', e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Simpan</button>
                  </form>
                </Modal>
              )}
            </>
          )}
        </>
      )}
    </DashboardLayout>
  )
}
