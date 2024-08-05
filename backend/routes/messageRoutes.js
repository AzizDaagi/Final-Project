const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authenticate = require("../middlewares/protect");

router.use(authenticate);

router.post("/send", messageController.send);
router.get("/getConversationMessages", messageController.getConversationMessages);

module.exports = router;
