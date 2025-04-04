const cron = require('node-cron');
const mongoose = require('mongoose');
const Booking = require('../models/booking');
const { NOTIFICATION_TYPES, sendNotification } = require('./notificationService');

/**
 * Initialize scheduled tasks for the application
 */
const initializeScheduledTasks = () => {
  console.log('Initializing scheduled tasks for notifications');
  
  // Schedule booking reminders - runs every day at 10:00 AM
  cron.schedule('0 10 * * *', async () => {
    console.log('Running scheduled task: Booking reminders');
    await sendBookingReminders();
  });

  // Schedule promotional offers - runs every Monday at 9:00 AM
  cron.schedule('0 9 * * 1', async () => {
    console.log('Running scheduled task: Promotional offers');
    await sendPromotionalOffers();
  });
};

/**
 * Send booking reminders for journeys scheduled for the next day
 */
const sendBookingReminders = async () => {
  try {
    // Calculate tomorrow's date in the format stored in database
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateString = tomorrow.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Find all bookings for tomorrow that are not cancelled
    const bookingsForTomorrow = await Booking.find({
      bookingDate: tomorrowDateString,
      status: { $ne: 'Cancelled' }
    }).lean();
    
    console.log(`Found ${bookingsForTomorrow.length} bookings for tomorrow, sending reminders...`);
    
    // Send reminder notification for each booking
    const notificationPromises = bookingsForTomorrow.map(booking => {
      const customerName = booking.passengerDetails[0]?.name || 'Valued Customer';
      
      return sendNotification({
        type: NOTIFICATION_TYPES.BOOKING_REMINDER,
        data: {
          bookingId: booking._id,
          customerName,
          email: booking.email,
          phoneNumber: booking.phoneNumber,
          bookingDate: booking.bookingDate,
          busDetails: `Bus ID: ${booking.busId}`,
          seats: booking.seats,
          userId: booking.customerId
        },
        channels: {
          email: true,
          sms: true,
          push: false
        }
      });
    });
    
    await Promise.allSettled(notificationPromises);
    console.log('Booking reminders sent successfully');
  } catch (error) {
    console.error('Error sending booking reminders:', error);
  }
};

/**
 * Send promotional offers to customers who have booked in the past
 * This is a simplified implementation - in a real system, this would use more 
 * sophisticated targeting based on user behavior, preferences, etc.
 */
const sendPromotionalOffers = async () => {
  try {
    // Find all unique customers who have booked in the last 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const bookings = await Booking.find({
      createdAt: { $gte: threeMonthsAgo }
    }).lean();
    
    // Create a map to deduplicate customers
    const customerMap = new Map();
    bookings.forEach(booking => {
      if (!customerMap.has(booking.customerId)) {
        customerMap.set(booking.customerId, {
          email: booking.email,
          phoneNumber: booking.phoneNumber,
          customerName: booking.passengerDetails[0]?.name || 'Valued Customer',
          userId: booking.customerId
        });
      }
    });
    
    console.log(`Found ${customerMap.size} unique customers for promotional offers`);
    
    // Sample promotional offers - in a real system, these could be personalized
    const promotionalOffers = [
      "10% off on your next booking! Use code REDBUS10",
      "Book a round trip and get 15% off on your return journey! Use code ROUNDTRIP15",
      "Special weekend discount: 20% off on all bookings for Saturday and Sunday. Use code WEEKEND20"
    ];
    
    // Send promotional offers to each unique customer
    const notificationPromises = Array.from(customerMap.values()).map(customer => {
      // Select a random offer for each customer
      const offerDetails = promotionalOffers[Math.floor(Math.random() * promotionalOffers.length)];
      
      return sendNotification({
        type: NOTIFICATION_TYPES.PROMOTIONAL_OFFER,
        data: {
          customerName: customer.customerName,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          offerDetails,
          userId: customer.userId
        },
        channels: {
          email: true,
          sms: false, // Avoid SMS spam for promotional content
          push: false
        }
      });
    });
    
    await Promise.allSettled(notificationPromises);
    console.log('Promotional offers sent successfully');
  } catch (error) {
    console.error('Error sending promotional offers:', error);
  }
};

module.exports = {
  initializeScheduledTasks,
  sendBookingReminders,
  sendPromotionalOffers
};