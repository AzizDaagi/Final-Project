const Property = require("../models/Property");
const User = require("../models/User")

const propertyController = {};
// Create a Property
propertyController.create = async (req, res) => {
  try {
    const {
      host: hostId,
      title,
      description,
      rooms,
      pricePerNight,
      availability,
    } = req.body;
    // Ensure the availability dates are parsed correctly
    const startDate = new Date(availability.startDate);
    const endDate = new Date(availability.endDate);

    // Check if host ID is provided
    if (!hostId) {
      return res.status(400).json({ error: "Host ID is required" });
    }

    // Check if the host exists in the database
    const existingHost = await User.findById(hostId);
    if (!existingHost) {
      return res.status(404).json({ error: "Host not found" });
    }

    // Handle file uploads
    const images = req.files ? req.files.map((file) => file.path) : [];

    // Create and save the property
    const newProperty = new Property({
      title,
      description,
      rooms,
      pricePerNight,
      location: {
        type: req.body.location.type,
        coordinates: req.body.location.coordinates,
      },
      images, // Store image paths
      availability: { startDate, endDate },
      host: hostId,
    });

    await newProperty.save();

    // Update the user role if necessary
    if (existingHost.role === "guest") {
      existingHost.role = "host";
      await existingHost.save();
    }

    res.status(201).json(newProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating property" });
  }
};
// Get all Properties
propertyController.getAll = async (req, res) => {
  try {
    const properties = await Property.find().populate("host", "name phone");
    res.status(200).json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching all the Properties" });
  }
};
// Get a property by ID
propertyController.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const property = await Property.findById(id).populate("host", "name phone");
    if (!property) {
      return res.status(404).json({ error: "property not found" });
    }
    return res.status(200).json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetchig a property" });
  }
};
// Search properties based on a querry
propertyController.search = async (req, res) => {
  try {
    const { lng, lat, radius = 20000, rooms, checkIn, checkOut } = req.query;

    console.log("Incoming query parameters:", {
      lng,
      lat,
      radius,
      rooms,
      checkIn,
      checkOut,
    });

    if (!lng || !lat) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    const query = {
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseFloat(radius),
        },
      },
    };

    if (rooms) {
      query.rooms = { $gte: parseInt(rooms) };
    }

    if (checkIn && checkOut) {
      query["availability.startDate"] = { $lte: new Date(checkIn) };
      query["availability.endDate"] = { $gte: new Date(checkIn) };
      query["availability.startDate"] = { $lte: new Date(checkOut) };
      query["availability.endDate"] = { $gte: new Date(checkOut) };
    }

    console.log("Query:", query);

    const properties = await Property.find(query).populate(
      "host",
      "name phone"
    );

    console.log("Properties found:", properties);

    res.status(200).json(properties);
  } catch (err) {
    console.error("Error searching properties:", err); // Log the error for debugging
    res.status(500).json({ error: "Error searching properties" });
  }
};

// Update a Property
propertyController.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(200).json(updatedProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating a Property" });
  }
};
// Delete a Property
propertyController.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(200).json(deletedProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting a Property" });
  }
};

module.exports = propertyController;