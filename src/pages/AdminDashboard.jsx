import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { bookingsAPI, servicesAPI } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import SearchBar from '../components/SearchBar';
import FloatingActionButton from '../components/FloatingActionButton';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    date: ''
  });
  const [stats, setStats] = useState({
    todayBookings: 0,
    weeklyRevenue: 0,
    popularService: 'None'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    fetchData();
  }, [filter]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = bookings.filter(booking =>
        booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  }, [searchQuery, bookings]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, servicesRes] = await Promise.all([
        bookingsAPI.getAll(filter),
        servicesAPI.getAll()
      ]);
      
      setBookings(bookingsRes.data.data);
      setServices(servicesRes.data.data);
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = bookingsRes.data.data.filter(b => b.bookingDate === today).length;
      const weeklyRevenue = bookingsRes.data.data
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + parseFloat(b.service.price), 0);
      const serviceCounts = {};
      bookingsRes.data.data.forEach(b => {
        serviceCounts[b.service.name] = (serviceCounts[b.service.name] || 0) + 1;
      });
      const popularService = Object.keys(serviceCounts).reduce((a, b) => 
        serviceCounts[a] > serviceCounts[b] ? a : b, 'None'
      );
      
      setStats({ todayBookings, weeklyRevenue, popularService });
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsAPI.cancel(bookingId);
      toast.success('Booking cancelled successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="px-6 py-8">
            <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    <div className="ml-4">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20 mb-2"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                ))}
          </div>
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-8">
        <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.email}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Online</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
      {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
            </div>
          </div>
        </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </p>
            </div>
          </div>
        </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Services</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{services.length}</p>
            </div>
          </div>
        </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.weeklyRevenue}</p>
            </div>
          </div>
        </div>
      </div>

        {/* Filters and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Bookings Management</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchBar 
                onSearch={setSearchQuery}
                placeholder="Search bookings..."
              />
              <div className="flex gap-2">
              <button
                onClick={() => navigate('/admin/calendar')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                  📅 Calendar
              </button>
              <button
                onClick={() => navigate('/admin/analytics')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                📊 Analytics
              </button>
              </div>
            </div>
        </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status Filter
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
            </select>
          </div>
          
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Filter
            </label>
            <input
              type="date"
              value={filter.date}
              onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
            <div className="flex items-end gap-2">
              <button
                onClick={() => setFilter({ status: 'confirmed', date: '' })}
                className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
              >
                Today's
              </button>
              <button
                onClick={() => setFilter({ status: '', date: '' })}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Clear
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {bookings.length} total bookings
            </div>
          </div>
        </div>
        
        {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No bookings found</h3>
              <p className="text-gray-500 dark:text-gray-400">Bookings will appear here once customers start making appointments.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                  </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Service
                  </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date & Time
                  </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                  </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                  </th>
                </tr>
              </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {booking.customerName.charAt(0)}
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.customerName}
                          </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                            {booking.customerEmail}
                            </div>
                        </div>
                      </div>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                          {booking.service.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.service.name}</div>
                            <div className="text-sm text-green-600 dark:text-green-400 font-medium">₹{booking.service.price}</div>
                          </div>
                      </div>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {format(new Date(booking.bookingDate), 'MMM d, yyyy')}
                      </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </div>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                            className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                            Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
      
      <FloatingActionButton />
    </div>
  );
};

export default AdminDashboard;
