import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    // Listen for real-time notifications
    newSocket.on('bookingCreated', (data) => {
      const notification = {
        id: Date.now(),
        type: 'booking',
        title: 'New Booking!',
        message: `${data.customerName} booked ${data.serviceName}`,
        timestamp: new Date(),
        unread: true
      };
      addNotification(notification);
      toast.success(`New booking: ${data.serviceName}`, {
        duration: 4000,
        icon: '📅'
      });
    });

    newSocket.on('bookingCancelled', (data) => {
      const notification = {
        id: Date.now(),
        type: 'cancellation',
        title: 'Booking Cancelled',
        message: `${data.customerName} cancelled ${data.serviceName}`,
        timestamp: new Date(),
        unread: true
      };
      addNotification(notification);
      toast.error(`Booking cancelled: ${data.serviceName}`, {
        duration: 4000,
        icon: '❌'
      });
    });

    newSocket.on('reviewAdded', (data) => {
      const notification = {
        id: Date.now(),
        type: 'review',
        title: 'New Review!',
        message: `${data.customerName} reviewed ${data.serviceName} (${data.rating}⭐)`,
        timestamp: new Date(),
        unread: true
      };
      addNotification(notification);
      toast.success(`New review: ${data.rating}⭐ for ${data.serviceName}`, {
        duration: 4000,
        icon: '⭐'
      });
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    socket,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;

