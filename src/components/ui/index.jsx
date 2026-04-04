import { useRef } from 'react'
import { Upload, X } from 'lucide-react'

export const Spinner = ({ size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    border: `${size / 10}px solid var(--color-border)`,
    borderTopColor: 'var(--color-primary)',
    animation: 'spin 0.7s linear infinite',
  }} />
)

export const Modal = ({ title, onClose, children }) => (
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
        <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: 6 }}>
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
)

export const FileUpload = ({ label, accept = 'image/*', value, onChange, hint }) => {
  const ref = useRef()
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div
        onClick={() => ref.current.click()}
        style={{
          border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)',
          padding: '1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)',
          background: value ? 'var(--color-primary-pale)' : 'var(--color-surface-2)',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
      >
        <Upload size={24} style={{ margin: '0 auto 8px', color: 'var(--color-text-muted)' }} />
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          {value ? (typeof value === 'string' ? 'File dipilih' : value.name) : 'Klik untuk upload'}
        </p>
        {value && typeof value !== 'string' && (
          <img src={URL.createObjectURL(value)} alt="" style={{ maxHeight: 120, margin: '0.75rem auto 0', borderRadius: 8, objectFit: 'cover' }} />
        )}
        {value && typeof value === 'string' && (
          <img src={value} alt="" style={{ maxHeight: 120, margin: '0.75rem auto 0', borderRadius: 8, objectFit: 'cover' }} />
        )}
      </div>
      <input ref={ref} type="file" accept={accept} style={{ display: 'none' }}
        onChange={e => onChange(e.target.files?.[0])} />
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  )
}

export const StatCard = ({ label, value, icon: Icon, color = 'var(--color-primary)', sub }) => (
  <div className="card" style={{ cursor: 'default' }}>
    <div className="card-body" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
      {Icon && (
        <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={22} style={{ color }} />
        </div>
      )}
      <div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1 }}>{value}</p>
        {sub && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{sub}</p>}
      </div>
    </div>
  </div>
)

export const ClusterBadge = ({ cluster }) => {
  const map = {
    desain: 'badge-desain', olimpiade: 'badge-olimpiade',
    penulisan: 'badge-penulisan', bisnis: 'badge-bisnis',
  }
  return <span className={`badge ${map[cluster] || 'badge-primary'}`}>{cluster}</span>
}

export const LevelBadge = ({ level }) => {
  const colors = {
    internasional: { bg: '#EDE9FE', color: '#6D28D9' },
    nasional: { bg: '#FEF3C7', color: '#92400E' },
    provinsi: { bg: '#D1FAE5', color: '#065F46' },
    kota: { bg: '#DBEAFE', color: '#1E40AF' },
    universitas: { bg: '#F3F4F6', color: '#374151' },
  }
  const c = colors[level?.toLowerCase()] || { bg: '#F3F4F6', color: '#374151' }
  return (
    <span className="badge" style={{ background: c.bg, color: c.color }}>
      {level}
    </span>
  )
}

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="empty-state">
    {Icon && <Icon size={48} style={{ margin: '0 auto 1rem', opacity: 0.25 }} />}
    <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>{title}</p>
    {description && <p style={{ fontSize: '0.875rem' }}>{description}</p>}
    {action && <div style={{ marginTop: '1rem' }}>{action}</div>}
  </div>
)
