const User = require("../models/User");
const { hashPassword } = require("../utils/crypt"); 

const userController = {};

// Create a user
userController.create = async (req, res) => {
  try {
    const { password, email, name, ...userData } = req.body;

    // Check if password provided
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email })
    if(existingUser){
      return res.status(400).json({error: "Email is already registered"})
    }

    // Hash the password 
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ ...userData, password: hashedPassword, email, name });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
userController.getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single user by ID
userController.getById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update and return the updated user
userController.update = async (req, res) => {
  try {
    const userId = req.params.id; // Extract userId from req.params
    const updateData = { ...req.body }; // Extract update data from req.body

    // Check if the user who wants to update is the owner of the profile
    if(userId !== req.user.id){
      return res.status(400).json({error: "Access denied"})
    }
    // Check if password is being updated
    if (updateData.password) {
      // Hash the new password
      updateData.password = await hashPassword(updateData.password);
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete a user by ID
userController.delete = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    // Check if the user who wants to update is the owner of the profile
    if (userId !== req.user.id) {
      return res.status(400).json({ error: "Access denied" });
    }

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = userController;
