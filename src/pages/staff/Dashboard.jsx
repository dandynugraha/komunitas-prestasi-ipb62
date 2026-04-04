// Staff Dashboard
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Stat, Empty, Modal, FileUp, ClBadge, LvBadge, Av } from '../../components/ui/index'
import { useAuth } from '../../hooks/useAuth'
import { supabase, uploadFile } from '../../services/supabase'
import { getCL } from '../../utils/constants'
import { Users, Trophy, Calendar, Activity, Star, Shield, Megaphone, Plus, Award, Edit2, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export const SNAV = [
  { to:'/staff',         label:'Dashboard',        icon:Activity },
  { to:'/staff/heg',     label:'HEG Panel',        icon:Users },
  { to:'/staff/cda',     label:'CDA Panel',        icon:Trophy },
  { to:'/staff/bph',     label:'BPH Panel',        icon:Shield },
  { to:'/staff/korvoks', label:'KORVOKS Panel',     icon:Megaphone },
  { to:'/dashboard/achievement/new', label:'Upload Prestasi', icon:Star },
]

export function StaffDashboard() {
  const { profile } = useAuth()
  const [ct, setCt] = useState({ m:0, a:0, e:0 })
  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id',{count:'exact',head:true}),
      supabase.from('achievements').select('id',{count:'exact',head:true}),
      supabase.from('events').select('id',{count:'exact',head:true}),
    ]).then(([m,a,e]) => setCt({ m:m.count||0, a:a.count||0, e:e.count||0 }))
  }, [])
  const r = profile?.role||''
  const has = (...rs) => rs.some(x=>r.includes(x))
  return (
    <DashboardLayout links={SNAV} title={`Staff — ${r.toUpperCase()}`}>
      <div className="g3" style={{ marginBottom:'1.75rem' }}>
        <Stat label="Total Anggota"  value={ct.m} icon={Users}    color="var(--brand)"/>
        <Stat label="Total Prestasi" value={ct.a} icon={Trophy}   color="var(--c-desain)"/>
        <Stat label="Total Event"    value={ct.e} icon={Calendar} color="var(--gold-dark)"/>
      </div>
      <div style={{ display:'flex', gap:'0.625rem', flexWrap:'wrap' }}>
        {(has('heg')||r==='bph') && <Link to="/staff/heg" className="btn btn-brand btn-sm">HEG Panel</Link>}
        {(has('cda')||r==='bph') && <Link to="/staff/cda" className="btn btn-outline btn-sm">CDA Panel</Link>}
        {r==='bph' && <Link to="/staff/bph" className="btn btn-outline btn-sm">BPH Panel</Link>}
        {(has('korvoks')||r==='bph') && <Link to="/staff/korvoks" className="btn btn-outline btn-sm">KORVOKS</Link>}
        {(r==='mbd (web developer)'||r==='bph') && <Link to="/admin" className="btn btn-gold btn-sm">Kelola Konten</Link>}
      </div>
    </DashboardLayout>
  )
}

// ── HEG ──
export function HEGDashboard() {
  const [members, setMembers] = useState([])
  const [att, setAtt]         = useState([])
  const [awards, setAwards]   = useState([])
  const [tab, setTab]         = useState('members')
  const [showAw, setShowAw]   = useState(false)
  const [af, setAf] = useState({ user_id:'', month:'', note:'' })
  const setAF = (k,v) => setAf(x=>({...x,[k]:v}))

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*').order('points',{ascending:false}),
      supabase.from('attendance').select('*,events(title),profiles(name,cluster)').order('created_at',{ascending:false}).limit(60),
      supabase.from('staff_awards').select('*,profiles(name,avatar_url,cluster)').order('month',{ascending:false}),
    ]).then(([m,a,aw]) => { setMembers(m.data||[]); setAtt(a.data||[]); setAwards(aw.data||[]) })
  }, [])

  const updPts = async (uid,d) => {
    const m = members.find(x=>x.id===uid); if (!m) return
    const np = Math.max(0,(m.points||0)+d)
    await supabase.from('profiles').update({points:np}).eq('id',uid)
    setMembers(p=>p.map(x=>x.id===uid?{...x,points:np}:x)); toast.success('Poin diperbarui')
  }
  const addAward = async (e) => {
    e.preventDefault()
    await supabase.from('staff_awards').insert(af); toast.success('Penghargaan ditambahkan!')
    setShowAw(false)
    supabase.from('staff_awards').select('*,profiles(name,avatar_url,cluster)').order('month',{ascending:false}).then(r=>setAwards(r.data||[]))
  }

  return (
    <DashboardLayout links={SNAV} title="HEG — Human Empowerment & Growth">
      <div className="tabs" style={{ marginBottom:'1.25rem', maxWidth:420 }}>
        {[['members','Anggota'],['attendance','Kehadiran'],['awards','Staff of Month']].map(([v,l])=>(
          <button key={v} className={`tab${tab===v?' on':''}`} onClick={()=>setTab(v)}>{l}</button>
        ))}
      </div>
      {tab==='members' && (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.84rem' }}>
            <thead><tr style={{ borderBottom:'2px solid var(--bdr)' }}>
              {['Nama','Klaster','Role','Poin','Aksi'].map(h=><th key={h} style={{ textAlign:'left', padding:'8px 10px', fontWeight:700, color:'var(--t3)', fontSize:'0.7rem', textTransform:'uppercase' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {members.map(m=>(
                <tr key={m.id} style={{ borderBottom:'1px solid var(--bdr)' }}>
                  <td style={{ padding:'8px 10px', fontWeight:600 }}>{m.name}</td>
                  <td style={{ padding:'8px 10px' }}><ClBadge cluster={m.cluster}/></td>
                  <td style={{ padding:'8px 10px', color:'var(--t3)', fontSize:'0.78rem', textTransform:'capitalize' }}>{m.role||'member'}</td>
                  <td style={{ padding:'8px 10px', fontWeight:700 }}>{m.points||0}</td>
                  <td style={{ padding:'8px 10px' }}>
                    <div style={{ display:'flex', gap:3 }}>
                      <button onClick={()=>updPts(m.id,10)}  className="btn btn-brand btn-sm" style={{ padding:'3px 9px' }}>+10</button>
                      <button onClick={()=>updPts(m.id,-10)} className="btn btn-outline btn-sm" style={{ padding:'3px 9px' }}>-10</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab==='attendance' && (
        att.length===0 ? <Empty title="Belum ada data kehadiran"/> :
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          {att.map((a,i)=>(
            <div key={i} style={{ display:'flex', gap:'1rem', alignItems:'center', padding:'9px 12px', background:'#fff', borderRadius:9, border:'1px solid var(--bdr)' }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:a.status==='present'?'#16A34A':'#DC2626', flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:600, fontSize:'0.84rem' }}>{a.profiles?.name}</p>
                <p style={{ fontSize:'0.7rem', color:'var(--t3)' }}>{a.events?.title}</p>
              </div>
              <span style={{ fontSize:'0.73rem', fontWeight:700, color:a.status==='present'?'#16A34A':'#DC2626' }}>{a.status==='present'?'Hadir':'Absen'}</span>
              {a.reason && <span style={{ fontSize:'0.7rem', color:'var(--t3)' }}>{a.reason}</span>}
            </div>
          ))}
        </div>
      )}
      {tab==='awards' && (
        <>
          <button onClick={()=>setShowAw(true)} className="btn btn-brand btn-sm" style={{ marginBottom:'1.25rem' }}><Plus size={13}/> Tambah Penghargaan</button>
          {awards.length===0 ? <Empty icon={Award} title="Belum ada penghargaan"/> :
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:'0.875rem' }}>
              {awards.map(a=>(
                <div key={a.id} style={{ background:'#fff', border:'1px solid var(--bdr)', borderRadius:13, padding:'1.1rem', textAlign:'center' }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'var(--gold-lite)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 0.625rem', overflow:'hidden' }}>
                    {a.profiles?.avatar_url ? <img src={a.profiles.avatar_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <span style={{ fontWeight:800, fontSize:'1rem', color:'var(--gold-dark)' }}>{a.profiles?.name?.[0]}</span>}
                  </div>
                  <Award size={13} style={{ color:'var(--gold)', margin:'0 auto 5px' }}/>
                  <p style={{ fontWeight:700, fontSize:'0.84rem' }}>{a.profiles?.name}</p>
                  <p style={{ fontSize:'0.7rem', color:'var(--t3)', marginTop:2 }}>{a.month}</p>
                </div>
              ))}
            </div>
          }
          {showAw && (
            <Modal title="Tambah Staff of the Month" onClose={()=>setShowAw(false)}>
              <form onSubmit={addAward} style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
                <div className="fg"><label className="flbl">Anggota</label>
                  <select className="fsel" value={af.user_id} onChange={e=>setAF('user_id',e.target.value)} required>
                    <option value="">Pilih anggota</option>
                    {members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div className="fg"><label className="flbl">Bulan</label><input type="month" className="fin" value={af.month} onChange={e=>setAF('month',e.target.value)} required/></div>
                <div className="fg"><label className="flbl">Catatan</label><textarea className="fta" rows={2} value={af.note} onChange={e=>setAF('note',e.target.value)}/></div>
                <button type="submit" className="btn btn-brand" style={{ alignSelf:'flex-start' }}>Simpan</button>
              </form>
            </Modal>
          )}
        </>
      )}
    </DashboardLayout>
  )
}

// ── CDA ──

export function CDADashboard() {
  const { profile } = useAuth()
  const [members, setMembers] = useState([])
  const [ach, setAch]         = useState([])
  const [showEv, setShowEv]   = useState(false)
  const [poster, setPoster]   = useState(null)
  const [ef, setEf] = useState({ title:'', caption:'', event_date:'', visibility:'cluster', registration_link:'', type:'event' })
  const setEF = (k,v) => setEf(x=>({...x,[k]:v}))

  const cluster = (() => { const m = (profile?.role||'').match(/\(([^)]+)\)/); return m?m[1]:profile?.cluster })()
  const cl = getCL(cluster)

  useEffect(() => {
    if (!cluster) return
    Promise.all([
      supabase.from('profiles').select('*').eq('cluster',cluster).order('points',{ascending:false}),
      supabase.from('achievements').select('*,profiles(name)').eq('cluster',cluster).order('created_at',{ascending:false}).limit(20),
    ]).then(([m,a]) => { setMembers(m.data||[]); setAch(a.data||[]) })
  }, [cluster])

  const addEv = async (e) => {
    e.preventDefault()
    let poster_url=null
    if (poster) { const { url }=await uploadFile('events',`events/${Date.now()}_${poster.name}`,poster); poster_url=url }
    await supabase.from('events').insert({ ...ef, poster_url, cluster, created_by:profile.id })
    toast.success('Event dibuat!'); setShowEv(false); setPoster(null)
    setEf({ title:'', caption:'', event_date:'', visibility:'cluster', registration_link:'', type:'event' })
  }

  return (
    <DashboardLayout links={SNAV} title={`CDA — ${cl.label}`}>
      <button onClick={()=>setShowEv(true)} className="btn btn-brand btn-sm" style={{ marginBottom:'1.5rem' }}><Plus size={13}/> Buat Event</button>
      <div className="g2" style={{ alignItems:'start' }}>
        <div style={{ background:'#fff', borderRadius:13, border:'1px solid var(--bdr)', padding:'1.1rem' }}>
          <h3 style={{ fontSize:'0.88rem', marginBottom:'0.875rem' }}>Anggota ({members.length})</h3>
          {members.map(m=>(
            <div key={m.id} style={{ display:'flex', alignItems:'center', gap:9, padding:'7px 0', borderBottom:'1px solid var(--bdr)' }}>
              <Av name={m.name} cluster={m.cluster} size="s"/>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:'0.82rem', fontWeight:600 }}>{m.name}</p>
                <p style={{ fontSize:'0.68rem', color:'var(--t3)', textTransform:'capitalize' }}>{m.role||'member'}</p>
              </div>
              <span style={{ fontWeight:700, fontSize:'0.82rem', color:'var(--brand)' }}>{m.points||0} poin</span>
            </div>
          ))}
        </div>
        <div style={{ background:'#fff', borderRadius:13, border:'1px solid var(--bdr)', padding:'1.1rem' }}>
          <h3 style={{ fontSize:'0.88rem', marginBottom:'0.875rem' }}>Prestasi Klaster</h3>
          {ach.length===0 ? <Empty title="Belum ada prestasi"/> :
            ach.map(a=>(
              <div key={a.id} style={{ padding:'7px 0', borderBottom:'1px solid var(--bdr)' }}>
                <p style={{ fontSize:'0.82rem', fontWeight:600 }}>{a.title}</p>
                <div style={{ display:'flex', gap:5, marginTop:3 }}><LvBadge level={a.level}/><span style={{ fontSize:'0.7rem', color:'var(--t3)' }}>{a.profiles?.name}</span></div>
              </div>
            ))
          }
        </div>
      </div>
      {showEv && (
        <Modal title="Buat Event" onClose={()=>setShowEv(false)}>
          <form onSubmit={addEv} style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
            <FileUp label="Poster" value={poster} onChange={setPoster}/>
            <div className="fg"><label className="flbl">Judul *</label><input className="fin" value={ef.title} onChange={e=>setEF('title',e.target.value)} required/></div>
            <div className="fg"><label className="flbl">Keterangan</label><textarea className="fta" rows={2} value={ef.caption} onChange={e=>setEF('caption',e.target.value)}/></div>
            <div className="g2" style={{ gap:'0.75rem' }}>
              <div className="fg"><label className="flbl">Tanggal</label><input type="datetime-local" className="fin" value={ef.event_date} onChange={e=>setEF('event_date',e.target.value)}/></div>
              <div className="fg"><label className="flbl">Visibilitas</label>
                <select className="fsel" value={ef.visibility} onChange={e=>setEF('visibility',e.target.value)}>
                  <option value="public">Publik</option><option value="community">Semua Anggota</option><option value="cluster">Klaster Saja</option>
                </select>
              </div>
            </div>
            {ef.visibility==='public' && <div className="fg"><label className="flbl">Link Pendaftaran</label><input className="fin" value={ef.registration_link} onChange={e=>setEF('registration_link',e.target.value)} placeholder="https://forms.gle/..."/></div>}
            <button type="submit" className="btn btn-brand" style={{ alignSelf:'flex-start' }}>Buat Event</button>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  )
}

// ── BPH ──
export function BPHDashboard() {
  const [acts, setActs] = useState([])
  const [st, setSt]     = useState({})
  useEffect(() => {
    Promise.all([
      supabase.from('achievements').select('*,profiles(name,cluster)').order('created_at',{ascending:false}).limit(30),
      supabase.from('profiles').select('id',{count:'exact',head:true}),
      supabase.from('events').select('id',{count:'exact',head:true}),
      supabase.from('competitions').select('id',{count:'exact',head:true}),
    ]).then(([a,m,e,c]) => { setActs(a.data||[]); setSt({ m:m.count, e:e.count, c:c.count, a:a.data?.length||0 }) })
  }, [])
  return (
    <DashboardLayout links={SNAV} title="BPH — Global Activity Feed">
      <div className="g4" style={{ marginBottom:'1.75rem' }}>
        {[['Anggota',st.m,'var(--brand)'],['Prestasi',st.a,'var(--c-desain)'],['Event',st.e,'var(--gold-dark)'],['Kompetisi',st.c,'var(--c-penulisan)']].map(([l,v,c])=>(
          <div key={l} style={{ background:'#fff', borderRadius:12, border:'1px solid var(--bdr)', padding:'1.1rem', textAlign:'center' }}>
            <p style={{ fontSize:'1.9rem', fontWeight:800, color:c }}>{v||0}</p>
            <p style={{ fontSize:'0.75rem', color:'var(--t3)', fontWeight:500, marginTop:3 }}>{l}</p>
          </div>
        ))}
      </div>
      <h3 style={{ fontSize:'0.88rem', marginBottom:'0.875rem' }}>Aktivitas Terbaru</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
        {acts.map(a=>(
          <div key={a.id} style={{ display:'flex', gap:'1rem', alignItems:'center', padding:'10px 12px', background:'#fff', borderRadius:9, border:'1px solid var(--bdr)' }}>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:600, fontSize:'0.84rem' }}>{a.title}</p>
              <p style={{ fontSize:'0.7rem', color:'var(--t3)' }}>{a.profiles?.name} · {a.profiles?.cluster}</p>
            </div>
            <LvBadge level={a.level}/>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

// ── KORVOKS ──
export function KORVOKSDashboard() {
  const { profile } = useAuth()
  const [members, setMembers] = useState([])
  useEffect(() => { supabase.from('profiles').select('*').eq('cluster',profile?.cluster).then(r=>setMembers(r.data||[])) }, [profile])
  return (
    <DashboardLayout links={SNAV} title="KORVOKS Dashboard">
      <p style={{ color:'var(--t3)', marginBottom:'1.25rem', fontSize:'0.875rem' }}>Koordinasi vokasi dan konten komunitas.</p>
      <div style={{ background:'#fff', borderRadius:13, border:'1px solid var(--bdr)', padding:'1.1rem' }}>
        <h3 style={{ fontSize:'0.88rem', marginBottom:'0.875rem' }}>Anggota Klaster Saya</h3>
        {members.map(m=>(
          <div key={m.id} style={{ display:'flex', alignItems:'center', gap:9, padding:'7px 0', borderBottom:'1px solid var(--bdr)' }}>
            <Av name={m.name} cluster={m.cluster} size="s"/>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:'0.82rem', fontWeight:600 }}>{m.name}</p>
              <p style={{ fontSize:'0.68rem', color:'var(--t3)', textTransform:'capitalize' }}>{m.role||'member'}</p>
            </div>
            <ClBadge cluster={m.cluster}/>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

export default StaffDashboard
