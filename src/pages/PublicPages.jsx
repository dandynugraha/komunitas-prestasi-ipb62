import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { SH, ClBadge, LvBadge, Av, Empty, Modal, FileUp } from '../components/ui/index'
import { getCL, CL } from '../utils/constants'
import { getEvents, getMembers, getStaffAwards, getSiteContent, supabase, uploadFile } from '../services/supabase'
import { askGemini } from '../services/gemini'
import { useAuth } from '../hooks/useAuth'
import { Calendar, ExternalLink, BookOpen, MapPin, Eye, Target, Award, Plus, Send, Bot, User, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { id as lo } from 'date-fns/locale'
import { useRef } from 'react'
import toast from 'react-hot-toast'

/* ── Shared page header ─────────────────────────────────────── */
function PH({ title, sub, pill }) {
  return (
    <section style={{ background:'var(--brand)', padding:'4rem 0 3rem', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'-40px', right:'-40px', width:240, height:240, borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'-60px', left:'-30px', width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }}/>
      <div className="wrap tc" style={{ position:'relative' }}>
        {pill && <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:6, padding:'4px 12px', marginBottom:'1rem' }}>
          <span style={{ fontSize:'0.68rem', fontWeight:700, color:'rgba(255,255,255,0.85)', letterSpacing:'0.1em', textTransform:'uppercase' }}>{pill}</span>
        </div>}
        <h1 style={{ color:'#fff', marginBottom:'0.6rem' }}>{title}</h1>
        {sub && <p style={{ color:'rgba(255,255,255,0.55)', maxWidth:460, margin:'0 auto', fontSize:'0.92rem' }}>{sub}</p>}
      </div>
    </section>
  )
}

/* ── Event card (shared) ────────────────────────────────────── */
function EvCard({ ev, guide=false }) {
  return (
    <div className="card">
      {ev.poster_url
        ? <div style={{ height:190, overflow:'hidden' }}><img src={ev.poster_url} alt={ev.title} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.35s' }} onMouseEnter={e=>e.target.style.transform='scale(1.04)'} onMouseLeave={e=>e.target.style.transform='scale(1)'}/></div>
        : <div style={{ height:145, background:'var(--brand-lite)', display:'flex', alignItems:'center', justifyContent:'center' }}><Calendar size={32} color="var(--brand)"/></div>}
      <div className="card-p">
        <p style={{ fontSize:'0.7rem', color:'var(--t3)', marginBottom:'0.35rem', display:'flex', alignItems:'center', gap:5 }}>
          <Calendar size={11}/>{ev.event_date ? format(new Date(ev.event_date),'d MMMM yyyy',{locale:lo}) : 'TBD'}
        </p>
        <h3 style={{ fontSize:'0.9rem', marginBottom:'0.35rem' }}>{ev.title}</h3>
        <p style={{ fontSize:'0.78rem', color:'var(--t3)', marginBottom:'0.875rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{ev.caption}</p>
        <div style={{ display:'flex', gap:7 }}>
          {ev.registration_link && <a href={ev.registration_link} target="_blank" rel="noreferrer" className="btn btn-brand btn-sm" style={{ flex:1 }}>Daftar</a>}
          {guide && ev.guidebook_link && <a href={ev.guidebook_link} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ flex:1 }}><BookOpen size={12}/> Guidebook</a>}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   EVENT PAGE
══════════════════════════════════════════════════════════════ */
export function EventPage() {
  const [evs, setEvs] = useState([])
  const [load, setLoad] = useState(true)
  useEffect(() => { getEvents({ visibility:'public' }).then(r=>{setEvs(r.data||[]);setLoad(false)}) }, [])
  return (
    <><Navbar/>
    <main style={{ paddingTop:64 }}>
      <PH title="Event" sub="Event publik dari komunitas Aksara Karya 62" pill="Jadwal"/>
      <section className="sec"><div className="wrap">
        {load ? <div className="lcenter"><div className="spin"/></div>
          : evs.length===0 ? <Empty icon={Calendar} title="Belum ada event" desc="Pantau terus untuk update!"/>
          : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:'1rem' }}>{evs.map(e=><EvCard key={e.id} ev={e}/>)}</div>}
      </div></section>
    </main><Footer/></>
  )
}

/* ══════════════════════════════════════════════════════════════
   COMPETITION PAGE
══════════════════════════════════════════════════════════════ */
export function CompetitionPage() {
  const [comps, setComps] = useState([])
  const [load, setLoad] = useState(true)
  useEffect(() => { getEvents().then(r=>{setComps((r.data||[]).filter(e=>e.type==='competition'||e.visibility==='public'));setLoad(false)}) }, [])
  return (
    <><Navbar/>
    <main style={{ paddingTop:64 }}>
      <PH title="Informasi Lomba" sub="Kompetisi terbuka untuk anggota Aksara Karya 62" pill="Kompetisi"/>
      <section className="sec"><div className="wrap">
        {load ? <div className="lcenter"><div className="spin"/></div>
          : comps.length===0 ? <Empty icon={BookOpen} title="Belum ada lomba terdaftar"/>
          : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:'1rem' }}>{comps.map(e=><EvCard key={e.id} ev={e} guide/>)}</div>}
      </div></section>
    </main><Footer/></>
  )
}

/* ══════════════════════════════════════════════════════════════
   FACILITIES PAGE
══════════════════════════════════════════════════════════════ */
const FAC = [
  { t:'Pengisian Aktivitas Student Portal', d:'Panduan mengisi aktivitas kemahasiswaan di Student Portal IPB University.', link:'https://ipb.link/tatacarapengisianaktivitas-studentportal', cta:'Buka Panduan', I:MapPin, c:'var(--brand)', bg:'var(--brand-lite)' },
  { t:'Informasi SKPI — Instagram 1', d:'Informasi lengkap tentang Surat Keterangan Pendamping Ijazah (SKPI).', link:'https://www.instagram.com/p/DUSPEpjD2L1/', cta:'Lihat Post', I:ExternalLink, c:'var(--c-desain)', bg:'#FFECE5' },
  { t:'Informasi SKPI — Instagram 2', d:'Update terbaru seputar SKPI dan cara pengajuannya.', link:'https://www.instagram.com/p/DUK1P6qj_Ne/', cta:'Lihat Post', I:ExternalLink, c:'var(--c-penulisan)', bg:'#E5F5EF' },
  { t:'Panduan SKPI Kemahasiswaan', d:'Dokumen lengkap panduan SKPI dari Direktorat Kemahasiswaan IPB University.', link:'https://ipb.link/panduan-skpi-kemahasiswaan', cta:'Unduh Panduan', I:BookOpen, c:'var(--gold-dark)', bg:'var(--gold-lite)' },
]
export function FacilitiesPage() {
  return (
    <><Navbar/>
    <main style={{ paddingTop:64 }}>
      <PH title="Fasilitas" sub="Sumber daya dan panduan untuk anggota" pill="Resources"/>
      <section className="sec"><div className="wrap">
        <div className="g2">
          {FAC.map((f,i)=>(
            <div key={i} className="card" style={{ cursor:'default' }}>
              <div className="card-p">
                <div style={{ width:40, height:40, borderRadius:10, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem' }}>
                  <f.I size={18} style={{ color:f.c }}/>
                </div>
                <h3 style={{ fontSize:'0.95rem', marginBottom:'0.4rem' }}>{f.t}</h3>
                <p style={{ fontSize:'0.83rem', color:'var(--t3)', marginBottom:'1rem', lineHeight:1.7 }}>{f.d}</p>
                <a href={f.link} target="_blank" rel="noreferrer" className="btn btn-brand btn-sm"><ExternalLink size={12}/> {f.cta}</a>
              </div>
            </div>
          ))}
        </div>
      </div></section>
    </main><Footer/></>
  )
}

/* ══════════════════════════════════════════════════════════════
   ABOUT PAGE
══════════════════════════════════════════════════════════════ */
const DIVS = [
  { n:'HEG', f:'Human Empowerment & Growth',       c:'var(--brand)',      bg:'var(--brand-lite)', d:'Mengelola anggota, absensi, poin aktivitas, dan pengembangan SDM komunitas.' },
  { n:'CDA', f:'Competition & Development',        c:'var(--c-desain)',   bg:'#FFECE5',           d:'Mendampingi anggota dalam kompetisi dan memantau perkembangan prestasi.' },
  { n:'MBD', f:'Media & Branding Division',        c:'var(--gold-dark)',  bg:'var(--gold-lite)',  d:'Mengelola konten media sosial, desain grafis, video, dan website komunitas.' },
  { n:'KORVOKS', f:'Koordinasi Vokasi & Konten',  c:'var(--c-penulisan)',bg:'#E5F5EF',           d:'Koordinasi lintas divisi dan pengelolaan konten vokasi komunitas.' },
]
const CLST = [
  { k:'bisnis', l:'Bisnis & Analisis' },
  { k:'desain', l:'Desain & Visual' },
  { k:'penulisan', l:'Penulisan & Sains' },
]

export function AboutPage() {
  const [members, setMembers] = useState([])
  const [awards, setAwards]   = useState([])
  const [vision, setVision]   = useState('')
  const [mission, setMission] = useState('')
  const [active, setActive]   = useState('bisnis')

  useEffect(() => {
    getMembers().then(r=>setMembers(r.data||[]))
    getStaffAwards().then(r=>setAwards(r.data||[]))
    getSiteContent('vision').then(r=>setVision(r.data?.value||'Menjadi komunitas prestasi mahasiswa IPB yang terdepan, inklusif, dan berdampak nyata bagi bangsa.'))
    getSiteContent('mission').then(r=>setMission(r.data?.value||'Mendampingi, memfasilitasi, dan mengapresiasi setiap pencapaian mahasiswa IPB University.'))
  }, [])

  const cm = members.filter(m=>m.cluster===active)
  const acl = getCL(active)

  return (
    <><Navbar/>
    <main style={{ paddingTop:64 }}>
      <PH title="Tentang Aksara Karya 62" sub="Komunitas Prestasi Mahasiswa IPB University di bawah Direktorat Kemahasiswaan." pill="Kabinet AKSARA KARYA"/>

      {/* Visi Misi */}
      <section className="sec" style={{ background:'#fff', borderBottom:'1px solid var(--bdr)' }}>
        <div className="wrap">
          <SH eyebrow="Arah Komunitas" title="Visi & Misi" center mb="2rem"/>
          <div className="g2">
            {[{I:Eye,t:'Visi',tx:vision,c:'var(--brand)',bg:'var(--brand-lite)'},{I:Target,t:'Misi',tx:mission,c:'var(--gold-dark)',bg:'var(--gold-lite)'}].map(({I,t,tx,c,bg})=>(
              <div key={t} className="card" style={{ cursor:'default' }}>
                <div className="card-p">
                  <div style={{ width:40, height:40, borderRadius:10, background:bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem' }}><I size={18} style={{ color:c }}/></div>
                  <h3 style={{ marginBottom:'0.75rem' }}>{t}</h3>
                  <p style={{ color:'var(--t3)', lineHeight:1.8, fontSize:'0.875rem' }}>{tx||'—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divisi */}
      <section className="sec">
        <div className="wrap">
          <SH eyebrow="Struktur" title="Divisi Fungsional" center mb="2rem"/>
          <div className="g4">
            {DIVS.map(div=>(
              <div key={div.n} className="card" style={{ cursor:'default' }}>
                <div className="card-p">
                  <div style={{ width:40, height:40, borderRadius:10, background:div.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'0.875rem' }}>
                    <span style={{ fontWeight:900, fontSize:'0.65rem', color:div.c, letterSpacing:'0.02em' }}>{div.n}</span>
                  </div>
                  <p style={{ fontWeight:800, fontSize:'0.875rem', marginBottom:3 }}>{div.n}</p>
                  <p style={{ fontSize:'0.69rem', fontWeight:700, color:div.c, marginBottom:'0.6rem', lineHeight:1.3 }}>{div.f}</p>
                  <p style={{ fontSize:'0.78rem', color:'var(--t3)', lineHeight:1.65 }}>{div.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      {awards.length>0 && (
        <section className="sec" style={{ background:'#fff', borderTop:'1px solid var(--bdr)', borderBottom:'1px solid var(--bdr)' }}>
          <div className="wrap">
            <SH eyebrow="Apresiasi" title="Staff of the Month" center mb="2rem"/>
            <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center' }}>
              {awards.slice(0,4).map(a=>(
                <div key={a.id} style={{ width:175, background:'#fff', borderRadius:16, padding:'1.25rem', border:'1px solid var(--bdr)', textAlign:'center', transition:'all var(--t)' }}
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--s2)';e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.borderColor='var(--gold)'}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor='var(--bdr)'}}>
                  <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,var(--gold),var(--gold-dark))', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 0.75rem', overflow:'hidden' }}>
                    {a.profiles?.avatar_url ? <img src={a.profiles.avatar_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <span style={{ fontWeight:800, fontSize:'1.1rem', color:'#fff' }}>{a.profiles?.name?.[0]}</span>}
                  </div>
                  <Award size={13} style={{ color:'var(--gold)', margin:'0 auto 5px' }}/>
                  <p style={{ fontWeight:700, fontSize:'0.85rem' }}>{a.profiles?.name}</p>
                  <p style={{ fontSize:'0.7rem', color:'var(--t3)', marginTop:2 }}>{a.month}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Members */}
      <section className="sec">
        <div className="wrap">
          <SH eyebrow="Tim" title="Anggota Klaster" center mb="1.75rem"/>
          <div style={{ display:'flex', gap:7, justifyContent:'center', marginBottom:'1.75rem', flexWrap:'wrap' }}>
            {CLST.map(c=>{
              const cl=getCL(c.k); const on=active===c.k
              return <button key={c.k} onClick={()=>setActive(c.k)} style={{ padding:'6px 16px', borderRadius:99, fontSize:'0.8rem', fontWeight:700, border:'none', cursor:'pointer', transition:'all 0.15s', background:on?cl.color:'#fff', color:on?'#fff':'var(--t3)', boxShadow:on?`0 2px 10px ${cl.color}44`:'var(--s1)', outline:on?'none':'1px solid var(--bdr)', fontFamily:'var(--font)' }}>{c.l}</button>
            })}
          </div>
          {cm.length===0 ? <Empty title="Belum ada anggota" desc="Anggota akan muncul setelah ditambahkan"/>
            : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:'0.875rem' }}>
                {cm.map(m=>(
                  <div key={m.id} style={{ background:'#fff', borderRadius:13, padding:'1.1rem', border:'1px solid var(--bdr)', textAlign:'center', transition:'all var(--t)' }}
                    onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--s2)';e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.borderColor=acl.color+'55'}}
                    onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor='var(--bdr)'}}>
                    <Av name={m.name} cluster={m.cluster} size="l" src={m.avatar_url} style={{ margin:'0 auto 0.625rem' }}/>
                    <p style={{ fontWeight:700, fontSize:'0.82rem' }}>{m.name}</p>
                    {m.bio && <p style={{ fontSize:'0.7rem', color:'var(--t3)', marginTop:3, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', lineHeight:1.5 }}>{m.bio}</p>}
                  </div>
                ))}
              </div>
          }
        </div>
      </section>
    </main><Footer/></>
  )
}

/* ══════════════════════════════════════════════════════════════
   FAQ PAGE
══════════════════════════════════════════════════════════════ */
const FAQS = [
  { q:'Apa itu Aksara Karya 62?', a:'Aksara Karya 62 adalah komunitas prestasi mahasiswa IPB University di bawah Direktorat Kemahasiswaan. Fokus pada pengembangan prestasi melalui 3 klaster: Bisnis & Analisis Strategi, Desain & Visual Kreatif, dan Penulisan Ilmiah & Olimpiade Sains.' },
  { q:'Bagaimana cara bergabung?', a:'Melalui open recruitment setiap awal tahun akademik. Pantau Instagram @aksarakarya62 untuk info terbaru.' },
  { q:'Apa itu kabinet AKSARA KARYA?', a:'Nama kabinet kepengurusan periode ini, terdiri dari BPH dan divisi: HEG, CDA, MBD, dan KORVOKS.' },
  { q:'Bagaimana sistem poin prestasi?', a:'Setiap prestasi memberikan poin: Internasional (100), Nasional (70), Provinsi (40), Kota (20), Universitas (10).' },
  { q:'Apa saja fitur platform ini?', a:'Upload dan tampilkan prestasi, leaderboard otomatis, kalender pribadi, dashboard per divisi, dan AI asisten komunitas.' },
]
const SUGG = ['Apa keuntungan bergabung?','Cara upload prestasi?','Info klaster Penulisan & Sains?','Kompetisi apa yang bisa diikuti?']

export function FAQPage() {
  const [msgs, setMsgs]   = useState([{ role:'model', text:'Halo! Aku Aksara 👋 Tanya apa saja seputar komunitas, kompetisi, atau platform Aksara Karya 62!' }])
  const [inp, setInp]     = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab]     = useState('ai')
  const bot               = useRef(null)

  useEffect(() => { bot.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])

  const send = async (t) => {
    const msg = (t||inp).trim(); if (!msg||loading) return
    setInp('')
    const next = [...msgs, { role:'user', text:msg }]
    setMsgs(next); setLoading(true)
    try {
      const r = await askGemini(msg, msgs.map(m=>({ role:m.role, text:m.text })))
      setMsgs([...next, { role:'model', text:r }])
    } catch { setMsgs([...next, { role:'model', text:'Maaf ada kendala teknis, coba lagi ya!' }]) }
    setLoading(false)
  }

  return (
    <><Navbar/>
    <main style={{ paddingTop:64 }}>
      <PH title="FAQ & AI Asisten" sub="Tanya Aksara AI atau baca FAQ komunitas." pill="Bantuan"/>

      <section className="sec"><div className="wrap" style={{ maxWidth:700 }}>
        {/* Tab switcher */}
        <div style={{ display:'flex', background:'#fff', padding:3, borderRadius:10, border:'1px solid var(--bdr)', marginBottom:'1.75rem', width:'fit-content' }}>
          {[['ai','AI Chat'],['faq','FAQ']].map(([v,l])=>(
            <button key={v} onClick={()=>setTab(v)} style={{ padding:'7px 22px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'var(--font)', fontSize:'0.84rem', fontWeight:tab===v?700:500, background:tab===v?'var(--brand)':'transparent', color:tab===v?'#fff':'var(--t3)', transition:'all 0.15s' }}>{l}</button>
          ))}
        </div>

        {/* AI Chat */}
        {tab==='ai' && (
          <div style={{ background:'#fff', borderRadius:16, border:'1px solid var(--bdr)', overflow:'hidden', boxShadow:'var(--s2)' }}>
            {/* Header */}
            <div style={{ padding:'0.875rem 1.1rem', background:'var(--brand)', display:'flex', alignItems:'center', gap:11 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Bot size={18} color="#fff"/>
              </div>
              <div>
                <p style={{ fontWeight:700, color:'#fff', fontSize:'0.84rem' }}>Aksara</p>
                <p style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.5)' }}>AI Maskot Aksara Karya 62</p>
              </div>
              <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:'#22C55E', boxShadow:'0 0 6px #22C55E' }}/>
                <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.5)' }}>Online</span>
              </div>
            </div>

            {/* Messages */}
            <div style={{ padding:'1.1rem', height:370, overflowY:'auto', display:'flex', flexDirection:'column', gap:'0.875rem' }}>
              {msgs.map((m,i)=>(
                <div key={i} style={{ display:'flex', gap:8, justifyContent:m.role==='user'?'flex-end':'flex-start' }}>
                  {m.role==='model' && <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--brand)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Bot size={14} color="#fff"/></div>}
                  <div style={{ maxWidth:'76%', padding:'8px 12px', borderRadius:m.role==='user'?'14px 14px 3px 14px':'14px 14px 14px 3px', background:m.role==='user'?'var(--brand)':'var(--bg)', color:m.role==='user'?'#fff':'var(--t1)', fontSize:'0.86rem', lineHeight:1.65 }}>{m.text}</div>
                  {m.role==='user' && <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--bg)', border:'1px solid var(--bdr)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><User size={14} color="var(--t3)"/></div>}
                </div>
              ))}
              {loading && (
                <div style={{ display:'flex', gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--brand)', display:'flex', alignItems:'center', justifyContent:'center' }}><Bot size={14} color="#fff"/></div>
                  <div style={{ padding:'10px 13px', background:'var(--bg)', borderRadius:'14px 14px 14px 3px' }}>
                    <div style={{ display:'flex', gap:4 }}>{[0,1,2].map(i=><span key={i} style={{ width:5, height:5, borderRadius:'50%', background:'var(--t4)', display:'inline-block', animation:`bounce 1.2s ${i*0.2}s infinite` }}/>)}</div>
                  </div>
                </div>
              )}
              <div ref={bot}/>
            </div>

            {/* Suggestions */}
            <div style={{ padding:'0 1.1rem 0.75rem', display:'flex', gap:5, flexWrap:'wrap' }}>
              {SUGG.map(s=>(
                <button key={s} onClick={()=>send(s)} style={{ padding:'3px 10px', borderRadius:99, border:'1px solid var(--bdr)', background:'#fff', fontSize:'0.72rem', cursor:'pointer', transition:'all 0.12s', fontFamily:'var(--font)', color:'var(--t3)' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='var(--brand-lite)';e.currentTarget.style.borderColor='var(--brand)';e.currentTarget.style.color='var(--brand)'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.borderColor='var(--bdr)';e.currentTarget.style.color='var(--t3)'}}>
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding:'0.75rem 1.1rem', borderTop:'1px solid var(--bdr)', display:'flex', gap:8 }}>
              <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Tulis pesan..." className="fin" style={{ flex:1 }}/>
              <button onClick={()=>send()} className="btn btn-brand" disabled={loading} style={{ padding:'9px 12px', flexShrink:0 }}><Send size={14}/></button>
            </div>
          </div>
        )}

        {/* FAQ */}
        {tab==='faq' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
            {FAQS.map((f,i)=><FItem key={i} q={f.q} a={f.a}/>)}
          </div>
        )}
      </div></section>
    </main><Footer/>
    <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
    </>
  )
}

function FItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background:'#fff', borderRadius:10, border:`1px solid ${open?'var(--brand)':'var(--bdr)'}`, overflow:'hidden', transition:'border-color 0.12s' }}>
      <button onClick={()=>setOpen(!open)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.9rem 1.1rem', background:'none', border:'none', cursor:'pointer', textAlign:'left', gap:'0.875rem', fontFamily:'var(--font)' }}>
        <span style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--t1)' }}>{q}</span>
        <span style={{ width:20, height:20, borderRadius:'50%', background:open?'var(--brand)':'var(--bg)', border:'1px solid var(--bdr)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', color:open?'#fff':'var(--t3)', flexShrink:0, transition:'all 0.12s', fontWeight:700, lineHeight:1 }}>
          {open?'−':'+'}
        </span>
      </button>
      {open && <div style={{ padding:'0 1.1rem 0.9rem', fontSize:'0.856rem', color:'var(--t3)', lineHeight:1.75, borderTop:'1px solid var(--bdr)', paddingTop:'0.75rem' }}>{a}</div>}
    </div>
  )
}

export default EventPage
