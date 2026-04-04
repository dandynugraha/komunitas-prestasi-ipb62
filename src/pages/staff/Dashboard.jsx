// Staff Base Dashboard
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { StatCard, EmptyState } from '../../components/ui/index'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../services/supabase'
import { Users, Trophy, Calendar, Activity, Star, Shield, Megaphone, Palette } from 'lucide-react'

const STAFF_SIDEBAR = [
  { to: '/staff', label: 'Dashboard', icon: Activity },
  { to: '/staff/heg', label: 'HEG Panel', icon: Users },
  { to: '/staff/cda', label: 'CDA Panel', icon: Trophy },
  { to: '/staff/bph', label: 'BPH Panel', icon: Shield },
  { to: '/staff/korvoks', label: 'KORVOKS Panel', icon: Megaphone },
  { to: '/dashboard/achievement/new', label: 'Upload Prestasi', icon: Star },
  { to: '/dashboard/project/new', label: 'Upload Proyek', icon: Palette },
]

export default function StaffDashboard() {
  const { profile } = useAuth()
  const [counts, setCounts] = useState({ members: 0, achievements: 0, events: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('achievements').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('id', { count: 'exact', head: true }),
    ]).then(([m, a, e]) => setCounts({ members: m.count || 0, achievements: a.count || 0, events: e.count || 0 }))
  }, [])

  const role = profile?.role || ''
  const isDivision = (div) => role.includes(div.toLowerCase())

  return (
    <DashboardLayout sidebarLinks={STAFF_SIDEBAR} title={`Staff Dashboard – ${role.toUpperCase()}`}>
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <StatCard label="Total Anggota" value={counts.members} icon={Users} color="var(--color-primary)" />
        <StatCard label="Total Prestasi" value={counts.achievements} icon={Trophy} color="#E63946" />
        <StatCard label="Total Event" value={counts.events} icon={Calendar} color="var(--color-accent)" />
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {isDivision('heg') || role === 'bph' ? <Link to="/staff/heg" className="btn btn-primary">HEG Panel</Link> : null}
        {(role.includes('cda') || role === 'bph') ? <Link to="/staff/cda" className="btn btn-outline">CDA Panel</Link> : null}
        {role === 'bph' ? <Link to="/staff/bph" className="btn btn-outline">BPH Panel</Link> : null}
        {(isDivision('korvoks') || role === 'bph') ? <Link to="/staff/korvoks" className="btn btn-outline">KORVOKS Panel</Link> : null}
        <Link to="/admin" className="btn btn-accent" style={{ display: (role === 'mbd (web developer)' || role === 'bph') ? 'inline-flex' : 'none' }}>
          Kelola Konten Web
        </Link>
      </div>
    </DashboardLayout>
  )
}

export { STAFF_SIDEBAR }
