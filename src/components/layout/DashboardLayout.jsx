import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Navbar from './Navbar'
import Footer from './Footer'

export default function DashboardLayout({ children, links = [], title }) {
  const loc = useLocation()
  const { profile } = useAuth()
  return (
    <>
      <Navbar/>
      <div style={{ paddingTop:64, minHeight:'100vh', background:'var(--bg)' }}>
        <div className="wrap" style={{ padding:'1.75rem 1.5rem', display:'flex', gap:'1.5rem', alignItems:'flex-start' }}>
          <aside className="sidebar">
            <div style={{ marginBottom:'0.875rem', paddingBottom:'0.875rem', borderBottom:'1px solid var(--bdr)' }}>
              <p style={{ fontWeight:700, fontSize:'0.84rem' }}>{profile?.name}</p>
              <p style={{ fontSize:'0.7rem', color:'var(--t3)', marginTop:2, textTransform:'capitalize' }}>{profile?.cluster} · {profile?.role||'Member'}</p>
            </div>
            <nav style={{ display:'flex', flexDirection:'column', gap:2 }}>
              {links.map(({ to, label, icon:I }) => {
                const a = loc.pathname === to
                return (
                  <Link key={to} to={to} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', borderRadius:8, fontSize:'0.82rem', fontWeight:a?700:500, color:a?'var(--brand)':'var(--t3)', background:a?'var(--brand-lite)':'transparent', transition:'all 0.12s' }}
                    onMouseEnter={e=>{if(!a){e.currentTarget.style.background='var(--bg)';e.currentTarget.style.color='var(--t1)'}}}
                    onMouseLeave={e=>{if(!a){e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--t3)'}}}>
                    {I && <I size={14}/>}{label}
                  </Link>
                )
              })}
            </nav>
          </aside>
          <main style={{ flex:1, minWidth:0 }}>
            {title && <h2 style={{ marginBottom:'1.25rem' }}>{title}</h2>}
            {children}
          </main>
        </div>
      </div>
      <Footer/>
    </>
  )
}
