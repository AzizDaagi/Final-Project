const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");
const authenticate = require("../middlewares/protect");
const upload = require("../config/multer"); // Import multer configuration

// Apply authentication middleware to all routes
router.use(authenticate);

// Routes for Property operations
router.post("/create", upload.array("images"), propertyController.create); // Handle file uploads
router.get("/getAll", propertyController.getAll);
router.get("/find/:id", propertyController.getById);
router.put("/update/:id", propertyController.update);
router.delete("/delete/:id", propertyController.delete);
router.get("/search", propertyController.search);

module.exports = router;
