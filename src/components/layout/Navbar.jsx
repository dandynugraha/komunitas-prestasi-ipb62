import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Settings } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { signOut } from '../../services/supabase'
import { Logo } from '../ui/index'
import { getCL } from '../../utils/constants'
import toast from 'react-hot-toast'

const NAV = [
  { to:'/',             label:'Beranda' },
  { to:'/competitions', label:'Lomba' },
  { to:'/events',       label:'Event' },
  { to:'/facilities',   label:'Fasilitas' },
  { to:'/about',        label:'Tentang Kami' },
  { to:'/faq',          label:'FAQ' },
]

export default function Navbar() {
  const [mob, setMob]       = useState(false)
  const [umenu, setUmenu]   = useState(false)
  const [scrolled, setScr]  = useState(false)
  const { user, profile }   = useAuth()
  const loc                 = useLocation()
  const nav                 = useNavigate()

  useEffect(() => {
    const fn = () => setScr(window.scrollY > 10)
    fn(); window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => { setMob(false); setUmenu(false) }, [loc.pathname])

  const out = async () => { await signOut(); toast.success('Berhasil keluar'); nav('/') }
  const isA = (to) => loc.pathname === to
  const dash = () => {
    const r = profile?.role || ''
    if (r === 'mbd (web developer)' || r === 'bph') return '/admin'
    if (['heg','cda','mbd','korvoks'].some(d => r.includes(d))) return '/staff'
    return '/dashboard'
  }
  const cl = getCL(profile?.cluster)

  return (
    <header style={{
      position:'fixed', top:0, left:0, right:0, zIndex:200, height:64,
      background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
      borderBottom:'1px solid var(--bdr)',
      boxShadow: scrolled ? 'var(--s1)' : 'none',
      transition:'box-shadow 0.2s',
    }}>
      <div className="wrap" style={{ display:'flex', alignItems:'center', height:'100%', gap:8 }}>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="Aksara Karya" 
              className="h-8 md:h-10 w-auto object-contain"
              style={{ maxWidth: '240px' }}
            />
          </div>
          <div className="hidden sm:block">
            <div className="font-serif text-lg leading-tight text-gray-900">
              Komunitas Prestasi
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500">
              Kabinet Aksara Karya
            </div>
          </div>
        </Link>

        {/* Spacer */}
        <div style={{ flex:1 }}/>

        {/* Desktop nav — right side */}
        <nav style={{ display:'flex', alignItems:'center', gap:2 }} className="dnav">
          {NAV.map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding:'5px 11px', borderRadius:6, fontSize:'0.845rem',
              fontWeight: isA(to) ? 700 : 500,
              color: isA(to) ? 'var(--brand)' : 'var(--t2)',
              background: isA(to) ? 'var(--brand-lite)' : 'transparent',
              transition:'all 0.15s', whiteSpace:'nowrap',
            }}
            onMouseEnter={e => { if (!isA(to)) { e.currentTarget.style.color='var(--brand)'; e.currentTarget.style.background='var(--brand-pale)' }}}
            onMouseLeave={e => { if (!isA(to)) { e.currentTarget.style.color='var(--t2)'; e.currentTarget.style.background='transparent' }}}>
              {label}
            </Link>
          ))}

          <div style={{ width:1, height:16, background:'var(--bdr)', margin:'0 6px' }}/>

          {/* Auth */}
          {user ? (
            <div style={{ position:'relative' }}>
              <button onClick={() => setUmenu(!umenu)} style={{
                display:'flex', alignItems:'center', gap:6, padding:'5px 8px',
                borderRadius:8, border:'1px solid var(--bdr)', background:'#fff',
                cursor:'pointer', transition:'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--bdr2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--bdr)'}>
                <div className="av av-s" style={{ background:cl.bg, color:cl.color }}>
                  {profile?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <span style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--t1)', maxWidth:80, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {profile?.name?.split(' ')[0] || 'User'}
                </span>
                <ChevronDown size={12} color="var(--t4)" style={{ transform: umenu?'rotate(180deg)':'none', transition:'transform 0.15s', flexShrink:0 }}/>
              </button>
              {umenu && (
                <div style={{ position:'absolute', top:'calc(100% + 6px)', right:0, background:'#fff', border:'1px solid var(--bdr)', borderRadius:12, boxShadow:'var(--s3)', width:188, overflow:'hidden', animation:'up 0.15s var(--ease)' }}>
                  <div style={{ padding:'10px 13px', background:'var(--brand-pale)', borderBottom:'1px solid var(--bdr)' }}>
                    <p style={{ fontWeight:700, fontSize:'0.82rem' }}>{profile?.name}</p>
                    <p style={{ fontSize:'0.69rem', color:'var(--t3)', textTransform:'capitalize', marginTop:1 }}>{profile?.role||'Member'}</p>
                  </div>
                  {[
                    { to:dash(), label:'Dashboard', I:LayoutDashboard },
                    ...((profile?.role==='mbd (web developer)'||profile?.role==='bph') ? [{ to:'/admin', label:'Kelola Konten', I:Settings }] : []),
                  ].map(({ to, label, I }) => (
                    <Link key={to} to={to} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 13px', fontSize:'0.82rem', color:'var(--t1)', transition:'background 0.12s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--brand-pale)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <I size={13} color="var(--brand)"/> {label}
                    </Link>
                  ))}
                  <button onClick={out} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 13px', fontSize:'0.82rem', color:'#DC2626', width:'100%', border:'none', background:'transparent', cursor:'pointer', borderTop:'1px solid var(--bdr)', fontFamily:'var(--font)', transition:'background 0.12s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#FEF2F2'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <LogOut size={13}/> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-brand btn-sm">Login</Link>
          )}
        </nav>

        {/* Mobile toggle */}
        <button onClick={()=>setMob(!mob)} className="mbtn" style={{ display:'none', background:'none', border:'none', padding:6, color:'var(--t1)', cursor:'pointer', borderRadius:6 }}>
          {mob ? <X size={21}/> : <Menu size={21}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {mob && (
        <nav style={{ background:'#fff', borderTop:'1px solid var(--bdr)', padding:'0.75rem', display:'flex', flexDirection:'column', gap:2 }}>
          {NAV.map(({ to, label }) => (
            <Link key={to} to={to} style={{ padding:'9px 11px', borderRadius:8, fontSize:'0.9rem', fontWeight:500, color:isA(to)?'var(--brand)':'var(--t1)', background:isA(to)?'var(--brand-pale)':'transparent' }}>{label}</Link>
          ))}
          <hr style={{ border:'none', borderTop:'1px solid var(--bdr)', margin:'3px 0' }}/>
          {user
            ? <><Link to={dash()} style={{ padding:'9px 11px', fontWeight:700, color:'var(--brand)', fontSize:'0.9rem' }}>Dashboard</Link>
                <button onClick={out} style={{ padding:'9px 11px', textAlign:'left', border:'none', background:'transparent', color:'#DC2626', fontWeight:700, fontSize:'0.9rem', cursor:'pointer', fontFamily:'var(--font)', borderRadius:8 }}>Keluar</button></>
            : <Link to="/login" style={{ padding:'9px 11px', fontWeight:700, color:'var(--brand)', fontSize:'0.9rem' }}>Login</Link>
          }
        </nav>
      )}

      <style>{`
        @media(min-width:769px){.mbtn{display:none!important}}
        @media(max-width:768px){.dnav{display:none!important}.mbtn{display:flex!important}}
      `}</style>
    </header>
  )
}
