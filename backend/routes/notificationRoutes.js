const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authenticate = require("../middlewares/protect");

// router.use(authenticate);

router.get("/getAll", notificationController.getAll);
router.get("/find/:id", notificationController.getByUserId);
router.post("/create", notificationController.create);
router.patch("/markAsRead/:id", notificationController.markAsRead);
router.delete("/delete/:id", notificationController.delete);
router.post("/accept", notificationController.acceptBooking)
router.post("/reject", notificationController.rejectBooking)

module.exports = router;
