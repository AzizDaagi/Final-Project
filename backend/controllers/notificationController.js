const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Booking = require("../models/Booking");

const notificationController = {};

notificationController.create = async (req, res) => {
  try {
    const { type, sender, receiver, booking, message } = req.body;

    // Validate required fields
    if (!type || !sender || !receiver || !booking) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const senderUser = await User.findById(sender);
    if (!senderUser) {
      return res.status(404).json({ error: "Sender not found" });
    }

    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    if (senderUser._id.equals(receiverUser._id)) {
      return res
        .status(400)
        .json({ error: "User cannot send a request to themselves" });
    }

    const newNotification = new Notification({
      type,
      sender,
      receiver,
      booking,
      message,
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get all notifications
notificationController.getAll = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get all notifications for a specific user
notificationController.getByUserId = async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from request parameters

    const notifications = await Notification.find({
      receiver: userId,
      $or: [
        { type: { $in: ["bookingAccepted", "bookingRejected"] } },
        { type: "bookingRequest", booking: { $exists: true } },
      ],
    }).populate({
      path: "booking",
      match: { status: "pending" },
    });

    // Filter out "bookingRequest" notifications without a pending booking
    const filteredNotifications = notifications.filter((notification) => {
      if (notification.type === "bookingRequest") {
        return notification.booking; // Only include if booking exists (and is "pending")
      }
      return true; // Include all other types
    });

    if (filteredNotifications.length === 0) {
      return res
        .status(404)
        .json({ error: "No notifications found for this user" });
    }

    return res.status(200).json(filteredNotifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Mark a notification as read
notificationController.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    } else {
      notification.read = true;
      await notification.save();
      return res.status(200).json(notification);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete a notification by his ID
notificationController.delete = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const deletedNotification = await Notification.findByIdAndDelete(
      notificationId
    );
    if (!deletedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    } else {
      return res.status(200).json(deletedNotification);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Accept or reject
notificationController.acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Find the booking and populate the property field
    const booking = await Booking.findById(bookingId).populate("property"); // Ensure 'property' is a reference in your schema

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update the booking status to accepted
    booking.status = "accepted";
    await booking.save();

    // Fetch the host ID from the populated property document
    const hostId = booking.property.host; // Ensure this field exists in your Property schema

    // Create a notification for the guest
    await Notification.create({
      sender: hostId,
      receiver: booking.guest,
      type: "bookingAccepted",
      booking: booking._id,
      message: `Your booking request for property "${booking.property.title}" has been Acceptedted.`, // Ensure 'title' field exists in your Property schema
    });

    res.status(200).json({ message: "Booking accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error accepting booking" });
  }
};

notificationController.rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Find the booking and populate the property field
    const booking = await Booking.findById(bookingId).populate("property"); // Ensure 'property' is a reference in your schema

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update the booking status to rejected
    booking.status = "rejected";
    await booking.save();

    // Fetch the host ID from the populated property document
    const hostId = booking.property.host; // Ensure this field exists in your Property schema

    // Create a notification for the guest
    await Notification.create({
      sender: hostId,
      receiver: booking.guest,
      type: "bookingRejected",
      booking: booking._id,
      message: `Your booking request for property "${booking.property.title}" has been rejected.`, // Ensure 'title' field exists in your Property schema
    });

    res.status(200).json({ message: "Booking rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error rejecting booking" });
  }
};

module.exports = notificationController;
