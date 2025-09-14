import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Translation data
const translations = {
  en: {
    // Navigation
    services: 'Services',
    myBookings: 'My Bookings',
    admin: 'Admin',
    adminLogin: 'Admin Login',
    logout: 'Logout',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    submit: 'Submit',
    book: 'Book',
    bookNow: 'Book Now',
    viewDetails: 'View Details',
    tryAgain: 'Try Again',
    
    // Services
    ourServices: 'Our Premium Services',
    serviceDescription: 'Choose from our range of professional services designed to meet your needs',
    liveBooking: 'Live Booking',
    instantConfirmation: 'Instant Confirmation',
    professionalService: 'Professional Service',
    available: 'Available',
    duration: 'Duration',
    price: 'Price',
    minutes: 'minutes',
    noServicesAvailable: 'No services available at the moment.',
    
    // Booking
    bookService: 'Book {serviceName}',
    selectDate: 'Select Date',
    availableTimes: 'Available Times',
    noAvailableSlots: 'No available slots for this date',
    customerInformation: 'Customer Information',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    notes: 'Notes (Optional)',
    specialRequests: 'Any special requests or notes',
    confirmBooking: 'Confirm Booking',
    bookingConfirmed: 'Booking confirmed! Check your email for details.',
    pleaseSelectTimeSlot: 'Please select a time slot',
    
    // Customer Dashboard
    myBookings: 'My Bookings',
    welcomeBack: 'Welcome back! Here are your appointment details.',
    upcoming: 'Upcoming',
    past: 'Past',
    cancelled: 'Cancelled',
    today: 'Today',
    total: 'Total',
    noBookingsFound: 'No bookings found',
    upcomingBookingsMessage: "You don't have any upcoming appointments.",
    pastBookingsMessage: "You don't have any past appointments.",
    cancelledBookingsMessage: "You don't have any cancelled appointments.",
    bookFirstAppointment: 'Book Your First Appointment',
    bookNewService: 'Book New Service',
    switchAccount: 'Switch Account',
    enterEmailToView: 'Enter your email to view your appointment history',
    confirmationCode: 'Confirmation Code',
    
    // Admin Dashboard
    adminDashboard: 'Admin Dashboard',
    welcomeBackAdmin: 'Welcome back, {email}',
    systemOnline: 'System Online',
    liveData: 'Live Data',
    totalBookings: 'Total Bookings',
    confirmed: 'Confirmed',
    services: 'Services',
    todaysRevenue: "Today's Revenue",
    advancedFilters: 'Advanced Filters',
    statusFilter: 'Status Filter',
    dateFilter: 'Date Filter',
    quickActions: 'Quick Actions',
    todays: "Today's",
    all: 'All',
    clearAll: 'Clear All',
    recentBookings: 'Recent Bookings',
    totalBookingsCount: '{count} total bookings',
    noBookingsFoundAdmin: 'No bookings found',
    bookingsWillAppear: 'Bookings will appear here once customers start making appointments.',
    customer: 'Customer',
    service: 'Service',
    dateTime: 'Date & Time',
    status: 'Status',
    actions: 'Actions',
    
    // Calendar
    calendarView: 'Calendar View',
    visualOverview: 'Visual overview of all bookings and appointments',
    month: 'Month',
    day: 'Day',
    thisMonth: 'This Month',
    selectDateToView: 'Select a date to view day details',
    
    // Reviews
    writeReview: 'Write a Review',
    customerReviews: 'Customer Reviews',
    howWouldYouRate: 'How would you rate this service?',
    tellUsAboutExperience: 'Tell us about your experience (Optional)',
    shareExperience: 'Share your experience with this service...',
    characters: 'characters',
    submitReview: 'Submit Review',
    submitting: 'Submitting...',
    reviewSubmitted: 'Review submitted successfully!',
    averageRating: 'Average Rating',
    noReviewsYet: 'No reviews yet',
    beFirstToReview: 'Be the first to review this service!',
    allReviews: 'All Reviews',
    stars: 'Stars',
    excellent: 'Excellent',
    veryGood: 'Very Good',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
    
    // Service Detail
    serviceInformation: 'Service Information',
    quickActions: 'Quick Actions',
    needHelp: 'Need Help?',
    callUsForAssistance: 'Call us for assistance',
    emailSupportAvailable: 'Email support available',
    bookThisService: 'Book This Service',
    viewMyBookings: 'View My Bookings',
    
    // Status
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    completed: 'Completed',
    past: 'Past',
    upcoming: 'Upcoming',
    today: 'Today'
  },
  
  hi: {
    // Navigation
    services: 'सेवाएं',
    myBookings: 'मेरी बुकिंग्स',
    admin: 'एडमिन',
    adminLogin: 'एडमिन लॉगिन',
    logout: 'लॉगआउट',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    save: 'सेव करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    back: 'वापस',
    next: 'अगला',
    previous: 'पिछला',
    search: 'खोजें',
    filter: 'फिल्टर',
    clear: 'साफ करें',
    submit: 'जमा करें',
    book: 'बुक करें',
    bookNow: 'अभी बुक करें',
    viewDetails: 'विवरण देखें',
    tryAgain: 'फिर से कोशिश करें',
    
    // Services
    ourServices: 'हमारी प्रीमियम सेवाएं',
    serviceDescription: 'अपनी आवश्यकताओं को पूरा करने के लिए डिज़ाइन की गई हमारी पेशेवर सेवाओं की श्रृंखला से चुनें',
    liveBooking: 'लाइव बुकिंग',
    instantConfirmation: 'तत्काल पुष्टि',
    professionalService: 'पेशेवर सेवा',
    available: 'उपलब्ध',
    duration: 'अवधि',
    price: 'कीमत',
    minutes: 'मिनट',
    noServicesAvailable: 'फिलहाल कोई सेवा उपलब्ध नहीं है।',
    
    // Booking
    bookService: '{serviceName} बुक करें',
    selectDate: 'तारीख चुनें',
    availableTimes: 'उपलब्ध समय',
    noAvailableSlots: 'इस तारीख के लिए कोई उपलब्ध स्लॉट नहीं',
    customerInformation: 'ग्राहक जानकारी',
    fullName: 'पूरा नाम',
    emailAddress: 'ईमेल पता',
    phoneNumber: 'फोन नंबर',
    notes: 'नोट्स (वैकल्पिक)',
    specialRequests: 'कोई विशेष अनुरोध या नोट्स',
    confirmBooking: 'बुकिंग की पुष्टि करें',
    bookingConfirmed: 'बुकिंग की पुष्टि हो गई! विवरण के लिए अपना ईमेल देखें।',
    pleaseSelectTimeSlot: 'कृपया एक समय स्लॉट चुनें',
    
    // Customer Dashboard
    myBookings: 'मेरी बुकिंग्स',
    welcomeBack: 'वापस स्वागत है! यहां आपकी अपॉइंटमेंट जानकारी है।',
    upcoming: 'आगामी',
    past: 'पिछली',
    cancelled: 'रद्द',
    today: 'आज',
    total: 'कुल',
    noBookingsFound: 'कोई बुकिंग नहीं मिली',
    upcomingBookingsMessage: 'आपकी कोई आगामी अपॉइंटमेंट नहीं है।',
    pastBookingsMessage: 'आपकी कोई पिछली अपॉइंटमेंट नहीं है।',
    cancelledBookingsMessage: 'आपकी कोई रद्द अपॉइंटमेंट नहीं है।',
    bookFirstAppointment: 'अपनी पहली अपॉइंटमेंट बुक करें',
    bookNewService: 'नई सेवा बुक करें',
    switchAccount: 'खाता बदलें',
    enterEmailToView: 'अपनी अपॉइंटमेंट हिस्ट्री देखने के लिए अपना ईमेल दर्ज करें',
    confirmationCode: 'पुष्टिकरण कोड',
    
    // Admin Dashboard
    adminDashboard: 'एडमिन डैशबोर्ड',
    welcomeBackAdmin: 'वापस स्वागत है, {email}',
    systemOnline: 'सिस्टम ऑनलाइन',
    liveData: 'लाइव डेटा',
    totalBookings: 'कुल बुकिंग्स',
    confirmed: 'पुष्टि की गई',
    services: 'सेवाएं',
    todaysRevenue: 'आज की आय',
    advancedFilters: 'उन्नत फिल्टर',
    statusFilter: 'स्थिति फिल्टर',
    dateFilter: 'तारीख फिल्टर',
    quickActions: 'त्वरित क्रियाएं',
    todays: 'आज की',
    all: 'सभी',
    clearAll: 'सभी साफ करें',
    recentBookings: 'हाल की बुकिंग्स',
    totalBookingsCount: '{count} कुल बुकिंग्स',
    noBookingsFoundAdmin: 'कोई बुकिंग नहीं मिली',
    bookingsWillAppear: 'ग्राहकों के अपॉइंटमेंट बनाने के बाद बुकिंग्स यहां दिखाई देंगी।',
    customer: 'ग्राहक',
    service: 'सेवा',
    dateTime: 'तारीख और समय',
    status: 'स्थिति',
    actions: 'क्रियाएं',
    
    // Calendar
    calendarView: 'कैलेंडर दृश्य',
    visualOverview: 'सभी बुकिंग्स और अपॉइंटमेंट्स का दृश्य अवलोकन',
    month: 'महीना',
    day: 'दिन',
    thisMonth: 'इस महीने',
    selectDateToView: 'दिन का विवरण देखने के लिए एक तारीख चुनें',
    
    // Reviews
    writeReview: 'समीक्षा लिखें',
    customerReviews: 'ग्राहक समीक्षाएं',
    howWouldYouRate: 'आप इस सेवा को कैसे रेट करेंगे?',
    tellUsAboutExperience: 'अपने अनुभव के बारे में बताएं (वैकल्पिक)',
    shareExperience: 'इस सेवा के साथ अपना अनुभव साझा करें...',
    characters: 'वर्ण',
    submitReview: 'समीक्षा जमा करें',
    submitting: 'जमा हो रहा है...',
    reviewSubmitted: 'समीक्षा सफलतापूर्वक जमा हो गई!',
    averageRating: 'औसत रेटिंग',
    noReviewsYet: 'अभी तक कोई समीक्षा नहीं',
    beFirstToReview: 'इस सेवा की पहली समीक्षा करें!',
    allReviews: 'सभी समीक्षाएं',
    stars: 'सितारे',
    excellent: 'उत्कृष्ट',
    veryGood: 'बहुत अच्छा',
    good: 'अच्छा',
    fair: 'ठीक',
    poor: 'खराब',
    
    // Service Detail
    serviceInformation: 'सेवा जानकारी',
    quickActions: 'त्वरित क्रियाएं',
    needHelp: 'मदद चाहिए?',
    callUsForAssistance: 'सहायता के लिए हमें कॉल करें',
    emailSupportAvailable: 'ईमेल सहायता उपलब्ध',
    bookThisService: 'इस सेवा को बुक करें',
    viewMyBookings: 'मेरी बुकिंग्स देखें',
    
    // Status
    confirmed: 'पुष्टि की गई',
    cancelled: 'रद्द',
    completed: 'पूर्ण',
    past: 'पिछली',
    upcoming: 'आगामी',
    today: 'आज'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key, params = {}) => {
    let translation = translations[language][key] || translations.en[key] || key;
    
    // Replace parameters in translation
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
    
    return translation;
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const value = {
    language,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
