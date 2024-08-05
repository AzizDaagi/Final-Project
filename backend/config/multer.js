// multerConfig.js
const multer = require("multer");

// Configure storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Append timestamp to filename
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

module.exports = upload;
