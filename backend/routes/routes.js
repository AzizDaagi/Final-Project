const express = require("express")
const router = express.Router()

// Import all routes
const bookingRoutes = require("./bookingRoutes");
const userRoutes = require("./userRoutes");
const propertyRoutes = require("./propertyRoutes");
const reviewRoutes = require("./reviewRoutes");
const notificationRoutes = require("./notificationRoutes");
const conversationRoutes = require("./conversationRoutes");
const messageRoutes = require("./messageRoutes");
const authRoutes = require("./authRoutes")

// Defining route handlers
router.use("/bookings", bookingRoutes);
router.use("/users", userRoutes);
router.use("/properties", propertyRoutes);
router.use("/reviews", reviewRoutes);
router.use("/notifications", notificationRoutes);
router.use("/conversations", conversationRoutes);
router.use("/messages", messageRoutes);
router.use("/auth", authRoutes)

module.exports = router;