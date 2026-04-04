import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Settings } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { signOut } from '../../services/supabase'
import toast from 'react-hot-toast'

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/competitions', label: 'Kompetisi' },
  { to: '/events', label: 'Event' },
  { to: '/facilities', label: 'Fasilitas' },
  { to: '/about', label: 'Tentang Kami' },
  { to: '/faq', label: 'FAQ & AI' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, profile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  const handleSignOut = async () => {
    await signOut()
    toast.success('Berhasil keluar')
    navigate('/')
  }

  const getDashboardLink = () => {
    const role = profile?.role || ''
    if (role === 'mbd (web developer)' || role === 'bph') return '/admin'
    if (['heg','cda','cda (bisnis)','cda (desain)','cda (penulisan)','cda (olimpiade)','mbd','mbd (ilustrator)','mbd (desain grafis)','mbd (video editor)','mbd (multimedia)','korvoks'].includes(role)) return '/staff'
    return '/dashboard'
  }

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(255,255,255,0.95)' : 'white',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: `1px solid ${scrolled ? '#E8E6E0' : 'transparent'}`,
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 68, gap: '2rem' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <img src="/logo.png" alt="Aksara Karya 62" style={{ height: 40, width: 'auto' }} />
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: '0.25rem', flex: 1, justifyContent: 'center' }}
          className="desktop-nav">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to} to={to}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: '0.875rem', fontWeight: 500,
                color: location.pathname === to ? 'var(--color-primary)' : 'var(--color-text-muted)',
                background: location.pathname === to ? 'var(--color-primary-pale)' : 'transparent',
                transition: 'var(--transition)',
              }}
            >{label}</Link>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
                  borderRadius: 10, border: '1.5px solid var(--color-border)',
                  background: 'white', cursor: 'pointer', transition: 'var(--transition)',
                }}
              >
                <div className="avatar avatar-sm" style={{ background: 'var(--color-primary-pale)', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.75rem' }}>
                  {profile?.name?.[0] || 'A'}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile?.name?.split(' ')[0] || 'User'}
                </span>
                <ChevronDown size={14} style={{ color: 'var(--color-text-muted)' }} />
              </button>

              {userMenuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'white', border: '1px solid var(--color-border)',
                  borderRadius: 14, boxShadow: 'var(--shadow-lg)', width: 200, overflow: 'hidden',
                  animation: 'fadeIn 0.15s ease',
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{profile?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{profile?.role || 'Member'}</p>
                  </div>
                  <Link to={getDashboardLink()} onClick={() => setUserMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: '0.875rem', transition: 'var(--transition)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  {(profile?.role === 'mbd (web developer)' || profile?.role === 'bph') && (
                    <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: '0.875rem', transition: 'var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <Settings size={15} /> Kelola Konten
                    </Link>
                  )}
                  <button onClick={handleSignOut}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: '0.875rem', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-danger)', transition: 'var(--transition)' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <LogOut size={15} /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Masuk</Link>
          )}

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="btn btn-ghost btn-sm mobile-menu-btn"
            style={{ padding: 8 }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: 'white', borderTop: '1px solid var(--color-border)',
          padding: '1rem', display: 'flex', flexDirection: 'column', gap: 4,
          animation: 'fadeIn 0.2s ease',
        }}>
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding: '10px 14px', borderRadius: 10,
              fontWeight: 500, fontSize: '0.9rem',
              color: location.pathname === to ? 'var(--color-primary)' : 'var(--color-text)',
              background: location.pathname === to ? 'var(--color-primary-pale)' : 'transparent',
            }}>{label}</Link>
          ))}
          {user && (
            <>
              <Link to={getDashboardLink()} style={{ padding: '10px 14px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                Dashboard
              </Link>
              <button onClick={handleSignOut} style={{ padding: '10px 14px', textAlign: 'left', border: 'none', background: 'transparent', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-danger)', cursor: 'pointer' }}>
                Keluar
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) { .mobile-menu-btn { display: none !important; } }
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
      `}</style>
    </header>
  )
}
