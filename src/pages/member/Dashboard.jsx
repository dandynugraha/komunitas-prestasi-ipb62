// Member Dashboard
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Stat, Empty, FileUp, ClBadge, LvBadge } from '../../components/ui/index'
import { useAuth } from '../../hooks/useAuth'
import { getAchievements, getCompetitions, getPlans, createAchievement, uploadFile, supabase } from '../../services/supabase'
import { Trophy, Star, FolderOpen, Calendar, Plus, Zap, CheckCircle, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { id as lo } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const MNAV = [
  { to:'/dashboard',                 label:'Beranda',          icon:Star },
  { to:'/dashboard/achievement/new', label:'Upload Prestasi',  icon:Trophy },
  { to:'/dashboard/project/new',     label:'Upload Proyek',    icon:FolderOpen },
  { to:'/dashboard/events',          label:'Event Saya',       icon:Calendar },
  { to:'/dashboard/competitions',    label:'Kompetisi Saya',   icon:Zap },
  { to:'/dashboard/plan',            label:'Rencana',          icon:Calendar },
]

export function MemberDashboard() {
  const { profile }     = useAuth()
  const [ach, setAch]   = useState([])
  const [comp, setComp] = useState([])
  const [plans, setPlans] = useState([])
  const [load, setLoad] = useState(true)

  useEffect(() => {
    if (!profile?.id) return
    Promise.all([getAchievements({ limit:5 }), getCompetitions(profile.id), getPlans(profile.id)]).then(([a,c,p]) => {
      setAch(a.data||[]); setComp(c.data||[])
      setPlans((p.data||[]).filter(x=>new Date(x.plan_date)>=new Date()).slice(0,4))
      setLoad(false)
    })
  }, [profile])

  return (
    <DashboardLayout links={MNAV} title={`Halo, ${profile?.name?.split(' ')[0]} 👋`}>
      <div className="g4" style={{ marginBottom:'1.5rem' }}>
        <Stat label="Total Prestasi"  value={ach.length}        icon={Trophy}   color="var(--brand)" />
        <Stat label="Kompetisi"       value={comp.length}       icon={Zap}      color="var(--c-desain)" />
        <Stat label="Poin"            value={profile?.points||0} icon={Star}    color="var(--gold-dark)" />
        <Stat label="Klaster"         value={profile?.cluster||'—'} icon={FolderOpen} color="var(--c-penulisan)" />
      </div>
      <div style={{ display:'flex', gap:'0.625rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <Link to="/dashboard/achievement/new" className="btn btn-brand btn-sm"><Plus size={13}/> Upload Prestasi</Link>
        <Link to="/dashboard/project/new"     className="btn btn-outline btn-sm"><Plus size={13}/> Tambah Proyek</Link>
        <Link to="/dashboard/competitions"    className="btn btn-outline btn-sm"><Plus size={13}/> Catat Kompetisi</Link>
      </div>
      <div className="g2" style={{ alignItems:'start' }}>
        <div style={{ background:'#fff', borderRadius:14, border:'1px solid var(--bdr)', padding:'1.1rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.875rem' }}>
            <h3 style={{ fontSize:'0.9rem' }}>Prestasi Terbaru</h3>
            <Link to="/dashboard/achievement/new" className="btn btn-ghost btn-sm"><Plus size={13}/></Link>
          </div>
          {load ? <div className="lcenter"><div className="spin"/></div>
            : ach.length===0 ? <Empty icon={Trophy} title="Belum ada prestasi" desc="Upload prestasi pertamamu!"/>
            : ach.slice(0,4).map(a=>(
                <div key={a.id} style={{ display:'flex', gap:9, padding:'8px 0', borderBottom:'1px solid var(--bdr)' }}>
                  {a.image_url && <img src={a.image_url} alt="" style={{ width:40, height:40, borderRadius:7, objectFit:'cover', flexShrink:0 }}/>}
                  <div style={{ minWidth:0 }}>
                    <p style={{ fontWeight:600, fontSize:'0.82rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.title}</p>
                    <p style={{ fontSize:'0.7rem', color:'var(--t3)' }}>{a.level} · {a.rank}</p>
                  </div>
                </div>
              ))
          }
        </div>
        <div style={{ background:'#fff', borderRadius:14, border:'1px solid var(--bdr)', padding:'1.1rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.875rem' }}>
            <h3 style={{ fontSize:'0.9rem' }}>Rencana Mendatang</h3>
            <Link to="/dashboard/plan" className="btn btn-ghost btn-sm"><Plus size={13}/></Link>
          </div>
          {plans.length===0 ? <Empty title="Tidak ada rencana" desc="Tambah di halaman Rencana"/>
            : plans.map(p=>(
                <div key={p.id} style={{ padding:'8px 0', borderBottom:'1px solid var(--bdr)' }}>
                  <p style={{ fontWeight:600, fontSize:'0.82rem' }}>{p.title}</p>
                  <p style={{ fontSize:'0.7rem', color:'var(--t3)' }}>{format(new Date(p.plan_date),'EEEE, d MMM yyyy',{locale:lo})}</p>
                </div>
              ))
          }
        </div>
      </div>
    </DashboardLayout>
  )
}

// Upload Achievement
export function UploadAchievement() {
  const { profile } = useAuth()
  const navigate    = useNavigate()
  const [load, setLoad] = useState(false)
  const [img, setImg]   = useState(null)
  const [f, setF] = useState({ title:'', date:'', level:'nasional', rank:'', cluster:profile?.cluster||'bisnis', location_type:'Offline', location_detail:'', storytelling:'' })
  const set = (k,v) => setF(x=>({...x,[k]:v}))

  const submit = async (e) => {
    e.preventDefault()
    if (!f.title||!f.date||!f.storytelling) { toast.error('Isi semua field wajib'); return }
    setLoad(true)
    try {
      let image_url = null
      if (img) { const { url, error } = await uploadFile('achievements',`achievements/${profile.id}/${Date.now()}_${img.name}`,img); if (error) throw error; image_url=url }
      const { error } = await createAchievement({ ...f, image_url, user_id:profile.id })
      if (error) throw error
      toast.success('Prestasi berhasil diupload!'); navigate('/dashboard')
    } catch (err) { toast.error('Gagal: '+err.message) }
    setLoad(false)
  }

  return (
    <DashboardLayout links={MNAV} title="Upload Prestasi">
      <p style={{ color:'var(--t3)', marginBottom:'1.5rem', fontSize:'0.875rem' }}>Prestasi yang diupload otomatis tampil di beranda, leaderboard, dan statistik.</p>
      <form onSubmit={submit} style={{ maxWidth:620, display:'flex', flexDirection:'column', gap:'1rem' }}>
        <FileUp label="Foto / Bukti Prestasi" value={img} onChange={setImg} hint="JPG, PNG — maks 5MB"/>
        <div className="fg"><label className="flbl">Judul Prestasi *</label><input className="fin" placeholder="Juara 1 LKTI Nasional 2024" value={f.title} onChange={e=>set('title',e.target.value)} required/></div>
        <div className="g2" style={{ gap:'0.875rem' }}>
          <div className="fg"><label className="flbl">Tanggal *</label><input type="date" className="fin" value={f.date} onChange={e=>set('date',e.target.value)} required/></div>
          <div className="fg"><label className="flbl">Klaster</label>
            <select className="fsel" value={f.cluster} onChange={e=>set('cluster',e.target.value)}>
              {['bisnis','desain','penulisan'].map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div className="g2" style={{ gap:'0.875rem' }}>
          <div className="fg"><label className="flbl">Level</label>
            <select className="fsel" value={f.level} onChange={e=>set('level',e.target.value)}>
              {['universitas','kota','provinsi','nasional','internasional'].map(l=><option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}
            </select>
          </div>
          <div className="fg"><label className="flbl">Peringkat</label><input className="fin" placeholder="Juara 1, Best Paper..." value={f.rank} onChange={e=>set('rank',e.target.value)}/></div>
        </div>
        <div className="g2" style={{ gap:'0.875rem' }}>
          <div className="fg"><label className="flbl">Jenis Lokasi</label>
            <select className="fsel" value={f.location_type} onChange={e=>set('location_type',e.target.value)}>
              {['Offline','Online','Hybrid'].map(l=><option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="fg"><label className="flbl">{f.location_type==='Online'?'Platform':'Tempat'}</label><input className="fin" placeholder={f.location_type==='Online'?'Zoom, Google Meet...':'Nama tempat...'} value={f.location_detail} onChange={e=>set('location_detail',e.target.value)}/></div>
        </div>
        <div className="fg"><label className="flbl">Storytelling *</label><textarea className="fta" rows={5} placeholder="Ceritakan perjalanan dan makna prestasi ini..." value={f.storytelling} onChange={e=>set('storytelling',e.target.value)} required/></div>
        <div style={{ display:'flex', gap:'0.625rem' }}>
          <button type="submit" className="btn btn-brand" disabled={load} style={{ minWidth:155 }}>
            {load?'Mengupload...':<><CheckCircle size={14}/> Upload Prestasi</>}
          </button>
          <button type="button" className="btn btn-ghost" onClick={()=>navigate('/dashboard')}>Batal</button>
        </div>
      </form>
    </DashboardLayout>
  )
}

export default MemberDashboard
