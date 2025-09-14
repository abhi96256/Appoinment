import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import NotificationCenter from './NotificationCenter';
import DarkModeToggle from './DarkModeToggle';
import LanguageToggle from './LanguageToggle';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Top Navigation - Logo + Right Controls */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg -ml-[150px]">

                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 dark:group-hover:from-purple-400 dark:group-hover:to-blue-400 transition-all duration-300">
                  BookAppoint
                </h1>
              </Link>
            </div>
            
            {/* Right Side Controls */}
            <div className="flex items-center space-x-3 -mr-[150px]">
              {/* Notifications */}
              {user && <NotificationCenter />}
              
              {/* Language Toggle */}
              <LanguageToggle />
              
              {/* Dark Mode Toggle */}
              <DarkModeToggle />
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Left Sidebar - Fixed but Visible */}
        <div className={`fixed top-20 left-0 bottom-0 z-50 w-72 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 shadow-2xl border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header - Fixed */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                Navigation
              </h2>
            </div>

            {/* Navigation Links - No Scrolling */}
            <div className="flex-1 px-4 py-6 space-y-3 overflow-hidden">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-4 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl scale-105' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 ${
                  isActive('/') 
                    ? 'bg-white/20' 
                    : 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-600 dark:to-gray-500 group-hover:from-blue-200 group-hover:to-purple-200'
                }`}>
                  <span className="text-lg">🏠</span>
                </div>
                <div>
                  <div className="font-semibold">{t('services')}</div>
                  <div className="text-xs opacity-75">Browse all services</div>
                </div>
              </Link>
              
              <Link
                to="/my-bookings"
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-4 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  isActive('/my-bookings') 
                    ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-xl scale-105' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-gray-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 ${
                  isActive('/my-bookings') 
                    ? 'bg-white/20' 
                    : 'bg-gradient-to-r from-green-100 to-blue-100 dark:from-gray-600 dark:to-gray-500 group-hover:from-green-200 group-hover:to-blue-200'
                }`}>
                  <span className="text-lg">📅</span>
                </div>
                <div>
                  <div className="font-semibold">{t('myBookings')}</div>
                  <div className="text-xs opacity-75">View your appointments</div>
                </div>
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-4 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                      isActive('/admin') 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-xl scale-105' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-gray-700 dark:hover:to-gray-600'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 ${
                      isActive('/admin') 
                        ? 'bg-white/20' 
                        : 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-gray-600 dark:to-gray-500 group-hover:from-purple-200 group-hover:to-pink-200'
                    }`}>
                      <span className="text-lg">⚙️</span>
                    </div>
                    <div>
                      <div className="font-semibold">{t('admin')}</div>
                      <div className="text-xs opacity-75">Manage bookings</div>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setSidebarOpen(false);
                    }}
                    className="group flex items-center w-full px-4 py-4 rounded-2xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 bg-gradient-to-r from-red-100 to-pink-100 dark:from-gray-600 dark:to-gray-500 group-hover:from-red-200 group-hover:to-pink-200">
                      <span className="text-lg">🚪</span>
                    </div>
                    <div>
                      <div className="font-semibold">{t('logout')}</div>
                      <div className="text-xs opacity-75">Sign out</div>
                    </div>
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setSidebarOpen(false)}
                  className="group flex items-center px-4 py-4 rounded-2xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-600 dark:to-gray-500 group-hover:from-blue-200 group-hover:to-purple-200">
                    <span className="text-lg">🔐</span>
                  </div>
                  <div>
                    <div className="font-semibold">{t('adminLogin')}</div>
                    <div className="text-xs opacity-75">Admin access</div>
                  </div>
                </Link>
              )}
            </div>
            
            {/* Sidebar Footer - Fixed */}
            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 flex-shrink-0">
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">BookAppoint</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">v1.0.0</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

      {/* Main Content - With proper margin for fixed sidebar */}
        <main className="flex-1 lg:ml-72">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
