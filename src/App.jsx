import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Public pages
import Home from './pages/Home'
import CompetitionPage from './pages/Competition'
import EventPage from './pages/Events'
import FacilitiesPage from './pages/Facilities'
import AboutPage from './pages/About'
import FAQPage from './pages/FAQ'
import LoginPage from './pages/auth/Login'

// Member dashboard
import MemberDashboard from './pages/member/Dashboard'
import UploadAchievement from './pages/member/UploadAchievement'
import UploadProject from './pages/member/UploadProject'
import MyEvents from './pages/member/MyEvents'
import MyCompetitions from './pages/member/MyCompetitions'
import MyPlan from './pages/member/MyPlan'

// Staff dashboards
import StaffDashboard from './pages/staff/Dashboard'
import HEGDashboard from './pages/staff/HEG'
import CDADashboard from './pages/staff/CDA'
import BPHDashboard from './pages/staff/BPH'
import KORVOKSDashboard from './pages/staff/KORVOKS'

// Admin (Web Dev)
import AdminDashboard from './pages/admin/Dashboard'

import { Spinner } from './components/ui/Spinner'

const PrivateRoute = ({ children, roles }) => {
  const { user, profile, loading } = useAuth()
  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(profile?.role) && !roles.includes(profile?.division)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export default function App() {
  const { profile } = useAuth()

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/competitions" element={<CompetitionPage />} />
      <Route path="/events" element={<EventPage />} />
      <Route path="/facilities" element={<FacilitiesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Member dashboard */}
      <Route path="/dashboard" element={<PrivateRoute><MemberDashboard /></PrivateRoute>} />
      <Route path="/dashboard/achievement/new" element={<PrivateRoute><UploadAchievement /></PrivateRoute>} />
      <Route path="/dashboard/project/new" element={<PrivateRoute><UploadProject /></PrivateRoute>} />
      <Route path="/dashboard/events" element={<PrivateRoute><MyEvents /></PrivateRoute>} />
      <Route path="/dashboard/competitions" element={<PrivateRoute><MyCompetitions /></PrivateRoute>} />
      <Route path="/dashboard/plan" element={<PrivateRoute><MyPlan /></PrivateRoute>} />

      {/* Staff dashboards */}
      <Route path="/staff" element={<PrivateRoute roles={['bph','heg','cda','cda (bisnis)','cda (desain)','cda (penulisan)','cda (olimpiade)','mbd','mbd (ilustrator)','mbd (desain grafis)','mbd (video editor)','mbd (multimedia)','korvoks']}><StaffDashboard /></PrivateRoute>} />
      <Route path="/staff/heg" element={<PrivateRoute roles={['heg','bph']}><HEGDashboard /></PrivateRoute>} />
      <Route path="/staff/cda" element={<PrivateRoute roles={['cda','cda (bisnis)','cda (desain)','cda (penulisan)','cda (olimpiade)','bph']}><CDADashboard /></PrivateRoute>} />
      <Route path="/staff/bph" element={<PrivateRoute roles={['bph']}><BPHDashboard /></PrivateRoute>} />
      <Route path="/staff/korvoks" element={<PrivateRoute roles={['korvoks','bph']}><KORVOKSDashboard /></PrivateRoute>} />

      {/* Admin CMS – Web Dev (Kadiv Web) */}
      <Route path="/admin" element={<PrivateRoute roles={['mbd (web developer)','bph']}><AdminDashboard /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
