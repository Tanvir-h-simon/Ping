const path = require("path");
const fs = require("fs");
const multer = require("multer");

function uploader(folder, allowedTypes, maxSize, errorMessage) {
  const UPLOAD_FOLDER = path.join(__dirname, "..", "public", folder);

  // Create the upload folder if it does not exist yet
  if (!fs.existsSync(UPLOAD_FOLDER)) {
    fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const filename =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now() +
        fileExt;
      cb(null, filename);
    },
  });

  const uploader = multer({
    storage,
    limits: {
      fileSize: maxSize,
    },
    fileFilter: (req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(errorMessage));
      }
    },
  });

  return uploader;
}

module.exports = uploader;
