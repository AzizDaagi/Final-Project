const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");
const authenticate = require("../middlewares/protect");

router.use(authenticate);

router.post("/create", conversationController.create);
router.get("/getAll", conversationController.getAll);
router.get("/find/:id", conversationController.find);

module.exports = router;
