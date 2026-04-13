import { Link } from 'react-router-dom'
import { Instagram, MessageCircle, MapPin, Phone, Mail } from 'lucide-react'
import { Logo } from '../ui/index'

export default function Footer() {
  return (
    <footer style={{ background:'#1A1C2E', color:'#fff', padding:'3rem 0 1.5rem', marginTop:'auto' }}>
      <div style={{ height:3, background:'linear-gradient(90deg,var(--brand),var(--gold),var(--brand))', marginBottom:0 }}/>
      <div className="wrap" style={{ paddingTop:'2.5rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1fr', gap:'2rem', marginBottom:'2rem' }}>

          {/* Brand */}
          <div>
            <Logo h={34} white style={{ marginBottom:'0.875rem' }}/>
            <p style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.42)', lineHeight:1.85, maxWidth:230, marginBottom:'1.1rem' }}>
              Komunitas Prestasi Mahasiswa IPB University — mencatat setiap pencapaian bersama.
            </p>
            <div style={{ display:'flex', gap:8 }}>
              {[{ href:'https://www.instagram.com/aksarakarya62', I:Instagram },
                { href:'https://wa.me/6281234567890', I:MessageCircle }].map(({href,I})=>(
                <a key={href} href={href} target="_blank" rel="noreferrer" style={{ width:34, height:34, borderRadius:8, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(92,59,196,0.3)';e.currentTarget.style.borderColor='rgba(92,59,196,0.5)'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'}}>
                  <I size={15}/>
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <p style={{ fontSize:'0.67rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:'0.875rem' }}>Menu</p>
            {[['/', 'Beranda'],['/competitions','Lomba'],['/events','Event'],['/facilities','Fasilitas'],['/about','Tentang Kami'],['/faq','FAQ']].map(([to,l])=>(
              <Link key={to} to={to} style={{ display:'block', fontSize:'0.82rem', color:'rgba(255,255,255,0.45)', marginBottom:'0.45rem', transition:'color 0.12s' }}
                onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}>
                {l}
              </Link>
            ))}
          </div>

          {/* Klaster */}
          <div>
            <p style={{ fontSize:'0.67rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:'0.875rem' }}>Klaster</p>
            {[['Bisnis & Analisis','#8B72E0'],['Desain & Visual','#E8825A'],['Penulisan & Sains','#3ABFA0']].map(([k,c])=>(
              <div key={k} style={{ display:'flex', alignItems:'center', gap:7, marginBottom:'0.45rem' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:c, flexShrink:0 }}/>
                <p style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.45)' }}>{k}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize:'0.67rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:'0.875rem' }}>Kontak</p>
            {[
              [MapPin, 'IPB University, Dramaga, Bogor'],
              [MessageCircle, 'WhatsApp Komunitas'],
              [Instagram, '@aksarakarya62'],
            ].map(([I,t])=>(
              <div key={t} style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:'0.5rem' }}>
                <I size={13} style={{ color:'rgba(255,255,255,0.3)', marginTop:3, flexShrink:0 }}/>
                <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.42)', lineHeight:1.5 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:'1.25rem', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:6 }}>
          <p style={{ fontSize:'0.73rem', color:'rgba(255,255,255,0.28)' }}>© {new Date().getFullYear()} Komunitas Prestasi · Kabinet Aksara Karya · IPB University</p>
          <p style={{ fontSize:'0.73rem', color:'rgba(255,255,255,0.28)' }}>Direktorat Kemahasiswaan IPB University</p>
        </div>
      </div>
      <style>{`
        @media(max-width:860px){footer .wrap>div:first-of-type{grid-template-columns:1fr 1fr!important}}
        @media(max-width:500px){footer .wrap>div:first-of-type{grid-template-columns:1fr!important}}
      `}</style>
    </footer>
  )
}
