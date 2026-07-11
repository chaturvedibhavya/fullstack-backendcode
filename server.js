// server.js — the smallest Express server
// npm init -y
// npm install express
// npm install dotenv
// npm install --save-dev nodemon
// npm install jsonwebtoken

require("dotenv").config(); // load .env into process.env

const dns = require("dns");
const cors = require('cors');
dns.setServers(["8.8.8.8", "1.1.1.1"]);


const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


// import the Express library
const app = express();              // create an app
app.use(cors());
app.use(express.json()); // <-- parses JSON request bodies into req.body
// example 1
app.post("/api/echo", (req, res) => {
  res.json({ youSent: req.body });
});

// When someone visits the home page ("/"), send back a message.
app.get("/api/data", (req, res) => {
  res.send({
    "name":"redwood"
  });
});

// When someone visits the home page ("/"), send back a message.
app.get("/api/userData", (req, res) => {
  res.send({
    "name":"Aditya"
  });
});


// __________ for routes in API __________
const woodRoutes = require("./routes/woods");
app.use("/api/woods", woodRoutes); // every route in the file is prefixed with /api/woods


const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes); // every route in the file is prefixed with /api/woods


const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes); // NEW: /api/auth/register, /login, /me

// __________ for routes in API __________


// Connect to MongoDB first; only start the server if it succeeds.
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // stop the app if the DB won't connect
  });