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
// const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'https://blog-app-meena.netlify.app'
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin || allowedOrigins.indexOf(origin) !== -1){
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

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
