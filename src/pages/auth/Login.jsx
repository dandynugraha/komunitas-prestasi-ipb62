import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../../services/supabase'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Logo } from '../../components/ui/index'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [pass, setPass]         = useState('')
  const [show, setShow]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const navigate                = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!email||!pass) { toast.error('Isi email dan kode anggota'); return }
    setLoading(true)
    const { error } = await signIn(email, pass)
    setLoading(false)
    if (error) { toast.error('Email atau kode anggota salah'); return }
    toast.success('Selamat datang!')
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex' }}>
      {/* Left - brand */}
      <div style={{ flex:1, background:'var(--brand)', display:'none', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'3rem', position:'relative', overflow:'hidden' }} className="ll">
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'-40px', left:'-40px', width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', textAlign:'center' }}>
          <Logo h={44} white style={{ margin:'0 auto 1.75rem' }}/>
          <h2 style={{ color:'#fff', marginBottom:'0.4rem', fontSize:'clamp(1.4rem,2.5vw,1.8rem)' }}>Komunitas Prestasi</h2>
          <p style={{ color:'rgba(255,255,255,0.72)', fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:'0.15em', fontWeight:600, marginBottom:'1rem' }}>Kabinet Aksara Karya</p> 
          <p style={{ color:'rgba(255,255,255,0.52)', lineHeight:1.8, maxWidth:270, fontSize:'0.875rem' }}>
            Platform resmi pencatatan dan pemantauan Komunitas Prestasi IPB University.
          </p>
          <div style={{ display:'flex', gap:7, flexWrap:'wrap', justifyContent:'center', marginTop:'1.75rem' }}>
            {['Bisnis & Analisis','Desain & Visual','Penulisan & Sains'].map(k=>(
              <span key={k} style={{ padding:'4px 11px', borderRadius:99, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.18)', color:'rgba(255,255,255,0.72)', fontSize:'0.75rem', fontWeight:600 }}>{k}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right - form */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background:'var(--bg)' }}>
        <div style={{ width:'100%', maxWidth:388 }}>
          <Link to="/" style={{ display:'inline-block', marginBottom:'2rem', lineHeight:0 }}><Logo h={34}/></Link>
          <h2 style={{ marginBottom:'0.3rem' }}>Masuk ke Akun</h2>
          <p style={{ color:'var(--t3)', fontSize:'0.875rem', marginBottom:'1.75rem' }}>Gunakan email dan kode anggota untuk masuk</p>

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
            <div className="fg">
              <label className="flbl">Email</label>
              <input type="email" className="fin" placeholder="email@example.com" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/>
            </div>
            <div className="fg">
              <label className="flbl">Kode Anggota / Password</label>
              <div style={{ position:'relative' }}>
                <input type={show?'text':'password'} className="fin" placeholder="Contoh: RONA622501" value={pass} onChange={e=>setPass(e.target.value)} style={{ paddingRight:42 }} autoComplete="current-password"/>
                <button type="button" onClick={()=>setShow(!show)} style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--t3)', cursor:'pointer', lineHeight:0 }}>
                  {show ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-brand" style={{ width:'100%', padding:'11px', fontSize:'0.9rem', marginTop:'0.25rem', opacity:loading?0.7:1 }}>
              {loading ? 'Memuat...' : <><span>Masuk</span><ArrowRight size={15}/></>}
            </button>
          </form>

          <div style={{ marginTop:'1.25rem', padding:'0.8rem 1rem', background:'#fff', borderRadius:9, border:'1px solid var(--bdr)', fontSize:'0.78rem', color:'var(--t3)', lineHeight:1.7 }}>
            <strong style={{ color:'var(--t1)' }}>Tidak punya akun?</strong> Hubungi admin atau pengurus HEG untuk mendapatkan akun.
          </div>
          <p style={{ marginTop:'1.1rem', fontSize:'0.78rem', color:'var(--t3)', textAlign:'center' }}>
            <Link to="/" style={{ color:'var(--brand)', fontWeight:600 }}>← Kembali ke Beranda</Link>
          </p>
        </div>
      </div>
      <style>{`@media(min-width:860px){.ll{display:flex!important}}`}</style>
    </div>
  )
}
