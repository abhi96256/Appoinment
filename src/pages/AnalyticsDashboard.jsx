import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookingsAPI, reviewsAPI } from '../services/api';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import AnimatedBackground from '../components/AnimatedBackground';
import FloatingElements from '../components/FloatingElements';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    revenue: { current: 0, previous: 0, growth: 0 },
    bookings: { current: 0, previous: 0, growth: 0 },
    customers: { current: 0, previous: 0, growth: 0 },
    reviews: { average: 0, total: 0, distribution: {} },
    topServices: [],
    monthlyData: [],
    hourlyData: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = timeRange === '7d' ? 
        new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000) :
        timeRange === '30d' ?
        new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000) :
        startOfMonth(subMonths(endDate, 1));

      const [bookingsRes, reviewsRes] = await Promise.all([
        bookingsAPI.getAll({ 
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        }),
        reviewsAPI.getAll()
      ]);

      const bookings = bookingsRes.data.data || [];
      const reviews = reviewsRes.data.data || [];

      // Calculate analytics
      const currentRevenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + parseFloat(b.service.price), 0);

      const previousRevenue = currentRevenue * 0.8; // Mock previous data
      const revenueGrowth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;

      const currentBookings = bookings.length;
      const previousBookings = Math.floor(currentBookings * 0.9);
      const bookingGrowth = ((currentBookings - previousBookings) / previousBookings) * 100;

      const uniqueCustomers = new Set(bookings.map(b => b.customerEmail)).size;
      const previousCustomers = Math.floor(uniqueCustomers * 0.85);
      const customerGrowth = ((uniqueCustomers - previousCustomers) / previousCustomers) * 100;

      // Service popularity
      const serviceCounts = {};
      bookings.forEach(b => {
        serviceCounts[b.service.name] = (serviceCounts[b.service.name] || 0) + 1;
      });
      const topServices = Object.entries(serviceCounts)
        .map(([name, count]) => ({ name, count, revenue: count * 50 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Review analytics
      const reviewStats = reviews.reduce((acc, review) => {
        acc.total += 1;
        acc.sum += review.rating;
        acc.distribution[review.rating] = (acc.distribution[review.rating] || 0) + 1;
        return acc;
      }, { total: 0, sum: 0, distribution: {} });

      const averageRating = reviewStats.total > 0 ? reviewStats.sum / reviewStats.total : 0;

      // Monthly data (mock)
      const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: format(new Date(2024, i), 'MMM'),
        revenue: Math.floor(Math.random() * 5000) + 2000,
        bookings: Math.floor(Math.random() * 100) + 50
      }));

      // Hourly data (mock)
      const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        bookings: Math.floor(Math.random() * 10) + 1
      }));

      setAnalytics({
        revenue: { current: currentRevenue, previous: previousRevenue, growth: revenueGrowth },
        bookings: { current: currentBookings, previous: previousBookings, growth: bookingGrowth },
        customers: { current: uniqueCustomers, previous: previousCustomers, growth: customerGrowth },
        reviews: { average: averageRating, total: reviewStats.total, distribution: reviewStats.distribution },
        topServices,
        monthlyData,
        hourlyData
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return '📈';
    if (growth < 0) return '📉';
    return '➡️';
  };

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
                📊 Advanced Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Deep insights into your business performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ₹{analytics.revenue.current.toFixed(2)}
                </p>
                <div className={`flex items-center text-sm ${getGrowthColor(analytics.revenue.growth)}`}>
                  <span className="mr-1">{getGrowthIcon(analytics.revenue.growth)}</span>
                  {analytics.revenue.growth.toFixed(1)}% vs previous
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analytics.bookings.current}
                </p>
                <div className={`flex items-center text-sm ${getGrowthColor(analytics.bookings.growth)}`}>
                  <span className="mr-1">{getGrowthIcon(analytics.bookings.growth)}</span>
                  {analytics.bookings.growth.toFixed(1)}% vs previous
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Customers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analytics.customers.current}
                </p>
                <div className={`flex items-center text-sm ${getGrowthColor(analytics.customers.growth)}`}>
                  <span className="mr-1">{getGrowthIcon(analytics.customers.growth)}</span>
                  {analytics.customers.growth.toFixed(1)}% vs previous
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analytics.reviews.average.toFixed(1)}⭐
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {analytics.reviews.total} reviews
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
            <div className="h-64 flex items-end space-x-2">
              {analytics.monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                    style={{ height: `${(data.revenue / 7000) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Services */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Services</h3>
            <div className="space-y-4">
              {analytics.topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{service.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{service.count} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">₹{service.revenue}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Booking Distribution by Hour</h3>
          <div className="h-32 flex items-end space-x-1">
            {analytics.hourlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t"
                  style={{ height: `${(data.bookings / 10) * 100}px` }}
                ></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{data.hour}:00</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

