const Review = require("../models/Review");
const Property = require("../models/Property");
const User = require("../models/User");

const reviewController = {};

// Create a Review
reviewController.create = async (req, res) => {
  try {
    console.log(req.body)
    const property = await Property.findById(req.body.property);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const guest = await User.findById(req.body.guest);
    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }

    const review = new Review({
      property: property._id,
      guest: guest._id,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating review" });
  }
};

// Get all Reviews
reviewController.getAll = async (req, res) => {
  try {
    const reviews = await Review.find().populate("property guest");
    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching all reviews" });
  }
};

// Get a Review by ID
reviewController.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const review = await Review.findById(id).populate("property guest");
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching review" });
  }
};

// Update a Review
reviewController.update = async (req, res) => {
  try {
    const id = req.params.id;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const property = await Property.findById(req.body.property);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const guest = await User.findById(req.body.guest);
    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }

    review.property = property._id;
    review.guest = guest._id;
    review.rating = req.body.rating;
    review.comment = req.body.comment;

    await review.save();
    res.status(200).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating review" });
  }
};

// Delete a Review
reviewController.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting review" });
  }
};

module.exports = reviewController;