const express = require("express");
const { getUsers, addUsers } = require("../controller/usersController");
const decorateHtmlRes = require("../middlewares/common/decorateHtmlRes");
const avatarUpload = require("../middlewares/users/avatarUpload");
const {
  addUserValidators,
  addUserValidatorsHandler,
} = require("../middlewares/users/usersValidator");

const router = express.Router();

// Index page route
router.get("/", decorateHtmlRes("Users"), getUsers);

// Add user
router.post(
  "/",
  avatarUpload,
  addUserValidators,
  addUserValidatorsHandler,
  addUsers,
);

module.exports = router;
