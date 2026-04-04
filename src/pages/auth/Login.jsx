import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signIn } from '../../services/supabase'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { profile } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Isi semua field'); return }
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) { toast.error('Email atau kode anggota salah'); return }
    toast.success('Selamat datang kembali!')
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-bg)' }}>
      {/* Left – branding */}
      <div style={{
        flex: 1, background: 'var(--color-primary)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '3rem',
        display: 'none',
      }} className="login-left">
        <img src="/logo.png" alt="logo" style={{ width: 200, filter: 'brightness(0) invert(1)', opacity: 0.9, marginBottom: '2rem' }} />
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: '2.5rem', textAlign: 'center', lineHeight: 1.2 }}>
          Aksara Karya 62
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '1rem', textAlign: 'center', maxWidth: 320, lineHeight: 1.7 }}>
          Platform prestasi komunitas IPB University. Catat, pantau, dan rayakan setiap pencapaian bersama.
        </p>
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Desain', 'Olimpiade', 'Penulisan', 'Bisnis'].map(k => (
            <span key={k} style={{ padding: '6px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>{k}</span>
          ))}
        </div>
      </div>

      {/* Right – form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', maxWidth: 560, margin: '0 auto', width: '100%' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Link to="/" style={{ display: 'flex', marginBottom: '2.5rem' }}>
            <img src="/logo.png" alt="logo" style={{ height: 44 }} />
          </Link>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Masuk ke Akun</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Gunakan email dan kode anggota untuk masuk
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email" className="form-input"
                placeholder="email@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kode Anggota / Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={show ? 'text' : 'password'} className="form-input"
                  placeholder="Contoh: RONA622501"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShow(!show)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '12px' }} disabled={loading}>
              {loading ? 'Memuat...' : <><span>Masuk</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--color-surface-2)', borderRadius: 12, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <strong style={{ color: 'var(--color-text)' }}>Tidak punya akun?</strong> Hubungi admin atau pengurus HEG untuk mendapatkan akun anggota.
          </div>

          <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
            <Link to="/" style={{ color: 'var(--color-primary)' }}>← Kembali ke Beranda</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) { .login-left { display: flex !important; } }
      `}</style>
    </div>
  )
}
