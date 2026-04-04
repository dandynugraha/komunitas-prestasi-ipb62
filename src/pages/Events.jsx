// ─── Events Page ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { getEvents } from '../services/supabase'
import { Calendar, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export function EventPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvents({ visibility: 'public' }).then(r => {
      setEvents(r.data || [])
      setLoading(false)
    })
  }, [])

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>
        <section style={{ padding: '4rem 0 2rem', background: 'linear-gradient(135deg,#F4F3EF,#fff)', textAlign: 'center' }}>
          <div className="container">
            <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Event</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Event publik dari Aksara Karya 62</p>
          </div>
        </section>
        <section className="section">
          <div className="container">
            {loading ? <div className="loading-center"><div className="spinner" /></div> : events.length === 0 ? (
              <div className="empty-state"><Calendar size={48} /><p>Belum ada event</p></div>
            ) : (
              <div className="grid-3">
                {events.map(ev => (
                  <div key={ev.id} className="card">
                    {ev.poster_url && <div style={{ height: 200, overflow: 'hidden' }}>
                      <img src={ev.poster_url} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>}
                    <div className="card-body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                        <Calendar size={12} />
                        {ev.event_date ? format(new Date(ev.event_date), 'd MMMM yyyy', { locale: id }) : 'TBD'}
                      </div>
                      <h3 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>{ev.title}</h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{ev.caption}</p>
                      {ev.registration_link && (
                        <a href={ev.registration_link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                          <ExternalLink size={13} /> Daftar
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

// ─── Facilities Page ──────────────────────────────────────────────────────────
const FACILITIES = [
  {
    title: 'Pengisian Aktivitas Student Portal',
    desc: 'Panduan cara mengisi aktivitas kemahasiswaan di Student Portal IPB University.',
    link: 'https://ipb.link/tatacarapengisianaktivitas-studentportal',
    cta: 'Buka Panduan',
  },
  {
    title: 'Informasi SKPI – Instagram 1',
    desc: 'Informasi lengkap tentang Surat Keterangan Pendamping Ijazah (SKPI) di Instagram.',
    link: 'https://www.instagram.com/p/DUSPEpjD2L1/',
    cta: 'Lihat Post',
  },
  {
    title: 'Informasi SKPI – Instagram 2',
    desc: 'Update terbaru seputar SKPI dan cara pengajuannya.',
    link: 'https://www.instagram.com/p/DUK1P6qj_Ne/',
    cta: 'Lihat Post',
  },
  {
    title: 'Panduan SKPI Kemahasiswaan',
    desc: 'Dokumen lengkap panduan SKPI dari Direktorat Kemahasiswaan IPB University.',
    link: 'https://ipb.link/panduan-skpi-kemahasiswaan',
    cta: 'Unduh Panduan',
  },
]

export function FacilitiesPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>
        <section style={{ padding: '4rem 0 2rem', background: 'linear-gradient(135deg,#F4F3EF,#fff)', textAlign: 'center' }}>
          <div className="container">
            <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Fasilitas</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Sumber daya dan panduan untuk anggota Aksara Karya 62</p>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="grid-2">
              {FACILITIES.map((f, i) => (
                <div key={i} className="card">
                  <div className="card-body">
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                      <ExternalLink size={18} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>{f.desc}</p>
                    <a href={f.link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                      <ExternalLink size={13} /> {f.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

// ─── Competition Page ─────────────────────────────────────────────────────────
export function CompetitionPage() {
  const [competitions, setCompetitions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Competitions are events with type='competition'
    getEvents().then(r => {
      const comps = (r.data || []).filter(e => e.type === 'competition' || e.visibility === 'public')
      setCompetitions(comps)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>
        <section style={{ padding: '4rem 0 2rem', background: 'linear-gradient(135deg,#1B4332,#2D6A4F)', textAlign: 'center' }}>
          <div className="container">
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'white', marginBottom: '0.5rem' }}>Kompetisi</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>Daftar kompetisi terbuka untuk anggota Aksara Karya 62</p>
          </div>
        </section>
        <section className="section">
          <div className="container">
            {loading ? <div className="loading-center"><div className="spinner" /></div> :
              competitions.length === 0 ? (
                <div className="empty-state"><Calendar size={48} /><p>Belum ada kompetisi terdaftar</p></div>
              ) : (
                <div className="grid-3">
                  {competitions.map(c => (
                    <div key={c.id} className="card">
                      {c.poster_url && <div style={{ height: 220, overflow: 'hidden' }}>
                        <img src={c.poster_url} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>}
                      <div className="card-body">
                        <h3 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>{c.title}</h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{c.caption}</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {c.registration_link && (
                            <a href={c.registration_link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Daftar</a>
                          )}
                          {c.guidebook_link && (
                            <a href={c.guidebook_link} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Guidebook</a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default EventPage
