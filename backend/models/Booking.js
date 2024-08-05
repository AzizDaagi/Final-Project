const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bookingSchema = new Schema({
  property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
  guest: { type: Schema.Types.ObjectId, ref: "User", required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  }
},{
  timestamps:true
});

module.exports = mongoose.model("Booking", bookingSchema);
