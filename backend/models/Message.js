const mongoose = require("mongoose")
const Schema = mongoose.Schema

const messageSchema = new Schema({
  text: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema)