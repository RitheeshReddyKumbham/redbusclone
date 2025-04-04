const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const { NOTIFICATION_TYPES, sendNotification } = require("../services/notificationService");

/**
 * Cancel a booking and send notification
 */
router.post("/booking/:id/cancel", async(req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);
        
        if (!booking) {
            return res.status(404).send({ error: "Booking not found" });
        }
        
        // Update booking status to cancelled
        booking.status = "Cancelled";
        await booking.save();
        
        // Calculate refund amount based on cancellation policy
        // This is a simple example - real implementation would be more complex
        const refundAmount = booking.fare * 0.8; // 80% refund
        
        // Send cancellation notification
        try {
            // First passenger's name is used as customer name for notification
            const customerName = booking.passengerDetails[0]?.name || 'Valued Customer';
            
            await sendNotification({
                type: NOTIFICATION_TYPES.BOOKING_CANCELLATION,
                data: {
                    bookingId: booking._id,
                    customerName: customerName,
                    email: booking.email,
                    phoneNumber: booking.phoneNumber,
                    refundAmount: refundAmount,
                    refundStatus: "Processing",
                    userId: booking.customerId
                },
                channels: {
                    email: true,
                    sms: true,
                    push: false
                }
            });
            
            console.log("Booking cancellation notification sent successfully");
        } catch (notificationError) {
            console.error("Failed to send booking cancellation notification:", notificationError);
            // Continue execution even if notification fails
        }
        
        res.send({ 
            message: "Booking cancelled successfully", 
            booking,
            refundAmount,
            refundStatus: "Processing"
        });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).send({ error: "Failed to cancel booking" });
    }
});

module.exports = router;