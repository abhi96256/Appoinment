// Working hours configuration
const WORKING_HOURS = {
  start: 9, // 9 AM
  end: 18,  // 6 PM
  breakStart: 12, // 12 PM
  breakEnd: 13    // 1 PM
};

export const generateTimeSlots = (serviceDuration, date) => {
  const slots = [];
  const slotDuration = serviceDuration;
  
  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingDate = new Date(date);
  bookingDate.setHours(0, 0, 0, 0);
  
  if (bookingDate < today) {
    return slots; // No slots for past dates
  }
  
  // Generate slots for the day
  for (let hour = WORKING_HOURS.start; hour < WORKING_HOURS.end; hour++) {
    // Skip lunch break
    if (hour >= WORKING_HOURS.breakStart && hour < WORKING_HOURS.breakEnd) {
      continue;
    }
    
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endHour = hour + Math.ceil(slotDuration / 60);
    const endTime = `${endHour.toString().padStart(2, '0')}:00`;
    
    // Don't create slots that would end after working hours
    if (endHour <= WORKING_HOURS.end) {
      slots.push({
        startTime,
        endTime,
        duration: slotDuration
      });
    }
  }
  
  return slots;
};

export const isSlotAvailable = (bookings, date, startTime, endTime) => {
  return !bookings.some(booking => {
    const bookingDate = new Date(booking.bookingDate).toISOString().split('T')[0];
    const targetDate = new Date(date).toISOString().split('T')[0];
    
    if (bookingDate !== targetDate) return false;
    
    const bookingStart = booking.startTime;
    const bookingEnd = booking.endTime;
    
    // Check for time overlap
    return (
      (startTime >= bookingStart && startTime < bookingEnd) ||
      (endTime > bookingStart && endTime <= bookingEnd) ||
      (startTime <= bookingStart && endTime >= bookingEnd)
    );
  });
};

export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};
