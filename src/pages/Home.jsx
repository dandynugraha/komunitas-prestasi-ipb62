import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { SH, ClBadge, LvBadge, Empty } from '../components/ui/index'
import { getCL, CL } from '../utils/constants'
import { getAchievements, getLeaderboard, getEvents, getProjects, getAchievementStats } from '../services/supabase'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Trophy, Calendar, ArrowRight, Medal, Zap, TrendingUp, Users, Star, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { id as lo } from 'date-fns/locale'

const PH = [
  { title:'Juara 1 PKM Kewirausahaan Nasional 2024', name:'Anggota Bisnis', level:'Nasional', cluster:'bisnis', rank:'Juara 1' },
  { title:'Best Paper LKTI Internasional UNPAD', name:'Anggota Penulisan', level:'Internasional', cluster:'penulisan', rank:'Best Paper' },
  { title:'Medali Perak OSN Biologi IPB', name:'Anggota Sains', level:'Nasional', cluster:'penulisan', rank:'Medali Perak' },
]

export default function Home() {
  const [ach, setAch] = useState([])
  const [lb, setLb]   = useState([])
  const [ev, setEv]   = useState([])
  const [pr, setPr]   = useState([])
  const [st, setSt]   = useState([])
  const [tab, setTab] = useState('overall')
  const [load, setLoad] = useState(true)

  useEffect(() => {
    Promise.all([
      getAchievements({ limit:9 }), getLeaderboard(),
      getEvents({ visibility:'public' }), getProjects(), getAchievementStats()
    ]).then(([a,l,e,p,s]) => {
      setAch(a.data||[]); setLb(l.data||[])
      setEv((e.data||[]).slice(0,3)); setPr((p.data||[]).slice(0,3))
      const g={}; (s.data||[]).forEach(r=>{g[r.cluster]=(g[r.cluster]||0)+1})
      setSt(Object.entries(g).map(([n,v])=>({n,v}))); setLoad(false)
    })
  }, [])

  const fLb = tab==='overall' ? lb : lb.filter(m=>m.cluster===tab)
  const cards = ach.length ? ach.slice(0,3) : PH
  const isReal = ach.length > 0

  return (
    <>
      <Navbar/>
      <main style={{ paddingTop:64 }}>

        {/* ── HERO: white bg, brand strip, data-forward ── */}
        <section style={{ background:'#fff', borderBottom:'1px solid var(--bdr)', padding:'3.5rem 0' }}>
          <div className="wrap" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem', alignItems:'center' }}>
            {/* Left */}
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'var(--brand-lite)', borderRadius:6, padding:'4px 12px', marginBottom:'1.25rem' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#22C55E', boxShadow:'0 0 6px #22C55E' }}/>
                <span style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--brand)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Kabinet AKSARA KARYA · IPB University</span>
              </div>
              <h1 style={{ marginBottom:'1rem', color:'var(--t1)' }}>
                Platform Prestasi<br/>
                <span style={{ color:'var(--brand)' }}>Aksara Karya 62</span>
              </h1>
              <p style={{ color:'var(--t3)', fontSize:'1rem', lineHeight:1.8, marginBottom:'1.75rem', maxWidth:440 }}>
                Catat, pantau, dan rayakan setiap pencapaian anggota komunitas IPB University — dari olimpiade sains sampai kompetisi bisnis internasional.
              </p>
              <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
                <Link to="/login" className="btn btn-brand btn-lg">Masuk ke Platform <ArrowRight size={16}/></Link>
                <Link to="/about" className="btn btn-outline btn-lg">Tentang Komunitas</Link>
              </div>
              {/* Stats row */}
              <div style={{ display:'flex', gap:'2rem', marginTop:'2rem', paddingTop:'1.75rem', borderTop:'1px solid var(--bdr)', flexWrap:'wrap' }}>
                {[
                  { n: lb.length||'—', l:'Anggota Aktif', i:Users },
                  { n: ach.length||'—', l:'Prestasi Tercatat', i:Trophy },
                  { n: '3', l:'Klaster', i:Star },
                ].map(({n,l,i:I})=>(
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:'var(--brand-lite)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <I size={17} color="var(--brand)"/>
                    </div>
                    <div>
                      <p style={{ fontSize:'1.35rem', fontWeight:800, lineHeight:1, color:'var(--t1)' }}>{n}</p>
                      <p style={{ fontSize:'0.69rem', color:'var(--t3)', marginTop:2, fontWeight:500 }}>{l}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: achievement preview cards */}
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }} className="hcards">
              <p style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--t3)', marginBottom:'0.25rem' }}>
                {isReal ? '✦ Prestasi Terbaru' : '✦ Contoh Prestasi'}
              </p>
              {cards.map((a,i)=>{
                const cl = getCL(a.cluster)
                const nm = a.profiles?.name || a.name || 'Anggota'
                return (
                  <div key={i} style={{ background:'#fff', border:'1px solid var(--bdr)', borderRadius:12, padding:'12px 14px', display:'flex', alignItems:'center', gap:11, boxShadow:'var(--s1)', transition:'all var(--t)', opacity: isReal ? 1 : 0.65 }}
                    onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--s2)';e.currentTarget.style.borderColor='var(--bdr2)'}}
                    onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--s1)';e.currentTarget.style.borderColor='var(--bdr)'}}>
                    <div style={{ width:38, height:38, borderRadius:10, background:cl.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:800, color:cl.color, flexShrink:0 }}>
                      {nm[0].toUpperCase()}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:'0.84rem', fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'var(--t1)' }}>{a.title}</p>
                      <p style={{ fontSize:'0.71rem', color:'var(--t3)', marginTop:2 }}>{nm} · {a.level}</p>
                    </div>
                    {a.rank && <span style={{ fontSize:'0.71rem', fontWeight:700, color:'var(--gold-dark)', flexShrink:0, display:'flex', alignItems:'center', gap:3 }}><Medal size={11}/>{a.rank}</span>}
                  </div>
                )
              })}
              {!isReal && <p style={{ fontSize:'0.68rem', color:'var(--t4)', textAlign:'center', fontStyle:'italic' }}>Data muncul setelah ada prestasi diupload</p>}
            </div>
          </div>
        </section>

        {/* Cluster strip */}
        <div style={{ background:'var(--brand)', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          <div className="wrap">
            <div style={{ display:'flex', overflowX:'auto', scrollbarWidth:'none' }}>
              {Object.entries(CL).map(([k,{color,label}],i,a)=>(
                <div key={k} style={{ flex:'0 0 auto', padding:'11px 20px', display:'flex', alignItems:'center', gap:8, borderRight:i<a.length-1?'1px solid rgba(255,255,255,0.15)':'none' }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:'rgba(255,255,255,0.8)', flexShrink:0 }}/>
                  <span style={{ fontSize:'0.8rem', fontWeight:600, color:'rgba(255,255,255,0.85)', whiteSpace:'nowrap' }}>{label}</span>
                </div>
              ))}
              <div style={{ flex:'0 0 auto', padding:'11px 20px', display:'flex', alignItems:'center', gap:8 }}>
                <Link to="/about" style={{ fontSize:'0.78rem', fontWeight:600, color:'rgba(255,255,255,0.6)', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:4, transition:'color 0.12s' }}
                  onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.6)'}>
                  Tentang komunitas <ArrowRight size={12}/>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── ACHIEVEMENT FEED ── */}
        <section className="sec">
          <div className="wrap">
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
              <SH eyebrow="Prestasi Terbaru" title="Pencapaian Anggota" mb="0"/>
              <Link to="/achievements" className="btn btn-outline btn-sm">Lihat Semua <ArrowRight size={13}/></Link>
            </div>
            {load ? <div className="lcenter"><div className="spin"/></div>
              : ach.length===0
                ? <Empty icon={Trophy} title="Belum ada prestasi" desc="Login dan upload prestasi pertamamu!"/>
                : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(285px,1fr))', gap:'1rem' }}>
                    {ach.map((a,i)=><AchCard key={a.id} a={a} fresh={i===0}/>)}
                  </div>
            }
          </div>
        </section>

        {/* ── STATS + LEADERBOARD (white section) ── */}
        <section className="sec" style={{ background:'#fff', borderTop:'1px solid var(--bdr)', borderBottom:'1px solid var(--bdr)' }}>
          <div className="wrap">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:'3rem', alignItems:'start' }}>
              {/* Chart */}
              <div>
                <SH eyebrow="Distribusi" title="Statistik Klaster"/>
                {st.length>0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={210}>
                      <PieChart>
                        <Pie data={st.map(s=>({name:s.n,value:s.v}))} cx="50%" cy="50%" innerRadius={52} outerRadius={95} paddingAngle={4} dataKey="value" stroke="none">
                          {st.map(s=><Cell key={s.n} fill={getCL(s.n).color}/>)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius:8, border:'1px solid var(--bdr)', fontSize:'0.78rem', fontFamily:'var(--font)' }} formatter={(v,n)=>[`${v} prestasi`, getCL(n).label]}/>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                      {st.map(s=>(
                        <div key={s.n} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 12px', background:'var(--bg)', borderRadius:8, border:'1px solid var(--bdr)' }}>
                          <div style={{ width:9, height:9, borderRadius:'50%', background:getCL(s.n).color, flexShrink:0 }}/>
                          <span style={{ flex:1, fontSize:'0.84rem', fontWeight:500 }}>{getCL(s.n).label}</span>
                          <span style={{ fontWeight:700, color:'var(--brand)', fontSize:'0.875rem' }}>{s.v}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : <Empty icon={Star} title="Belum ada data" desc="Statistik muncul setelah ada prestasi"/> }
              </div>

              {/* Leaderboard */}
              <div>
                <SH eyebrow="Peringkat" title="Leaderboard"/>
                <div style={{ display:'flex', gap:2, background:'var(--bg)', padding:3, borderRadius:9, border:'1px solid var(--bdr)', marginBottom:'1rem', overflowX:'auto' }}>
                  {[['overall','Semua'],['bisnis','Bisnis'],['desain','Desain'],['penulisan','Penulisan']].map(([v,l])=>(
                    <button key={v} onClick={()=>setTab(v)} style={{ flex:'1 0 auto', padding:'6px 10px', borderRadius:7, border:'none', cursor:'pointer', fontSize:'0.76rem', fontWeight:tab===v?700:500, background:tab===v?'#fff':'transparent', color:tab===v?'var(--brand)':'var(--t3)', transition:'all 0.12s', fontFamily:'var(--font)' }}>{l}</button>
                  ))}
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                  {(fLb.length?fLb:lb).slice(0,8).map((m,i)=><LbRow key={m.id} m={m} i={i}/>)}
                  {lb.length===0 && <Empty title="Leaderboard kosong" desc="Poin muncul otomatis saat ada prestasi"/>}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── EVENTS ── */}
        {ev.length>0 && (
          <section className="sec">
            <div className="wrap">
              <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
                <SH eyebrow="Jadwal" title="Event Mendatang" mb="0"/>
                <Link to="/events" className="btn btn-outline btn-sm">Semua <ArrowRight size={13}/></Link>
              </div>
              <div className="g3">
                {ev.map(e=><EvCard key={e.id} e={e}/>)}
              </div>
            </div>
          </section>
        )}

        {/* ── PROJECTS (brand bg) ── */}
        <section className="sec" style={{ background:'var(--brand)' }}>
          <div className="wrap">
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
              <SH eyebrow="Aktif" title="Proyek Berjalan" white mb="0"/>
              <Link to="/login" className="btn btn-white btn-sm">Dashboard <ArrowRight size={13}/></Link>
            </div>
            {pr.length===0
              ? <div className="empty" style={{ color:'rgba(255,255,255,0.4)' }}><TrendingUp size={40} style={{ margin:'0 auto 0.75rem', opacity:.3 }}/><p>Belum ada proyek aktif</p></div>
              : <div className="g3">{pr.map(p=><PrCard key={p.id} p={p}/>)}</div>
            }
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="sec" style={{ background:'#fff', borderTop:'1px solid var(--bdr)' }}>
          <div className="wrap tc" style={{ maxWidth:500, margin:'0 auto' }}>
            <div style={{ width:48, height:48, borderRadius:12, background:'var(--brand-lite)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.1rem' }}>
              <Zap size={22} color="var(--brand)"/>
            </div>
            <h2 style={{ marginBottom:'0.75rem' }}>Siap Berprestasi?</h2>
            <p style={{ color:'var(--t3)', marginBottom:'1.75rem', lineHeight:1.8 }}>
              Bergabung dan mulai dokumentasikan setiap pencapaianmu bersama komunitas Aksara Karya 62.
            </p>
            <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/login" className="btn btn-brand btn-lg">Masuk Sekarang <ArrowRight size={15}/></Link>
              <Link to="/faq" className="btn btn-outline btn-lg">Tanya AI Aksara</Link>
            </div>
          </div>
        </section>

      </main>
      <Footer/>
      <style>{`
        @media(max-width:700px){.hcards{display:none!important}}
        @media(max-width:860px){
          section>.wrap>div[style*="1fr 1.1fr"]{grid-template-columns:1fr!important}
          section>.wrap>div[style*="1fr 1fr"]{grid-template-columns:1fr!important}
        }
      `}</style>
    </>
  )
}

/* ── Sub-components ─────────────────────────────────────── */
function AchCard({ a, fresh }) {
  const cl = getCL(a.cluster)
  return (
    <div className="card" style={{ borderTop: fresh ? `3px solid ${cl.color}` : '1px solid var(--bdr)' }}>
      {a.image_url && <div style={{ height:175, overflow:'hidden' }}><img src={a.image_url} alt={a.title} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.35s' }} onMouseEnter={e=>e.target.style.transform='scale(1.04)'} onMouseLeave={e=>e.target.style.transform='scale(1)'}/></div>}
      <div className="card-p">
        <div style={{ display:'flex', gap:5, marginBottom:'0.6rem', flexWrap:'wrap' }}>
          <ClBadge cluster={a.cluster}/>
          <LvBadge level={a.level}/>
          {fresh && <span className="badge b-gold">Terbaru</span>}
        </div>
        <h3 style={{ fontSize:'0.92rem', marginBottom:'0.35rem' }}>{a.title}</h3>
        <p style={{ fontSize:'0.8rem', color:'var(--t3)', marginBottom:'0.875rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', lineHeight:1.6 }}>{a.storytelling}</p>
        <div style={{ display:'flex', alignItems:'center', gap:8, paddingTop:'0.75rem', borderTop:'1px solid var(--bdr)' }}>
          <div className="av av-s" style={{ background:cl.bg, color:cl.color }}>{a.profiles?.name?.[0]?.toUpperCase()||'A'}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:'0.75rem', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.profiles?.name}</p>
            {a.date && <p style={{ fontSize:'0.67rem', color:'var(--t4)' }}>{format(new Date(a.date),'d MMM yyyy',{locale:lo})}</p>}
          </div>
          {a.rank && <span style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--gold-dark)', flexShrink:0, display:'flex', alignItems:'center', gap:3 }}><Medal size={11}/>{a.rank}</span>}
        </div>
      </div>
    </div>
  )
}

function LbRow({ m, i }) {
  const cl = getCL(m.cluster)
  const top = i<3
  return (
    <div style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 11px', borderRadius:9, background:top?'var(--brand-pale)':'transparent', border:`1px solid ${top?'var(--bdr)':'transparent'}`, transition:'background var(--t)' }}
      onMouseEnter={e=>{if(!top)e.currentTarget.style.background='#fff'}}
      onMouseLeave={e=>{if(!top)e.currentTarget.style.background='transparent'}}>
      <span style={{ width:24, textAlign:'center', fontSize:top?'0.95rem':'0.75rem', fontWeight:700, color:'var(--t3)', flexShrink:0 }}>{['🥇','🥈','🥉'][i]||i+1}</span>
      <div className="av av-s" style={{ background:cl.bg, color:cl.color }}>{m.name?.[0]?.toUpperCase()}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:'0.82rem', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.name}</p>
        <p style={{ fontSize:'0.67rem', color:'var(--t3)' }}>{cl.label}</p>
      </div>
      <div style={{ textAlign:'right', flexShrink:0 }}>
        <p style={{ fontSize:'0.875rem', fontWeight:800, color:top?'var(--brand)':'var(--t2)' }}>{m.points}</p>
        <p style={{ fontSize:'0.6rem', color:'var(--t4)', letterSpacing:'0.05em' }}>POIN</p>
      </div>
    </div>
  )
}

function EvCard({ e }) {
  return (
    <div className="card">
      {e.poster_url ? <div style={{ height:170, overflow:'hidden' }}><img src={e.poster_url} alt={e.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/></div>
        : <div style={{ height:130, background:'var(--brand-lite)', display:'flex', alignItems:'center', justifyContent:'center' }}><Calendar size={32} color="var(--brand)"/></div>}
      <div className="card-p">
        <p style={{ fontSize:'0.7rem', color:'var(--t3)', marginBottom:'0.35rem', display:'flex', alignItems:'center', gap:5 }}>
          <Calendar size={11}/>{e.event_date?format(new Date(e.event_date),'d MMMM yyyy',{locale:lo}):'TBD'}
        </p>
        <h3 style={{ fontSize:'0.88rem', marginBottom:'0.35rem' }}>{e.title}</h3>
        <p style={{ fontSize:'0.78rem', color:'var(--t3)', marginBottom:'0.875rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{e.caption}</p>
        {e.registration_link && <a href={e.registration_link} target="_blank" rel="noreferrer" className="btn btn-brand btn-sm" style={{ width:'100%' }}>Daftar <ArrowRight size={12}/></a>}
      </div>
    </div>
  )
}

function PrCard({ p }) {
  const tl = p.project_timelines||[]
  const pct = tl.length ? Math.round((tl.filter(t=>t.completed).length/tl.length)*100) : 0
  return (
    <div style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:14, padding:'1.1rem', transition:'all var(--t)' }}
      onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.16)';e.currentTarget.style.borderColor='rgba(255,255,255,0.28)'}}
      onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'}}>
      <p style={{ fontSize:'0.67rem', fontWeight:700, color:'rgba(255,255,255,0.5)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.35rem' }}>{p.leader_name}</p>
      <h3 style={{ color:'#fff', fontSize:'0.9rem', marginBottom:'0.5rem' }}>{p.title}</h3>
      <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.45)', marginBottom:'0.875rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', lineHeight:1.6 }}>{p.description}</p>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
        <span style={{ fontSize:'0.67rem', color:'rgba(255,255,255,0.38)' }}>Progress</span>
        <span style={{ fontSize:'0.7rem', fontWeight:700, color:pct>=70?'var(--gold)':'rgba(255,255,255,0.6)' }}>{pct}%</span>
      </div>
      <div className="prog"><div className="prog-bar" style={{ width:`${pct}%` }}/></div>
    </div>
  )
}
