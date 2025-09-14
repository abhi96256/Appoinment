import nodemailer from 'nodemailer';

// Mock email service - replace with actual SendGrid implementation
const createTransporter = () => {
  if (process.env.SENDGRID_API_KEY) {
    // Real SendGrid implementation
    return nodemailer.createTransporter({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else {
    // Mock implementation for development
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }
};

export const sendConfirmationEmail = async (booking) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@appointment.com',
      to: booking.customerEmail,
      subject: `Booking Confirmation - ${booking.confirmationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Booking Confirmation</h2>
          <p>Dear ${booking.customerName},</p>
          <p>Your appointment has been confirmed with the following details:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Appointment Details</h3>
            <p><strong>Service:</strong> ${booking.service.name}</p>
            <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
            <p><strong>Duration:</strong> ${booking.service.duration} minutes</p>
            <p><strong>Price:</strong> $${booking.service.price}</p>
            <p><strong>Confirmation Code:</strong> ${booking.confirmationCode}</p>
          </div>
          
          <p>Please arrive 10 minutes before your scheduled time.</p>
          <p>If you need to cancel or reschedule, please contact us with your confirmation code.</p>
          
          <p>Thank you for choosing our services!</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const sendCancellationEmail = async (booking) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@appointment.com',
      to: booking.customerEmail,
      subject: `Booking Cancelled - ${booking.confirmationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">Booking Cancelled</h2>
          <p>Dear ${booking.customerName},</p>
          <p>Your appointment has been cancelled:</p>
          
          <div style="background-color: #ffebee; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Cancelled Appointment</h3>
            <p><strong>Service:</strong> ${booking.service.name}</p>
            <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
            <p><strong>Confirmation Code:</strong> ${booking.confirmationCode}</p>
          </div>
          
          <p>If you would like to book a new appointment, please visit our website.</p>
          <p>Thank you for your understanding.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Cancellation email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Cancellation email sending failed:', error);
    throw error;
  }
};
