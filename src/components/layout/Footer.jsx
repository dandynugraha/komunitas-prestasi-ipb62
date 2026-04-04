import { Link } from 'react-router-dom'
import { Instagram, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--color-primary)', color: 'white',
      padding: '3rem 0 2rem',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Brand */}
          <div>
            <img src="/logo.png" alt="Aksara Karya 62" style={{ height: 44, marginBottom: '1rem', filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
            <p style={{ fontSize: '0.875rem', opacity: 0.75, lineHeight: 1.7, maxWidth: 240 }}>
              Komunitas Prestasi IPB University. Bersama meraih prestasi terbaik untuk bangsa.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: '1rem' }}>
              <a href="https://www.instagram.com/aksarakarya62" target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', transition: 'var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                <Instagram size={16} />
              </a>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', transition: 'var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <p style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem', letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.5 }}>Navigasi</p>
            {[
              ['/', 'Beranda'],
              ['/competitions', 'Kompetisi'],
              ['/events', 'Event'],
              ['/facilities', 'Fasilitas'],
              ['/about', 'Tentang Kami'],
              ['/faq', 'FAQ & AI'],
            ].map(([to, label]) => (
              <Link key={to} to={to} style={{ display: 'block', fontSize: '0.875rem', opacity: 0.75, marginBottom: 8, transition: 'var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.75'}
              >{label}</Link>
            ))}
          </div>

          {/* Klaster */}
          <div>
            <p style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem', letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.5 }}>Klaster</p>
            {['Desain', 'Olimpiade', 'Penulisan', 'Bisnis'].map(k => (
              <p key={k} style={{ fontSize: '0.875rem', opacity: 0.75, marginBottom: 8 }}>{k}</p>
            ))}
          </div>

          {/* Divisions */}
          <div>
            <p style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem', letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.5 }}>Divisi</p>
            {['HEG', 'CDA', 'MBD', 'KORVOKS'].map(d => (
              <p key={d} style={{ fontSize: '0.875rem', opacity: 0.75, marginBottom: 8 }}>{d}</p>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: '0.8rem', opacity: 0.55 }}>
            © {new Date().getFullYear()} Aksara Karya 62 · Kabinet AKSARA KARYA · IPB University
          </p>
          <p style={{ fontSize: '0.8rem', opacity: 0.55 }}>
            Direktorat Kemahasiswaan IPB University
          </p>
        </div>
      </div>
    </footer>
  )
}
