const express = require("express");
const cors = require("cors");
// const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const mongoose = require("mongoose");




const app = express();

// connect database
// connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.log(err));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

