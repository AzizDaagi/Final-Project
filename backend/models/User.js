const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  profilePicture: String,
  role: { type:String,
    enum:["guest","host","admin"],
     default: "guest" }
},{
  timestamps:true
});

module.exports = mongoose.model('User', userSchema)