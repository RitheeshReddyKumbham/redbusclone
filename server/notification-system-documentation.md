# Advanced Notification System for RedBus Clone

This document provides an overview of the comprehensive notification system implemented for the RedBus clone application.

## Features

The notification system supports multiple channels:

1. **Email notifications** - Using Nodemailer with Gmail
2. **SMS notifications** - Using Twilio
3. **Push notifications** - Framework in place for future integration (currently logs to console)

The system covers the following notification types:

1. **Booking confirmations** - Sent immediately after booking creation
2. **Booking cancellations** - Sent when a booking is cancelled
3. **Booking reminders** - Scheduled to be sent one day before journey
4. **Promotional offers** - Scheduled to be sent weekly to customers

## Architecture

The system consists of the following components:

### 1. Notification Service (`notificationService.js`)

Core service that handles sending notifications through different channels:
- Email sending via Nodemailer
- SMS sending via Twilio
- Push notification framework (placeholder for future implementation)
- Content generation based on notification type
- Multi-channel notification distribution

### 2. Scheduler Service (`schedulerService.js`)

Handles scheduled notifications using node-cron:
- Booking reminders (daily at 10:00 AM)
- Promotional offers (every Monday at 9:00 AM)

### 3. Booking Controller Integration

The booking controller has been enhanced to:
- Send confirmation notifications on booking creation
- Send cancellation notifications when bookings are cancelled

### 4. Environment Configuration

Required environment variables:
- Email configuration (EMAIL_USER, EMAIL_PASS)
- Twilio configuration (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)
- MongoDB and server configuration

## Implementation Details

### Notification Types

The system defines several notification types:
- BOOKING_CONFIRMATION
- BOOKING_CANCELLATION
- BOOKING_REMINDER
- PROMOTIONAL_OFFER

Each type has specific templates for subject and body content.

### Integration Points

1. **Booking Creation**: When a new booking is created, a confirmation notification is sent
2. **Booking Cancellation**: When a booking is cancelled, a cancellation notification is sent
3. **Daily Reminder Job**: Checks for journeys scheduled for the next day and sends reminders
4. **Weekly Promotional Job**: Sends promotional offers to customers who have booked in the past 3 months

### Error Handling

The notification system includes robust error handling:
- Failed notifications are logged but don't block the primary booking operations
- Each notification channel has its own error handling
- The scheduler catches and logs errors without stopping the application

## Usage

For developers integrating with the notification system:

```javascript
const { NOTIFICATION_TYPES, sendNotification } = require('../services/notificationService');

// Example of sending a notification
await sendNotification({
  type: NOTIFICATION_TYPES.BOOKING_CONFIRMATION,
  data: {
    bookingId: booking._id,
    customerName: customerName,
    email: booking.email,
    phoneNumber: booking.phoneNumber,
    // other data specific to notification type
  },
  channels: {
    email: true,
    sms: true,
    push: false
  }
});
```

## Configuration

Before using the notification system, make sure to:

1. Create a `.env` file based on the provided `.env.example`
2. Set up Gmail credentials for email notifications
3. Set up a Twilio account for SMS notifications
4. Update the MongoDB connection string if needed

## Future Enhancements

1. Implement actual push notification service (Firebase Cloud Messaging)
2. Add notification preferences for users
3. Create notification templates in HTML for better email formatting
4. Add notification history and tracking
5. Implement retry mechanism for failed notifications