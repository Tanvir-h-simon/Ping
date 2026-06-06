const multer = require("multer");
const uploader = require("../../utilities/singleUploader");

function avatarUpload(req, res, next) {
  const upload = uploader(
    "avatars",
    ["image/jpeg", "image/jpg", "image/png"],
    2 * 1024 * 1024, // 2MB
    "Only .jpg, .jpeg, and .png formats are allowed.",
  );

  upload.single("avatar")(req, res, (err) => {
    if (err) {
      const isClientError = err instanceof multer.MulterError || err.message === "Only .jpg, .jpeg, and .png formats are allowed.";
      res.status(isClientError ? 400 : 500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}

module.exports = avatarUpload;
