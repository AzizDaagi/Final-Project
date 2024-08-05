const mongoose = require("mongoose")
const Schema = mongoose.Schema

const conversationSchema = new Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Conversation", conversationSchema)