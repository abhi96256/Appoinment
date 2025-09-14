import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isToday, isFuture, isPast } from 'date-fns';
import { bookingsAPI } from '../services/api';
import toast from 'react-hot-toast';
import AnimatedBackground from '../components/AnimatedBackground';
import FloatingElements from '../components/FloatingElements';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [customerEmail, setCustomerEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(true);

  useEffect(() => {
    // Check if email is stored in localStorage
    const storedEmail = localStorage.getItem('customerEmail');
    if (storedEmail) {
      setCustomerEmail(storedEmail);
      setShowEmailForm(false);
      fetchBookings(storedEmail);
    }
  }, []);

  const fetchBookings = async (email) => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getByEmail(email);
      setBookings(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!customerEmail) {
      toast.error('Please enter your email address');
      return;
    }
    localStorage.setItem('customerEmail', customerEmail);
    setShowEmailForm(false);
    fetchBookings(customerEmail);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsAPI.cancel(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings(customerEmail);
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

  const getStatusBadge = (status, bookingDate, startTime) => {
    const bookingDateTime = new Date(`${bookingDate}T${startTime}`);
    const isBookingToday = isToday(bookingDateTime);
    const isBookingFuture = isFuture(bookingDateTime);
    const isBookingPast = isPast(bookingDateTime);

    let badgeClass = '';
    let badgeText = '';

    if (status === 'cancelled') {
      badgeClass = 'bg-red-100 text-red-800';
      badgeText = 'Cancelled';
    } else if (status === 'completed') {
      badgeClass = 'bg-blue-100 text-blue-800';
      badgeText = 'Completed';
    } else if (isBookingPast) {
      badgeClass = 'bg-gray-100 text-gray-800';
      badgeText = 'Past';
    } else if (isBookingToday) {
      badgeClass = 'bg-green-100 text-green-800';
      badgeText = 'Today';
    } else if (isBookingFuture) {
      badgeClass = 'bg-yellow-100 text-yellow-800';
      badgeText = 'Upcoming';
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
        {badgeText}
      </span>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') {
      const bookingDateTime = new Date(`${booking.bookingDate}T${booking.startTime}`);
      return booking.status === 'confirmed' && isFuture(bookingDateTime);
    } else if (activeTab === 'past') {
      const bookingDateTime = new Date(`${booking.bookingDate}T${booking.startTime}`);
      return isPast(bookingDateTime) || booking.status === 'completed';
    } else if (activeTab === 'cancelled') {
      return booking.status === 'cancelled';
    }
    return true;
  });

  const upcomingBookings = bookings.filter(booking => {
    const bookingDateTime = new Date(`${booking.bookingDate}T${booking.startTime}`);
    return booking.status === 'confirmed' && isFuture(bookingDateTime);
  });

  const todayBookings = bookings.filter(booking => {
    const bookingDateTime = new Date(`${booking.bookingDate}T${booking.startTime}`);
    return booking.status === 'confirmed' && isToday(bookingDateTime);
  });

  if (showEmailForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        <AnimatedBackground />
        <FloatingElements />
        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="max-w-md w-full">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  My Bookings
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Enter your email to view your appointment history
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  View My Bookings
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <AnimatedBackground />
      <FloatingElements />
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                My Bookings
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Welcome back! Here are your appointment details.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 hover:shadow-xl transition-all duration-200"
              >
                Book New Service
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('customerEmail');
                  setShowEmailForm(true);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200"
              >
                Switch Account
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingBookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayBookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 mb-8">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'upcoming', label: 'Upcoming', count: upcomingBookings.length },
              { id: 'past', label: 'Past', count: bookings.filter(b => isPast(new Date(`${b.bookingDate}T${b.startTime}`)) || b.status === 'completed').length },
              { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No bookings found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {activeTab === 'upcoming' 
                  ? "You don't have any upcoming appointments."
                  : activeTab === 'past'
                  ? "You don't have any past appointments."
                  : "You don't have any cancelled appointments."
                }
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Book Your First Appointment
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.map((booking, index) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {booking.service.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {booking.service.name}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {format(new Date(booking.bookingDate), 'MMM d, yyyy')} at {formatTime(booking.startTime)}
                            </p>
                            <p className="text-sm font-semibold text-green-600">
                              ₹{booking.service.price}
                            </p>
                            {getStatusBadge(booking.status, booking.bookingDate, booking.startTime)}
                          </div>
                          {booking.notes && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Note: {booking.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {booking.status === 'confirmed' && isFuture(new Date(`${booking.bookingDate}T${booking.startTime}`)) && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      )}
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Confirmation: {booking.confirmationCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

