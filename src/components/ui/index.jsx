import { useRef } from 'react'
import { X, Upload } from 'lucide-react'
import { LOGO, getCL, getLV } from '../../utils/constants'

export const Logo = ({ h = 36, white = false, style = {} }) => {
  const base = import.meta.env.BASE_URL || '/'
  const src = base.endsWith('/') ? base + 'logo.png' : base + '/logo.png'

  // Kalau white=true (dipakai di background gelap), bungkus logo dengan container putih
  // supaya logo yang background-nya putih nggak "hilang" dan tetep terbaca
  if (white) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        padding: '6px 12px',
        borderRadius: 8,
        ...style,
      }}>
        <img
          src={src}
          alt="Komunitas Prestasi - Aksara Karya"
          style={{ height: h, width: 'auto', display: 'block' }}
          onError={e => { e.target.src = '/logo.png' }}
        />
      </div>
    )
  }

  // Default: logo tanpa filter apapun
  return (
    <img
      src={src}
      alt="Komunitas Prestasi - Aksara Karya"
      style={{ height: h, width: 'auto', display: 'block', ...style }}
      onError={e => { e.target.src = '/logo.png' }}
    />
  )
}

export const ClBadge = ({ cluster }) => {
  const cl = getCL(cluster)
  return <span className={`badge b-${cluster?.toLowerCase()}`} style={{ background: cl.bg, color: cl.color }}>{cl.label}</span>
}

export const LvBadge = ({ level }) => (
  <span className={getLV(level)}>{level}</span>
)

export const Av = ({ name, cluster, size = 'm', src }) => {
  const cl = getCL(cluster)
  if (src) return <div className={`av av-${size}`}><img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/></div>
  return <div className={`av av-${size}`} style={{ background: cl.bg, color: cl.color }}>{name?.[0]?.toUpperCase() || '?'}</div>
}

export const Modal = ({ title, onClose, children }) => (
  <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
        <h3>{title}</h3>
        <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding:'5px 7px' }}><X size={15}/></button>
      </div>
      {children}
    </div>
  </div>
)

export const FileUp = ({ label, accept = 'image/*', value, onChange, hint }) => {
  const ref = useRef()
  const prev = value instanceof File ? URL.createObjectURL(value) : typeof value === 'string' ? value : null
  return (
    <div className="fg">
      {label && <label className="flbl">{label}</label>}
      <div onClick={() => ref.current.click()} style={{ border:'2px dashed var(--bdr)', borderRadius:'var(--r2)', padding:'1.25rem', textAlign:'center', cursor:'pointer', background: prev ? 'var(--brand-pale)' : 'var(--bg)', transition:'border-color var(--t)' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--bdr)'}>
        <Upload size={20} style={{ margin:'0 auto 6px', color:'var(--t3)' }}/>
        <p style={{ fontSize:'0.82rem', color:'var(--t3)' }}>{value ? (value instanceof File ? value.name : 'File dipilih') : 'Klik untuk upload'}</p>
        {prev && <img src={prev} alt="" style={{ maxHeight:110, margin:'0.75rem auto 0', borderRadius:6, objectFit:'cover' }}/>}
      </div>
      <input ref={ref} type="file" accept={accept} style={{ display:'none' }} onChange={e => onChange(e.target.files?.[0])}/>
      {hint && <span className="fhint">{hint}</span>}
    </div>
  )
}

export const Stat = ({ label, value, icon: Icon, color = 'var(--brand)' }) => (
  <div className="stat">
    {Icon && <div style={{ width:40, height:40, borderRadius:'var(--r2)', background:color+'18', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon size={18} style={{ color }}/></div>}
    <div>
      <p style={{ fontSize:'0.75rem', color:'var(--t3)', fontWeight:500, marginBottom:2 }}>{label}</p>
      <p style={{ fontSize:'1.5rem', fontWeight:800, lineHeight:1.1 }}>{value}</p>
    </div>
  </div>
)

export const Empty = ({ icon:Icon, title, desc }) => (
  <div className="empty">
    {Icon && <Icon size={40} style={{ margin:'0 auto 0.875rem', opacity:.18 }}/>}
    <p style={{ fontWeight:600, color:'var(--t2)', marginBottom:4 }}>{title}</p>
    {desc && <p style={{ fontSize:'0.84rem' }}>{desc}</p>}
  </div>
)

export const SH = ({ eyebrow, title, center = false, white = false, mb = '2rem' }) => (
  <div style={{ marginBottom: mb, textAlign: center ? 'center' : 'left' }}>
    {eyebrow && <p style={{ fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color: white ? 'rgba(255,255,255,0.5)' : 'var(--brand)', marginBottom:'0.4rem' }}>{eyebrow}</p>}
    <h2 style={{ color: white ? '#fff' : 'var(--t1)' }}>{title}</h2>
  </div>
)