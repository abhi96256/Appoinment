import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { format } from 'date-fns';

const ConfirmationPage = () => {
  const { confirmationCode } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooking();
  }, [confirmationCode]);

  const fetchBooking = async () => {
    try {
      // In a real app, you'd have an endpoint to get booking by confirmation code
      // For now, we'll simulate this
      setBooking({
        confirmationCode,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        service: {
          name: 'Haircut',
          duration: 30,
          price: 25.00
        },
        bookingDate: '2024-01-15',
        startTime: '10:00',
        endTime: '10:30',
        status: 'confirmed'
      });
    } catch (err) {
      setError('Booking not found');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || 'Booking not found'}</div>
        <Link to="/" className="btn-primary">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600">
          Your appointment has been successfully booked
        </p>
      </div>

      <div className="card">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Confirmation Code
          </h2>
          <div className="text-3xl font-mono font-bold text-primary-600 bg-primary-50 px-4 py-2 rounded-lg inline-block">
            {booking.confirmationCode}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Service:</span>
            <span className="text-gray-900">{booking.service.name}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Date:</span>
            <span className="text-gray-900">
              {format(new Date(booking.bookingDate), 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Time:</span>
            <span className="text-gray-900">
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Duration:</span>
            <span className="text-gray-900">{booking.service.duration} minutes</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Price:</span>
            <span className="text-gray-900 font-semibold">₹{booking.service.price}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Customer:</span>
            <span className="text-gray-900">{booking.customerName}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-900">{booking.customerEmail}</span>
          </div>
          
          <div className="flex justify-between py-2">
            <span className="font-medium text-gray-700">Status:</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Important Notes:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Please arrive 10 minutes before your scheduled time</li>
            <li>• A confirmation email has been sent to {booking.customerEmail}</li>
            <li>• Keep your confirmation code for reference</li>
            <li>• Contact us if you need to reschedule or cancel</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link to="/" className="btn-primary flex-1 text-center">
            Book Another Service
          </Link>
          <button
            onClick={() => window.print()}
            className="btn-secondary flex-1"
          >
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
