import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import MessagesPage from '../pages/admin/MessagesPage';
import LeaguesPage from '../pages/admin/LeaguesPage';
import ScoresPage from '../pages/admin/ScoresPage';
import HoursPage from '../pages/admin/HoursPage';
import AnnouncementsPage from '../pages/admin/AnnouncementsPage';
import TournamentsPage from '../pages/admin/TournamentsPage';
import CafeMenuPage from '../pages/admin/CafeMenuPage';
import ContactPage from '../pages/ContactPage';
import EmploymentPage from '../pages/EmploymentPage';
import EmploymentApplicationsPage from '../pages/admin/EmploymentApplicationsPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/employment" element={<EmploymentPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="leagues" element={<LeaguesPage />} />
          <Route path="scores" element={<ScoresPage />} />
          <Route path="hours" element={<HoursPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="tournaments" element={<TournamentsPage />} />
          <Route path="cafe-menu" element={<CafeMenuPage />} />
          <Route path="applications" element={<EmploymentApplicationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}