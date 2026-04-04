import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { StatCard } from '../../components/ui/index'
import { useAuth } from '../../hooks/useAuth'
import { getAchievements, getCompetitions, getProjects, getPlans } from '../../services/supabase'
import { Trophy, Star, FolderOpen, Calendar, Plus, Swords } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const SIDEBAR = [
  { to: '/dashboard', label: 'Beranda', icon: Star },
  { to: '/dashboard/achievement/new', label: 'Upload Prestasi', icon: Trophy },
  { to: '/dashboard/project/new', label: 'Upload Proyek', icon: FolderOpen },
  { to: '/dashboard/events', label: 'Event Saya', icon: Calendar },
  { to: '/dashboard/competitions', label: 'Kompetisi Saya', icon: Swords },
  { to: '/dashboard/plan', label: 'Rencana / Kalender', icon: Calendar },
]

export default function MemberDashboard() {
  const { profile } = useAuth()
  const [achievements, setAchievements] = useState([])
  const [competitions, setCompetitions] = useState([])
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.id) return
    Promise.all([
      getAchievements({ limit: 5 }),
      getCompetitions(profile.id),
      getPlans(profile.id),
    ]).then(([ach, comp, pl]) => {
      setAchievements(ach.data || [])
      setCompetitions(comp.data || [])
      setPlans((pl.data || []).filter(p => new Date(p.plan_date) >= new Date()).slice(0, 3))
      setLoading(false)
    })
  }, [profile])

  return (
    <DashboardLayout sidebarLinks={SIDEBAR} title={`Halo, ${profile?.name?.split(' ')[0]} 👋`}>
      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <StatCard label="Total Prestasi" value={achievements.length} icon={Trophy} color="var(--color-primary)" />
        <StatCard label="Kompetisi Diikuti" value={competitions.length} icon={Swords} color="#E63946" />
        <StatCard label="Poin" value={profile?.points || 0} icon={Star} color="var(--color-accent)" />
        <StatCard label="Klaster" value={profile?.cluster || '-'} icon={FolderOpen} color="#457B9D" sub="Kelompok minat" />
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link to="/dashboard/achievement/new" className="btn btn-primary">
          <Plus size={16} /> Upload Prestasi
        </Link>
        <Link to="/dashboard/project/new" className="btn btn-outline">
          <Plus size={16} /> Tambah Proyek
        </Link>
        <Link to="/dashboard/competitions" className="btn btn-outline">
          <Plus size={16} /> Catat Kompetisi
        </Link>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Recent Achievements */}
        <div className="card" style={{ cursor: 'default' }}>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Prestasi Terbaru</h3>
              <Link to="/dashboard/achievement/new" className="btn btn-ghost btn-sm"><Plus size={14} /></Link>
            </div>
            {loading ? <div className="loading-center"><div className="spinner" /></div> :
              achievements.length === 0 ? <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Belum ada prestasi. Ayo upload pertamamu!</p> :
              achievements.slice(0, 4).map(a => (
                <div key={a.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                  {a.image_url && <img src={a.image_url} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{a.level} · {a.rank}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Upcoming Plans */}
        <div className="card" style={{ cursor: 'default' }}>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Rencana Mendatang</h3>
              <Link to="/dashboard/plan" className="btn btn-ghost btn-sm"><Plus size={14} /></Link>
            </div>
            {plans.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Belum ada rencana mendatang.</p>
            ) : plans.map(p => (
              <div key={p.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.title}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {format(new Date(p.plan_date), 'EEEE, d MMMM yyyy', { locale: id })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export { SIDEBAR }
