// api/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require("path");

const userRouter = require("./routes/userRoutes");
const blogRouter = require("./routes/blogRoutes");

const app = express();
const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ credentials: true, origin: "https://blog-app-meena.onrender.com" }));
app.use(express.json());
app.use(cookieParser());

// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// app.use(express.static(path.join(__dirname, '/client/dist')));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
// });

mongoose.connect(uri).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log(err);
});

// Routes
app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
