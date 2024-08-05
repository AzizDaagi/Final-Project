const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema(
  {
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (v) {
            return v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90; // Longitude: -180 to 180, Latitude: -90 to 90
          },
          message: "Invalid coordinates",
        },
      },
    },
    rooms: { type: Number, required: true },
    pricePerNight: { type: Number, required: true },
    images: { type: [String], default: [] },
    availability: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },
  },
  {
    timestamps: true,
  }
);

// Add geospatial index
propertySchema.index({ location: "2dsphere" });
propertySchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Property", propertySchema);
