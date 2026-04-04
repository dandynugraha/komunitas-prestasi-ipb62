import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { Modal, FileUp, ClBadge, LvBadge } from '../../components/ui/index'
import { supabase, uploadFile, getAllSiteContent, setSiteContent } from '../../services/supabase'
import toast from 'react-hot-toast'
import { FileText, Trophy, Calendar, Users, Image, Edit2, Trash2, Plus, Save, Eye, EyeOff, ChevronRight, Globe, Lock } from 'lucide-react'

const SECS = [
  { id:'content', label:'Konten Situs', I:FileText },
  { id:'ach',     label:'Prestasi',     I:Trophy },
  { id:'events',  label:'Event & Lomba',I:Calendar },
  { id:'members', label:'Anggota',      I:Users },
  { id:'media',   label:'Media',        I:Image },
]
const PRESET = [
  { k:'vision',        l:'Visi',           h:'Tampil di halaman Tentang Kami' },
  { k:'mission',       l:'Misi',           h:'Tampil di halaman Tentang Kami' },
  { k:'cabinet_name',  l:'Nama Kabinet',   h:'Nama kabinet tahun ini' },
  { k:'whatsapp_link', l:'Link WhatsApp',  h:'Link grup WhatsApp komunitas' },
  { k:'instagram_link',l:'Link Instagram', h:'Link Instagram komunitas' },
  { k:'announcement',  l:'Pengumuman',     h:'Banner di atas website (kosongkan jika tidak ada)' },
]

export default function AdminDashboard() {
  const [sec, setSec]   = useState('content')
  const [col, setCol]   = useState(false)
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar/>
      <div style={{ paddingTop:64, display:'flex', minHeight:'calc(100vh - 64px)' }}>
        {/* Sidebar */}
        <aside style={{ width:col?60:220, flexShrink:0, background:'var(--brand)', transition:'width 0.22s', padding:'1.1rem 0.75rem', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:col?'center':'space-between', marginBottom:'1.5rem', padding:'0 4px' }}>
            {!col && <span style={{ fontSize:'0.67rem', fontWeight:700, letterSpacing:'0.14em', color:'rgba(255,255,255,0.4)', textTransform:'uppercase' }}>CMS Panel</span>}
            <button onClick={()=>setCol(!col)} style={{ background:'rgba(255,255,255,0.1)', border:'none', borderRadius:7, padding:'5px 7px', cursor:'pointer', color:'#fff', lineHeight:0 }}>
              <ChevronRight size={14} style={{ transform:col?'none':'rotate(180deg)', transition:'transform 0.2s' }}/>
            </button>
          </div>
          <nav style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {SECS.map(({ id, label, I }) => (
              <button key={id} onClick={()=>setSec(id)} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 9px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'var(--font)', background:sec===id?'rgba(255,255,255,0.18)':'transparent', color:'#fff', fontWeight:sec===id?700:400, fontSize:'0.82rem', transition:'background 0.12s', justifyContent:col?'center':'flex-start', width:'100%' }}
                onMouseEnter={e=>{if(sec!==id)e.currentTarget.style.background='rgba(255,255,255,0.08)'}}
                onMouseLeave={e=>{if(sec!==id)e.currentTarget.style.background='transparent'}}>
                <I size={16} style={{ flexShrink:0 }}/>{!col && <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{label}</span>}
              </button>
            ))}
          </nav>
          {!col && <div style={{ marginTop:'auto', padding:'0.75rem', background:'rgba(255,255,255,0.07)', borderRadius:9, fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', lineHeight:1.7 }}>Dikelola oleh <strong style={{ color:'rgba(255,255,255,0.65)' }}>Kadiv Web (MBD)</strong>.<br/>Tidak perlu coding.</div>}
        </aside>
        {/* Main */}
        <main style={{ flex:1, padding:'1.75rem', minWidth:0, overflowX:'hidden' }}>
          <div style={{ maxWidth:820 }}>
            {sec==='content' && <ContentP/>}
            {sec==='ach'     && <AchP/>}
            {sec==='events'  && <EventsP/>}
            {sec==='members' && <MembersP/>}
            {sec==='media'   && <MediaP/>}
          </div>
        </main>
      </div>
    </div>
  )
}

function ContentP() {
  const [cts, setCts] = useState([])
  const [ed, setEd]   = useState(null)
  const load = () => getAllSiteContent().then(r=>setCts(r.data||[]))
  useEffect(()=>{ load() }, [])
  const save = async (k,v) => { await setSiteContent(k,v); toast.success('Disimpan!'); setEd(null); load() }
  const get = (k) => cts.find(c=>c.key===k)?.value||''
  return (
    <div>
      <h2 style={{ marginBottom:'0.35rem' }}>Konten Situs</h2>
      <p style={{ color:'var(--t3)', fontSize:'0.875rem', marginBottom:'1.75rem' }}>Edit teks website tanpa perlu coding.</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
        {PRESET.map(({k,l,h})=>{
          const cur=get(k); const isE=ed?.k===k
          return (
            <div key={k} style={{ background:'#fff', borderRadius:11, border:'1px solid var(--bdr)', overflow:'hidden' }}>
              <div style={{ padding:'0.875rem 1.1rem', display:'flex', alignItems:'center', gap:'1rem' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, fontSize:'0.84rem', marginBottom:2 }}>{l}</p>
                  <p style={{ fontSize:'0.7rem', color:'var(--t3)' }}>{h}</p>
                </div>
                <button onClick={()=>setEd(isE?null:{k,v:cur})} className={`btn btn-sm ${isE?'btn-brand':'btn-outline'}`}><Edit2 size={12}/> {isE?'Tutup':'Edit'}</button>
              </div>
              {!isE&&cur && <div style={{ padding:'0 1.1rem 0.875rem', fontSize:'0.82rem', color:'var(--t3)', borderTop:'1px solid var(--bdr)', paddingTop:'0.75rem' }}>{cur}</div>}
              {isE && (
                <div style={{ padding:'0 1.1rem 1.1rem', borderTop:'1px solid var(--bdr)', paddingTop:'0.875rem' }}>
                  <textarea className="fta" rows={3} value={ed.v} onChange={e=>setEd(x=>({...x,v:e.target.value}))} style={{ marginBottom:'0.625rem' }}/>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={()=>save(k,ed.v)} className="btn btn-brand btn-sm"><Save size={12}/> Simpan</button>
                    <button onClick={()=>setEd(null)} className="btn btn-ghost btn-sm">Batal</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AchP() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('')
  const load = () => supabase.from('achievements').select('*,profiles(name,cluster)').order('created_at',{ascending:false}).then(r=>setItems(r.data||[]))
  useEffect(()=>{ load() }, [])
  const del = async (id) => { if(!confirm('Hapus?')) return; await supabase.from('achievements').delete().eq('id',id); setItems(p=>p.filter(x=>x.id!==id)); toast.success('Dihapus') }
  const tog = async (id,v) => { await supabase.from('achievements').update({visible:!v}).eq('id',id); setItems(p=>p.map(x=>x.id===id?{...x,visible:!v}:x)); toast.success(v?'Disembunyikan':'Ditampilkan') }
  const shown = filter ? items.filter(a=>a.cluster===filter||a.level===filter) : items
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'0.75rem' }}>
        <div><h2 style={{ marginBottom:'0.2rem' }}>Kelola Prestasi</h2><p style={{ fontSize:'0.78rem', color:'var(--t3)' }}>{items.length} prestasi</p></div>
        <select className="fsel" style={{ width:155 }} value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="">Semua</option>
          {['bisnis','desain','penulisan'].map(c=><option key={c} value={c}>{c}</option>)}
          {['universitas','kota','provinsi','nasional','internasional'].map(l=><option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
        {shown.map(a=>(
          <div key={a.id} style={{ background:'#fff', borderRadius:9, border:'1px solid var(--bdr)', display:'flex', alignItems:'center', overflow:'hidden' }}>
            {a.image_url && <img src={a.image_url} alt="" style={{ width:64, objectFit:'cover', alignSelf:'stretch', flexShrink:0 }}/>}
            <div style={{ flex:1, padding:'0.75rem 1rem', display:'flex', alignItems:'center', gap:'0.875rem', minWidth:0 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontWeight:600, fontSize:'0.84rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.title}</p>
                <p style={{ fontSize:'0.7rem', color:'var(--t3)' }}>{a.profiles?.name} · {a.cluster} · {a.level}</p>
              </div>
              <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                <button onClick={()=>tog(a.id,a.visible!==false)} className="btn btn-ghost btn-sm">{a.visible!==false ? <Eye size={12}/> : <EyeOff size={12} style={{color:'#DC2626'}}/>}</button>
                <button onClick={()=>del(a.id)} className="btn btn-ghost btn-sm" style={{color:'#DC2626'}}><Trash2 size={12}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EventsP() {
  const [evs, setEvs] = useState([])
  const [show, setShow] = useState(false)
  const [poster, setPoster] = useState(null)
  const [f, setF] = useState({ title:'', caption:'', event_date:'', visibility:'public', registration_link:'', guidebook_link:'', type:'event' })
  const sf = (k,v) => setF(x=>({...x,[k]:v}))
  const load = () => supabase.from('events').select('*').order('event_date',{ascending:false}).then(r=>setEvs(r.data||[]))
  useEffect(()=>{ load() }, [])
  const del = async (id) => { if(!confirm('Hapus?')) return; await supabase.from('events').delete().eq('id',id); setEvs(p=>p.filter(x=>x.id!==id)); toast.success('Dihapus') }
  const submit = async (e) => {
    e.preventDefault(); let poster_url=null
    if (poster) { const { url }=await uploadFile('events',`events/${Date.now()}_${poster.name}`,poster); poster_url=url }
    await supabase.from('events').insert({...f,poster_url}); toast.success('Event dibuat!')
    setShow(false); setPoster(null); setF({ title:'', caption:'', event_date:'', visibility:'public', registration_link:'', guidebook_link:'', type:'event' }); load()
  }
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <div><h2 style={{ marginBottom:'0.2rem' }}>Kelola Event & Lomba</h2><p style={{ fontSize:'0.78rem', color:'var(--t3)' }}>{evs.length} event</p></div>
        <button onClick={()=>setShow(true)} className="btn btn-brand btn-sm"><Plus size={13}/> Buat Event</button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
        {evs.map(ev=>(
          <div key={ev.id} style={{ background:'#fff', borderRadius:9, border:'1px solid var(--bdr)', display:'flex', alignItems:'center', overflow:'hidden' }}>
            {ev.poster_url && <img src={ev.poster_url} alt="" style={{ width:64, objectFit:'cover', alignSelf:'stretch', flexShrink:0 }}/>}
            <div style={{ flex:1, padding:'0.75rem 1rem', display:'flex', alignItems:'center', gap:'0.875rem', minWidth:0 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontWeight:600, fontSize:'0.84rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ev.title}</p>
                <p style={{ fontSize:'0.7rem', color:'var(--t3)' }}>{ev.event_date?.split('T')[0]} · {ev.type} · {ev.visibility}</p>
              </div>
              <button onClick={()=>del(ev.id)} className="btn btn-ghost btn-sm" style={{color:'#DC2626',flexShrink:0}}><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
      </div>
      {show && (
        <Modal title="Buat Event / Lomba" onClose={()=>setShow(false)}>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
            <FileUp label="Poster" value={poster} onChange={setPoster}/>
            <div className="fg"><label className="flbl">Judul *</label><input className="fin" value={f.title} onChange={e=>sf('title',e.target.value)} required/></div>
            <div className="fg"><label className="flbl">Keterangan</label><textarea className="fta" rows={2} value={f.caption} onChange={e=>sf('caption',e.target.value)}/></div>
            <div className="g2" style={{ gap:'0.75rem' }}>
              <div className="fg"><label className="flbl">Tanggal & Waktu</label><input type="datetime-local" className="fin" value={f.event_date} onChange={e=>sf('event_date',e.target.value)}/></div>
              <div className="fg"><label className="flbl">Tipe</label><select className="fsel" value={f.type} onChange={e=>sf('type',e.target.value)}><option value="event">Event</option><option value="competition">Lomba</option></select></div>
            </div>
            <div className="fg"><label className="flbl">Visibilitas</label>
              <select className="fsel" value={f.visibility} onChange={e=>sf('visibility',e.target.value)}>
                <option value="public">Publik (tampil di beranda)</option>
                <option value="community">Komunitas (semua anggota)</option>
                <option value="cluster">Klaster tertentu</option>
              </select>
            </div>
            {f.visibility==='public' && <div className="fg"><label className="flbl">Link Pendaftaran</label><input className="fin" value={f.registration_link} onChange={e=>sf('registration_link',e.target.value)} placeholder="https://forms.gle/..."/></div>}
            {f.type==='competition' && <div className="fg"><label className="flbl">Link Guidebook</label><input className="fin" value={f.guidebook_link} onChange={e=>sf('guidebook_link',e.target.value)}/></div>}
            <button type="submit" className="btn btn-brand" style={{ alignSelf:'flex-start' }}>Simpan</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

function MembersP() {
  const [members, setMembers] = useState([])
  const [search, setSearch]   = useState('')
  const [ed, setEd]           = useState(null)
  useEffect(()=>{ supabase.from('profiles').select('*').order('name').then(r=>setMembers(r.data||[])) }, [])
  const save = async (e) => {
    e.preventDefault()
    await supabase.from('profiles').update({ name:ed.name, cluster:ed.cluster, role:ed.role, bio:ed.bio }).eq('id',ed.id)
    toast.success('Diperbarui!'); setEd(null)
    supabase.from('profiles').select('*').order('name').then(r=>setMembers(r.data||[]))
  }
  const shown = members.filter(m=>m.name?.toLowerCase().includes(search.toLowerCase())||m.cluster?.includes(search)||m.role?.includes(search))
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'0.75rem' }}>
        <div><h2 style={{ marginBottom:'0.2rem' }}>Kelola Anggota</h2><p style={{ fontSize:'0.78rem', color:'var(--t3)' }}>{members.length} akun</p></div>
        <input className="fin" style={{ width:210 }} placeholder="Cari nama, klaster, role..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.82rem' }}>
          <thead><tr style={{ borderBottom:'2px solid var(--bdr)' }}>
            {['Nama','Email','Klaster','Role','Poin','Aksi'].map(h=><th key={h} style={{ textAlign:'left', padding:'8px 10px', fontWeight:700, color:'var(--t3)', fontSize:'0.68rem', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {shown.map(m=>(
              <tr key={m.id} style={{ borderBottom:'1px solid var(--bdr)' }}>
                <td style={{ padding:'8px 10px', fontWeight:600 }}>{m.name}</td>
                <td style={{ padding:'8px 10px', color:'var(--t3)', fontSize:'0.76rem' }}>{m.email}</td>
                <td style={{ padding:'8px 10px', textTransform:'capitalize' }}>{m.cluster}</td>
                <td style={{ padding:'8px 10px', fontSize:'0.76rem', color:'var(--t3)', textTransform:'capitalize' }}>{m.role||'member'}</td>
                <td style={{ padding:'8px 10px', fontWeight:700 }}>{m.points||0}</td>
                <td style={{ padding:'8px 10px' }}><button onClick={()=>setEd({...m})} className="btn btn-outline btn-sm"><Edit2 size={11}/> Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {ed && (
        <Modal title={`Edit: ${ed.name}`} onClose={()=>setEd(null)}>
          <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
            <div className="fg"><label className="flbl">Nama</label><input className="fin" value={ed.name||''} onChange={e=>setEd(x=>({...x,name:e.target.value}))}/></div>
            <div className="g2" style={{ gap:'0.75rem' }}>
              <div className="fg"><label className="flbl">Klaster</label>
                <select className="fsel" value={ed.cluster||''} onChange={e=>setEd(x=>({...x,cluster:e.target.value}))}>
                  {['bisnis','desain','penulisan'].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="fg"><label className="flbl">Role</label>
                <select className="fsel" value={ed.role||'member'} onChange={e=>setEd(x=>({...x,role:e.target.value}))}>
                  {['member','bph','heg','cda','cda (bisnis)','cda (desain)','cda (penulisan)','cda (olimpiade)','mbd (ilustrator)','mbd (desain grafis)','mbd (video editor)','mbd (multimedia)','mbd (web developer)','korvoks'].map(r=><option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="fg"><label className="flbl">Bio</label><textarea className="fta" rows={2} value={ed.bio||''} onChange={e=>setEd(x=>({...x,bio:e.target.value}))}/></div>
            <button type="submit" className="btn btn-brand" style={{ alignSelf:'flex-start' }}><Save size={13}/> Simpan</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

function MediaP() {
  const [files, setFiles]   = useState([])
  const [bucket, setBucket] = useState('achievements')
  const [file, setFile]     = useState(null)
  const [upl, setUpl]       = useState(false)
  const load = () => supabase.storage.from(bucket).list('',{limit:50}).then(r=>setFiles(r.data||[]))
  useEffect(()=>{ load() }, [bucket])
  const upload = async () => { if(!file) return; setUpl(true); await uploadFile(bucket,`admin/${Date.now()}_${file.name}`,file); toast.success('Terupload!'); setFile(null); setUpl(false); load() }
  const del = async (n) => { if(!confirm('Hapus file?')) return; await supabase.storage.from(bucket).remove([n]); toast.success('Dihapus'); load() }
  return (
    <div>
      <h2 style={{ marginBottom:'0.35rem' }}>Kelola Media</h2>
      <p style={{ color:'var(--t3)', fontSize:'0.875rem', marginBottom:'1.5rem' }}>Upload dan kelola file gambar di Supabase Storage.</p>
      <div style={{ display:'flex', gap:'0.875rem', marginBottom:'1.5rem', flexWrap:'wrap', alignItems:'flex-end' }}>
        <div className="fg" style={{ marginBottom:0 }}>
          <label className="flbl">Bucket</label>
          <select className="fsel" style={{ width:165 }} value={bucket} onChange={e=>setBucket(e.target.value)}>
            {['achievements','events','profiles','site'].map(b=><option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div style={{ display:'flex', gap:7, alignItems:'center' }}>
          <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0])} style={{ fontSize:'0.78rem' }}/>
          <button onClick={upload} className="btn btn-brand btn-sm" disabled={!file||upl}>{upl?'Uploading...':'Upload'}</button>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(148px,1fr))', gap:'0.875rem' }}>
        {files.map(f=>{
          const { data:{ publicUrl } } = supabase.storage.from(bucket).getPublicUrl(f.name)
          return (
            <div key={f.name} style={{ background:'#fff', borderRadius:10, border:'1px solid var(--bdr)', overflow:'hidden' }}>
              <div style={{ height:100, background:'var(--bg)', overflow:'hidden' }}>
                <img src={publicUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'}/>
              </div>
              <div style={{ padding:'0.5rem' }}>
                <p style={{ fontSize:'0.67rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'var(--t3)', marginBottom:4 }}>{f.name}</p>
                <div style={{ display:'flex', gap:3 }}>
                  <a href={publicUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ flex:1, fontSize:'0.68rem' }}><Eye size={10}/> Buka</a>
                  <button onClick={()=>del(f.name)} className="btn btn-ghost btn-sm" style={{ color:'#DC2626', padding:'5px 7px' }}><Trash2 size={11}/></button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
