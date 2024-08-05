const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authenticate = require("../middlewares/protect")

router.use(authenticate)

router.get("/getAll", bookingController.getAll);
router.get("/find/:id", bookingController.getById);
router.post("/create", bookingController.create);
router.put("/update/:id", bookingController.update);
router.delete("/delete/:id", bookingController.delete);

module.exports = router;