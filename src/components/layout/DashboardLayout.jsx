import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Navbar from './Navbar'
import Footer from './Footer'

export default function DashboardLayout({ children, sidebarLinks, title }) {
  const location = useLocation()
  const { profile } = useAuth()

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 68, minHeight: '100vh', background: 'var(--color-bg)' }}>
        <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Sidebar */}
          <aside style={{
            width: 240, flexShrink: 0, position: 'sticky', top: 88,
            background: 'white', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)', padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
          }} className="sidebar">
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{profile?.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                {profile?.cluster} · {profile?.role || 'Member'}
              </p>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sidebarLinks?.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to
                return (
                  <Link key={to} to={to} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 12px', borderRadius: 10, fontSize: '0.875rem',
                    fontWeight: active ? 600 : 500,
                    color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    background: active ? 'var(--color-primary-pale)' : 'transparent',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--color-surface-2)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
                    {Icon && <Icon size={16} />}
                    {label}
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {title && <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>{title}</h2>}
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}
