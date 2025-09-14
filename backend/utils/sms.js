import twilio from 'twilio';

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Format phone number for international format
const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // If it starts with 0, replace with country code
  if (cleaned.startsWith('0')) {
    return `+91${cleaned.substring(1)}`;
  }
  
  // If it doesn't start with +, add +91 for India
  if (!cleaned.startsWith('+')) {
    return `+91${cleaned}`;
  }
  
  return cleaned;
};

// Send SMS notification
export const sendSMS = async (to, message) => {
  try {
    if (!accountSid || !authToken || !fromNumber) {
      console.log('SMS service not configured. Skipping SMS notification.');
      return { success: false, error: 'SMS service not configured' };
    }

    const formattedNumber = formatPhoneNumber(to);
    
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedNumber
    });

    console.log('SMS sent successfully:', result.sid);
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: error.message };
  }
};

// Send booking confirmation SMS
export const sendBookingConfirmationSMS = async (booking) => {
  const { customerName, service, bookingDate, startTime, confirmationCode } = booking;
  
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const message = `🎉 Booking Confirmed!

Hi ${customerName},

Your appointment for ${service.name} has been confirmed.

📅 Date: ${formatDate(bookingDate)}
🕐 Time: ${formatTime(startTime)}
💰 Price: ₹${service.price}
🔢 Confirmation Code: ${confirmationCode}

Thank you for choosing our services!

Best regards,
BookAppoint Team`;

  return await sendSMS(booking.customerPhone, message);
};

// Send booking reminder SMS
export const sendBookingReminderSMS = async (booking) => {
  const { customerName, service, bookingDate, startTime } = booking;
  
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const message = `⏰ Appointment Reminder!

Hi ${customerName},

This is a friendly reminder about your upcoming appointment.

📅 Date: ${formatDate(bookingDate)}
🕐 Time: ${formatTime(startTime)}
🛠️ Service: ${service.name}

Please arrive 10 minutes early.

See you soon!
BookAppoint Team`;

  return await sendSMS(booking.customerPhone, message);
};

// Send booking cancellation SMS
export const sendBookingCancellationSMS = async (booking) => {
  const { customerName, service, bookingDate, startTime } = booking;
  
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const message = `❌ Booking Cancelled

Hi ${customerName},

Your appointment for ${service.name} has been cancelled.

📅 Date: ${formatDate(bookingDate)}
🕐 Time: ${formatTime(startTime)}

We're sorry for any inconvenience. Please book again when convenient.

BookAppoint Team`;

  return await sendSMS(booking.customerPhone, message);
};

export default {
  sendSMS,
  sendBookingConfirmationSMS,
  sendBookingReminderSMS,
  sendBookingCancellationSMS
};

