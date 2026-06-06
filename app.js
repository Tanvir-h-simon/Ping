// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

// External dependencies
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
// Internal dependencies
const loginRouter = require("./router/loginRouter");
const userRouter = require("./router/usersRouter");
const inboxRouter = require("./router/inboxRouter");
const {
  notFoundErrorHandler,
  defaultErrorHandler,
} = require("./middlewares/common/errorHandler");

// Create Express app
const app = express();

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Request parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set("view engine", "ejs");

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Cookies parser middleware
app.use(cookieParser(process.env.COOKIE_SECRET));

// Routes
app.use("/", loginRouter);
app.use("/users", userRouter);
app.use("/inbox", inboxRouter);

// Error handling middleware
app.use(notFoundErrorHandler);
app.use(defaultErrorHandler);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
