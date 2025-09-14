import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import AIChatbot from './components/AIChatbot';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminCalendar from './pages/AdminCalendar';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="App">
              <Toaster position="top-right" />
              <AIChatbot />
              <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/service/:serviceId" element={<Layout><ServiceDetailPage /></Layout>} />
            <Route path="/book/:serviceId" element={<Layout><BookingPage /></Layout>} />
            <Route path="/confirmation/:confirmationCode" element={<Layout><ConfirmationPage /></Layout>} />
            <Route path="/my-bookings" element={<Layout><CustomerDashboard /></Layout>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Layout><AdminDashboard /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/calendar" 
              element={
                <ProtectedRoute>
                  <Layout><AdminCalendar /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute>
                  <Layout><AnalyticsDashboard /></Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
