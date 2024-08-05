const Message = require("../models/Message");

const messageController = {};
messageController.send = async (req, res) => {
  const text = req.body.text;
  const conversationId = req.body.conversation
  const senderId = req.body.sender
  const message = new Message({
    text,
    conversation: conversationId,
    sender: senderId,
  });
  try {
    await message.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error sending message" });
  }
};

messageController.getConversationMessages = async (req, res) => {
  const conversationId = req.params.id;
  try {
    const messages = await Message.find({
      conversation: conversationId,
    }).populate("sender");
    res.json(messages);
  } catch (err) {
    res.status(404).json({ message: "Conversation messages not found" });
  }
};

module.exports = messageController;
