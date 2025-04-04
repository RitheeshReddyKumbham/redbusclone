const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Configuration for email service
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Configuration for SMS service
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Notification types
const NOTIFICATION_TYPES = {
  BOOKING_CONFIRMATION: 'booking_confirmation',
  BOOKING_CANCELLATION: 'booking_cancellation',
  BOOKING_REMINDER: 'booking_reminder',
  PROMOTIONAL_OFFER: 'promotional_offer'
};

/**
 * Send email notification
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email content in HTML format
 * @returns {Promise} - Promise object representing the email sending operation
 */
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };
    
    return await emailTransporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email notification error:', error);
    throw error;
  }
};

/**
 * Send SMS notification
 * @param {string} to - Recipient phone number
 * @param {string} body - SMS content
 * @returns {Promise} - Promise object representing the SMS sending operation
 */
const sendSMS = async (to, body) => {
  try {
    return await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
  } catch (error) {
    console.error('SMS notification error:', error);
    throw error;
  }
};

/**
 * Send push notification (placeholder for future implementation)
 * @param {string} userId - User ID for push notification
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @returns {Promise} - Promise object representing the push notification operation
 */
const sendPushNotification = async (userId, title, body) => {
  // This is a placeholder for actual push notification implementation
  // Would typically use Firebase Cloud Messaging or similar service
  console.log(`Push notification would be sent to user ${userId}: ${title} - ${body}`);
  return Promise.resolve({ success: true, userId, title, body });
};

/**
 * Generate notification content based on type and data
 * @param {string} type - Notification type
 * @param {Object} data - Data to include in the notification
 * @returns {Object} - Object containing subject and body for the notification
 */
const generateNotificationContent = (type, data) => {
  switch (type) {
    case NOTIFICATION_TYPES.BOOKING_CONFIRMATION:
      return {
        subject: 'Your Booking is Confirmed!',
        body: `Dear ${data.customerName},

Thank you for booking with us. Your booking reference is ${data.bookingId}.

Journey Details:
Date: ${data.bookingDate}
Bus: ${data.busDetails}
Seats: ${data.seats.join(', ')}
Fare: ${data.fare}

Have a safe journey!
RedBus Team`
      };
    
    case NOTIFICATION_TYPES.BOOKING_CANCELLATION:
      return {
        subject: 'Your Booking has been Cancelled',
        body: `Dear ${data.customerName},

Your booking (Ref: ${data.bookingId}) has been cancelled.

Refund Details: 
Amount: ${data.refundAmount}
Status: ${data.refundStatus}

If you have any questions, please contact our support team.
RedBus Team`
      };
      
    case NOTIFICATION_TYPES.BOOKING_REMINDER:
      return {
        subject: 'Reminder: Your Journey is Tomorrow',
        body: `Dear ${data.customerName},

This is a friendly reminder that your journey is scheduled for tomorrow.

Journey Details:
Date: ${data.bookingDate}
Bus: ${data.busDetails}
Seats: ${data.seats.join(', ')}

Have a safe journey!
RedBus Team`
      };
      
    case NOTIFICATION_TYPES.PROMOTIONAL_OFFER:
      return {
        subject: 'Special Offer Just for You!',
        body: `Dear ${data.customerName},

We have a special offer just for you!

${data.offerDetails}

Book now to avail this offer.
RedBus Team`
      };
      
    default:
      return {
        subject: 'RedBus Notification',
        body: 'This is a notification from RedBus.'
      };
  }
};

/**
 * Send notification via multiple channels
 * @param {Object} options - Notification options
 * @param {string} options.type - Notification type
 * @param {Object} options.data - Data related to the notification
 * @param {Object} options.channels - Channels to send notification through
 * @param {boolean} options.channels.email - Whether to send email
 * @param {boolean} options.channels.sms - Whether to send SMS
 * @param {boolean} options.channels.push - Whether to send push notification
 * @returns {Promise} - Promise resolving to an object with the results of each notification
 */
const sendNotification = async (options) => {
  const { type, data, channels } = options;
  const content = generateNotificationContent(type, data);
  const results = {};

  try {
    if (channels.email && data.email) {
      results.email = await sendEmail(data.email, content.subject, content.body.replace(/\n/g, '<br>'));
    }
    
    if (channels.sms && data.phoneNumber) {
      // Keep SMS content shorter
      const smsContent = content.body.split('\n\n')[0];
      results.sms = await sendSMS(data.phoneNumber, smsContent);
    }
    
    if (channels.push && data.userId) {
      results.push = await sendPushNotification(data.userId, content.subject, content.body);
    }
    
    return {
      success: true,
      results
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      success: false,
      error: error.message,
      results
    };
  }
};

module.exports = {
  NOTIFICATION_TYPES,
  sendNotification,
  sendEmail,
  sendSMS,
  sendPushNotification
};