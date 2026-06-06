const bcrypt = require("bcrypt");
const People = require("../models/People");

function getUsers(req, res, next) {
  res.render("users");
}

async function addUsers(req, res, next) {
  try {
    const { name, age, email, mobile, password } = req.body;
    const avatar = req.file ? req.file.filename : null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new People({
      name,
      age,
      email,
      mobile,
      password: hashedPassword,
      avatar,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User added successfully." });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({
      errors: {
        general: { msg: "An error occurred while adding the user. Please try again." },
      },
    });
  }
}

module.exports = {
  getUsers,
  addUsers,
};
