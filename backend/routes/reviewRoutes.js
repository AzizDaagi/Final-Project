const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authenticate = require("../middlewares/protect");

router.use(authenticate);

router.get("/getAll", reviewController.getAll);
router.get("/find/:id", reviewController.getById);
router.post("/create", reviewController.create);
router.put("/update/:id", reviewController.update);
router.delete("/delete/:id", reviewController.delete);

module.exports = router;
