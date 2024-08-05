const Booking = require("../models/Booking")
const Property = require("../models/Property")
const User = require("../models/User")
const Notification = require("../models/Notification")

const bookingController = {}
// Create a Booking
bookingController.create = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const { checkInDate, checkOutDate, totalAmount, guest, property } =
      req.body;
    console.log("Extracted values:", {
      checkInDate,
      checkOutDate,
      totalAmount,
      guest,
      property,
    });

    if (!checkInDate || !checkOutDate || !totalAmount || !guest || !property) {
      console.log("Validation failed: Missing required fields.");
      return res.status(400).json({ error: "All fields are required" });
    }

    const propertyDoc = await Property.findById(property);
    console.log("Property document:", propertyDoc);

    const guestDoc = await User.findById(guest);
    console.log("Guest document:", guestDoc);

    if (!guestDoc) {
      console.log("Validation failed: Guest not found.");
      return res.status(404).json({ error: "Guest not found" });
    }
    if (!propertyDoc) {
      console.log("Validation failed: Property not found.");
      return res.status(404).json({ error: "Property not found" });
    }
    if (propertyDoc.host.toString() === guest) {
      console.log(
        "Validation failed: Guest cannot be the host of the property."
      );
      return res
        .status(400)
        .json({ error: "Guest cannot be the host of the property" });
    }

    const booking = new Booking({
      property: property,
      guest: guest,
      checkInDate,
      checkOutDate,
      totalAmount,
    });

    await booking.save();
    console.log("Booking saved successfully.");
    // Create a notification for the property owner
    const notification = new Notification({
      type: "bookingRequest",
      sender: guest,
      receiver: propertyDoc.host, // Property owner
      booking: booking._id,
      message: `You have a new booking request for property ${propertyDoc.title}.`,
    });

    await notification.save();
    console.log("Notification created successfully.");
    res.status(201).json({ message: "Booking created successfully!" });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Error creating booking" });
  }
};

// Get all Bookings
bookingController.getAll = async (req, res) => {
    try{
        const bookings = await Booking.find().populate("property guest")
        res.status(200).json(bookings)
    }
    catch(err){
        console.error(err)
        res.status(500).json({ error: "Error fetching all the bookings"})
    }
}
// Get a Booking by ID
bookingController.getById = async (req, res) => {
    try {
        const id = req.params.id
        const booking = await Booking.findById(id).populate("property guest")
        if(!booking){
            return res.status(404).json({ error: "booking not found"});
        }
        return res.status(200).json(booking);
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetchig a booking" });
    }
}
// Update a Booking
bookingController.update = async (req, res) => {
    try {
        const id = req.params.id
        const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if(!updatedBooking){
            return res.status(404).json({error: "Booking not found"})
        }
        res.status(200).json(updatedBooking)
    } 
    catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating a booking" });
    }
}
// Delete a Booking
bookingController.delete = async (req, res) => {
    try{
        const id = req.params.id
        const deletedBooking = await Booking.findByIdAndDelete(id)
        if(!deletedBooking){
            return res.status(404).json({error: "Booking not found"})
        }
        res.status(200).json(deletedBooking)
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deletting a booking" });
    }
}

module.exports = bookingController