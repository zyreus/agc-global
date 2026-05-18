import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminShell from './components/admin/AdminShell.jsx'
import AdminOverview from './pages/AdminOverview.jsx'
import AdminMessages from './pages/AdminMessages.jsx'
import AdminAnnouncements from './pages/AdminAnnouncements.jsx'
import AdminSubscribers from './pages/AdminSubscribers.jsx'
import AdminCrm from './pages/AdminCrm.jsx'
import AdminLeads from './pages/AdminLeads.jsx'
import AdminFeedback from './pages/AdminFeedback.jsx'
import AdminSettings from './pages/AdminSettings.jsx'
import AdminModulePlaceholder from './pages/AdminModulePlaceholder.jsx'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-brand-background-alt text-brand-text transition-colors duration-300 dark:bg-brand-night dark:text-white/90">
      <div className="relative flex min-h-screen flex-col">
        {!isAdminRoute && (
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-brand-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
          >
            Skip to content
          </a>
        )}
        {!isAdminRoute && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminShell />}>
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="crm" element={<AdminCrm />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="subscribers" element={<AdminSubscribers />} />
            <Route path="workspace/:slug" element={<AdminModulePlaceholder />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <ScrollToTop />}
      </div>
    </div>
  )
}

export default App
