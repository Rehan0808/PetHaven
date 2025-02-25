const multer = require("multer");
const path = require("path");

// For simplicity, store uploaded images in an "uploads" folder at project root:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists!
  },
  filename: (req, file, cb) => {
    // Append a timestamp or unique ID to avoid name conflicts
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
