// server.js
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

//middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
mongoose.connect(process.env.MONGODB_URI);
//Connect to MONGODB
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});
// GET /
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

  //server test
  app.get("/test", (req, res) => {
    console.log("GET /test route works")
    res.send("Server is running")
  })

app.listen(3000, () => {
    console.log("Listening on port 3000");
})