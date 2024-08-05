const Conversation = require("../models/Conversation");

const conversationController = {};

conversationController.create = async (req, res) => {
  const { participants, booking } = req.body;
  const conversation = new Conversation({ participants, booking });
  try {
    await conversation.save();
    res.status(201).json({ message: "Conversation created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating conversation" });
  }
};

conversationController.find = async (req, res) => {
  const conversationId = req.params.id;
  try {
    const conversation = await Conversation.findById(conversationId).populate(
      "participants"
    );
    res.json(conversation);
  } catch (err) {
    res.status(404).json({ message: "Conversation not found" });
  }
};

conversationController.getAll = async(req, res) => {
    try {
      const conversations = await Conversation.find({ participants: req.user.id });
      res.json(conversations);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving conversations' });
    }
  }

module.exports = conversationController;
